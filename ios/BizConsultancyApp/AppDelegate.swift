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
  /// Physical devices cannot reach Metro via `localhost` — pin the Mac LAN IP.
  private static func configureMetroHostForDevice() {
#if !targetEnvironment(simulator)
    guard let host = AppDelegateMetro.resolvedHost() else {
      return
    }
    // Wipe stale Dev Settings / NSUserDefaults that point at phone-local Metro.
    let defaults = UserDefaults.standard
    if defaults.string(forKey: "RCT_jsLocation") == "localhost" {
      defaults.removeObject(forKey: "RCT_jsLocation")
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
    bundleURL() ?? bridge.bundleURL
  }

  override func bundleURL() -> URL? {
#if DEBUG
#if !targetEnvironment(simulator)
    // Bypass RCTBundleURLProvider.isPackagerRunning — on device that check often
    // fails (Local Network not granted yet) and RN then falls back to localhost
    // (the phone itself), which is why Metro never connects on Wi‑Fi.
    if let host = AppDelegateMetro.resolvedHost() {
      RCTBundleURLProvider.sharedSettings().jsLocation = host
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
    if let host = (Bundle.main.object(forInfoDictionaryKey: "RCTMetroHost") as? String)?
      .trimmingCharacters(in: .whitespacesAndNewlines),
      !host.isEmpty,
      host != "localhost"
    {
      return host
    }
    if let ipPath = Bundle.main.path(forResource: "ip", ofType: "txt"),
      let ip = try? String(contentsOfFile: ipPath, encoding: .utf8)
      .trimmingCharacters(in: .whitespacesAndNewlines),
      !ip.isEmpty,
      ip != "localhost"
    {
      return ip
    }
    return nil
  }

  static func bundleURL(host: String) -> URL? {
    var components = URLComponents()
    components.scheme = "http"
    components.host = host
    components.port = 8081
    components.path = "/index.bundle"
    components.queryItems = [
      URLQueryItem(name: "platform", value: "ios"),
      URLQueryItem(name: "dev", value: "true"),
      URLQueryItem(name: "minify", value: "false"),
      URLQueryItem(name: "modulesOnly", value: "false"),
      URLQueryItem(name: "runModule", value: "true"),
      URLQueryItem(name: "app", value: "BizConsultancyApp"),
    ]
    return components.url
  }
}
#endif
