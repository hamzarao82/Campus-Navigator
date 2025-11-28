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

### **After Publishing Rules:**

1. Wait 10-30 seconds for propagation
2. Reload your app
3. Test all features:
   - Student notifications should load
   - Admin can delete users
   - Faculty can send notifications
   - Students can view POIs

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

**Last Updated:** November 29, 2025
**Version:** 2.0 (Updated for client-side notification filtering)
