package com.consultancy

import android.app.ActivityManager
import android.app.Notification
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.util.Log
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import org.json.JSONObject

/**
 * FCM receive hook when the app is not in the foreground.
 *
 * Killed state: Headless JS often never paints Notifee — this native path is required.
 * Background: may race with Notifee; JS cancels this notification once Notifee displays.
 */
class IncomingCallFcmReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent?) {
    val extras = intent?.extras ?: return
    val type = extras.getString("type") ?: return
    if (type != "call.incoming") {
      return
    }
    if (isAppInForeground(context)) {
      return
    }

    try {
      IncomingCallNativeNotifier.show(context.applicationContext, extras)
    } catch (error: Exception) {
      Log.e(TAG, "Failed to show native incoming-call notification", error)
    }
  }

  private fun isAppInForeground(context: Context): Boolean {
    val am = context.getSystemService(Context.ACTIVITY_SERVICE) as? ActivityManager ?: return false
    val processes = am.runningAppProcesses ?: return false
    val packageName = context.packageName
    return processes.any {
      it.processName == packageName &&
          it.importance == ActivityManager.RunningAppProcessInfo.IMPORTANCE_FOREGROUND
    }
  }

  companion object {
    private const val TAG = "IncomingCallFcm"
  }
}

object IncomingCallNativeNotifier {
  private const val PREFS = "incoming_call_native"
  private const val KEY_PAYLOAD_JSON = "pending_payload_json"
  private const val KEY_ACTION = "pending_action"

  const val ACTION_OPEN = "com.consultancy.INCOMING_CALL_OPEN"
  const val ACTION_ANSWER = "com.consultancy.INCOMING_CALL_ANSWER"
  const val ACTION_DECLINE = "com.consultancy.INCOMING_CALL_DECLINE"

  fun show(context: Context, extras: Bundle) {
    val sessionId = extras.getString("sessionId") ?: return
    val callerName =
        extras.getString("callerName")?.takeIf { it.isNotBlank() } ?: "Incoming caller"
    val callType = extras.getString("callType") ?: "voice"
    val body =
        if (callType == "video") {
          "Incoming video call"
        } else {
          "Incoming voice call"
        }

    persistPending(context, extras, action = "open")

    val contentIntent =
        pendingActivity(context, sessionId, ACTION_OPEN, extras, 1000 + stableId(sessionId))
    val answerIntent =
        pendingActivity(context, sessionId, ACTION_ANSWER, extras, 2000 + stableId(sessionId))
    val declineIntent =
        pendingActivity(context, sessionId, ACTION_DECLINE, extras, 3000 + stableId(sessionId))
    val fullScreen =
        PendingIntent.getActivity(
            context,
            4000 + stableId(sessionId),
            activityIntent(context, sessionId, ACTION_OPEN, extras),
            pendingFlags(),
        )

    val notification =
        NotificationCompat.Builder(context, MainApplication.INCOMING_CALLS_CHANNEL_ID)
            .setSmallIcon(context.applicationInfo.icon)
            .setContentTitle(callerName)
            .setContentText(body)
            .setCategory(NotificationCompat.CATEGORY_CALL)
            .setPriority(NotificationCompat.PRIORITY_MAX)
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .setOngoing(true)
            .setAutoCancel(false)
            .setContentIntent(contentIntent)
            .setFullScreenIntent(fullScreen, true)
            .addAction(0, "Decline", declineIntent)
            .addAction(0, "Answer", answerIntent)
            .setDefaults(Notification.DEFAULT_LIGHTS)
            .build()

    NotificationManagerCompat.from(context).notify(stableId(sessionId), notification)
  }

  fun captureLaunchIntent(context: Context, intent: Intent?) {
    if (intent == null) {
      return
    }
    val action =
        intent.getStringExtra("native_call_action")
            ?: intent.getStringExtra("call_action")
            ?: return
    rememberAction(context, action)
    if (intent.getStringExtra("type") == "call.incoming") {
      val extras = intent.extras ?: return
      persistPending(context, extras, action)
    }
  }

  fun consumePending(context: Context): Pair<String, Map<String, String>>? {
    val prefs = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
    val json = prefs.getString(KEY_PAYLOAD_JSON, null) ?: return null
    val action = prefs.getString(KEY_ACTION, "open") ?: "open"
    prefs.edit().remove(KEY_PAYLOAD_JSON).remove(KEY_ACTION).apply()
    val parsed = JSONObject(json)
    val map = HashMap<String, String>()
    val keys = parsed.keys()
    while (keys.hasNext()) {
      val key = keys.next()
      map[key] = parsed.optString(key, "")
    }
    return action to map
  }

  fun cancel(context: Context, sessionId: String) {
    NotificationManagerCompat.from(context).cancel(stableId(sessionId))
  }

  private fun rememberAction(context: Context, action: String) {
    context
        .getSharedPreferences(PREFS, Context.MODE_PRIVATE)
        .edit()
        .putString(KEY_ACTION, action)
        .apply()
  }

  private fun persistPending(context: Context, extras: Bundle, action: String) {
    val json = JSONObject()
    for (key in extras.keySet()) {
      val value = extras.get(key)
      if (value is String) {
        json.put(key, value)
      }
    }
    context
        .getSharedPreferences(PREFS, Context.MODE_PRIVATE)
        .edit()
        .putString(KEY_PAYLOAD_JSON, json.toString())
        .putString(KEY_ACTION, action)
        .apply()
  }

  private fun activityIntent(
      context: Context,
      sessionId: String,
      action: String,
      extras: Bundle,
  ): Intent {
    val callAction =
        when (action) {
          ACTION_ANSWER -> "answer"
          ACTION_DECLINE -> "decline"
          else -> "open"
        }
    return Intent(context, MainActivity::class.java).apply {
      this.action = action
      addFlags(
          Intent.FLAG_ACTIVITY_NEW_TASK or
              Intent.FLAG_ACTIVITY_SINGLE_TOP or
              Intent.FLAG_ACTIVITY_CLEAR_TOP,
      )
      putExtra("sessionId", sessionId)
      putExtra("call_action", callAction)
      putExtra("native_call_action", callAction)
      for (key in extras.keySet()) {
        val value = extras.get(key)
        if (value is String) {
          putExtra(key, value)
        }
      }
    }
  }

  private fun pendingActivity(
      context: Context,
      sessionId: String,
      action: String,
      extras: Bundle,
      requestCode: Int,
  ): PendingIntent {
    return PendingIntent.getActivity(
        context,
        requestCode,
        activityIntent(context, sessionId, action, extras),
        pendingFlags(),
    )
  }

  private fun pendingFlags(): Int {
    return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
    } else {
      PendingIntent.FLAG_UPDATE_CURRENT
    }
  }

  private fun stableId(sessionId: String): Int {
    return sessionId.toIntOrNull() ?: sessionId.hashCode()
  }
}
