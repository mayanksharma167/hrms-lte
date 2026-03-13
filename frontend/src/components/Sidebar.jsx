import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    CalendarCheck,
    Building2,
} from "lucide-react";

const navItems = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/employees", label: "Employees", icon: Users },
    { to: "/attendance", label: "Attendance", icon: CalendarCheck },
];

export default function Sidebar() {
    return (
        <aside style={{ width: 240, minHeight: '100vh', background: '#080808', borderRight: '1px solid #1a1a1a', display: 'flex', flexDirection: 'column', fontFamily: 'inherit' }}>
            <style>{`
                .sidebar-logo-ring {
                    width: 38px;
                    height: 38px;
                    border-radius: 12px;
                    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 0 18px rgba(99,102,241,0.45), inset 0 1px 0 rgba(255,255,255,0.15);
                    flex-shrink: 0;
                }

                .sidebar-nav-link {
                    display: flex;
                    align-items: center;
                    gap: 11px;
                    padding: 9px 14px;
                    border-radius: 10px;
                    font-size: 0.8125rem;
                    font-weight: 500;
                    color: #6b7280;
                    text-decoration: none;
                    transition: background 0.15s, color 0.15s, box-shadow 0.15s;
                    position: relative;
                    letter-spacing: 0.01em;
                }
                .sidebar-nav-link:hover {
                    background: #111111;
                    color: #d1d5db;
                }
                .sidebar-nav-link:hover .nav-icon {
                    color: #9ca3af;
                }

                .sidebar-nav-link.active {
                    background: linear-gradient(135deg, rgba(79,70,229,0.18) 0%, rgba(124,58,237,0.12) 100%);
                    color: #a5b4fc;
                    box-shadow: inset 0 0 0 1px rgba(99,102,241,0.2);
                }
                .sidebar-nav-link.active .nav-icon {
                    color: #818cf8;
                }
                .sidebar-nav-link.active::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 20%;
                    height: 60%;
                    width: 3px;
                    border-radius: 0 3px 3px 0;
                    background: linear-gradient(180deg, #6366f1, #8b5cf6);
                    box-shadow: 0 0 8px rgba(99,102,241,0.7);
                }

                .nav-icon {
                    color: #4b5563;
                    transition: color 0.15s;
                    flex-shrink: 0;
                }

                .sidebar-divider {
                    height: 1px;
                    background: linear-gradient(90deg, transparent, #1f1f1f 30%, #1f1f1f 70%, transparent);
                    margin: 0 16px;
                }

                .sidebar-section-label {
                    font-size: 9.5px;
                    font-weight: 700;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    color: #374151;
                    padding: 0 14px;
                    margin-bottom: 6px;
                }
            `}</style>

            {/* Logo */}
            <div style={{ height: 64, display: 'flex', alignItems: 'center', gap: 12, padding: '0 20px', borderBottom: '1px solid #131313' }}>
                <div className="sidebar-logo-ring">
                    <Building2 size={17} color="#fff" />
                </div>
                <div>
                    <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#f9fafb', lineHeight: 1, letterSpacing: '0.02em' }}>
                        HRMS Lite
                    </p>
                    <p style={{ fontSize: '10.5px', color: '#4b5563', marginTop: 3, letterSpacing: '0.03em' }}>
                        Admin Panel
                    </p>
                </div>
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, padding: '20px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div className="sidebar-section-label">Menu</div>

                {navItems.map(({ to, label, icon: Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={to === "/"}
                        className={({ isActive }) =>
                            `sidebar-nav-link${isActive ? ' active' : ''}`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <Icon
                                    size={16}
                                    className="nav-icon"
                                    style={{ color: isActive ? '#818cf8' : undefined }}
                                />
                                {label}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Footer */}
            <div className="sidebar-divider" />
            <div style={{ padding: '14px 20px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                    width: 30, height: 30, borderRadius: 8,
                    background: 'linear-gradient(135deg, #1f2937, #111827)',
                    border: '1px solid #1f2937',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0
                }}>
                    <span style={{ fontSize: 11, color: '#6b7280', fontWeight: 600 }}>A</span>
                </div>
                <div>
                    <p style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 500, lineHeight: 1 }}>Admin</p>
                    <p style={{ fontSize: '10px', color: '#374151', marginTop: 3 }}>admin@hrms.com</p>
                </div>
            </div>
        </aside>
    );
}