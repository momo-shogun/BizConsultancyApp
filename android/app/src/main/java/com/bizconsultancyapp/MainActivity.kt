package com.consultancy
import expo.modules.ReactActivityDelegateWrapper

import android.app.Activity
import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.view.WindowManager
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.swmansion.rnscreens.fragment.restoration.RNScreensFragmentFactory

class MainActivity : ReactActivity() {

  override fun getMainComponentName(): String = "BizConsultancyApp"

  override fun onCreate(savedInstanceState: Bundle?) {
    supportFragmentManager.fragmentFactory = RNScreensFragmentFactory()
    IncomingCallNativeNotifier.captureLaunchIntent(this, intent)
    super.onCreate(savedInstanceState)
    maybeEnableCallLockFromIntent(intent)
  }

  override fun onNewIntent(intent: Intent?) {
    super.onNewIntent(intent)
    setIntent(intent)
    IncomingCallNativeNotifier.captureLaunchIntent(this, intent)
    maybeEnableCallLockFromIntent(intent)
  }

  /**
   * Only show this activity over the keyguard for incoming-call intents.
   * Everyday launches must not unlock into the full app shell on the lock screen.
   */
  private fun maybeEnableCallLockFromIntent(intent: Intent?) {
    val action =
        intent?.getStringExtra("call_action")
            ?: intent?.getStringExtra("native_call_action")
    if (action == "answer" || action == "open") {
      applyCallLockOverlay(true)
    }
  }

  fun applyCallLockOverlay(enabled: Boolean) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
      setShowWhenLocked(enabled)
      setTurnScreenOn(enabled)
    } else if (enabled) {
      @Suppress("DEPRECATION")
      window.addFlags(
          WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or
              WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON,
      )
    } else {
      @Suppress("DEPRECATION")
      window.clearFlags(
          WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or
              WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON,
      )
    }
  }

  override fun createReactActivityDelegate(): ReactActivityDelegate =
      ReactActivityDelegateWrapper(
          this,
          BuildConfig.IS_NEW_ARCHITECTURE_ENABLED,
          DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled),
      )

  companion object {
    fun setCallLockOverlay(activity: Activity?, enabled: Boolean) {
      val main = activity as? MainActivity ?: return
      main.runOnUiThread { main.applyCallLockOverlay(enabled) }
    }
  }
}
