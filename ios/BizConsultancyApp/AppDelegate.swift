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
#if !targetEnvironment(simulator)
    // Embedded device bundle is a file:// URL; hide "Connect to Metro to develop JavaScript."
    RCTDevLoadingView.setEnabled(false)
#endif
#endif

    let delegate = ReactNativeDelegate()
    let factory = ExpoReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)
    window?.backgroundColor = UIColor(red: 15 / 255, green: 45 / 255, blue: 26 / 255, alpha: 1)

    factory.startReactNative(
      withModuleName: "BizConsultancyApp",
      in: window,
      launchOptions: launchOptions
    )

    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

#if DEBUG
  /// Physical devices cannot reach Metro via `localhost` — pin the Mac LAN IP.
  private static func configureMetroHostForDevice() {
#if !targetEnvironment(simulator)
    guard let host = AppDelegateMetro.resolvedHost() else {
      return
    }
    AppDelegateMetro.pinJsLocation(host)
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
  override func customize(_ rootView: UIView) {
    super.customize(rootView)
    rootView.backgroundColor = UIColor(red: 15 / 255, green: 45 / 255, blue: 26 / 255, alpha: 1)
  }

  override func sourceURL(for bridge: RCTBridge) -> URL? {
    bundleURL() ?? bridge.bundleURL
  }

  override func bundleURL() -> URL? {
#if DEBUG
#if !targetEnvironment(simulator)
    // USB can install the app but cannot deliver Metro JS. Load the embedded
    // bundle so the UI appears; keep jsLocation pinned for later reload.
    if let host = AppDelegateMetro.resolvedHost() {
      AppDelegateMetro.pinJsLocation(host)
    }
    if let embedded = Bundle.main.url(forResource: "main", withExtension: "jsbundle") {
      return embedded
    }
    if let host = AppDelegateMetro.resolvedHost() {
      return AppDelegateMetro.bundleURL(host: host)
    }
#endif
    return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}

#if DEBUG
enum AppDelegateMetro {
  static func resolvedHost() -> String? {
    if let ipPath = Bundle.main.path(forResource: "ip", ofType: "txt"),
      let ip = try? String(contentsOfFile: ipPath, encoding: .utf8)
        .trimmingCharacters(in: .whitespacesAndNewlines),
      isUsableMetroHost(ip)
    {
      return ip
    }
    if let host = (Bundle.main.object(forInfoDictionaryKey: "RCTMetroHost") as? String)?
      .trimmingCharacters(in: .whitespacesAndNewlines),
      isUsableMetroHost(host)
    {
      return host
    }
    return nil
  }

  static func pinJsLocation(_ host: String) {
    let defaults = UserDefaults.standard
    if let existing = defaults.string(forKey: "RCT_jsLocation"),
      existing == "localhost"
        || existing.hasPrefix("localhost:")
        || existing.hasPrefix("127.0.0.1")
    {
      defaults.removeObject(forKey: "RCT_jsLocation")
    }
    RCTBundleURLProvider.sharedSettings().jsLocation = "\(host):8081"
  }

  static func bundleURL(host: String) -> URL? {
    RCTBundleURLProvider.jsBundleURL(
      forBundleRoot: "index",
      packagerHost: "\(host):8081",
      enableDev: true,
      enableMinification: false,
      inlineSourceMap: false
    )
  }

  private static func isUsableMetroHost(_ host: String) -> Bool {
    !host.isEmpty && host != "localhost" && !host.hasPrefix("127.")
  }
}
#endif
