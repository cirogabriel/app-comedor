import PropTypes from "prop-types";
import { useState } from "react";
import { X, Check } from "lucide-react";
import { useAdmin } from "../../context/adminContext.jsx";
import { todayLocalStr, localStrToDate } from "../../lib/dateUtils.js";

const DAYS = [
    { value: 1, label: 'Lun' },
    { value: 2, label: 'Mar' },
    { value: 3, label: 'Mié' },
    { value: 4, label: 'Jue' },
    { value: 5, label: 'Vie' },
];

const AutoScheduleModal = ({ onClose }) => {
    const { autoCreateDiningDays } = useAdmin();
    const [selectedDays, setSelectedDays] = useState([1, 2, 3, 4, 5]);
    const [capacity, setCapacity] = useState(100);
    const [weeks, setWeeks] = useState(2);
    const [startDate, setStartDate] = useState(todayLocalStr());
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const toggleDay = (d) =>
        setSelectedDays(prev =>
            prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]
        );

    const handleCreate = async () => {
        if (selectedDays.length === 0) return;
        setLoading(true);
        try {
            const start = localStrToDate(startDate);
            const created = await autoCreateDiningDays(
                selectedDays, parseInt(capacity), parseInt(weeks), start
            );
            setResult(created);
        } catch {
            setResult([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-xl border border-[#e8e8e8] w-full max-w-sm p-6 z-10">
                <button onClick={onClose}
                    className="absolute top-4 right-4 text-[#bbb] hover:text-[#1a1a1a] transition-colors">
                    <X className="h-5 w-5" />
                </button>
                <h3 className="text-lg font-semibold text-[#1a1a1a] mb-1">Auto-programar días</h3>
                <p className="text-xs text-[#999] mb-5">Crea días de servicio automáticamente</p>

                {result ? (
                    <div className="space-y-4">
                        <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                            <p className="text-sm font-medium text-green-700 mb-2">
                                {result.length} {result.length === 1 ? 'día creado' : 'días creados'}
                            </p>
                            <div className="space-y-1 max-h-40 overflow-y-auto">
                                {result.length === 0 && (
                                    <p className="text-xs text-green-600">Los días ya existían</p>
                                )}
                                {result.map((d, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <Check className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
                                        <span className="text-xs text-green-700 capitalize">{d}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button onClick={onClose}
                            className="w-full py-3 bg-[#1a1a1a] text-white text-sm font-semibold rounded-xl hover:bg-[#333] transition-all">
                            Listo
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-semibold tracking-widest text-[#444] uppercase block mb-2">
                                Días de la semana
                            </label>
                            <div className="flex gap-2">
                                {DAYS.map(({ value, label }) => (
                                    <button key={value} onClick={() => toggleDay(value)}
                                        className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all
                                            ${selectedDays.includes(value)
                                                ? 'bg-[#1a1a1a] text-white'
                                                : 'bg-[#f5f5f0] text-[#666] hover:bg-[#e8e8e8]'}`}>
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-semibold tracking-widest text-[#444] uppercase block mb-1.5">
                                Desde
                            </label>
                            <input type="date" value={startDate}
                                min={todayLocalStr()}
                                onChange={e => setStartDate(e.target.value)}
                                className="w-full px-4 py-3 bg-[#f0f0f0] rounded-xl text-sm text-[#1a1a1a] outline-none border-2 border-transparent focus:border-[#1a1a1a] focus:bg-white transition-all"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-semibold tracking-widest text-[#444] uppercase block mb-1.5">
                                Semanas adelante
                            </label>
                            <select value={weeks} onChange={e => setWeeks(e.target.value)}
                                className="w-full px-4 py-3 bg-[#f0f0f0] rounded-xl text-sm text-[#1a1a1a] outline-none border-2 border-transparent focus:border-[#1a1a1a] transition-all">
                                {[1,2,3,4].map(w => (
                                    <option key={w} value={w}>{w} semana{w > 1 ? 's' : ''}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-semibold tracking-widest text-[#444] uppercase block mb-1.5">
                                Capacidad por día
                            </label>
                            <input type="number" value={capacity} min={1} max={500}
                                onChange={e => setCapacity(e.target.value)}
                                className="w-full px-4 py-3 bg-[#f0f0f0] rounded-xl text-sm text-[#1a1a1a] outline-none border-2 border-transparent focus:border-[#1a1a1a] transition-all"
                            />
                        </div>

                        <button onClick={handleCreate}
                            disabled={loading || selectedDays.length === 0}
                            className="w-full py-3.5 bg-[#1a1a1a] text-white text-sm font-semibold rounded-xl hover:bg-[#333] disabled:opacity-40 transition-all">
                            {loading ? 'Creando...' : 'Crear días'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

AutoScheduleModal.propTypes = { onClose: PropTypes.func.isRequired };
export default AutoScheduleModal;