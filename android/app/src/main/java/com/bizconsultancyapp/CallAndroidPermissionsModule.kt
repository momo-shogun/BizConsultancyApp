package com.consultancy

import android.app.NotificationManager
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.provider.Settings
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap

/**
 * Android call-display helpers: full-screen intent permission + pending native incoming call.
 */
class CallAndroidPermissionsModule(
    private val reactContext: ReactApplicationContext,
) : ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = NAME

  @ReactMethod
  fun canUseFullScreenIntent(promise: Promise) {
    try {
      if (Build.VERSION.SDK_INT < Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
        promise.resolve(true)
        return
      }
      val manager = reactContext.getSystemService(NotificationManager::class.java)
      promise.resolve(manager?.canUseFullScreenIntent() == true)
    } catch (error: Exception) {
      promise.reject("FSI_CHECK_FAILED", error.message, error)
    }
  }

  @ReactMethod
  fun openFullScreenIntentSettings(promise: Promise) {
    try {
      val packageUri = Uri.parse("package:${reactContext.packageName}")
      val intent =
          if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            Intent(Settings.ACTION_MANAGE_APP_USE_FULL_SCREEN_INTENT).apply {
              data = packageUri
              addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
          } else {
            Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS).apply {
              data = packageUri
              addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
          }
      reactContext.startActivity(intent)
      promise.resolve(null)
    } catch (error: Exception) {
      try {
        val fallback =
            Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS).apply {
              data = Uri.parse("package:${reactContext.packageName}")
              addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
        reactContext.startActivity(fallback)
        promise.resolve(null)
      } catch (fallbackError: Exception) {
        promise.reject("FSI_SETTINGS_FAILED", fallbackError.message, fallbackError)
      }
    }
  }

  /**
   * Returns `{ action, data }` for a killed-state native incoming call, or null.
   * `action` is `open` | `answer` | `decline`.
   */
  @ReactMethod
  fun consumePendingIncomingCall(promise: Promise) {
    try {
      val pending = IncomingCallNativeNotifier.consumePending(reactContext.applicationContext)
      if (pending == null) {
        promise.resolve(null)
        return
      }
      val (action, data) = pending
      val map: WritableMap = Arguments.createMap()
      map.putString("action", action)
      val dataMap = Arguments.createMap()
      for ((key, value) in data) {
        dataMap.putString(key, value)
      }
      map.putMap("data", dataMap)
      val sessionId = data["sessionId"]
      if (sessionId != null) {
        IncomingCallNativeNotifier.cancel(reactContext.applicationContext, sessionId)
      }
      promise.resolve(map)
    } catch (error: Exception) {
      promise.reject("PENDING_CALL_FAILED", error.message, error)
    }
  }

  @ReactMethod
  fun cancelIncomingCallNotification(sessionId: String, promise: Promise) {
    try {
      IncomingCallNativeNotifier.cancel(reactContext.applicationContext, sessionId)
      promise.resolve(null)
    } catch (error: Exception) {
      promise.reject("CANCEL_CALL_FAILED", error.message, error)
    }
  }

  companion object {
    const val NAME: String = "CallAndroidPermissions"
  }
}
