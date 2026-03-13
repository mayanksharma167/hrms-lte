export default function StatCard({ label, value, icon: Icon, color = 'brand', loading = false }) {
    const colorMap = {
        brand: { bg: 'bg-indigo-500/10', icon: 'text-indigo-400', value: 'text-white' },
        emerald: { bg: 'bg-emerald-500/10', icon: 'text-emerald-400', value: 'text-emerald-300' },
        red: { bg: 'bg-red-500/10', icon: 'text-red-400', value: 'text-red-300' },
        amber: { bg: 'bg-amber-500/10', icon: 'text-amber-400', value: 'text-amber-300' },
    }

    const c = colorMap[color] || colorMap.brand

    if (loading) {
        return (
            <div className="card p-5">
                <div className="skeleton h-4 w-24 mb-4" />
                <div className="skeleton h-8 w-16" />
            </div>
        )
    }

    return (
        <div className="card p-5 hover:shadow-card-hover transition-shadow duration-200">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</p>
                    <p className={`text-3xl font-semibold mt-1 ${c.value}`}>{value ?? '—'}</p>
                </div>
                {Icon && (
                    <div className={`w-10 h-10 rounded-lg ${c.bg} flex items-center justify-center`}>
                        <Icon size={18} className={c.icon} />
                    </div>
                )}
            </div>
        </div>
    )
}