package com.consultancy

import android.app.NotificationManager
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.provider.Settings
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

/**
 * Android 14+ full-screen intent helpers for incoming-call Notifee UI.
 * Notifee does not expose [NotificationManager.canUseFullScreenIntent].
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

  companion object {
    const val NAME: String = "CallAndroidPermissions"
  }
}
