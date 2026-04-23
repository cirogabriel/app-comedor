import { createContext, useContext, useState, useCallback } from "react";
import PropTypes from "prop-types";
import {
    getBookingsToday, getBookings, cancelBookingAdmin, resetBooked,
    getDiningDayToday, getDiningDays, createDiningDay, updateDiningDay,
    deleteDiningDay, getStudents,
} from "../api/auth.js";
import { todayLocalStr, isoToLocalStr, localStrToDate } from "../lib/dateUtils.js";

export const AdminContext = createContext();
export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [darkMode, setDarkModeState] = useState(
        () => localStorage.getItem('darkMode') === 'true'
    );
    const [bookingsToday, setBookingsToday] = useState(null);
    const [diningDayToday, setDiningDayToday] = useState(null);
    const [diningDays, setDiningDays] = useState([]);
    const [students, setStudents] = useState([]);
    const [adminUsername, setAdminUsername] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('admin') || '{}').username || '';
        } catch { return ''; }
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchBookingsToday = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getBookingsToday();
            setBookingsToday(res.data);
        } catch {
            setBookingsToday({ bookings: [], total: 0, confirmed: 0, cancelled: 0 });
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchDiningDayToday = useCallback(async () => {
        try {
            const res = await getDiningDayToday();
            setDiningDayToday(res.data?.id ? res.data : null);
        } catch {
            setDiningDayToday(null);
        }
    }, []);

    const fetchDiningDays = useCallback(async () => {
        try {
            const res = await getDiningDays();
            const todayStr = todayLocalStr();
            const filtered = (res.data || []).filter(d => {
                return isoToLocalStr(d.date) >= todayStr;
            });
            filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
            setDiningDays(filtered);
        } catch {
            setDiningDays([]);
        }
    }, []);

    const fetchStudents = useCallback(async () => {
        try {
            const res = await getStudents();
            setStudents(res.data);
        } catch {
            setStudents([]);
        }
    }, []);

    // Sin polling — los cambios se ven al refrescar o al hacer una acción
    const cancelBooking = async (bookingId) => {
        try {
            await cancelBookingAdmin(bookingId);
            await fetchBookingsToday();
        } catch {
            setError('Error al cancelar reserva');
        }
    };

    const handleCreateDiningDay = async (data) => {
        const res = await createDiningDay(data);
        await fetchDiningDayToday();
        await fetchDiningDays();
        return res;
    };

    const handleUpdateDiningDay = async (id, data) => {
        const res = await updateDiningDay(id, data);
        await fetchDiningDayToday();
        await fetchDiningDays();
        return res;
    };

    const handleDeleteDiningDay = async (id) => {
        await deleteDiningDay(id);
        await fetchDiningDays();
        await fetchDiningDayToday();
    };

    const autoCreateDiningDays = async (weekDays, capacity, weeks, startDate) => {
        const created = [];
        const start = startDate ? new Date(startDate) : new Date();
        start.setHours(0, 0, 0, 0);
        for (let w = 0; w < weeks * 7; w++) {
            const date = new Date(start);
            date.setDate(start.getDate() + w);
            if (weekDays.includes(date.getDay())) {
                const dateStr = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
                try {
                    await createDiningDay({
                        date: localStrToDate(dateStr).toISOString(),
                        capacity
                    });
                    created.push(date.toLocaleDateString('es-PE', {
                        weekday: 'short', day: 'numeric', month: 'short'
                    }));
                } catch { /* ya existe */ }
            }
        }
        await fetchDiningDays();
        await fetchDiningDayToday();
        return created;
    };

    const limpiarCupos = async () => {
        try {
            await resetBooked();
            await fetchBookingsToday();
            return { success: true, message: 'Reservas del día canceladas' };
        } catch {
            return { success: false, message: 'Error al limpiar reservas' };
        }
    };

    const fetchBookingsByDay = async (dateStr) => {
        try {
            const res = await getBookings({ date: dateStr });
            return res.data;
        } catch {
            return [];
        }
    };

    const setDarkMode = (val) => {
        setDarkModeState(val);
        localStorage.setItem('darkMode', String(val));
    };

    const updateAdminUsername = (name) => {
        setAdminUsername(name);
        const stored = JSON.parse(localStorage.getItem('admin') || '{}');
        localStorage.setItem('admin', JSON.stringify({ ...stored, username: name }));
    };

    return (
        <AdminContext.Provider value={{
            isSidebarCollapsed, setIsSidebarCollapsed,
            isMobileOpen, setIsMobileOpen,
            darkMode, setDarkMode,
            adminUsername, updateAdminUsername,
            bookingsToday, diningDayToday, diningDays, students,
            loading, error,
            fetchBookingsToday, fetchDiningDayToday, fetchDiningDays, fetchStudents,
            cancelBooking,
            handleCreateDiningDay, handleUpdateDiningDay, handleDeleteDiningDay,
            autoCreateDiningDays, limpiarCupos, fetchBookingsByDay,
        }}>
            {children}
        </AdminContext.Provider>
    );
};

AdminProvider.propTypes = { children: PropTypes.node.isRequired };