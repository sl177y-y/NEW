# AI Product Advisor - Build Instructions

## 📱 Available Builds

### ✅ **Current Exports Created**
- **Web Build**: Ready for deployment (`dist/index.html`)
- **Android Export**: Bundle ready for native compilation
- **iOS Export**: Bundle ready for native compilation

## 🚀 **Web Deployment (Ready Now)**

The web build is immediately deployable to any hosting service:

### **1. Local Testing**
```bash
# Serve the web build locally
npx serve dist

# Or use any HTTP server
python -m http.server 8000 -d dist
```

### **2. Deploy to Hosting Services**
- **Netlify**: Drag and drop the `dist` folder
- **Vercel**: Upload the `dist` folder or connect to Git
- **GitHub Pages**: Copy contents to `gh-pages` branch
- **Firebase Hosting**: `firebase deploy` with `dist` as public folder

## 📱 **Native Builds (Android & iOS)**

### **Prerequisites for Native Builds**
1. **Android**: Android Studio + Android SDK
2. **iOS**: Xcode (macOS only) + Apple Developer Account
3. **EAS Build Account**: For cloud building (recommended)

### **Option 1: EAS Build (Recommended)**
```bash
# 1. Install EAS CLI
npm install -g @expo/cli

# 2. Login to Expo
npx expo login

# 3. Build Android APK
npx eas build --platform android --profile preview

# 4. Build iOS (simulator)
npx eas build --platform ios --profile preview

# 5. Build for Production
npx eas build --platform all --profile production
```

### **Option 2: Local Development Builds**
```bash
# Android Development Build
npx expo run:android

# iOS Development Build (macOS only)
npx expo run:ios
```

### **Option 3: React Native CLI**
```bash
# Generate React Native project
npx expo prebuild

# Build Android
cd android && ./gradlew assembleRelease

# Build iOS (macOS only)
cd ios && xcodebuild -workspace *.xcworkspace -scheme * archive
```

## 🎯 **Build Profiles Explained**

### **Preview Profile** (eas.json)
- **Android**: APK file (easy to install and test)
- **iOS**: Simulator build (for testing on iOS Simulator)
- **Distribution**: Internal testing

### **Production Profile** (eas.json)
- **Android**: AAB (Android App Bundle) for Play Store
- **iOS**: Archive for App Store submission
- **Distribution**: App stores

### **Development Profile** (eas.json)
- **Purpose**: Development builds with debugging
- **Distribution**: Internal development team

## 📋 **Current Build Status**

| Platform | Status | Output | Notes |
|----------|--------|--------|-------|
| **Web** | ✅ Ready | `dist/index.html` | Deployable to any hosting |
| **Android** | 🔄 Export Ready | `dist/_expo/static/js/android/` | Requires EAS Build or Android Studio |
| **iOS** | 🔄 Export Ready | `dist/_expo/static/js/ios/` | Requires EAS Build or Xcode |

## 🛠️ **Quick Start Builds**

### **For Immediate Testing**
```bash
# 1. Web (works immediately)
npx serve dist

# 2. Mobile (using Expo Go)
npx expo start
# Scan QR code with Expo Go app
```

### **For Production Deployment**
```bash
# 1. Sign up for Expo EAS (free tier available)
# 2. Run these commands:
npx expo login
npx eas build --platform all --profile preview
```

## 📱 **App Store Submission Ready**

The app is configured with:
- ✅ **Bundle IDs**: `com.aiproductadvisor.app`
- ✅ **App Icons**: Included in assets
- ✅ **Splash Screen**: Configured with brand colors
- ✅ **Permissions**: Web-based (no special permissions needed)
- ✅ **Privacy**: No data collection, external API only

## 🔧 **Build Configuration Files**

### **app.json**
- App metadata and platform configurations
- Bundle identifiers and app icons
- Splash screen and theme colors

### **eas.json**
- Build profiles for different deployment types
- Platform-specific build settings
- Distribution and signing configurations

## 🎉 **Next Steps**

1. **Test Web Build**: Use `npx serve dist` to test locally
2. **Create EAS Account**: Sign up at expo.dev for cloud builds
3. **Run Native Builds**: Use EAS Build for Android APK and iOS IPA
4. **Deploy Web Version**: Upload `dist` folder to any hosting service

## 🆘 **Troubleshooting**

### **Common Issues**
- **"Not logged in"**: Run `npx expo login`
- **Build fails**: Check `eas.json` configuration
- **iOS build on Windows**: Use EAS Build (cloud service)
- **Android build errors**: Install Android Studio and SDK

### **Alternative Solutions**
- **Snack.expo.dev**: Upload code for instant testing
- **Expo Go**: Test development builds on physical devices
- **Web-first**: Deploy web version for immediate access

---

**🚀 The AI Product Advisor app is ready for deployment across all platforms!** 