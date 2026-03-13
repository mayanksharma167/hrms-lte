import { useEffect, useState, useCallback } from 'react'
import {
    Users, UserCheck, UserX, Clock,
    TrendingUp, RefreshCw, Award, BarChart2
} from 'lucide-react'
import StatCard from '../components/StatCard'
import api from '../lib/api'
import toast from 'react-hot-toast'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Cell,
    AreaChart, Area, Legend
} from 'recharts'

// ── Helpers ───────────────────────────────────────────────────────────────────

function todayLabel() {
    return new Date().toLocaleDateString('en-IN', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    })
}

// ── Custom Tooltip ────────────────────────────────────────────────────────────

function DarkTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null
    return (
        <div style={{
            background: '#0d0d0d', border: '1px solid #1f1f1f', borderRadius: 8,
            padding: '8px 14px', fontSize: 12, color: '#e5e7eb',
            boxShadow: '0 8px 24px rgba(0,0,0,0.6)'
        }}>
            <p style={{ color: '#6b7280', marginBottom: 4, fontSize: 11 }}>{label}</p>
            {payload.map((p, i) => (
                <p key={i} style={{ fontWeight: 600, color: p.color }}>
                    {p.name}: <span style={{ color: '#f9fafb' }}>{p.value}</span>
                </p>
            ))}
        </div>
    )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function RecentAttendanceTable({ records, loading }) {
    if (loading) return (
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[...Array(6)].map((_, i) => (
                <div key={i} style={{ height: 36, borderRadius: 8, background: '#111', animation: 'dash-pulse 1.4s ease-in-out infinite', opacity: 1 - i * 0.12 }} />
            ))}
        </div>
    )

    if (!records?.length) return (
        <div style={{ padding: '48px 24px', textAlign: 'center' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#111', border: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <UserCheck size={18} color="#374151" />
            </div>
            <p style={{ fontSize: '0.8125rem', color: '#4b5563', fontWeight: 500 }}>No attendance records yet</p>
            <p style={{ fontSize: '0.75rem', color: '#374151', marginTop: 4 }}>Head to Attendance to start marking</p>
        </div>
    )

    return (
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                <thead>
                    <tr style={{ background: '#060606' }}>
                        {['Employee', 'Department', 'Date', 'Status'].map(h => (
                            <th key={h} style={{ textAlign: 'left', padding: '10px 24px', fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: '#374151' }}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {records.map(record => (
                        <tr key={record._id} className="dash-table-row">
                            <td style={{ padding: '13px 24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(79,70,229,0.2), rgba(124,58,237,0.15))', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <span style={{ fontSize: 11, fontWeight: 700, color: '#818cf8' }}>
                                            {(record.employee?.full_name || '?').charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: 600, color: '#e5e7eb', lineHeight: 1 }}>{record.employee?.full_name || '—'}</p>
                                        <p style={{ fontSize: 11, color: '#374151', fontFamily: 'ui-monospace, monospace', marginTop: 3, letterSpacing: '0.04em' }}>{record.employee?.employee_id}</p>
                                    </div>
                                </div>
                            </td>
                            <td style={{ padding: '13px 24px' }}>
                                <span style={{ fontSize: 11, fontWeight: 600, color: '#4b5563', background: '#111', border: '1px solid #1a1a1a', borderRadius: 6, padding: '2px 8px', letterSpacing: '0.03em' }}>
                                    {record.employee?.department || '—'}
                                </span>
                            </td>
                            <td style={{ padding: '13px 24px' }}>
                                <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.775rem', color: '#4b5563' }}>{record.date}</span>
                            </td>
                            <td style={{ padding: '13px 24px' }}>
                                <span style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 6,
                                    padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, letterSpacing: '0.05em',
                                    ...(record.status === 'PRESENT'
                                        ? { background: 'rgba(16,185,129,0.08)', color: '#34d399', border: '1px solid rgba(16,185,129,0.15)' }
                                        : { background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.15)' })
                                }}>
                                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: record.status === 'PRESENT' ? '#10b981' : '#ef4444', boxShadow: record.status === 'PRESENT' ? '0 0 5px rgba(16,185,129,0.7)' : '0 0 5px rgba(239,68,68,0.7)' }} />
                                    {record.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

function PresentDaysTable({ data, loading }) {
    if (loading) return (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[...Array(5)].map((_, i) => (
                <div key={i} style={{ height: 36, borderRadius: 8, background: '#111', animation: 'dash-pulse 1.4s ease-in-out infinite', opacity: 1 - i * 0.15 }} />
            ))}
        </div>
    )

    if (!data?.length) return (
        <div style={{ padding: '48px 24px', textAlign: 'center' }}>
            <TrendingUp size={20} color="#374151" style={{ margin: '0 auto 10px', display: 'block' }} />
            <p style={{ fontSize: '0.8125rem', color: '#4b5563' }}>No data yet</p>
        </div>
    )

    const max = data[0]?.totalPresent || 1
    const rankColors = ['#f59e0b', '#9ca3af', '#f97316']

    return (
        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {data.map((row, idx) => (
                <div key={row._id || idx} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, background: rankColors[idx] ? `${rankColors[idx]}22` : '#111', color: rankColors[idx] || '#4b5563', border: `1px solid ${rankColors[idx] ? rankColors[idx] + '44' : '#1f1f1f'}` }}>{idx + 1}</div>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg, rgba(79,70,229,0.15), rgba(124,58,237,0.1))', border: '1px solid rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#818cf8' }}>{(row.employee_id || '?').charAt(0)}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                            <span style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', fontFamily: 'ui-monospace, monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.employee_id}</span>
                            <span style={{ fontSize: 11, fontWeight: 700, color: '#34d399', marginLeft: 8, flexShrink: 0 }}>{row.totalPresent}d</span>
                        </div>
                        <div style={{ height: 4, background: '#111', borderRadius: 4, overflow: 'hidden', border: '1px solid #1a1a1a' }}>
                            <div style={{ height: '100%', borderRadius: 4, background: 'linear-gradient(90deg, #059669, #34d399)', width: `${(row.totalPresent / max) * 100}%`, transition: 'width 0.6s ease', boxShadow: '0 0 6px rgba(52,211,153,0.4)' }} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

// ── Analytics Charts ──────────────────────────────────────────────────────────

function AttendanceViz({ stats, loading }) {
    const CARD = { background: '#0a0a0a', border: '1px solid #161616', borderRadius: 14, overflow: 'hidden' }
    const HDR = { padding: '14px 20px', borderBottom: '1px solid #161616', display: 'flex', alignItems: 'center', gap: 8 }

    if (loading) return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {[0, 1, 2].map(i => (
                <div key={i} style={{ ...(i === 2 ? { gridColumn: '1 / -1' } : {}), height: 260, borderRadius: 14, background: '#0a0a0a', border: '1px solid #161616', animation: 'dash-pulse 1.4s ease-in-out infinite' }} />
            ))}
        </div>
    )

    const barData = (stats?.presentDaysPerEmployee || []).slice(0, 8).map(row => ({
        name: row.employee_id || '—',
        present: row.totalPresent || 0,
    }))

    // ✅ FIXED WEEKLY TREND LOGIC
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

    const weekTrend = weekDays.map(day => {
        const record = stats?.weeklyTrend?.find(d => d.day === day)

        return {
            day,
            present: record?.present || 0,
            absent: record?.absent || 0
        }
    })

    const total = stats?.totalEmployees || 1

    const segs = [
        { label: 'Present', value: stats?.presentToday || 0, color: '#10b981', glow: 'rgba(16,185,129,0.5)' },
        { label: 'Absent', value: stats?.absentToday || 0, color: '#ef4444', glow: 'rgba(239,68,68,0.5)' },
        { label: 'Not Marked', value: stats?.notMarkedToday || 0, color: '#f59e0b', glow: 'rgba(245,158,11,0.5)' },
    ]

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

            {/* Bar Chart */}
            <div style={CARD}>
                <div style={HDR}>
                    <BarChart2 size={13} color="#818cf8" />
                    <div>
                        <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f9fafb' }}>
                            Present Days per Employee
                        </p>
                        <p style={{ fontSize: 11, color: '#4b5563', marginTop: 2 }}>
                            All-time attendance count
                        </p>
                    </div>
                </div>

                <div style={{ padding: '20px 16px 12px' }}>
                    <ResponsiveContainer width="100%" height={210}>
                        <BarChart data={barData} barSize={18} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="barGradTop" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#818cf8" />
                                    <stop offset="100%" stopColor="#4f46e5" />
                                </linearGradient>
                            </defs>

                            <CartesianGrid vertical={false} stroke="#141414" />

                            <XAxis
                                dataKey="name"
                                tick={{ fill: '#4b5563', fontSize: 10, fontFamily: 'ui-monospace, monospace' }}
                                axisLine={false}
                                tickLine={false}
                            />

                            <YAxis
                                tick={{ fill: '#374151', fontSize: 10 }}
                                axisLine={false}
                                tickLine={false}
                            />

                            <Tooltip content={<DarkTooltip />} cursor={{ fill: 'rgba(255,255,255,0.025)' }} />

                            <Bar dataKey="present" name="Days Present" radius={[4, 4, 0, 0]}>
                                {barData.map((_, i) => (
                                    <Cell
                                        key={i}
                                        fill={i === 0
                                            ? 'url(#barGradTop)'
                                            : `rgba(99,102,241,${Math.max(0.25, 0.5 - i * 0.05)})`}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Weekly Trend Area Chart */}
            <div style={CARD}>
                <div style={HDR}>
                    <TrendingUp size={13} color="#34d399" />
                    <div>
                        <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f9fafb' }}>
                            Weekly Attendance Trend
                        </p>
                        <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>
                            Present vs Absent this week
                        </p>
                    </div>
                </div>

                <div style={{ padding: '20px 16px 12px' }}>
                    <ResponsiveContainer width="100%" height={210}>
                        <AreaChart data={weekTrend} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>

                            <defs>
                                <linearGradient id="areaPresent" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />
                                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>

                                <linearGradient id="areaAbsent" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.2} />
                                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid vertical={false} stroke="#141414" />

                            <XAxis
                                dataKey="day"
                                tick={{ fill: '#9ca3af', fontSize: 11 }}
                                axisLine={false}
                                tickLine={false}
                            />

                            <YAxis
                                tick={{ fill: '#6b7280', fontSize: 10 }}
                                axisLine={false}
                                tickLine={false}
                            />

                            <Tooltip content={<DarkTooltip />} cursor={{ stroke: '#1f1f1f', strokeWidth: 1 }} />

                            <Legend
                                wrapperStyle={{ fontSize: 11, color: '#9ca3af', paddingTop: 8 }}
                                iconType="circle"
                                iconSize={7}
                            />

                            <Area
                                type="monotone"
                                dataKey="present"
                                name="Present"
                                stroke="#10b981"
                                strokeWidth={2}
                                fill="url(#areaPresent)"
                                dot={{ fill: '#10b981', r: 3, strokeWidth: 0 }}
                                activeDot={{ r: 5, fill: '#34d399', strokeWidth: 0 }}
                            />

                            <Area
                                type="monotone"
                                dataKey="absent"
                                name="Absent"
                                stroke="#ef4444"
                                strokeWidth={2}
                                fill="url(#areaAbsent)"
                                dot={{ fill: '#ef4444', r: 3, strokeWidth: 0 }}
                                activeDot={{ r: 5, fill: '#f87171', strokeWidth: 0 }}
                            />

                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Workforce Snapshot */}
            <div style={{ ...CARD, gridColumn: '1 / -1' }}>
                <div style={HDR}>
                    <Users size={13} color="#f59e0b" />
                    <div>
                        <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f9fafb' }}>
                            Today's Workforce Snapshot
                        </p>
                        <p style={{ fontSize: 11, color: '#4b5563', marginTop: 2 }}>
                            Present · Absent · Not yet marked
                        </p>
                    </div>
                </div>

                <div style={{ padding: '20px 24px' }}>
                    <div style={{
                        display: 'flex',
                        height: 10,
                        borderRadius: 8,
                        overflow: 'hidden',
                        background: '#0d0d0d',
                        border: '1px solid #1a1a1a',
                        marginBottom: 18
                    }}>
                        {segs.map(s => s.value > 0 && (
                            <div
                                key={s.label}
                                style={{
                                    width: `${Math.round((s.value / total) * 100)}%`,
                                    background: s.color
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>

        </div>
    )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function Dashboard() {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    const fetchStats = useCallback(async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true)
        else setLoading(true)
        try {
            const res = await api.get('/api/dashboard')
            setStats(res.data)
        } catch {
            toast.error('Failed to load dashboard data')
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }, [])

    useEffect(() => { fetchStats() }, [fetchStats])

    const attendanceRate = stats && stats.totalEmployees > 0
        ? Math.round((stats.presentToday / stats.totalEmployees) * 100)
        : null

    const CARD = { background: '#0a0a0a', border: '1px solid #161616', borderRadius: 14, overflow: 'hidden' }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <style>{`
                @keyframes dash-pulse { 0%,100%{opacity:1} 50%{opacity:.35} }
                .dash-table-row { border-top: 1px solid #111; transition: background .12s; }
                .dash-table-row:hover { background: rgba(255,255,255,.018); }
                .dash-refresh-btn {
                    display:inline-flex; align-items:center; gap:6px;
                    padding:7px 14px; border-radius:9px; border:1px solid #1f1f1f;
                    background:#0d0d0d; color:#6b7280; font-size:.8rem;
                    font-weight:500; cursor:pointer;
                    transition:background .15s,color .15s,border-color .15s;
                    letter-spacing:.02em;
                }
                .dash-refresh-btn:hover:not(:disabled){background:#141414;color:#9ca3af;border-color:#2a2a2a;}
                .dash-refresh-btn:disabled{opacity:.4;cursor:not-allowed;}
                @keyframes spin{to{transform:rotate(360deg)}}
            `}</style>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                    <h1 style={{ fontSize: '1.1875rem', fontWeight: 700, color: '#f9fafb', letterSpacing: '-0.01em' }}>Dashboard</h1>
                    <p style={{ fontSize: '0.8rem', color: '#4b5563', marginTop: 3 }}>{todayLabel()}</p>
                </div>
                <button onClick={() => fetchStats(true)} disabled={refreshing} className="dash-refresh-btn">
                    <RefreshCw size={12} style={refreshing ? { animation: 'spin 0.8s linear infinite' } : {}} />
                    Refresh
                </button>
            </div>

            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
                <StatCard label="Total Employees" value={stats?.totalEmployees} icon={Users} color="brand" loading={loading} />
                <StatCard label="Present Today" value={stats?.presentToday} icon={UserCheck} color="emerald" loading={loading} />
                <StatCard label="Absent Today" value={stats?.absentToday} icon={UserX} color="red" loading={loading} />
                <StatCard label="Not Marked" value={stats?.notMarkedToday} icon={Clock} color="amber" loading={loading} />
            </div>

            {/* Attendance Rate Banner */}
            {!loading && attendanceRate !== null && (
                <div style={{ ...CARD, padding: '18px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                        <div>
                            <p style={{ fontSize: '10px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Today's Attendance Rate</p>
                            <p style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f9fafb', marginTop: 2, letterSpacing: '-0.02em' }}>{attendanceRate}%</p>
                        </div>
                        <div style={{
                            padding: '4px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
                            ...(attendanceRate >= 80
                                ? { background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' }
                                : attendanceRate >= 50
                                    ? { background: 'rgba(245,158,11,0.1)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.2)' }
                                    : { background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' })
                        }}>
                            {attendanceRate >= 80 ? '● GOOD' : attendanceRate >= 50 ? '● AVERAGE' : '● LOW'}
                        </div>
                    </div>
                    <div style={{ height: 5, background: '#0d0d0d', borderRadius: 4, overflow: 'hidden', border: '1px solid #1a1a1a' }}>
                        <div style={{
                            height: '100%', borderRadius: 4, transition: 'width .7s ease',
                            width: `${attendanceRate}%`,
                            background: attendanceRate >= 80
                                ? 'linear-gradient(90deg,#059669,#34d399)'
                                : attendanceRate >= 50
                                    ? 'linear-gradient(90deg,#d97706,#fbbf24)'
                                    : 'linear-gradient(90deg,#b91c1c,#f87171)',
                            boxShadow: attendanceRate >= 80
                                ? '0 0 8px rgba(52,211,153,0.5)'
                                : attendanceRate >= 50
                                    ? '0 0 8px rgba(251,191,36,0.5)'
                                    : '0 0 8px rgba(248,113,113,0.5)'
                        }} />
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#374151', marginTop: 10 }}>
                        {stats?.presentToday} present · {stats?.absentToday} absent · {stats?.notMarkedToday} not marked
                    </p>
                </div>
            )}



            {/* Analytics Section */}
            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <BarChart2 size={13} color="#818cf8" />
                    <h2 style={{ fontSize: '10.5px', fontWeight: 700, color: '#374151', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Analytics</h2>
                    <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,#1a1a1a,transparent)' }} />
                </div>
                <AttendanceViz stats={stats} loading={loading} />
            </div>
            {/* Recent + Leaderboard */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
                <div style={CARD}>
                    <div style={{ padding: '14px 24px', borderBottom: '1px solid #161616', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <h2 style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f9fafb' }}>Recent Attendance</h2>
                            <p style={{ fontSize: 11, color: '#4b5563', marginTop: 2 }}>Last 10 records across all employees</p>
                        </div>
                        <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#4b5563', background: '#111', border: '1px solid #1f1f1f', borderRadius: 6, padding: '2px 8px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Live</span>
                    </div>
                    <RecentAttendanceTable records={stats?.recentAttendance} loading={loading} />
                </div>

                <div style={CARD}>
                    <div style={{ padding: '14px 20px', borderBottom: '1px solid #161616', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Award size={13} color="#f59e0b" />
                        <div>
                            <h2 style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f9fafb' }}>Top Attendance</h2>
                            <p style={{ fontSize: 11, color: '#4b5563', marginTop: 2 }}>Total present days (all time)</p>
                        </div>
                    </div>
                    <PresentDaysTable data={stats?.presentDaysPerEmployee} loading={loading} />
                </div>
            </div>
        </div>
    )
}