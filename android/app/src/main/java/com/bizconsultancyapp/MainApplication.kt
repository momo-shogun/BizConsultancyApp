package com.bizconsultancyapp
import android.content.res.Configuration
import expo.modules.ApplicationLifecycleDispatcher
import expo.modules.ExpoReactHostFactory

import android.app.Application
import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.os.Build
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import org.wonday.orientation.OrientationActivityLifecycle

class MainApplication : Application(), ReactApplication {

  override val reactHost: ReactHost by lazy {
    ExpoReactHostFactory.getDefaultReactHost(
      context = applicationContext,
      packageList =
        PackageList(this).packages.apply {
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // add(MyReactNativePackage())
        },
    )
  }

  override fun onCreate() {
    super.onCreate()
    registerActivityLifecycleCallbacks(OrientationActivityLifecycle.getInstance())
    createIncomingCallNotificationChannel()
    loadReactNative(this)
    ApplicationLifecycleDispatcher.onApplicationCreate(this)
  }

  private fun createIncomingCallNotificationChannel() {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
      return
    }
    val channel =
        NotificationChannel(
                INCOMING_CALLS_CHANNEL_ID,
                "Incoming calls",
                NotificationManager.IMPORTANCE_HIGH,
            )
            .apply {
              description = "Alerts for incoming voice and video calls"
              /** Ringtone + haptics come from JS `react-native-incall-manager` only (avoids double ring). */
              enableVibration(false)
              lockscreenVisibility = Notification.VISIBILITY_PUBLIC
              setBypassDnd(true)
              setSound(null, null)
            }
    val manager = getSystemService(NotificationManager::class.java)
    manager?.createNotificationChannel(channel)
  }

  companion object {
    const val INCOMING_CALLS_CHANNEL_ID = "incoming_calls_v2"
  }

  override fun onConfigurationChanged(newConfig: Configuration) {
    super.onConfigurationChanged(newConfig)
    ApplicationLifecycleDispatcher.onConfigurationChanged(this, newConfig)
  }
}
