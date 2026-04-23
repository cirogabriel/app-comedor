import { useEffect, useState, useMemo } from "react";
import { Search, Plus, Trash2, Edit2, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { useAdmin } from "../../context/adminContext.jsx";
import StatsBar from "./StatsBar.jsx";
import BookingCard from "./BookingCard.jsx";
import DiningDayModal from "./DiningDayModal.jsx";
import AutoScheduleModal from "./AutoScheduleModal.jsx";
import { isoToLocalStr, todayLocalStr } from "../../lib/dateUtils.js";

const statuses = [
    { id: 'all',       label: 'Todas' },
    { id: 'confirmed', label: 'Confirmadas' },
    { id: 'cancelled', label: 'Canceladas' },
];

const normalize = (str) =>
    (str || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const matchesQuery = (student, query) => {
    if (!query) return true;
    const q = normalize(query);
    return (
        normalize(`${student.name} ${student.surname}`).includes(q) ||
        normalize(`${student.surname} ${student.name}`).includes(q) ||
        normalize(student.name).includes(q) ||
        normalize(student.surname).includes(q) ||
        (student.code || '').toLowerCase().includes(q) ||
        normalize(student.email || '').includes(q)
    );
};

const ReservasSection = () => {
    const {
        bookingsToday, diningDayToday, diningDays, students,
        fetchBookingsToday, fetchDiningDayToday, fetchDiningDays, fetchStudents,
        handleDeleteDiningDay, loading,
    } = useAdmin();

    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showDayModal, setShowDayModal] = useState(false);
    const [showAutoModal, setShowAutoModal] = useState(false);
    const [editingDay, setEditingDay] = useState(null);
    const [showDaysList, setShowDaysList] = useState(false);

    useEffect(() => {
        fetchBookingsToday();
        fetchDiningDayToday();
        fetchDiningDays();
        fetchStudents();
    }, [fetchBookingsToday, fetchDiningDayToday, fetchDiningDays, fetchStudents]);

    const allBookings = bookingsToday?.bookings || [];

    const bookings = useMemo(() => {
        const map = new Map();
        const sorted = [...allBookings].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        for (const b of sorted) {
            if (!map.has(b.student.id)) {
                map.set(b.student.id, b);
            }
        }
        return Array.from(map.values());
    }, [allBookings]);

    // ids de estudiantes con reserva activa
    const bookedStudentIds = useMemo(
        () => new Set(bookings.map(b => b.student.id)),
        [bookings]
    );

    // estudiantes sin reserva activa hoy
    const studentsWithoutBooking = useMemo(
        () => students.filter(s => !bookedStudentIds.has(s.id)),
        [students, bookedStudentIds]
    );

    const filtered = useMemo(() => {
        return bookings.filter(b => {
            const matchSearch = matchesQuery(b.student, searchQuery);
            const matchStatus =
                filterStatus === 'all' ||
                (filterStatus === 'confirmed' && b.status === true) ||
                (filterStatus === 'cancelled' && b.status === false);
            return matchSearch && matchStatus;
        });
    }, [bookings, searchQuery, filterStatus]);

    const filteredStudentsWithout = useMemo(
        () => studentsWithoutBooking.filter(s => matchesQuery(s, searchQuery)),
        [studentsWithoutBooking, searchQuery]
    );

    const stats = {
        total: bookingsToday?.total || 0,
        confirmed: bookingsToday?.confirmed || 0,
        cancelled: bookingsToday?.cancelled || 0,
    };

    const todayStr = todayLocalStr();

    const formatDayDate = (isoStr) => {
        const localStr = isoToLocalStr(isoStr);
        const [y, m, d] = localStr.split('-').map(Number);
        return new Date(y, m - 1, d).toLocaleDateString('es-PE', {
            weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
        });
    };

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl md:text-2xl font-semibold text-[#1a1a1a] mb-1">Gestión de Reservas</h2>
                    <p className="text-sm text-[#888]">Administra reservas y días de servicio</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <button onClick={() => { setEditingDay(null); setShowDayModal(true); }}
                        className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white text-sm rounded-xl hover:bg-[#333] transition-all">
                        <Plus className="h-4 w-4" />
                        <span>Nuevo día</span>
                    </button>
                    <button onClick={() => setShowAutoModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-[#e8e8e8] text-[#1a1a1a] text-sm rounded-xl hover:border-[#1a1a1a] transition-all">
                        <Calendar className="h-4 w-4" />
                        <span>Auto-programar</span>
                    </button>
                </div>
            </div>

            {/* Dias programados */}
            <div className="bg-white rounded-2xl border border-[#e8e8e8]">
                <button onClick={() => setShowDaysList(!showDaysList)}
                    className="w-full flex items-center justify-between px-5 py-4 text-sm font-medium text-[#1a1a1a]">
                    <span>Días programados ({diningDays.length})</span>
                    {showDaysList
                        ? <ChevronUp className="h-4 w-4 text-[#bbb]" />
                        : <ChevronDown className="h-4 w-4 text-[#bbb]" />
                    }
                </button>
                {showDaysList && (
                    <div className="border-t border-[#f0f0f0] px-5 pb-4">
                        {diningDays.length === 0 ? (
                            <p className="text-sm text-[#aaa] py-4 text-center">No hay días programados</p>
                        ) : (
                            <div className="space-y-2 mt-3 max-h-60 overflow-y-auto">
                                {diningDays.map(day => {
                                    const dayLocalStr = isoToLocalStr(day.date);
                                    const isToday = dayLocalStr === todayStr;
                                    return (
                                        <div key={day.id}
                                            className={`flex items-center justify-between py-2.5 px-3 rounded-xl
                                                ${isToday ? 'bg-[#f5f5f0] border border-[#e0e0e0]' : ''}`}>
                                            <div className="flex items-center gap-3 min-w-0">
                                                {isToday && (
                                                    <span className="text-xs bg-[#1a1a1a] text-white px-2 py-0.5 rounded-lg flex-shrink-0">
                                                        Hoy
                                                    </span>
                                                )}
                                                <span className="text-sm text-[#1a1a1a] capitalize truncate">
                                                    {formatDayDate(day.date)}
                                                </span>
                                                <span className="text-xs text-[#999] flex-shrink-0">
                                                    Cap: {day.capacity}
                                                </span>
                                            </div>
                                            <div className="flex gap-1 flex-shrink-0">
                                                <button
                                                    onClick={() => { setEditingDay(day); setShowDayModal(true); }}
                                                    className="p-1.5 text-[#bbb] hover:text-[#1a1a1a] hover:bg-[#f5f5f0] rounded-lg transition-all">
                                                    <Edit2 className="h-3.5 w-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteDiningDay(day.id)}
                                                    className="p-1.5 text-[#bbb] hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#bbb]" />
                <input type="text"
                    placeholder="Buscar por nombre, apellido, código o correo..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#e8e8e8] text-sm text-[#1a1a1a] placeholder-[#bbb] focus:outline-none focus:border-[#1a1a1a] transition-all"
                />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
                {statuses.map(s => (
                    <button key={s.id} onClick={() => setFilterStatus(s.id)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
                            ${filterStatus === s.id
                                ? 'bg-[#1a1a1a] text-white'
                                : 'bg-white border border-[#e8e8e8] text-[#666] hover:border-[#1a1a1a]'}`}>
                        {s.label}
                    </button>
                ))}
            </div>

            <StatsBar stats={stats} capacity={diningDayToday?.capacity} />

            {/* Reservas del día */}
            {diningDayToday ? (
                <div className="space-y-3">
                    <p className="text-xs font-semibold text-[#999] uppercase tracking-widest">
                        Reservas de hoy ({filtered.length})
                    </p>
                    {loading ? (
                        <p className="text-sm text-[#aaa] text-center py-8">Cargando...</p>
                    ) : filtered.length > 0 ? (
                        filtered.map(booking => <BookingCard key={booking.id} booking={booking} />)
                    ) : (
                        <div className="bg-white rounded-2xl border border-[#e8e8e8] py-10 text-center">
                            <p className="text-[#aaa] text-sm">No se encontraron reservas</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-[#e8e8e8] py-10 text-center">
                    <p className="text-sm text-[#888] mb-3">No hay día de servicio habilitado para hoy</p>
                    <button
                        onClick={() => { setEditingDay(null); setShowDayModal(true); }}
                        className="px-4 py-2 bg-[#1a1a1a] text-white text-sm rounded-xl hover:bg-[#333] transition-all">
                        Crear día de hoy
                    </button>
                </div>
            )}

            {/* Estudiantes sin reserva activa */}
            {filterStatus === 'all' && diningDayToday && (
                <div className="space-y-3">
                    <p className="text-xs font-semibold text-[#999] uppercase tracking-widest">
                        Sin reserva hoy ({filteredStudentsWithout.length})
                    </p>
                    {filteredStudentsWithout.length > 0 ? (
                        filteredStudentsWithout.map(s => (
                            <div key={s.id}
                                className="bg-white rounded-2xl border border-[#e8e8e8] p-4 flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-[#f5f5f0] flex items-center justify-center text-sm font-semibold text-[#888] flex-shrink-0">
                                    {s.name[0]}{s.surname[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-[#1a1a1a] truncate">
                                        {s.name} {s.surname}
                                    </p>
                                    <p className="text-xs text-[#999]">{s.code} · {s.career}</p>
                                </div>
                                <span className="text-xs text-[#bbb] bg-[#f5f5f0] px-2.5 py-1 rounded-lg flex-shrink-0">
                                    Sin reserva
                                </span>
                            </div>
                        ))
                    ) : searchQuery ? (
                        <div className="bg-white rounded-2xl border border-[#e8e8e8] py-6 text-center">
                            <p className="text-[#aaa] text-sm">No se encontraron estudiantes</p>
                        </div>
                    ) : null}
                </div>
            )}

            {showDayModal && (
                <DiningDayModal
                    day={editingDay}
                    onClose={() => { setShowDayModal(false); setEditingDay(null); }}
                />
            )}
            {showAutoModal && (
                <AutoScheduleModal onClose={() => setShowAutoModal(false)} />
            )}
        </div>
    );
};

export default ReservasSection;