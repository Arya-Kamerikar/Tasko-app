import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { ToastProvider, useToast } from './context/ToastContext'
import { useTasks, useFilteredTasks } from './hooks/useTasks'
import { useReminders } from './hooks/useReminders'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import StatsBar from './components/StatsBar'
import FilterToolbar from './components/FilterToolbar'
import TaskList from './components/TaskList'
import TaskModal from './components/TaskModal'
import BulkActions from './components/BulkActions'
import CalendarView from './components/CalendarView'
import { isOverdue, today, tomorrow, getWeekRange, getWeekendDates } from './utils/dateUtils'

const DEF_FILTERS = { search: '', status: 'All', priority: 'All', category: 'All', section: 'All' }

function AppInner() {
  const { addToast } = useToast()
  const { tasks, addTask, updateTask, deleteTask, toggleTask, reorderTasks, clearCompleted, markAllComplete, exportTasks, importTasks } = useTasks()
  useReminders(tasks, addToast)

  const [section, setSection] = useState('All')
  const [filters, setFilters] = useState(DEF_FILTERS)
  const [sort, setSort] = useState('manual')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [modal, setModal] = useState(false)
  const [editTask, setEditTask] = useState(null)
  const [calView, setCalView] = useState(false)
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('tasko_dark') === 'true')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
    localStorage.setItem('tasko_dark', darkMode)
  }, [darkMode])

  const activeFilters = useMemo(() => ({ ...filters, section }), [filters, section])
  const filtered = useFilteredTasks(tasks, activeFilters, sort)

  const counts = useMemo(() => {
    const td = today(), tom = tomorrow()
    const { end: we } = getWeekRange()
    const wkends = getWeekendDates()
    return {
      All: tasks.filter(t => !t.completed).length,
      Today: tasks.filter(t => t.dueDate === td && !t.completed).length,
      Tomorrow: tasks.filter(t => t.dueDate === tom && !t.completed).length,
      'This Week': tasks.filter(t => t.dueDate >= td && t.dueDate <= we && !t.completed).length,
      Weekend: tasks.filter(t => wkends.includes(t.dueDate) && !t.completed).length,
      Overdue: tasks.filter(t => isOverdue(t)).length,
    }
  }, [tasks])

  const handleSection = useCallback((s) => { setSection(s); setFilters(DEF_FILTERS) }, [])

  const handleSave = useCallback((data) => {
    if (editTask) { updateTask(editTask.id, data); addToast('Task updated!', 'success') }
    else { addTask(data); addToast('Task added!', 'success') }
    setEditTask(null)
  }, [editTask, addTask, updateTask, addToast])

  const handleEdit = useCallback((task) => { setEditTask(task); setModal(true) }, [])
  const handleDelete = useCallback((id) => { deleteTask(id); addToast('Task deleted', 'info') }, [deleteTask, addToast])

  const handleToggle = useCallback((id) => {
    const t = tasks.find(t => t.id === id)
    toggleTask(id)
    addToast(t?.completed ? 'Marked as pending' : 'Task completed!', t?.completed ? 'info' : 'success')
  }, [tasks, toggleTask, addToast])

  const handleClear = useCallback(() => {
    const n = tasks.filter(t => t.completed).length
    clearCompleted()
    addToast('Cleared ' + n + ' task' + (n !== 1 ? 's' : ''), 'info')
  }, [tasks, clearCompleted, addToast])

  const handleMarkAll = useCallback(() => { markAllComplete(); addToast('All tasks completed!', 'success') }, [markAllComplete, addToast])

  const handleImport = useCallback(async (file) => {
    if (!file) return
    try { const n = await importTasks(file); addToast('Imported ' + n + ' tasks!', 'success') }
    catch { addToast('Import failed - invalid file', 'error') }
  }, [importTasks, addToast])

  const completedCount = useMemo(() => tasks.filter(t => t.completed).length, [tasks])

  return (
    <div className={'app-root ' + (darkMode ? 'dark' : 'light')}>
      <div className="bg-deco" aria-hidden="true">
        <div className="deco-blob b1" />
        <div className="deco-blob b2" />
        <div className="deco-blob b3" />
        <span className="deco-star ds1">✦</span>
        <span className="deco-star ds2">✦</span>
        <span className="deco-star ds3">⭐</span>
      </div>

      <Sidebar section={section} onSection={handleSection} counts={counts}
        open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="main-col">
        <Header section={section} onMenu={() => setSidebarOpen(o => !o)}
          onAdd={() => { setEditTask(null); setModal(true) }}
          onExport={exportTasks} onImport={handleImport}
          count={filtered.length} darkMode={darkMode}
          onToggleDark={() => setDarkMode(d => !d)} />

        <div className="content-area">
          <StatsBar tasks={tasks} />

          <div className="view-tabs">
            <button className={'view-tab ' + (!calView ? 'vt-on' : '')} onClick={() => setCalView(false)}>
              📋 List View
            </button>
            <button className={'view-tab ' + (calView ? 'vt-on' : '')} onClick={() => setCalView(true)}>
              📆 Calendar
            </button>
          </div>

          {calView ? (
            <CalendarView tasks={tasks} />
          ) : (
            <>
              <FilterToolbar filters={filters} sort={sort} onFilter={setFilters} onSort={setSort} />
              <BulkActions completed={completedCount} total={tasks.length}
                onClear={handleClear} onMarkAll={handleMarkAll} />
              <TaskList tasks={filtered} allTasks={tasks}
                onToggle={handleToggle} onDelete={handleDelete}
                onEdit={handleEdit} onReorder={reorderTasks} />
            </>
          )}
        </div>
      </div>

      {modal && (
        <TaskModal task={editTask} onSave={handleSave}
          onClose={() => { setModal(false); setEditTask(null) }} />
      )}
    </div>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <AppInner />
    </ToastProvider>
  )
}
