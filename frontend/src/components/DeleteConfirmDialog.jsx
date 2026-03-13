import { AlertTriangle, Loader2, X } from 'lucide-react'

export default function DeleteConfirmDialog({ employee, onConfirm, onClose, loading }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={!loading ? onClose : undefined}
            />

            {/* Dialog */}
            <div className="relative w-full max-w-sm bg-neutral-900 rounded-2xl shadow-xl shadow-black/60 border border-neutral-800 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                            <AlertTriangle size={15} className="text-red-400" />
                        </div>
                        <h2 className="text-sm font-semibold text-white">Delete Employee</h2>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50"
                    >
                        <X size={15} className="text-gray-400" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5">
                    <p className="text-sm text-gray-300">
                        Are you sure you want to delete{' '}
                        <span className="font-semibold text-white">{employee?.full_name}</span>?
                    </p>
                    <div className="mt-2 p-3 rounded-lg bg-neutral-900 border border-neutral-800">
                        <p className="text-xs text-gray-400 font-mono">{employee?.employee_id}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{employee?.department}</p>
                    </div>
                    <p className="mt-3 text-xs text-red-500">
                        ⚠ This will also delete all attendance records for this employee.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 px-6 pb-5">
                    <button onClick={onClose} disabled={loading} className="btn-secondary">
                        Cancel
                    </button>
                    <button onClick={onConfirm} disabled={loading} className="btn-danger">
                        {loading ? (
                            <><Loader2 size={14} className="animate-spin" /> Deleting...</>
                        ) : (
                            'Delete Employee'
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}