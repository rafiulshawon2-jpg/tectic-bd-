# TecTic Bd – Smart Group Publisher

A professional, centralized business promotional campaign manager and automated Facebook Group publisher integrated with a Google Chrome Extension (Manifest V3).

Initially designed for **TecTic Bd**, this application allows agency owners, marketers, and businesses to prepare promotional posts in one place, select 10, 20, 50, or 100+ Facebook groups, calculate smart interval schedules (preventing Facebook spam flags), and automate post publishing through a dedicated Chrome Extension or the built-in browser engine.

---

## 🚀 Key Features

1. **Centralized Operational Dashboard**:
   - Live metrics: Total Groups, Active Groups, Total Campaigns, Scheduled Posts, Successfully Published, Failed Posts, Pending Posts.
   - Real-time Dhaka timezone clock (`BST UTC+6`).
   - Extension bridge status monitor with live ping checks.
   - Recent campaigns progress bars and upcoming queue countdowns.

2. **Facebook Group Manager**:
   - Permanent database of Facebook Groups stored in resilient persistent storage (with Firebase sync ready).
   - **Manual Addition**: Group name, valid URL, custom category, and description.
   - **Bulk URL Import**: Paste dozens of group URLs at once; auto-validates URL format, detects duplicates against existing groups, produces an error report, and imports valid groups in batch.
   - Category and status filters, full text search, and bulk select/delete/status toggle.

3. **Post Composer & Facebook Preview**:
   - Campaign title, post caption, emoji palette, character/word counter, one-click copy and clear.
   - Multi-image and video upload with preview, reordering, and removal.
   - **Realistic Live Facebook Preview**: Accurately simulates Facebook group post presentation, responsive 1/2/3/4+ multi-image grid layout, and engagement bar.

4. **Multiple Group Campaign System & Smart Scheduling**:
   - Stagger posts across 10, 20, 50, or 100+ groups automatically.
   - **Automatic Scheduling**: Set start time and interval (e.g. 5 minutes); the system automatically calculates individual schedules for every single group.
   - **Manual Scheduling**: Custom date and time picker for each target group.
   - Default timezone set to `Asia/Dhaka` with customizable timezone options.

5. **Publishing Queue & Worker**:
   - Statuses: `Draft`, `Scheduled`, `Processing`, `Published`, `Failed`, `Paused`, `Cancelled`.
   - Global queue controls: Pause all queue, resume all queue, run task immediately, edit scheduled time, retry failed tasks.

6. **Chrome Extension Integration (Manifest V3)**:
   - Complete modular source code included in `/chrome-extension/`:
     - `manifest.json`: Manifest V3 specification
     - `background.js`: Background service worker
     - `popup.html` & `popup.js`: Extension popup UI
     - `content.js`: Facebook DOM automation script
     - `messaging.js`: Dashboard-to-extension window communication bridge
     - `publishing-engine.js`: Modular posting orchestrator
     - `scheduler.js`: Alarms and queue countdown manager
   - **1-Click Zip Download**: Generates and downloads `tectic-bd-group-publisher-extension-v1.0.0.zip` ready for `chrome://extensions`.
   - **In-Browser Simulator**: Allows testing and running publishing workflows immediately in the browser without installing the extension.

7. **History, Reports & CSV Export**:
   - Audit trail of all executed tasks with timestamps, confirmation post URLs, and error reasons.
   - RFC-4180 compliant CSV export for team reporting.

8. **Settings & Firebase Architecture**:
   - Full JSON backup and restore.
   - Sample dataset reset.
   - Cloud Firestore security rules viewer and collection blueprint.

---

## 🛠️ Chrome Extension Installation (Takes 30 seconds)

1. Open the web application and navigate to **Chrome Extension** in the left sidebar.
2. Click **Download Extension (.zip)**.
3. Unzip the downloaded archive into a folder on your computer.
4. In Google Chrome, go to `chrome://extensions`.
5. Enable **Developer mode** using the toggle switch in the top-right corner.
6. Click the **Load unpacked** button in the top-left corner.
7. Select the unzipped folder containing `manifest.json`.
8. The TecTic Bd publisher icon will now appear in your browser toolbar!

---

## 💻 Local Development Instructions

### Prerequisites
- Node.js (version 18 or higher)
- npm

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd tectic-bd-group-publisher

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will launch at `http://localhost:3000`.

---

## 📦 Production Build

```bash
# Run TypeScript compilation and Vite production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🗄️ Firestore Database Architecture & Security Rules

When connecting Cloud Firestore, use the following collections:

| Collection | Purpose |
|---|---|
| `users` | User profile and application preferences |
| `groups` | Saved Facebook Groups directory |
| `campaigns` | Promotional campaigns and creative contents |
| `publishingTasks` | Individual group publishing tasks |
| `activityLogs` | Real-time audit logs and delivery receipts |
| `settings` | Timezone, interval, and extension configuration |

### Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() {
      return request.auth != null;
    }

    match /users/{userId} {
      allow read, write: if isAuthenticated() && request.auth.uid == userId;
    }
    match /groups/{groupId} {
      allow read, write: if isAuthenticated();
    }
    match /campaigns/{campaignId} {
      allow read, write: if isAuthenticated();
    }
    match /publishingTasks/{taskId} {
      allow read, write: if isAuthenticated();
    }
    match /activityLogs/{logId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
    }
    match /settings/{settingId} {
      allow read, write: if isAuthenticated();
    }
  }
}
```
