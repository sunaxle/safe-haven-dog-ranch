[[money]]

# Firebase Security Rules Specification

This document outlines the security rules for Cloud Firestore and Cloud Storage. We utilize Firebase Authentication Custom Claims or user document lookups to define `admin` privileges. For simplicity and reduced database reads, it is recommended to set a custom claim `admin: true` for staff users.

## Cloud Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
  
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      // Assuming custom claims are used:
      return isAuthenticated() && request.auth.token.admin == true;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    // 1. Users Collection
    match /users/{userId} {
      // Users can read and write their own basic profile data.
      // Admins can read and write all user profiles.
      allow read: if isOwner(userId) || isAdmin();
      
      // Prevent users from escalating their own privileges
      allow create, update: if isOwner(userId) 
        && (!request.resource.data.keys().hasAll(['role']) 
            || request.resource.data.role == resource.data.role); // Can't change own role
      
      allow write: if isAdmin();
    }

    // 2. Dogs Collection
    match /dogs/{dogId} {
      // Anyone can view the dogs
      allow read: if true;
      
      // Only admins can create, update, or delete dog records
      allow write: if isAdmin();
    }

    // 3. Applications Collection
    match /applications/{appId} {
      // Users can read their own applications. Admins can read all.
      allow read: if isAdmin() || (isAuthenticated() && resource.data.userId == request.auth.uid);
      
      // Users can create an application for themselves.
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      
      // Users cannot update their application once submitted, except maybe to withdraw it.
      // Admins can update any application (e.g., changing status to approved).
      allow update: if isAdmin() || (
        isAuthenticated() && resource.data.userId == request.auth.uid 
        && request.resource.data.status == 'withdrawn'
      );
      
      allow delete: if isAdmin();
    }
  }
}
```

## Cloud Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
  
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isAuthenticated() && request.auth.token.admin == true;
    }

    // 1. Dog Photos
    match /dogs/{dogId}/{imageId} {
      // Anyone can view dog photos
      allow read: if true;
      // Only admins can upload or delete photos
      allow write: if isAdmin();
    }

    // 2. Application Documents
    match /applications/{appId}/{documentId} {
      // Adopters must be authenticated to upload documents to their application.
      // Validating ownership strictly in Storage rules requires passing userId in the path or metadata.
      // We assume paths like: /applications/{userId}/{appId}/{docId} for easier rule checking.
      
      // Let's assume the path is /applications/{userId}/{appId}/{documentId}
    }
    
    match /applications/{userId}/{appId}/{documentId} {
      allow read: if isAdmin() || request.auth.uid == userId;
      allow write: if isAdmin() || request.auth.uid == userId;
    }
  }
}
```
