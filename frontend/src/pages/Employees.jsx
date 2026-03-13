import { useEffect, useState } from 'react'
import { UserPlus } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../lib/api'
import EmployeeList from '../components/EmployeeList'
import AddEmployeeModal from '../components/AddEmployeeModal'
import DeleteConfirmDialog from '../components/DeleteConfirmDialog'

export default function Employees() {
    const [employees, setEmployees] = useState([])
    const [loading, setLoading] = useState(true)
    const [showAdd, setShowAdd] = useState(false)
    const [toDelete, setToDelete] = useState(null)
    const [deleting, setDeleting] = useState(false)

    const fetchEmployees = async () => {
        try {
            const res = await api.get('/api/employees')
            setEmployees(res.data)
        } catch (err) {
            toast.error('Failed to load employees')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchEmployees() }, [])

    const handleAdded = (newEmp) => {
        setEmployees(prev => [newEmp, ...prev])
    }

    const handleDeleteConfirm = async () => {
        setDeleting(true)
        try {
            await api.delete(`/api/employees/${toDelete._id}`)
            setEmployees(prev => prev.filter(e => e._id !== toDelete._id))
            toast.success(`${toDelete.full_name} deleted.`)
            setToDelete(null)
        } catch (err) {
            toast.error(err.message)
        } finally {
            setDeleting(false)
        }
    }

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Employees</h1>
                    <p className="page-subtitle">
                        {loading ? 'Loading...' : `${employees.length} employee${employees.length !== 1 ? 's' : ''} total`}
                    </p>
                </div>
                <button onClick={() => setShowAdd(true)} className="btn-primary">
                    <UserPlus size={15} />
                    Add Employee
                </button>
            </div>

            <EmployeeList
                employees={employees}
                loading={loading}
                onDelete={setToDelete}
            />

            {showAdd && (
                <AddEmployeeModal
                    onClose={() => setShowAdd(false)}
                    onAdded={handleAdded}
                />
            )}

            {toDelete && (
                <DeleteConfirmDialog
                    employee={toDelete}
                    onConfirm={handleDeleteConfirm}
                    onClose={() => !deleting && setToDelete(null)}
                    loading={deleting}
                />
            )}
        </div>
    )
}