import PropTypes from "prop-types";
import { Bell, Menu } from "lucide-react";
import { useAdmin } from "../../context/adminContext.jsx";

const AdminHeader = ({ admin }) => {
    const { setIsMobileOpen, adminUsername } = useAdmin();
    const displayName = adminUsername || admin?.username || 'Admin';
    const initials = displayName.slice(0, 2).toUpperCase();

    return (
        <header className="sticky top-0 z-40 border-b border-[#e0e0e0] bg-white">
            <div className="h-16 flex items-center justify-between px-4 md:px-8">
                <button onClick={() => setIsMobileOpen(true)}
                    className="lg:hidden text-[#888] hover:text-[#1a1a1a] mr-3">
                    <Menu className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-4 ml-auto">
                    <button className="text-[#bbb] hover:text-[#1a1a1a] transition-colors">
                        <Bell className="h-5 w-5" strokeWidth={1.5} />
                    </button>
                    <div className="flex items-center gap-3 pl-4 border-l border-[#e0e0e0]">
                        <div className="hidden sm:block text-right">
                            <p className="text-sm font-medium text-[#1a1a1a]">{displayName}</p>
                            <p className="text-xs text-[#999]">Universidad</p>
                        </div>
                        <div className="h-9 w-9 rounded-full bg-[#1a1a1a] flex items-center justify-center text-white text-xs font-semibold">
                            {initials}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

AdminHeader.propTypes = {
    admin: PropTypes.shape({
        username: PropTypes.string,
        email: PropTypes.string,
    }),
};

export default AdminHeader;