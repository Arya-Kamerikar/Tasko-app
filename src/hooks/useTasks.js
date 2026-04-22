import { useState, useEffect, useCallback, useMemo } from 'react'
import { generateId, today, isOverdue, priorityOrder, tomorrow, getWeekRange, getWeekendDates } from '../utils/dateUtils'

const STORAGE_KEY = 'tasko_v2_tasks'

function load() {
  try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : [] }
  catch { return [] }
}

export function useTasks() {
  const [tasks, setTasks] = useState(load)

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)) }, [tasks])

  const addTask = useCallback((data) => {
    const task = {
      id: generateId(),
      text: data.text.trim(),
      description: data.description?.trim() || '',
      priority: data.priority || 'Medium',
      category: data.category || 'Personal',
      dueDate: data.dueDate || '',
      dueTime: data.dueTime || '',
      recurrence: data.recurrence || 'None',
      tags: data.tags || [],
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
      order: Date.now(),
    }
    setTasks(prev => [task, ...prev])
    return task
  }, [])

  const updateTask = useCallback((id, updates) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
  }, [])

  const deleteTask = useCallback((id) => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }, [])

  const toggleTask = useCallback((id) => {
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date().toISOString() : null } : t
    ))
  }, [])

  const reorderTasks = useCallback((newOrder) => { setTasks(newOrder) }, [])

  const clearCompleted = useCallback(() => {
    setTasks(prev => prev.filter(t => !t.completed))
  }, [])

  const markAllComplete = useCallback(() => {
    const now = new Date().toISOString()
    setTasks(prev => prev.map(t => ({ ...t, completed: true, completedAt: t.completedAt || now })))
  }, [])

  const exportTasks = useCallback(() => {
    const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url
    a.download = `tasko-backup-${today()}.json`; a.click()
    URL.revokeObjectURL(url)
  }, [tasks])

  const importTasks = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result)
          if (!Array.isArray(imported)) throw new Error('bad format')
          setTasks(prev => {
            const ids = new Set(prev.map(t => t.id))
            return [...imported.filter(t => !ids.has(t.id)), ...prev]
          })
          resolve(imported.length)
        } catch (err) { reject(err) }
      }
      reader.readAsText(file)
    })
  }, [])

  return { tasks, addTask, updateTask, deleteTask, toggleTask, reorderTasks, clearCompleted, markAllComplete, exportTasks, importTasks }
}

export function useFilteredTasks(tasks, filters, sort) {
  return useMemo(() => {
    let r = [...tasks]

    if (filters.search) {
      const q = filters.search.toLowerCase()
      r = r.filter(t =>
        t.text.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        t.tags?.some(tag => tag.toLowerCase().includes(q))
      )
    }

    if (filters.status === 'Completed') r = r.filter(t => t.completed)
    else if (filters.status === 'Pending') r = r.filter(t => !t.completed)

    if (filters.priority && filters.priority !== 'All') r = r.filter(t => t.priority === filters.priority)
    if (filters.category && filters.category !== 'All') r = r.filter(t => t.category === filters.category)

    const tom = tomorrow()
    const td = today()
    const { end: weekEnd } = getWeekRange()
    const weekends = getWeekendDates()

    if (filters.section === 'Today') r = r.filter(t => t.dueDate === td)
    else if (filters.section === 'Tomorrow') r = r.filter(t => t.dueDate === tom)
    else if (filters.section === 'This Week') r = r.filter(t => t.dueDate >= td && t.dueDate <= weekEnd)
    else if (filters.section === 'Weekend') r = r.filter(t => weekends.includes(t.dueDate))
    else if (filters.section === 'Overdue') r = r.filter(t => isOverdue(t))

    if (sort === 'priority') r.sort((a, b) => priorityOrder(a.priority) - priorityOrder(b.priority))
    else if (sort === 'dueDate') r.sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0
      if (!a.dueDate) return 1; if (!b.dueDate) return -1
      return a.dueDate.localeCompare(b.dueDate)
    })
    else if (sort === 'created') r.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    else r.sort((a, b) => (a.order || 0) - (b.order || 0))

    return r
  }, [tasks, filters, sort])
}
