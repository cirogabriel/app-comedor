import PropTypes from "prop-types";
import {
     LayoutGrid, 
     Users, 
     BarChart3, 
     Settings, 
     LogOut, 
     ChevronLeft, 
     ChevronRight, 
     Soup,
     X } from "lucide-react";
import { useAdmin } from "../../context/adminContext.jsx";



const menuItems = [
    { id: 'dashboard',     label: 'Dashboard',     icon: LayoutGrid },
    { id: 'reservas',      label: 'Reservas',       icon: Users },
    { id: 'reportes',      label: 'Reportes',       icon: BarChart3 },
];

const AdminSidebar = ({ activeSection, onSectionChange, onLogout }) => {
    const { 
        isSidebarCollapsed, 
        setIsSidebarCollapsed, 
        isMobileOpen, 
        setIsMobileOpen } = useAdmin();

    const handleNav = (id) => {
        onSectionChange(id);
        setIsMobileOpen(false);
    };

    const sidebarContent = (
        <div className="flex flex-col h-full">
            <div className="border-b border-[#e0e0e0] p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 flex items-center justify-center flex-shrink-0">
                        <Soup className="h-7 w-7 text-[#1a1a1a]" strokeWidth={3} />
                    </div>
                    {!isSidebarCollapsed && (
                        <div>
                            <h1 className="text-base font-semibold text-[#1a1a1a]"
                                style={{ fontFamily: "'Pacifico', cursive" }}>
                                Comedor
                            </h1>
                            <p className="text-xs text-[#999]">Admin</p>
                        </div>
                    )}
                    
                </div>
                <button onClick={() => setIsMobileOpen(false)} className="lg:hidden text-[#bbb] hover:text-[#1a1a1a]">
                    <X className="h-5 w-5" />
                </button>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {menuItems.map(({ id, label, icon: Icon }) => (
                    <button key={id} onClick={() => handleNav(id)}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-sm font-medium
                            ${activeSection === id
                                ? 'bg-[#1a1a1a] text-white'
                                : 'text-[#666] hover:bg-[#f5f5f0] hover:text-[#1a1a1a]'}`}
                        title={isSidebarCollapsed ? label : undefined}>
                        <Icon className="h-5 w-5 flex-shrink-0" strokeWidth={1.5} />
                        {!isSidebarCollapsed && <span>{label}</span>}
                    </button>
                ))}
            </nav>

            <div className="border-t border-[#e0e0e0] p-4 space-y-1">
                <button onClick={() => handleNav('configuracion')}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-sm
                        ${activeSection === 'configuracion'
                            ? 'bg-[#1a1a1a] text-white'
                            : 'text-[#888] hover:text-[#1a1a1a] hover:bg-[#f5f5f0]'}`}
                    title={isSidebarCollapsed ? 'Configuración' : undefined}>
                    <Settings className="h-5 w-5 flex-shrink-0" strokeWidth={1.5} />
                    {!isSidebarCollapsed && <span>Configuración</span>}
                </button>

                <button onClick={onLogout}
                    className="w-full flex items-center gap-3 px-3 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all text-sm"
                    title={isSidebarCollapsed ? 'Cerrar sesión' : undefined}>
                    <LogOut className="h-5 w-5 flex-shrink-0" strokeWidth={1.5} />
                    {!isSidebarCollapsed && <span>Cerrar sesión</span>}
                </button>

                <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    className="hidden lg:flex w-full items-center justify-center py-2 text-[#bbb] hover:text-[#1a1a1a] transition-colors">
                    {isSidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                </button>
            </div>
        </div>
    );

    return (
        <>
            <aside className={`hidden lg:flex h-screen sticky top-0 border-r border-[#e0e0e0] bg-white flex-col transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
                {sidebarContent}
            </aside>
            {isMobileOpen && (
                <div className="lg:hidden fixed inset-0 z-50 flex">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setIsMobileOpen(false)} />
                    <aside className="relative z-10 w-72 bg-white h-full flex flex-col">
                        {sidebarContent}
                    </aside>
                </div>
            )}
        </>
    );
};

AdminSidebar.propTypes = {
    activeSection: PropTypes.string.isRequired,
    onSectionChange: PropTypes.func.isRequired,
    onLogout: PropTypes.func.isRequired,
};

export default AdminSidebar;