# Phase 3: Firebase Backend Setup

This document is for the volunteer web developer. Antigravity has built the UI for the Admin Dashboard (`admin.html`) and drafted the Cloud Functions (`functions/index.js`) required for email notifications and weekly summaries.

To wire everything up, follow these steps:

## 1. Create the Firebase Project
1. Go to [console.firebase.google.com](https://console.firebase.google.com/).
2. Click **Create Project** and name it "Safe Haven".
3. Enable **Firestore Database** and **Authentication** (Email/Password).
4. Register a "Web App" to get your Firebase config block.

## 2. Initialize Firebase Locally
In your terminal, inside the repository folder, run:
```bash
npm install -g firebase-tools
firebase login
firebase init
```
- Select **Firestore**, **Functions**, and **Hosting**.
- Choose your newly created project.

## 3. Wire Up The Frontend
- Add your Firebase SDK config to `admin.html`, `application.html`, and `adopt.html`.
- For `application.html`: Write a javascript listener on the form submit button that calls `addDoc(collection(db, "applications"), { ...formData })`.
- For `admin.html`: Write a query to fetch applications and dogs from Firestore.
- For `adopt.html`: Use Firestore queries (`where()`) to implement the advanced search filters (Size, Breed, Friendly with kids).

## 4. Deploy Cloud Functions
- Open `functions/index.js`.
- The triggers for the instant application email and the weekly donation summary cron job are already written!
- You just need to add a mail transport service (like SendGrid or Nodemailer) to actually send the emails.
- Run `firebase deploy --only functions` to push them to the cloud.
