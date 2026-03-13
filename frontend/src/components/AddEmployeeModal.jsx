import { useState } from 'react'
import { X, UserPlus, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../lib/api'

const DEPARTMENTS = [
    'Engineering', 'Design', 'Product', 'HR',
    'Finance', 'Marketing', 'Operations', 'Sales',
]

const empty = { employee_id: '', full_name: '', email: '', department: '' }

export default function AddEmployeeModal({ onClose, onAdded }) {
    const [form, setForm] = useState(empty)
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)

    const validate = () => {
        const e = {}
        if (!form.employee_id.trim()) e.employee_id = 'Employee ID is required'
        if (!form.full_name.trim()) e.full_name = 'Full name is required'
        if (!form.email.trim()) e.email = 'Email is required'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email address'
        if (!form.department) e.department = 'Department is required'
        return e
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(f => ({ ...f, [name]: value }))
        if (errors[name]) setErrors(er => ({ ...er, [name]: '' }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const errs = validate()
        if (Object.keys(errs).length) { setErrors(errs); return }

        setLoading(true)
        try {
            const res = await api.post('/api/employees', {
                ...form,
                employee_id: form.employee_id.toUpperCase().trim(),
            })
            toast.success(`${res.data.full_name} added successfully!`)
            onAdded(res.data)
            onClose()
        } catch (err) {
            toast.error(err.message || 'Failed to add employee')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="
        relative w-full max-w-md 
        bg-neutral-900 
        rounded-2xl 
        shadow-2xl shadow-black/60
        border border-neutral-800
        overflow-hidden
        transition-colors
      ">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
                    <div className="flex items-center gap-3">
                        <div className="
              w-8 h-8 rounded-lg 
              bg-indigo-500/10 
              flex items-center justify-center
            ">
                            <UserPlus size={15} className="text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-white">
                                Add Employee
                            </h2>
                            <p className="text-xs text-gray-400">
                                Fill in the details below
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="
              w-7 h-7 flex items-center justify-center 
              rounded-lg 
              hover:bg-neutral-800 
              transition-colors
            "
                    >
                        <X size={15} className="text-gray-400" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
                    {/* Employee ID */}
                    <div>
                        <label className="label">Employee ID</label>
                        <input
                            name="employee_id"
                            value={form.employee_id}
                            onChange={handleChange}
                            placeholder="e.g. EMP001"
                            className={`
                input font-mono uppercase tracking-wide
                focus:border-indigo-500
                focus:ring-indigo-500/30
                ${errors.employee_id ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' : ''}
              `}
                        />
                        {errors.employee_id && (
                            <p className="mt-1.5 text-xs text-red-400">{errors.employee_id}</p>
                        )}
                    </div>

                    {/* Full Name */}
                    <div>
                        <label className="label">Full Name</label>
                        <input
                            name="full_name"
                            value={form.full_name}
                            onChange={handleChange}
                            placeholder="e.g. Aisha Sharma"
                            className={`
                input
                focus:border-indigo-500
                focus:ring-indigo-500/30
                ${errors.full_name ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' : ''}
              `}
                        />
                        {errors.full_name && (
                            <p className="mt-1.5 text-xs text-red-400">{errors.full_name}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="label">Email Address</label>
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="e.g. aisha@company.com"
                            className={`
                input
                focus:border-indigo-500
                focus:ring-indigo-500/30
                ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' : ''}
              `}
                        />
                        {errors.email && (
                            <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>
                        )}
                    </div>

                    {/* Department */}
                    <div>
                        <label className="label">Department</label>
                        <select
                            name="department"
                            value={form.department}
                            onChange={handleChange}
                            className={`
                input
                focus:border-indigo-500
                focus:ring-indigo-500/30
                ${errors.department ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' : ''}
              `}
                        >
                            <option value="" className="text-gray-500">Select department...</option>
                            {DEPARTMENTS.map(d => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                        {errors.department && (
                            <p className="mt-1.5 text-xs text-red-400">{errors.department}</p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="
                btn-secondary
                px-4 py-2 text-sm font-medium
                text-gray-300
                bg-neutral-900
                border border-neutral-700
                hover:bg-neutral-800
                active:bg-neutral-700
              "
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                btn-primary
                px-5 py-2 text-sm font-medium
                flex items-center gap-2
                bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700
                text-white
                shadow-sm
                disabled:opacity-60 disabled:cursor-not-allowed
              "
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={14} className="animate-spin" />
                                    Adding...
                                </>
                            ) : (
                                <>
                                    <UserPlus size={14} />
                                    Add Employee
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}