import { useEffect, useRef, useCallback } from 'react'

export function useReminders(tasks, addToast) {
  const notified = useRef(new Set())

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      tasks.forEach(task => {
        if (task.completed || !task.dueDate || !task.dueTime) return
        const due = new Date(task.dueDate + 'T' + task.dueTime)
        const diff = due - now
        if (diff > 0 && diff <= 10 * 60 * 1000 && !notified.current.has(task.id + '_r')) {
          notified.current.add(task.id + '_r')
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('⏰ Tasko Reminder', { body: `"${task.text}" due in ${Math.ceil(diff / 60000)} min`, icon: '/favicon.svg' })
          }
          addToast(`⏰ "${task.text}" due in ${Math.ceil(diff / 60000)} min`, 'warning')
        }
        if (diff < 0 && diff > -60000 && !notified.current.has(task.id + '_o')) {
          notified.current.add(task.id + '_o')
          addToast(`🔴 Overdue: "${task.text}"`, 'error')
        }
      })
    }, 30000)
    return () => clearInterval(interval)
  }, [tasks, addToast])
}
