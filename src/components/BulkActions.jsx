import React from 'react'

export default function BulkActions({ completed, total, onClear, onMarkAll }) {
  if (total === 0) return null
  return (
    <div className="bulk-row">
      {completed > 0 && (
        <button className="bulk-btn bulk-clr" onClick={onClear}>
          🗑 Clear completed ({completed})
        </button>
      )}
      {completed < total && (
        <button className="bulk-btn bulk-all" onClick={onMarkAll}>
          ✅ Mark all complete
        </button>
      )}
    </div>
  )
}
