# 🎓 Campus Navigator

> A comprehensive mobile application for campus navigation, course management, and student services built with React Native and Expo.

[![React Native](https://img.shields.io/badge/React%20Native-0.81.4-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-~54.0.10-000020.svg)](https://expo.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-12.6.0-orange.svg)](https://firebase.google.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue.svg)](https://www.typescriptlang.org/)

---

## 📱 Features

### 🗺️ **Interactive Campus Maps**
- Real-time GPS navigation with turn-by-turn directions
- Points of Interest (POI) management
- Indoor/outdoor map integration
- Custom location markers and saved places
- Route calculation with distance and duration
- Long-press to save custom locations

### 👥 **Role-Based Access Control**
Three distinct user roles with tailored dashboards:

#### 🎓 **Student Features**
- Personal dashboard with quick access to services
- Course schedules and timetables
- Campus POI discovery
- Notification center
- Profile management

#### 👨‍🏫 **Faculty Features**
- Faculty dashboard
- Course schedule management
- Send notifications to students
- Profile management

#### 🔐 **Admin Features**
- Comprehensive admin dashboard
- User permission management
- Map updates and POI management
- Student timetable oversight
- System-wide notifications
- User role assignment (Student/Faculty/Admin)

### 📅 **Schedule Management**
- Interactive course timetables
- Color-coded schedules
- Time slot management
- Course information display

### 🔔 **Notification System**
- Real-time push notifications
- Role-based notification delivery
- Notification history
- Admin/Faculty broadcast capabilities

### ⚙️ **Settings & Customization**
- Profile management
- Account settings
- App preferences
- Logout functionality

---

## 🏗️ Tech Stack

### **Frontend**
- **React Native** (0.81.4) - Cross-platform mobile framework
- **Expo** (~54.0.10) - Development platform
- **TypeScript** (5.9.2) - Type safety
- **Expo Router** (~6.0.8) - File-based routing
- **NativeWind** (4.2.1) - Tailwind CSS for React Native
- **React Native Maps** (1.20.1) - Map integration

### **Backend & Services**
- **Firebase** (12.6.0)
  - Authentication
  - Firestore Database
  - Real-time data sync
- **Expo Location** (19.0.7) - GPS and location services
- **OpenStreetMap Nominatim API** - Geocoding and search

### **UI/UX**
- **Tailwind CSS** (3.4.17) - Styling
- **TWRNC** (4.10.0) - Tailwind React Native Classnames
- **Poppins Font** - Custom typography
- **React Native Reanimated** (4.1.1) - Smooth animations
- **Expo Haptics** (15.0.7) - Tactile feedback

### **Navigation & State**
- **Expo Router** - File-based navigation
- **React Native Gesture Handler** (2.28.0) - Touch interactions
- **React Native Screens** (4.16.0) - Native navigation

---

## 📂 Project Structure

```
Campus-Navigator/
├── app/                          # Main application code
│   ├── admin/                    # Admin role screens
│   │   ├── admin-dashboard.tsx
│   │   ├── admin-profile.tsx
│   │   ├── map-updates.tsx
│   │   ├── student-timetable.tsx
│   │   └── user-permission.tsx
│   ├── faculty/                  # Faculty role screens
│   │   ├── faculty-dashboard.tsx
│   │   └── faculty-profile.tsx
│   ├── student/                  # Student role screens
│   │   ├── student-dashboard.tsx
│   │   ├── student-profile.tsx
│   │   ├── student-notification.tsx
│   │   ├── schedules.tsx
│   │   └── poi.tsx
│   ├── features/                 # Shared features
│   │   ├── maps.tsx             # Main map navigation
│   │   ├── manage-poi.tsx       # POI management
│   │   ├── course-schedule.tsx  # Schedule management
│   │   ├── notifications.tsx    # Notification system
│   │   └── settings.tsx         # App settings
│   ├── _layout.tsx              # Root layout
│   ├── index.tsx                # Entry point
│   ├── intro.tsx                # Intro screen
│   ├── login.tsx                # Login screen
│   └── signup.tsx               # Registration screen
├── components/                   # Reusable components
│   ├── ui/                      # UI components
│   └── haptic-tab.tsx           # Custom tab component
├── assets/                       # Images, fonts, etc.
├── firebaseConfig.ts            # Firebase configuration (gitignored)
├── firebaseConfig.example.ts    # Firebase config template
└── tailwind.config.ts           # Tailwind configuration
```

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator
- Firebase account

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Campus-Navigator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Copy `firebaseConfig.example.ts` to `firebaseConfig.ts`
   - Add your Firebase credentials to `firebaseConfig.ts`

   ```typescript
   // firebaseConfig.ts
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID",
     measurementId: "YOUR_MEASUREMENT_ID"
   };
   ```

4. **Start the development server**
   ```bash
   npx expo start
   ```

5. **Run on device/emulator**
   - Press `a` for Android emulator
   - Press `i` for iOS simulator
   - Scan QR code with Expo Go app for physical device

---

## 🔥 Firebase Setup

### **Firestore Collections**

Create the following collections in Firestore:

1. **`users`** - User profiles
   ```javascript
   {
     uid: string,
     email: string,
     name: string,
     role: "student" | "faculty" | "admin",
     createdAt: timestamp
   }
   ```

2. **`pois`** - Points of Interest
   ```javascript
   {
     name: string,
     description: string,
     latitude: number,
     longitude: number,
     capacity: number,
     currentOccupancy: number,
     status: string,
     image: string,
     createdAt: timestamp
   }
   ```

3. **`notifications`** - System notifications
   ```javascript
   {
     title: string,
     message: string,
     targetRole: "all" | "student" | "faculty",
     createdAt: timestamp,
     createdBy: string
   }
   ```

4. **`schedules`** - Course schedules
   ```javascript
   {
     courseName: string,
     instructor: string,
     room: string,
     day: string,
     startTime: string,
     endTime: string,
     studentId: string
   }
   ```

### **Security Rules**

Set up Firestore security rules to protect your data. See `permissions-firebase.md` for detailed rules.

---

## 📱 User Roles & Access

| Feature | Student | Faculty | Admin |
|---------|---------|---------|-------|
| View Maps | ✅ | ✅ | ✅ |
| Save POIs | ✅ | ✅ | ✅ |
| View Schedule | ✅ | ✅ | ✅ |
| Manage POIs | ❌ | ❌ | ✅ |
| Send Notifications | ❌ | ✅ | ✅ |
| User Management | ❌ | ❌ | ✅ |
| Map Updates | ❌ | ❌ | ✅ |

---

## 🛠️ Development

### **Available Scripts**

```bash
# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on web
npm run web

# Run linter
npm run lint

# Reset project
npm run reset-project
```

### **Environment Variables**

Create a `.env` file for environment-specific configuration (optional):
```env
EXPO_PUBLIC_API_URL=your_api_url
```

---

## 🎨 Customization

### **Theming**
Modify `tailwind.config.ts` to customize colors, fonts, and spacing:

```typescript
theme: {
  extend: {
    colors: {
      primary: "var(--colorThemePrimary)",
      secondary: "var(--colorThemeSecondary)",
    },
    fontFamily: {
      poppins: ["Poppins, sans-serif"],
    },
  },
}
```

### **Icons**
Icons are defined in `app/features/maps.tsx`:
```typescript
const Icons = {
  Menu: '☰',
  Search: '🔍',
  Pin: '📍',
  // Add more icons...
};
```

---

## 📦 Build for Production

### **Android**
```bash
eas build --platform android
```

### **iOS**
```bash
eas build --platform ios
```

### **Configure EAS**
```bash
eas build:configure
```

---

## 🐛 Troubleshooting

### **Common Issues**

1. **Firebase not connecting**
   - Verify `firebaseConfig.ts` credentials
   - Check Firebase project settings
   - Ensure Firestore is enabled

2. **Maps not loading**
   - Check location permissions
   - Verify internet connection
   - Check Google Maps API key (if using)

3. **Build errors**
   - Clear cache: `npx expo start -c`
   - Reinstall dependencies: `rm -rf node_modules && npm install`

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

**Hamza Sarwar**

---

## 🙏 Acknowledgments

- [Expo](https://expo.dev/) - Amazing development platform
- [Firebase](https://firebase.google.com/) - Backend services
- [OpenStreetMap](https://www.openstreetmap.org/) - Map data
- [React Native Maps](https://github.com/react-native-maps/react-native-maps) - Map component

---

## 📞 Support

For support, email [your-email@example.com] or open an issue in the repository.

---

**Made with ❤️ for campus communities**
