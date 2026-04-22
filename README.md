# Tasko ✦ Advanced Task Manager

Buttery yellow & white themed, feature-rich task manager. React + Vite, no backend.

## 🚀 Quick Start

```bash
npm install
npm run dev
```
Open **http://localhost:5173**

## ✨ Features
- 📅 Due dates, times, overdue highlights, recurring tasks
- 🎯 4 priority levels (Low → Urgent) with color coding
- 🗂 7 categories + custom tags
- 🔍 Full-text search + filter by status, priority, category
- ↕️ Drag & drop task reordering (@dnd-kit)
- 📊 Stats bar with progress bar and motivational messages
- 📆 Monthly calendar view with task dots
- 🍅 Pomodoro timer with browser notifications
- 🌙 Dark / Light mode toggle (persists)
- 📥 Export & Import tasks as JSON
- ✅ Bulk actions: clear completed, mark all done
- 🔔 Browser reminder notifications (10 min before due)
- 💛 Buttery yellow & white theme with lots of animations

## 📁 Structure
```
src/
├── App.jsx                  # Root
├── index.css                # Full design system
├── context/ToastContext.jsx
├── hooks/
│   ├── useTasks.js
│   ├── useReminders.js
│   └── usePomodoro.js
├── utils/dateUtils.js
└── components/
    ├── Sidebar.jsx
    ├── Header.jsx
    ├── StatsBar.jsx
    ├── FilterToolbar.jsx
    ├── BulkActions.jsx
    ├── TaskList.jsx
    ├── TaskItem.jsx
    ├── TaskModal.jsx
    ├── CalendarView.jsx
    └── PomodoroTimer.jsx
```
