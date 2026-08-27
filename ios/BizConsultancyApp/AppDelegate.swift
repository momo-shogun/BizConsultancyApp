import UIKit
internal import Expo
import FirebaseCore
import Network
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider

@main
class AppDelegate: ExpoAppDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  #if DEBUG
  /// Kept alive so iOS shows the Local Network permission prompt (needed for Metro on device).
  private static var localNetworkBrowser: NWBrowser?
  #endif

  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    if FirebaseApp.app() == nil {
      FirebaseApp.configure()
    }

#if DEBUG
    Self.configureMetroHostForDevice()
    Self.triggerLocalNetworkPermissionIfNeeded()
#endif

    let delegate = ReactNativeDelegate()
    let factory = ExpoReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "BizConsultancyApp",
      in: window,
      launchOptions: launchOptions
    )

    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

#if DEBUG
  /// Physical devices cannot reach Metro via `localhost` — pin the Mac LAN IP from Info.plist.
  private static func configureMetroHostForDevice() {
#if !targetEnvironment(simulator)
    let host =
      (Bundle.main.object(forInfoDictionaryKey: "RCTMetroHost") as? String)?
      .trimmingCharacters(in: .whitespacesAndNewlines)
    guard let host, !host.isEmpty else {
      return
    }
    RCTBundleURLProvider.sharedSettings().jsLocation = host
#endif
  }

  private static func triggerLocalNetworkPermissionIfNeeded() {
#if !targetEnvironment(simulator)
    let params = NWParameters()
    params.includePeerToPeer = true
    let browser = NWBrowser(for: .bonjour(type: "_http._tcp", domain: nil), using: params)
    browser.stateUpdateHandler = { _ in }
    browser.start(queue: .main)
    localNetworkBrowser = browser
#endif
  }
#endif
}

class ReactNativeDelegate: ExpoReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    // Prefer our bundleURL() — Expo/RN may already set bridge.bundleURL to Metro.
    bundleURL() ?? bridge.bundleURL
  }

  override func bundleURL() -> URL? {
#if DEBUG
#if targetEnvironment(simulator)
    return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    // Physical device: load embedded JS (Metro LAN often blocked by Local Network / Wi‑Fi).
    if let embedded = Bundle.main.url(forResource: "main", withExtension: "jsbundle") {
      // DEBUG + file:// shows sticky "Connect to Metro…" banner; turn it off for embedded.
      RCTDevLoadingViewSetEnabled(false)
      return embedded
    }
    if let host = (Bundle.main.object(forInfoDictionaryKey: "RCTMetroHost") as? String)?
      .trimmingCharacters(in: .whitespacesAndNewlines),
      !host.isEmpty
    {
      RCTBundleURLProvider.sharedSettings().jsLocation = host
    }
    return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#endif
#else
    return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
