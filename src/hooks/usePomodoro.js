import { useState, useEffect, useRef, useCallback } from 'react'

export function usePomodoro() {
  const [mode, setMode] = useState('work')
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [running, setRunning] = useState(false)
  const [sessions, setSessions] = useState(0)
  const intervalRef = useRef(null)
  const sessRef = useRef(0)

  const DURATIONS = { work: 25 * 60, break: 5 * 60, longBreak: 15 * 60 }

  const switchMode = useCallback((m) => {
    setMode(m); setRunning(false)
    clearInterval(intervalRef.current)
    setTimeLeft(DURATIONS[m])
  }, [])

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current); setRunning(false)
            if (mode === 'work') {
              sessRef.current += 1; setSessions(sessRef.current)
              const nextMode = sessRef.current % 4 === 0 ? 'longBreak' : 'break'
              setTimeout(() => switchMode(nextMode), 100)
            } else {
              setTimeout(() => switchMode('work'), 100)
            }
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('🍅 Tasko Pomodoro', { body: mode === 'work' ? '🎉 Break time!' : '💪 Back to focus!' })
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else { clearInterval(intervalRef.current) }
    return () => clearInterval(intervalRef.current)
  }, [running, mode, switchMode])

  const toggle = () => setRunning(r => !r)
  const reset = () => { setRunning(false); clearInterval(intervalRef.current); setTimeLeft(DURATIONS[mode]) }
  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  return { mode, timeLeft, running, sessions, toggle, reset, switchMode, fmt }
}
