# Safe Haven Dog Ranch - Automatic Adoption Portal Architecture

## Overview
The Automatic Adoption Portal for Safe Haven Dog Ranch leverages Firebase to provide a scalable, real-time, and secure platform. The system is designed to streamline the adoption process for both prospective adopters and ranch staff.

## Core Firebase Services

### 1. Firebase Authentication
- **Purpose**: Manage user identity securely.
- **Roles**:
  - **Adopters**: Can create accounts (Email/Password or Google Sign-In) to submit and track their adoption applications.
  - **Staff/Admins**: Authenticated personnel who can manage dog profiles and review applications.

### 2. Cloud Firestore (Database)
- **Purpose**: Store all structured data in a scalable NoSQL document database.
- **Key Collections**:
  - `users`: Stores user profiles and role information (e.g., `role: 'admin' | 'adopter'`).
  - `dogs`: Stores dog profiles, including their name, age, breed, description, and adoption status (e.g., `available`, `pending`, `adopted`).
  - `applications`: Stores adoption applications submitted by users. Links a `userId` to a `dogId`.

### 3. Cloud Storage for Firebase
- **Purpose**: Store unstructured binary data securely.
- **Usage**:
  - **Dog Photos**: Staff upload images of dogs to showcase them to adopters.
  - **User Documents**: Adopters might need to upload supporting documents (e.g., lease agreements, vet records) during the application process.

### 4. Cloud Functions for Firebase
- **Purpose**: Run backend code in response to events triggered by Firebase features.
- **Key Functions**:
  - **Email Triggers**: 
    - *On Application Created*: Automatically send a confirmation email to the applicant and a notification email to the staff when a new application is submitted to Firestore.
    - *On Application Status Change*: Send an email update to the applicant when their application is approved or rejected.
  - **Image Processing**: Automatically resize high-resolution dog photos uploaded to Cloud Storage to generate thumbnails, optimizing load times for the portal.
  - **Admin Role Management**: Provide a secure HTTPS endpoint to assign admin roles to specific user accounts via Custom Claims.

## Architecture Workflow
1. **Browsing**: Anonymous users or signed-in adopters browse available dogs. The client app reads from the `dogs` collection in Firestore. Images are served directly from Cloud Storage.
2. **Applying**: A user signs in using Firebase Auth. They fill out an application form for a specific dog. The client app writes a new document to the `applications` collection in Firestore.
3. **Processing**:
   - The write to `applications` triggers a Cloud Function.
   - The function integrates with an email provider (e.g., SendGrid) to send confirmation emails.
4. **Reviewing**: Staff log in to the portal. They query the `applications` collection to review new submissions. When they update an application's status to `approved`, another Cloud Function triggers to notify the adopter.
