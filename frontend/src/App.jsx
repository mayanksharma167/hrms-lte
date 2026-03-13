import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";

export default function App() {
    return (<BrowserRouter>
        {/* Toast Notifications */}
        <Toaster
            position="top-right"
            toastOptions={{
                duration: 3500,
                style: {
                    fontSize: "13px",
                    fontFamily: "DM Sans, sans-serif",
                    borderRadius: "10px",
                    background: "#111",
                    color: "#fff",
                    border: "1px solid #27272a",
                },
                success: {
                    iconTheme: {
                        primary: "#22c55e",
                        secondary: "#fff",
                    },
                },
                error: {
                    iconTheme: {
                        primary: "#ef4444",
                        secondary: "#fff",
                    },
                },
            }}
        />

        <div className="flex min-h-screen bg-black text-gray-200">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">

                {/* Topbar */}
                <header className="h-16 bg-neutral-900 border-b border-neutral-800 flex items-center px-8">
                    <div className="ml-auto flex items-center gap-3">

                        {/* Avatar */}
                        <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-semibold">
                            A
                        </div>

                        {/* User Info */}
                        <div>
                            <p className="text-sm font-medium text-white leading-none">
                                Admin
                            </p>
                            <p className="text-[11px] text-gray-400">
                                Administrator
                            </p>
                        </div>

                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-auto p-8 max-w-6xl w-full mx-auto">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/employees" element={<Employees />} />
                        <Route path="/attendance" element={<Attendance />} />
                    </Routes>
                </div>

            </main>
        </div>
    </BrowserRouter>


    );
}
