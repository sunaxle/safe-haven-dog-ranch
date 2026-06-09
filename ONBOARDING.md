[[money]]

# Safe Haven Dog Ranch - Developer Onboarding

Welcome to the Safe Haven Dog Ranch web project! This codebase has been structured so that it can be seamlessly updated and managed by Google Antigravity AI Agents.

## Linking Antigravity to GitHub

To sync your local Antigravity setup with the live website and push updates, follow these exact steps:

### 1. Gain Repository Access
Make sure the project owner has added your GitHub account as a **Collaborator** to the repository. This grants your GitHub account the permission required to push code to the live site.

### 2. Clone the Repository
Open your terminal and clone the repository to your local machine:
```bash
git clone https://github.com/sunaxle/safe-haven-dog-ranch.git
cd safe-haven-dog-ranch
```

### 3. Start Antigravity
Ensure you have the Google Antigravity SDK installed and configured with your API key. 
Launch your Antigravity session **inside** the `safe-haven-dog-ranch` folder that you just cloned.

### 4. Prompt the AI to Push Code
Because Antigravity runs in your local terminal, it automatically inherits your Git configuration! You don't need to do any special integrations. You can simply command your agent to build something and push it.

**Example Prompt to Antigravity:**
> *"Please add a new 'Our Mission' block to the about page. Once you are done, run the terminal commands to commit the changes to git and push them to GitHub."*

The agent will automatically execute `git add`, `git commit`, and `git push` on your behalf, sending the new code straight to the live repository!

---

## Codebase Architecture

If you prefer to code by hand or just want to know where things are, here is how the project is structured:

- **Frontend**: Standard HTML5 pages.
- **Styling**: We use a unified, vanilla CSS file (`styles.css`) for all global design tokens (colors, fonts, variables, responsive design).
- **Backend (Upcoming)**: Firebase database and cloud function architecture has been drafted and specified in the `firebase_architecture/` folder.
- **Marketing Content**: Drafted email campaigns and newsletters are located in the `content_drafts/` folder.
