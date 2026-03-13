import { Trash2, Mail, Building2 } from 'lucide-react'

function SkeletonRow() {
    return (
        <tr className="border-b border-neutral-800">
            {[...Array(5)].map((_, i) => (
                <td key={i} className="px-4 py-3">
                    <div className="skeleton h-4 rounded w-3/4" />
                </td>
            ))}
        </tr>
    )
}

function EmptyState() {
    return (
        <tr>
            <td colSpan={5}>
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-12 h-12 rounded-xl bg-neutral-900 flex items-center justify-center mb-3">
                        <Building2 size={22} className="text-gray-500" />
                    </div>
                    <p className="text-sm font-medium text-gray-400">No employees yet</p>
                    <p className="text-xs text-gray-500 mt-1">Click "Add Employee" to get started</p>
                </div>
            </td>
        </tr>
    )
}

export default function EmployeeList({ employees, loading, onDelete }) {
    return (
        <div className="card">
            <div className="table-wrapper">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Employee ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Department</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
                        ) : employees.length === 0 ? (
                            <EmptyState />
                        ) : (
                            employees.map(emp => (
                                <tr key={emp._id} className="border-b border-surface-50 hover:bg-surface-50 transition-colors">
                                    {/* Employee ID */}
                                    <td>
                                        <span className="font-mono text-xs font-medium text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded">
                                            {emp.employee_id}
                                        </span>
                                    </td>

                                    {/* Name */}
                                    <td>
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-7 h-7 rounded-full bg-neutral-800 flex items-center justify-center flex-shrink-0">
                                                <span className="text-[11px] font-semibold text-gray-100">
                                                    {emp.full_name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <span className="font-medium text-white">{emp.full_name}</span>
                                        </div>
                                    </td>

                                    {/* Email */}
                                    <td>
                                        <div className="flex items-center gap-1.5 text-gray-400">
                                            <Mail size={12} className="text-gray-500 flex-shrink-0" />
                                            {emp.email}
                                        </div>
                                    </td>

                                    {/* Department */}
                                    <td>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-900 text-gray-300">
                                            {emp.department}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td>
                                        <button
                                            onClick={() => onDelete(emp)}
                                            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                            title="Delete employee"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}