# Firebase Permissions & Security Rules

This document contains all the necessary permissions and security rules you need to configure in your Firebase Console for the Campus Navigator app.

---

## 📋 Table of Contents
1. [Firestore Security Rules](#firestore-security-rules)
2. [Firebase Authentication Settings](#firebase-authentication-settings)
3. [Firebase Storage Rules (Optional)](#firebase-storage-rules-optional)
4. [Email Templates Configuration](#email-templates-configuration)

---

## 🔒 Firestore Security Rules

### How to Apply:
1. Go to **Firebase Console** → Your Project
2. Navigate to **Firestore Database** → **Rules** tab
3. Copy and paste the rules below
4. Click **Publish**

### Security Rules Code:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function getUserRole() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
    }

    function isAdmin() {
      return getUserRole() == 'admin';
    }

    function isFaculty() {
      return getUserRole() == 'faculty';
    }

    function isStudent() {
      return getUserRole() == 'student';
    }

    // ==========================================
    // USERS COLLECTION
    // ==========================================
    match /users/{userId} {
      // All authenticated users can read any user profile
      allow read: if request.auth != null;
      
      // Users can create their own document during signup
      allow create: if request.auth != null && request.auth.uid == userId;
      
      // Users can update their own document OR admins can update any user
      allow update: if request.auth != null && 
                       (request.auth.uid == userId || isAdmin());
      
      // Only admins can delete users
      allow delete: if isAdmin();
    }

    // ==========================================
    // PERMISSIONS COLLECTION
    // ==========================================
    match /permissions/{permissionId} {
      allow read: if request.auth != null;
      allow write: if isAdmin();
    }

    // ==========================================
    // NOTIFICATIONS COLLECTION
    // ==========================================
    match /notifications/{notificationId} {
      // Allow admins and faculty to create notifications
      allow create: if isAdmin() || isFaculty();

      // Allow all authenticated users to read notifications
      // (Filtering is done client-side to avoid complex index requirements)
      allow read: if request.auth != null;

      // Allow only admins to update or delete notifications
      allow update, delete: if isAdmin();
    }

    // ==========================================
    // COURSES COLLECTION
    // ==========================================
    match /courses/{courseId} {
      // Allow admins and faculty to create, update, and delete courses
      allow create, delete: if isAdmin() || isFaculty();
      allow update: if isAdmin() || isFaculty();

      // Allow all authenticated users (admin, faculty, student) to read courses
      allow read: if request.auth != null;

      // Allow students to increment the 'enrolled' count specifically
      allow update: if isStudent() &&
                       request.resource.data.diff(resource.data).affectedKeys().hasOnly(['enrolled']) &&
                       request.resource.data.enrolled == resource.data.enrolled + 1;
    }

    // ==========================================
    // COURSE ENROLLMENTS COLLECTION
    // ==========================================
    match /course_enrollments/{enrollmentId} {
      // Allow authenticated students to create their own enrollment records
      allow create: if isStudent() && request.resource.data.userId == request.auth.uid;

      // Allow authenticated users to read their own enrollment records
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;

      // Prevent updates or deletes from client-side for enrollments
      allow update, delete: if isAdmin() || isFaculty();
    }

    // ==========================================
    // POINTS OF INTEREST (POIs) COLLECTION
    // ==========================================
    match /pois/{poiId} {
      // Allow all authenticated users to read POIs
      allow read: if request.auth != null;

      // Allow admins and faculty to create, update, and delete POIs
      allow create, update, delete: if isAdmin() || isFaculty();
    }

    // ==========================================
    // SCHEDULES/TIMETABLES COLLECTION
    // ==========================================
    match /schedules/{scheduleId} {
      // Students can read their own schedules
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      
      // Faculty and Admin can read all schedules
      allow read: if isFaculty() || isAdmin();
      
      // Students can create their own schedules
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      
      // Users can update their own schedules
      allow update: if request.auth != null && resource.data.userId == request.auth.uid;
      
      // Faculty and Admin can create/update any schedule
      allow create, update: if isFaculty() || isAdmin();
      
      // Only owner, faculty, or admin can delete
      allow delete: if request.auth != null && 
                       (resource.data.userId == request.auth.uid || isFaculty() || isAdmin());
    }

    // ==========================================
    // MAP UPDATES COLLECTION
    // ==========================================
    match /mapUpdates/{updateId} {
      // Everyone can read map updates
      allow read: if request.auth != null;
      
      // Only admin can create/update/delete map updates
      allow create, update, delete: if isAdmin();
    }

    // ==========================================
    // EVENTS COLLECTION
    // ==========================================
    match /events/{eventId} {
      // Everyone can read events
      allow read: if request.auth != null;
      
      // Faculty and admin can create events
      allow create: if isFaculty() || isAdmin();
      
      // Only creator, faculty, or admin can update
      allow update: if request.auth != null && 
                       (resource.data.createdBy == request.auth.uid || isFaculty() || isAdmin());
      
      // Only admin can delete events
      allow delete: if isAdmin();
    }

    // ==========================================
    // FEEDBACK/REPORTS COLLECTION
    // ==========================================
    match /feedback/{feedbackId} {
      // Users can read their own feedback
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      
      // Faculty and admin can read all feedback
      allow read: if isFaculty() || isAdmin();
      
      // Any authenticated user can create feedback
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      
      // Users can update their own feedback
      allow update: if request.auth != null && resource.data.userId == request.auth.uid;
      
      // Only admin can delete feedback
      allow delete: if isAdmin();
    }
  }
}
```

---

## 🔐 Firebase Authentication Settings

### How to Configure:
1. Go to **Firebase Console** → **Authentication**
2. Click on **Sign-in method** tab
3. Enable the following providers:

### Required Settings:

#### 1. **Email/Password Authentication**
- ✅ **Enable** Email/Password sign-in
- ✅ **Enable** Email link (passwordless sign-in) - Optional
- ✅ **Disable** Email enumeration protection (for better UX) - Optional

#### 2. **Password Policy** (Recommended)
- Minimum length: **6 characters** (Firebase default)
- Consider enabling:
  - Require uppercase letters
  - Require numbers
  - Require special characters

#### 3. **Authorized Domains**
Add your app domains:
```
localhost (for development)
your-app-domain.com (for production)
your-app-domain.firebaseapp.com
```

#### 4. **Email Templates**
Configure the following email templates in **Authentication** → **Templates**:

##### **Password Reset Email:**
```
Subject: Reset your Campus Navigator password

Hi %DISPLAY_NAME%,

We received a request to reset your Campus Navigator password.

Click the link below to reset your password:
%LINK%

If you didn't request this, you can safely ignore this email.

Thanks,
Campus Navigator Team
```

##### **Email Verification (Optional):**
```
Subject: Verify your Campus Navigator email

Hi %DISPLAY_NAME%,

Thanks for signing up for Campus Navigator!

Please verify your email address by clicking the link below:
%LINK%

Thanks,
Campus Navigator Team
```

---

## 📦 Firebase Storage Rules (Optional)

If you plan to add profile pictures or file uploads, use these rules:

### How to Apply:
1. Go to **Firebase Console** → **Storage**
2. Click on **Rules** tab
3. Copy and paste the rules below
4. Click **Publish**

### Storage Rules Code:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check file size (max 5MB)
    function isValidSize() {
      return request.resource.size < 5 * 1024 * 1024;
    }
    
    // Helper function to check if file is an image
    function isImage() {
      return request.resource.contentType.matches('image/.*');
    }
    
    // ==========================================
    // PROFILE PICTURES
    // ==========================================
    match /profilePictures/{userId}/{fileName} {
      // Users can read their own profile pictures
      allow read: if isAuthenticated();
      
      // Users can upload their own profile pictures
      allow write: if isAuthenticated() && 
                      request.auth.uid == userId &&
                      isImage() &&
                      isValidSize();
      
      // Users can delete their own profile pictures
      allow delete: if isAuthenticated() && request.auth.uid == userId;
    }
    
    // ==========================================
    // GENERAL UPLOADS
    // ==========================================
    match /uploads/{userId}/{fileName} {
      // Users can read their own uploads
      allow read: if isAuthenticated();
      
      // Users can upload their own files
      allow write: if isAuthenticated() && 
                      request.auth.uid == userId &&
                      isValidSize();
      
      // Users can delete their own uploads
      allow delete: if isAuthenticated() && request.auth.uid == userId;
    }
  }
}
```

---

## 📝 Important Notes

### **Critical Rules for Current Features:**

1. **Notifications** - Must allow `read: if request.auth != null` for client-side filtering
2. **Users** - Admins can update/delete any user
3. **POIs** - All authenticated users can read, only admin/faculty can modify
4. **Courses** - Students can increment enrollment count

### **POI Management (manage-poi.tsx) - Detailed Guide:**

The `manage-poi.tsx` feature provides full CRUD (Create, Read, Update, Delete) functionality for Points of Interest.

#### **Permissions:**
- ✅ **Read POIs**: All authenticated users (admin, faculty, student)
- ✅ **Create POIs**: Admin and Faculty only
- ✅ **Update POIs**: Admin and Faculty only
- ✅ **Delete POIs**: Admin and Faculty only

#### **POI Data Structure:**
Each POI document in the `pois` collection contains:
```javascript
{
  name: string,              // Required - POI name
  image: string,             // Image URL (default provided if empty)
  description: string,       // Description of the POI
  location: string,          // Location name/address
  hours: string,             // Operating hours (e.g., "8:00 AM - 10:00 PM")
  capacity: number,          // Maximum capacity
  currentOccupancy: number,  // Current number of people
  status: string,            // "Open", "Busy", "Available", or "Closed"
  latitude: number,          // GPS latitude (default: 33.6844)
  longitude: number,         // GPS longitude (default: 73.0479)
  createdAt: timestamp,      // Auto-generated on creation
  updatedAt: timestamp       // Auto-generated on update
}
```

#### **Features Implemented:**
1. **Add POI**: Click the + button → Fill form → Submit
2. **Edit POI**: Click Edit button on any POI card → Modify fields → Update
3. **Delete POI**: Click Delete button → Confirm deletion
4. **Navigate to Map**: Click Map button → Redirects to `/features/maps` with POI coordinates

#### **Default Values:**
- Image: `https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg`
- Coordinates: Islamabad, Pakistan (33.6844, 73.0479)
- Status: "Open"

#### **Testing POI Management:**
```javascript
// Test POI Data
{
  name: "Main Library",
  description: "Central library with quiet study areas",
  location: "Central Campus",
  hours: "8:00 AM - 10:00 PM",
  capacity: 500,
  currentOccupancy: 120,
  status: "Open",
  latitude: 33.6844,
  longitude: 73.0479
}
```

#### **Navigation Integration:**
When clicking the "Map" button on a POI:
- Navigates to: `/features/maps`
- Passes parameters: `poiName`, `poiLat`, `poiLng`
- Map automatically centers on the POI location
- Route calculation starts from current location to POI

### **Maps.tsx Integration with Firestore POIs:**

The `maps.tsx` screen now integrates with Firestore to display managed POIs alongside personal saved locations.

#### **Dual POI System:**
1. **Managed Campus POIs** (from Firestore `pois` collection):
   - Purple markers on map
   - 🏢 icon in drawer list
   - Real-time sync with manage-poi.tsx
   - Displayed under "Campus POIs" section

2. **Personal Saved POIs** (local state):
   - Red markers on map
   - 📍 icon in drawer list
   - Saved via long-press or manual entry
   - Displayed under category sections

#### **Features:**
- ✅ **Real-time Updates**: Changes in manage-poi.tsx instantly reflect in maps.tsx
- ✅ **Unified Navigation**: Both POI types use same navigation system
- ✅ **Quick Access**: "Manage Campus POIs" button in drawer for easy access
- ✅ **Route Parameters**: Clicking "Map" in manage-poi navigates with POI data
- ✅ **Combined Counter**: Shows total count of both POI types

#### **Data Flow:**
```
User adds POI in manage-poi.tsx
         ↓
Saved to Firestore (pois collection)
         ↓
maps.tsx Firestore listener detects change
         ↓
managedPOIs state updated
         ↓
New marker appears on map
         ↓
POI listed in drawer under "Campus POIs"
```

#### **Implementation Status:**
- ✅ manage-poi.tsx: Fully functional with Firestore CRUD
- ⚠️ maps.tsx: Requires manual integration (see MAPS_INTEGRATION_GUIDE.md)

#### **Integration Steps:**
See `MAPS_INTEGRATION_GUIDE.md` for detailed step-by-step instructions to:
1. Add Firebase imports
2. Create managedPOIs state
3. Add Firestore listener
4. Display managed POIs on map
5. Add "Manage POIs" button
6. Handle route parameters from manage-poi

### **After Publishing Rules:**

1. Wait 10-30 seconds for propagation
2. Reload your app
3. Test all features:
   - Student notifications should load
   - Admin can delete users
   - Faculty can send notifications
   - Students can view POIs
   - **Admin/Faculty can add/edit/delete POIs**
   - **All users can navigate to POI on map**

---

## 🆘 Troubleshooting

### **"Missing or insufficient permissions" Error:**
- Make sure you've published the rules in Firebase Console
- Check that you're logged in as the correct user type
- Verify the collection name matches exactly (case-sensitive)

### **"Index required" Error:**
- Click the link in the error message to create the index automatically
- OR manually create in Firebase Console → Firestore → Indexes

### **Rules not taking effect:**
- Wait 30 seconds after publishing
- Clear app cache and reload
- Check Firebase Console → Firestore → Rules to verify they're published

---

**Last Updated:** December 1, 2025
**Version:** 2.1 (Added POI Management documentation for manage-poi.tsx)
