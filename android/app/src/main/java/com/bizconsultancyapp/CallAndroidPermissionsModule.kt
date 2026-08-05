package com.consultancy

import android.app.KeyguardManager
import android.app.NotificationManager
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.provider.Settings
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.UiThreadUtil
import com.facebook.react.bridge.WritableMap

/**
 * Android call-display helpers: full-screen intent permission + pending native incoming call
 * + lock-screen call-only overlay.
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
      // Soft cancel only — used when Notifee replaces the native tray paint. Do not sweep
      // the channel here or the freshly painted Notifee Answer/Decline is wiped.
      IncomingCallNativeNotifier.cancel(reactContext.applicationContext, sessionId)
      promise.resolve(null)
    } catch (error: Exception) {
      promise.reject("CANCEL_CALL_FAILED", error.message, error)
    }
  }

  /**
   * Remote hang-up / miss / decline: clear this session and any leftover Notifee entry on
   * the incoming-calls channel.
   */
  @ReactMethod
  fun expireIncomingCallNotification(sessionId: String, promise: Promise) {
    try {
      IncomingCallNativeNotifier.expire(reactContext.applicationContext, sessionId)
      promise.resolve(null)
    } catch (error: Exception) {
      promise.reject("EXPIRE_CALL_FAILED", error.message, error)
    }
  }

  /**
   * Arm the ring-window expiry for a Notifee-painted notification. Notifee has no `timeoutAfter`,
   * so without this its notification outlives a JS process the OS reclaims mid-ring.
   */
  @ReactMethod
  fun scheduleIncomingCallExpiry(sessionId: String, promise: Promise) {
    try {
      IncomingCallNativeNotifier.scheduleExpiry(reactContext.applicationContext, sessionId)
      promise.resolve(null)
    } catch (error: Exception) {
      promise.reject("SCHEDULE_CALL_EXPIRY_FAILED", error.message, error)
    }
  }

  /** Clears pending killed-state payload + all incoming-call notifications (logout). */
  @ReactMethod
  fun clearAllIncomingCallNotifications(promise: Promise) {
    try {
      IncomingCallNativeNotifier.clearAll(reactContext.applicationContext)
      promise.resolve(null)
    } catch (error: Exception) {
      promise.reject("CLEAR_INCOMING_CALLS_FAILED", error.message, error)
    }
  }

  /**
   * Enable/disable native killed-state incoming-call paints. Must be false after logout so a
   * stale FCM token on the server cannot still ring this device.
   */
  @ReactMethod
  fun setIncomingCallPushEnabled(enabled: Boolean, promise: Promise) {
    try {
      IncomingCallNativeNotifier.setPushDeliveryEnabled(reactContext.applicationContext, enabled)
      promise.resolve(null)
    } catch (error: Exception) {
      promise.reject("SET_CALL_PUSH_ENABLED_FAILED", error.message, error)
    }
  }

  /**
   * While a call is connected, mark the session so delayed FCM `call.incoming` does not show a
   * second incoming notification beside the ongoing-call tray entry. Pass null/empty to clear.
   */
  @ReactMethod
  fun setConnectedCallSession(sessionId: String?, promise: Promise) {
    try {
      IncomingCallNativeNotifier.setConnectedSession(
          reactContext.applicationContext,
          sessionId,
      )
      promise.resolve(null)
    } catch (error: Exception) {
      promise.reject("SET_CONNECTED_CALL_FAILED", error.message, error)
    }
  }

  /** Whether the keyguard is currently locked (device lock screen). */
  @ReactMethod
  fun isDeviceLocked(promise: Promise) {
    try {
      val km =
          reactContext.getSystemService(Context.KEYGUARD_SERVICE) as? KeyguardManager
      promise.resolve(km?.isKeyguardLocked == true)
    } catch (error: Exception) {
      promise.reject("KEYGUARD_CHECK_FAILED", error.message, error)
    }
  }

  /**
   * Allow / disallow MainActivity over the lock screen for the duration of a call.
   * Everyday app use must not sit on top of the keyguard.
   */
  @ReactMethod
  fun setCallLockOverlay(enabled: Boolean, promise: Promise) {
    UiThreadUtil.runOnUiThread {
      try {
        val activity = reactContext.currentActivity
        MainActivity.setCallLockOverlay(activity, enabled)
        promise.resolve(null)
      } catch (error: Exception) {
        promise.reject("CALL_LOCK_OVERLAY_FAILED", error.message, error)
      }
    }
  }

  /**
   * After a call ends: drop lock-screen overlay. If the device is still locked,
   * send the task to the background so the user returns to the lock screen
   * instead of browsing the full app without unlocking.
   */
  @ReactMethod
  fun leaveCallUiIfLocked(promise: Promise) {
    UiThreadUtil.runOnUiThread {
      try {
        val activity = reactContext.currentActivity
        MainActivity.setCallLockOverlay(activity, false)
        val km =
            reactContext.getSystemService(Context.KEYGUARD_SERVICE) as? KeyguardManager
        if (km?.isKeyguardLocked == true && activity != null) {
          activity.moveTaskToBack(true)
        }
        promise.resolve(null)
      } catch (error: Exception) {
        promise.reject("LEAVE_CALL_UI_FAILED", error.message, error)
      }
    }
  }

  companion object {
    const val NAME: String = "CallAndroidPermissions"
  }
}
