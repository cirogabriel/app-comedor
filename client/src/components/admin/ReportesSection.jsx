import { useState, useEffect, useCallback, useRef } from "react";
import { Search, CheckCircle2, XCircle, CalendarDays } from "lucide-react";
import { useAdmin } from "../../context/adminContext.jsx";
import { getDiningDays } from "../../api/auth.js";
import { isoToLocalStr, todayLocalStr, toPeruDateLong } from "../../lib/dateUtils.js";
import * as echarts from "echarts";

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
        (student.code || '').includes(q)
    );
};

const DAY_LABELS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const MONTH_NAMES = [
    'Enero','Febrero','Marzo','Abril','Mayo','Junio',
    'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
];

const ReservationChart = ({ confirmed, cancelled, capacity }) => {
    const chartRef = useRef(null);
    const instanceRef = useRef(null);

    useEffect(() => {
        if (!chartRef.current) return;
        if (!instanceRef.current) {
            instanceRef.current = echarts.init(chartRef.current);
        }
        const total = confirmed + cancelled;
        const available = Math.max(0, (capacity || 0) - confirmed);

        instanceRef.current.setOption({
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c} ({d}%)',
                backgroundColor: '#1a1a1a',
                borderColor: '#1a1a1a',
                textStyle: { color: '#fff', fontSize: 12 },
            },
            legend: { show: false },
            series: [
                {
                    name: 'Reservas',
                    type: 'pie',
                    radius: ['52%', '78%'],
                    center: ['50%', '50%'],
                    avoidLabelOverlap: false,
                    label: {
                        show: true,
                        position: 'center',
                        formatter: () => `{total|${total}}\n{label|reservas}`,
                        rich: {
                            total: { fontSize: 28, fontWeight: 'bold', color: '#1a1a1a', lineHeight: 36 },
                            label: { fontSize: 11, color: '#999', lineHeight: 18 },
                        }
                    },
                    emphasis: {
                        label: { show: true },
                        scaleSize: 4,
                    },
                    labelLine: { show: false },
                    data: [
                        { value: confirmed, name: 'Confirmadas', itemStyle: { color: '#16a34a' } },
                        { value: cancelled,  name: 'Canceladas',  itemStyle: { color: '#e8e8e8' } },
                        ...(capacity && available > 0
                            ? [{ value: available, name: 'Disponibles', itemStyle: { color: '#f0fdf4' } }]
                            : []),
                    ].filter(d => d.value > 0),
                }
            ]
        });
    }, [confirmed, cancelled, capacity]);

    useEffect(() => {
        const handleResize = () => instanceRef.current?.resize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return <div ref={chartRef} style={{ width: '100%', height: '260px' }} />;
};

const ReportesSection = () => {
    const { fetchBookingsByDay } = useAdmin();
    const [allDiningDays, setAllDiningDays] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [bookings, setBookings] = useState([]);
    const [selectedDayData, setSelectedDayData] = useState(null);
    const [loadingDays, setLoadingDays] = useState(true);
    const [loadingBookings, setLoadingBookings] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentMonth, setCurrentMonth] = useState(() => {
        const now = new Date();
        return { year: now.getFullYear(), month: now.getMonth() };
    });

    const loadAllDays = useCallback(async () => {
        try {
            const res = await getDiningDays();
            setAllDiningDays(res.data || []);
        } catch {
            setAllDiningDays([]);
        } finally {
            setLoadingDays(false);
        }
    }, []);

    useEffect(() => { loadAllDays(); }, [loadAllDays]);

    const handleSelectDate = async (dateStr) => {
        if (selectedDate === dateStr) {
            setSelectedDate('');
            setBookings([]);
            setSelectedDayData(null);
            return;
        }
        setSelectedDate(dateStr);
        setSearchQuery('');
        setBookings([]);
        setLoadingBookings(true);
        const data = await fetchBookingsByDay(dateStr);
        const list = Array.isArray(data) ? data : data?.bookings || [];
        setBookings(list);
        const day = allDiningDays.find(d => isoToLocalStr(d.date) === dateStr);
        setSelectedDayData({ capacity: day?.capacity || 0 });
        setLoadingBookings(false);
    };

    const filtered = bookings.filter(b => matchesQuery(b.student, searchQuery));
    const confirmed = bookings.filter(b => b.status).length;
    const cancelled = bookings.filter(b => !b.status).length;

    const activeDateStrs = new Set(allDiningDays.map(d => isoToLocalStr(d.date)));
    const todayStr = todayLocalStr();

    const { year, month } = currentMonth;
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPad = (firstDay.getDay() + 6) % 7;

    const calendarDays = [];
    for (let i = 0; i < startPad; i++) calendarDays.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) {
        calendarDays.push(
            `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
        );
    }

    const prevMonth = () => setCurrentMonth(({ year, month }) =>
        month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 }
    );
    const nextMonth = () => setCurrentMonth(({ year, month }) =>
        month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 }
    );

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-xl md:text-2xl font-semibold text-[#1a1a1a] mb-1">Reportes</h2>
                <p className="text-sm text-[#888]">Historial de reservas por día</p>
            </div>

            {/* Panel principal: calendario + stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">

                {/* Calendario compacto */}
                <div className="bg-white rounded-2xl border border-[#e8e8e8] p-4 flex flex-col">
                    {/* Nav mes */}
                    <div className="flex items-center justify-between mb-3">
                        <button onClick={prevMonth}
                            className="p-1.5 rounded-lg bg-[#f5f5f0] text-[#666] hover:bg-[#e8e8e8] transition-all text-sm font-bold leading-none">
                            ‹
                        </button>
                        <span className="text-xs font-semibold text-[#1a1a1a] capitalize">
                            {MONTH_NAMES[month]} {year}
                        </span>
                        <button onClick={nextMonth}
                            className="p-1.5 rounded-lg bg-[#f5f5f0] text-[#666] hover:bg-[#e8e8e8] transition-all text-sm font-bold leading-none">
                            ›
                        </button>
                    </div>

                    {/* Labels días */}
                    <div className="grid grid-cols-7 mb-1">
                        {DAY_LABELS.map(l => (
                            <div key={l} className="text-center text-[10px] text-[#bbb] font-medium py-0.5">{l}</div>
                        ))}
                    </div>

                    {/* Días */}
                    {loadingDays ? (
                        <p className="text-xs text-[#aaa] text-center py-4">Cargando...</p>
                    ) : (
                        <div className="grid grid-cols-7 gap-0.5 flex-1">
                            {calendarDays.map((dateStr, i) => {
                                if (!dateStr) return <div key={`pad-${i}`} className="aspect-square" />;
                                const isActive = activeDateStrs.has(dateStr);
                                const isSelected = selectedDate === dateStr;
                                const isToday = dateStr === todayStr;
                                const day = parseInt(dateStr.split('-')[2]);

                                return (
                                    <button key={dateStr}
                                        onClick={() => isActive && handleSelectDate(dateStr)}
                                        disabled={!isActive}
                                        className={`relative aspect-square flex items-center justify-center rounded-lg text-[11px] font-medium transition-all
                                            ${isSelected
                                                ? 'bg-[#1a1a1a] text-white'
                                                : isActive
                                                    ? 'bg-green-50 text-green-700 hover:bg-green-100 cursor-pointer'
                                                    : 'text-[#ddd] cursor-default'
                                            }`}>
                                        {day}
                                        {isToday && !isSelected && (
                                            <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#1a1a1a]" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Leyenda */}
                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[#f0f0f0]">
                        <div className="flex items-center gap-1">
                            <div className="w-2.5 h-2.5 rounded-sm bg-green-50 border border-green-200" />
                            <span className="text-[10px] text-[#999]">Con reservas</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-[#1a1a1a] inline-block" />
                            <span className="text-[10px] text-[#999]">Hoy</span>
                        </div>
                    </div>
                </div>

                {/* Panel derecho */}
                <div className="bg-white rounded-2xl border border-[#e8e8e8] p-4 flex flex-col">
                    {selectedDate ? (
                        <div className="flex flex-col h-full">
                            <p className="text-xs font-semibold text-[#1a1a1a] capitalize mb-2">
                                {toPeruDateLong(selectedDate + 'T12:00:00')}
                            </p>

                            {loadingBookings ? (
                                <div className="flex-1 flex items-center justify-center">
                                    <p className="text-sm text-[#aaa]">Cargando...</p>
                                </div>
                            ) : (
                                <div className="flex flex-col flex-1">
                                    {/* Chart ocupa el espacio disponible */}
                                    <div className="flex-1 min-h-0">
                                        <ReservationChart
                                            confirmed={confirmed}
                                            cancelled={cancelled}
                                            capacity={selectedDayData?.capacity}
                                        />
                                    </div>

                                    {/* Stats pegados abajo */}
                                    <div className="grid grid-cols-3 gap-2 mt-2">
                                        <div className="bg-[#f5f5f0] rounded-xl p-2.5 text-center">
                                            <p className="text-[10px] text-[#999] mb-0.5">Total</p>
                                            <p className="text-base font-semibold text-[#1a1a1a]">{bookings.length}</p>
                                        </div>
                                        <div className="bg-green-50 rounded-xl p-2.5 text-center">
                                            <p className="text-[10px] text-green-600 mb-0.5">Confirmadas</p>
                                            <p className="text-base font-semibold text-green-700">{confirmed}</p>
                                        </div>
                                        <div className="bg-[#f5f5f0] rounded-xl p-2.5 text-center">
                                            <p className="text-[10px] text-[#999] mb-0.5">Canceladas</p>
                                            <p className="text-base font-semibold text-[#888]">{cancelled}</p>
                                        </div>
                                    </div>

                                    {selectedDayData?.capacity > 0 && (
                                        <div className="mt-2 bg-[#f5f5f0] rounded-xl px-3 py-2 flex items-center justify-between">
                                            <span className="text-[10px] text-[#999]">Capacidad del día</span>
                                            <span className="text-xs font-semibold text-[#1a1a1a]">
                                                {confirmed}/{selectedDayData.capacity}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-[#f5f5f0] flex items-center justify-center">
                                <CalendarDays className="h-6 w-6 text-[#bbb]" strokeWidth={1.5} />
                            </div>
                            <div>
                                <p className="text-sm text-[#888] font-medium">Selecciona un día</p>
                                <p className="text-xs text-[#bbb] mt-0.5">Los días con reservas aparecen en verde</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Lista de reservas */}
            {selectedDate && !loadingBookings && (
                <div className="space-y-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#bbb]" />
                        <input type="text"
                            placeholder="Buscar por nombre, apellido o código..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#e8e8e8] text-sm text-[#1a1a1a] placeholder-[#bbb] focus:outline-none focus:border-[#1a1a1a] transition-all"
                        />
                    </div>

                    <p className="text-xs font-semibold text-[#999] uppercase tracking-widest">
                        {searchQuery
                            ? `${filtered.length} resultado${filtered.length !== 1 ? 's' : ''}`
                            : `${bookings.length} reserva${bookings.length !== 1 ? 's' : ''}`
                        }
                    </p>

                    {filtered.length > 0 ? (
                        filtered.map(b => (
                            <div key={b.id}
                                className="bg-white rounded-2xl border border-[#e8e8e8] p-4 flex items-center gap-3">
                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-sm font-semibold flex-shrink-0
                                    ${b.status ? 'bg-green-50 text-green-700' : 'bg-[#f5f5f0] text-[#888]'}`}>
                                    {b.student.name[0]}{b.student.surname[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-[#1a1a1a] truncate">
                                        {b.student.name} {b.student.surname}
                                    </p>
                                    <p className="text-xs text-[#999]">{b.student.code} · {b.student.career}</p>
                                </div>
                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                    {b.status
                                        ? <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        : <XCircle className="h-4 w-4 text-[#ccc]" />
                                    }
                                    <span className={`text-xs font-medium ${b.status ? 'text-green-600' : 'text-[#aaa]'}`}>
                                        {b.status ? 'Confirmada' : 'Cancelada'}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-2xl border border-[#e8e8e8] py-10 text-center">
                            <p className="text-[#aaa] text-sm">
                                {searchQuery ? 'No se encontraron resultados' : 'No hay reservas para este día'}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ReportesSection;