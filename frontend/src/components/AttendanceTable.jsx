import { CalendarCheck } from 'lucide-react'

function SkeletonRow() {
    return (
        <tr className="border-b border-neutral-800">
            {[...Array(4)].map((_, i) => (
                <td key={i} className="px-4 py-3">
                    <div className="skeleton h-4 rounded w-3/4 bg-neutral-800 animate-pulse" />
                </td>
            ))}
        </tr>
    )
}

function EmptyState() {
    return (
        <tr>
            <td colSpan={4}>
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center mb-3">
                        <CalendarCheck size={22} className="text-gray-500" />
                    </div>
                    <p className="text-sm font-medium text-gray-300">No attendance records</p>
                    <p className="text-xs text-gray-500 mt-1">Mark attendance using the form</p>
                </div>
            </td>
        </tr>
    )
}

export default function AttendanceTable({ records, loading }) {
    return (
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className="border-b border-neutral-800">
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                                Employee
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                                Department
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                                Date
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            [...Array(6)].map((_, i) => <SkeletonRow key={i} />)
                        ) : records.length === 0 ? (
                            <EmptyState />
                        ) : (
                            records.map(record => {
                                const emp = record.employee || {}
                                return (
                                    <tr
                                        key={record._id}
                                        className="border-b border-neutral-800 hover:bg-neutral-800/60 transition-colors"
                                    >
                                        {/* Employee */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-7 h-7 rounded-full bg-neutral-700 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-[11px] font-semibold text-gray-300">
                                                        {(emp.full_name || '?').charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-200 leading-none">
                                                        {emp.full_name || '—'}
                                                    </p>
                                                    <p className="text-xs text-gray-500 font-mono mt-0.5">
                                                        {record.employee_id || '—'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Department */}
                                        <td className="px-4 py-3">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-800 text-gray-300">
                                                {emp.department || '—'}
                                            </span>
                                        </td>

                                        {/* Date */}
                                        <td className="px-4 py-3">
                                            <span className="font-mono text-sm text-gray-400">
                                                {record.date || '—'}
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td className="px-4 py-3">
                                            <span
                                                className={`
                                                    inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium
                                                    ${record.status === 'PRESENT'
                                                        ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-800/30'
                                                        : 'bg-red-600/20 text-red-400 border border-red-800/30'
                                                    }
                                                `}
                                            >
                                                <span className={`
                                                    w-1.5 h-1.5 rounded-full flex-shrink-0 
                                                    ${record.status === 'PRESENT' ? 'bg-emerald-500' : 'bg-red-500'}
                                                `} />
                                                {record.status}
                                            </span>
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}