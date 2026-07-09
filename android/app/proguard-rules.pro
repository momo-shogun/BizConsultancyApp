# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# React Native + Hermes
-include ../../node_modules/react-native/ReactAndroid/proguard-rules.pro

# Reanimated / Worklets (new architecture)
-keep class com.swmansion.reanimated.** { *; }
-keep class com.swmansion.worklets.** { *; }

# Firebase / FCM
-keep class io.invertase.firebase.** { *; }
-dontwarn io.invertase.firebase.**

# Razorpay
-keep class com.razorpay.** { *; }
-dontwarn com.razorpay.**

# Agora
-keep class io.agora.** { *; }
-dontwarn io.agora.**

# General React Native bridge safety net
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keepattributes *Annotation*, Signature, InnerClasses, EnclosingMethod
