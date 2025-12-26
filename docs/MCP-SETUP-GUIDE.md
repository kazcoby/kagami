# MCP Setup Guide for Kristi Jacoby

> Your personal AI assistant toolkit — email, calendar, Canvas, and more!

## What is MCP?

MCP (Model Context Protocol) is like "USB-C for AI" — it lets Claude connect to your real tools and services. Once set up, I can:

- **Read and send emails** for you
- **Manage your calendar** and schedule meetings
- **Access Canvas LMS** to help with courses
- **Search Google Drive** for documents
- **Post to Slack** channels
- **Create notes and reminders**
- And much more!

---

## Quick Start: Essential Setup

### Step 1: Install Prerequisites

You'll need Node.js installed. Open Terminal and run:

```bash
# Check if Node.js is installed
node --version

# If not installed, install via Homebrew
brew install node
```

### Step 2: Set Up Gmail (Email)

This lets me read, search, and send emails on your behalf.

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project called "Claude Assistant"
3. Enable the Gmail API:
   - Go to "APIs & Services" → "Enable APIs"
   - Search for "Gmail API" and enable it
4. Create OAuth credentials:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Choose "Desktop app"
   - Download the JSON file
5. Run authentication:
   ```bash
   npx @gongrzhe/server-gmail-autoauth-mcp auth
   ```
6. Follow the browser prompts to authorize

**What I can do with Gmail:**
- Search emails: "Find emails from Dr. Smith about the curriculum"
- Read emails: "What did the IT department say?"
- Send emails: "Draft an email to faculty about the workshop"
- Manage labels: "Label all Canvas notifications as 'LMS'"
- Batch operations: "Archive all emails older than 30 days from newsletters"

---

### Step 3: Set Up Google Calendar

1. In the same Google Cloud project, enable the Google Calendar API
2. Your OAuth credentials will work for both
3. Run:
   ```bash
   npx @nspady/google-calendar-mcp
   ```

**What I can do with Calendar:**
- Schedule meetings: "Schedule a meeting with Sarah for next Tuesday at 2pm"
- Find free time: "When am I free this week for a 1-hour meeting?"
- List events: "What's on my calendar tomorrow?"
- Smart scheduling: "Find a time that works for me and the department"

---

### Step 4: Set Up Canvas LMS

This is your superpower for course management!

1. Log into Canvas at your institution
2. Go to Account → Settings → Approved Integrations → New Access Token
3. Generate a token and save it securely
4. Set environment variables:
   ```bash
   export CANVAS_API_TOKEN="your-token-here"
   export CANVAS_DOMAIN="canyons.instructure.com"  # Your Canvas domain
   ```

**What I can do with Canvas (54 tools!):**
- Course management: "List all active courses"
- Assignments: "Create an assignment due next Friday"
- Grades: "Show me grades for ENG 101"
- Enrollments: "Who's enrolled in my online course?"
- Analytics: "How are students performing in Module 3?"
- Bulk operations: "Send a message to all students in COM 201"

---

### Step 5: Set Up Google Drive

Uses the same Google Cloud project.

1. Enable the Google Drive API in your project
2. Your existing OAuth credentials will work

**What I can do with Drive:**
- Search: "Find the syllabus template"
- Read: "What's in the Faculty Handbook?"
- Create: "Create a new document for meeting notes"
- Organize: "Move all course files to the Archive folder"

---

### Step 6: Set Up Slack (Optional)

If your team uses Slack:

1. Go to [api.slack.com/apps](https://api.slack.com/apps)
2. Create a new app
3. Add Bot Token Scopes: `channels:read`, `chat:write`, `users:read`
4. Install to workspace
5. Copy the Bot Token
6. Set environment variable:
   ```bash
   export SLACK_BOT_TOKEN="xoxb-your-token"
   ```

**What I can do with Slack:**
- Read channels: "What's the latest in #faculty-announcements?"
- Post messages: "Post the workshop reminder to #online-learning"
- Search: "Find messages about the LMS update"

---

### Step 7: Set Up Notion (Optional)

For knowledge management and documentation:

1. Go to [notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Create a new integration
3. Copy the Internal Integration Token
4. Share your Notion pages with the integration
5. Set environment variable:
   ```bash
   export NOTION_TOKEN="secret_your-token"
   ```

**What I can do with Notion:**
- Search: "Find the course design checklist"
- Create: "Add a new page for workshop notes"
- Update: "Add today's meeting notes to the project page"

---

## Local Tools (No Setup Required)

These work immediately on your Mac:

### Apple Notes
- "Search my notes for accessibility checklist"
- "Create a new note with today's meeting summary"
- "Read my note about Canvas tips"

### Apple Reminders
- "Add a reminder to review assignments tomorrow"
- "Show my reminders for this week"
- "Create a shopping list"

### Filesystem
- "Read the document on my Desktop"
- "List files in my Documents folder"
- "Find all PDFs in my Downloads"

### YouTube Transcripts
- "Get the transcript from this video: [URL]"
- Perfect for creating study guides from educational videos!

### Web Fetch
- "Read the content from this webpage"
- "Summarize this article: [URL]"

### Memory
- I can remember things across our conversations!
- "Remember that the next department meeting is on the 15th"
- "What do you remember about my Canvas preferences?"

---

## All-in-One Setup Script

Run this script to set all your environment variables:

```bash
#!/bin/bash
# Save as ~/setup-mcp.sh and run: source ~/setup-mcp.sh

# Canvas LMS
export CANVAS_API_TOKEN="your-canvas-token"
export CANVAS_DOMAIN="canyons.instructure.com"

# Notion (optional)
export NOTION_TOKEN="secret_your-notion-token"

# Slack (optional)
export SLACK_BOT_TOKEN="xoxb-your-slack-token"

echo "MCP environment variables set!"
```

Add to your `~/.zshrc` to make permanent:
```bash
echo 'source ~/setup-mcp.sh' >> ~/.zshrc
```

---

## Testing Your Setup

Once configured, try these commands with me:

1. **Email**: "Search my Gmail for emails from this week"
2. **Calendar**: "What's on my calendar today?"
3. **Canvas**: "List my active Canvas courses"
4. **Drive**: "Search my Drive for syllabus"
5. **Notes**: "Search my Apple Notes"
6. **Reminders**: "Show my reminders"

---

## Security Notes

- **OAuth tokens** are stored locally and securely
- **API keys** should never be shared or committed to git
- All tools respect your existing **permissions** — I can only do what you're allowed to do
- You can **revoke access** anytime in each service's settings

---

## Troubleshooting

### "Command not found: npx"
Install Node.js: `brew install node`

### "Authentication failed"
Re-run the auth command for that service

### "Permission denied"
Check that your API token has the required scopes

### Canvas not connecting
Verify your domain and token are correct

---

## Priority Recommendations for You

Based on your role as Online Education Coordinator:

### Tier 1 — Set Up First (Biggest Impact)
1. **Gmail** — Handle communications efficiently
2. **Google Calendar** — Smart scheduling
3. **Canvas LMS** — Your core platform
4. **Google Drive** — Document management

### Tier 2 — High Value
5. **Notion** — Knowledge base for your team
6. **YouTube Transcript** — Educational content
7. **Slack** — Team communication

### Tier 3 — Personal Productivity
8. **Apple Notes** — Quick capture
9. **Apple Reminders** — Task management
10. **Memory** — I remember your preferences

---

## What This Means for Your Work

Once set up, you can say things like:

> "Check my email for anything urgent from faculty, then add any deadlines to my calendar and create Canvas announcements for affected courses."

And I'll handle it all, step by step, with your approval.

---

*The Seven Colonies are ready to help you. Let's get you connected!*

h(x) ≥ 0 — Always 🪞
