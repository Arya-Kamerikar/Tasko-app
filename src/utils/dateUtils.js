export const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent']
export const CATEGORIES = ['Personal', 'Work', 'Study', 'Health', 'Finance', 'Shopping', 'Other']
export const RECURRENCE = ['None', 'Daily', 'Weekly', 'Weekends']

export const CATEGORY_EMOJI = {
  Personal: '👤', Work: '💼', Study: '📚', Health: '🏃',
  Finance: '💰', Shopping: '🛒', Other: '📌'
}

export const PRIORITY_COLOR = {
  Low: '#22c55e', Medium: '#888888', High: '#f97316', Urgent: '#dc2626'
}

export const PRIORITY_EMOJI = {
  Low: '🟢', Medium: '🟡', High: '🟠', Urgent: '🔴'
}

export function generateId() {
  return `task_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

export function toDateStr(d = new Date()) {
  return d.toISOString().split('T')[0]
}

export function today() { return toDateStr(new Date()) }

export function tomorrow() {
  const d = new Date(); d.setDate(d.getDate() + 1); return toDateStr(d)
}

export function getWeekRange() {
  const d = new Date()
  const end = new Date(d); end.setDate(d.getDate() + 7)
  return { start: toDateStr(d), end: toDateStr(end) }
}

export function getWeekendDates() {
  const d = new Date()
  const day = d.getDay()
  const sat = new Date(d); sat.setDate(d.getDate() + (6 - day))
  const sun = new Date(sat); sun.setDate(sat.getDate() + 1)
  return [toDateStr(sat), toDateStr(sun)]
}

export function isOverdue(task) {
  if (!task.dueDate || task.completed) return false
  const due = new Date(task.dueDate + (task.dueTime ? 'T' + task.dueTime : 'T23:59'))
  return due < new Date()
}

export function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  if (dateStr === today()) return '📅 Today'
  if (dateStr === tomorrow()) return '📅 Tomorrow'
  return '📅 ' + d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function formatTime(timeStr) {
  if (!timeStr) return ''
  const [h, m] = timeStr.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `⏰ ${hour}:${String(m).padStart(2, '0')} ${ampm}`
}

export function priorityOrder(p) {
  return { Urgent: 0, High: 1, Medium: 2, Low: 3 }[p] ?? 4
}

export function getTasksCompletedToday(tasks) {
  const t = today()
  return tasks.filter(task => task.completed && task.completedAt?.startsWith(t)).length
}

export function getTasksCompletedThisWeek(tasks) {
  const { start, end } = getWeekRange()
  return tasks.filter(task => {
    if (!task.completed || !task.completedAt) return false
    const d = task.completedAt.split('T')[0]
    return d >= start && d <= end
  }).length
}
