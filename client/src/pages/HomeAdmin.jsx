import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext.jsx";
import { useAdmin } from "../context/adminContext.jsx";
import AdminSidebar from "../components/admin/AdminSidebar.jsx";
import AdminHeader from "../components/admin/AdminHeader.jsx";
import DashboardSection from "../components/admin/DashboardSection.jsx";
import ReservasSection from "../components/admin/ReservasSection.jsx";
import ReportesSection from "../components/admin/ReportesSection.jsx";
import ConfigSection from "../components/admin/ConfigSection.jsx";
import '../styles/admin.css';

const HomeAdmin = () => {
    const [activeSection, setActiveSection] = useState('reservas');
    const { admin, logout } = useAuth();
    const { darkMode } = useAdmin();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div
            id="admin-root"
            data-dark={String(darkMode)}
            className="min-h-screen flex"
        >
            <AdminSidebar
                activeSection={activeSection}
                onSectionChange={setActiveSection}
                onLogout={handleLogout}
            />
            <div className="flex-1 flex flex-col min-w-0">
                <AdminHeader admin={admin} />
                <main className="flex-1 px-4 md:px-8 py-6 md:py-8 overflow-auto">
                    <div className="max-w-6xl mx-auto">
                        {activeSection === 'dashboard'     && <DashboardSection />}
                        {activeSection === 'reservas'      && <ReservasSection />}
                        {activeSection === 'reportes'      && <ReportesSection />}
                        {activeSection === 'configuracion' && <ConfigSection />}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default HomeAdmin;