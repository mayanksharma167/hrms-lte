import { useEffect, useState } from 'react'
import { Filter, X } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../lib/api'
import MarkAttendanceForm from '../components/MarkAttendanceForm'
import AttendanceTable from '../components/AttendanceTable'

export default function Attendance() {
    const [records, setRecords] = useState([])
    const [loading, setLoading] = useState(true)
    const [dateFilter, setDateFilter] = useState('')

    const fetchAttendance = async (date = '') => {
        setLoading(true)
        try {
            const url = date ? `/api/attendance?date=${date}` : '/api/attendance'
            const res = await api.get(url)
            setRecords(res.data)
        } catch (err) {
            toast.error('Failed to load attendance records')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchAttendance() }, [])

    const handleDateFilter = (e) => {
        const val = e.target.value
        setDateFilter(val)
        fetchAttendance(val)
    }

    const clearFilter = () => {
        setDateFilter('')
        fetchAttendance('')
    }

    const handleMarked = (newRecord) => {
        // Refresh to get populated employee data
        fetchAttendance(dateFilter)
    }

    return (
        <div>
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Attendance</h1>
                    <p className="page-subtitle">
                        {loading ? 'Loading...' : `${records.length} record${records.length !== 1 ? 's' : ''}${dateFilter ? ` for ${dateFilter}` : ''}`}
                    </p>
                </div>

                {/* Date filter */}
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <style>{`
    /* ── Date input: force calendar icon visible & styled ── */
    .date-wrapper {
        position: relative;
    }
    .date-wrapper .cal-icon {
        position: absolute;
        left: 11px;
        top: 50%;
        transform: translateY(-50%);
        pointer-events: none;
        color: #6b7280;
        z-index: 1;
    }
    .date-input-styled {
        padding-left: 2.25rem !important;
        color-scheme: light;
    }

    /* ── Always show the native calendar picker icon ── */
    .date-input-styled::-webkit-calendar-picker-indicator {
        opacity: 1 !important;
        visibility: visible !important;
        pointer-events: auto;           /* ← allows clicking the icon directly */
        width: 15px;
        height: 15px;
        margin: 0 8px 0 0;
        cursor: pointer;
    }

    /* Optional: make it even more obvious / styled */
    .date-input-styled::-webkit-calendar-picker-indicator:hover {
        opacity: 1;
        filter: brightness(1.15);
    }

    /* Firefox usually shows it always — but this helps consistency */
    .date-input-styled {
        -moz-appearance: textfield;     /* removes default spinner in some cases */
    }

    /* Present / Absent toggle buttons */
    .status-btn {
        flex: 1;
        padding: 0.5rem 0;
        font-size: 0.875rem;
        font-weight: 500;
        border: none;
        cursor: pointer;
        transition: background 0.18s ease, color 0.18s ease, box-shadow 0.18s ease;
        letter-spacing: 0.02em;
    }
    .status-btn.present-active {
        background: linear-gradient(135deg, #059669 0%, #10b981 60%, #34d399 100%);
        color: #fff;
        box-shadow: 0 0 16px 0 rgba(16, 185, 129, 0.35), inset 0 1px 0 rgba(255,255,255,0.12);
    }
    .status-btn.absent-active {
        background: linear-gradient(135deg, #b91c1c 0%, #ef4444 60%, #f87171 100%);
        color: #fff;
        box-shadow: 0 0 16px 0 rgba(239, 68, 68, 0.35), inset 0 1px 0 rgba(255,255,255,0.12);
    }
    .status-btn.inactive {
        background: #141414;
        color: #6b7280;
    }
    .status-btn.inactive:hover {
        background: #1e1e1e;
        color: #9ca3af;
    }

    /* ── Submit button ── */
    .submit-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.4rem;
        width: 100%;
        padding: 0.6rem 1rem;
        font-size: 0.875rem;
        font-weight: 600;
        border: none;
        border-radius: 0.5rem;
        cursor: pointer;
        letter-spacing: 0.03em;
        transition: opacity 0.2s, box-shadow 0.2s, transform 0.12s;
        background: linear-gradient(135deg, #3730a3 0%, #4f46e5 50%, #6366f1 100%);
        color: #fff;
        box-shadow: 0 2px 18px 0 rgba(99, 102, 241, 0.32), inset 0 1px 0 rgba(255,255,255,0.1);
    }
    .submit-btn:hover:not(:disabled) {
        box-shadow: 0 4px 24px 0 rgba(99, 102, 241, 0.5), inset 0 1px 0 rgba(255,255,255,0.15);
        transform: translateY(-1px);
    }
    .submit-btn:active:not(:disabled) {
        transform: translateY(0);
    }
    .submit-btn:disabled {
        opacity: 0.45;
        cursor: not-allowed;
    }
`}</style>
                        <Filter size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white pointer-events-none" />
                        <input
                            type="date"
                            value={dateFilter}
                            onChange={handleDateFilter}
                            max={new Date().toISOString().split('T')[0]}
                            className="input date-input-styled pl-8 pr-3 w-44 text-white"
                            placeholder="Filter by date"
                        />
                    </div>
                    {dateFilter && (
                        <button onClick={clearFilter} className="btn-secondary px-3">
                            <X size={13} />
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Two-column layout */}
            <div className="flex gap-6">
                {/* Mark Attendance Form — left panel */}
                <div className="w-72 flex-shrink-0">
                    <MarkAttendanceForm onMarked={handleMarked} />
                </div>

                {/* Attendance Table — right panel */}
                <div className="flex-1 min-w-0">
                    <AttendanceTable records={records} loading={loading} />
                </div>
            </div>
        </div>
    )
}