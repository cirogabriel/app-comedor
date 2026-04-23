import PropTypes from "prop-types";
import { useState } from "react";
import { X } from "lucide-react";
import { useAdmin } from "../../context/adminContext.jsx";
import { todayLocalStr, isoToLocalStr, localStrToDate } from "../../lib/dateUtils.js";

const DiningDayModal = ({ day, onClose }) => {
    const { handleCreateDiningDay, handleUpdateDiningDay } = useAdmin();
    const [date, setDate] = useState(day ? isoToLocalStr(day.date) : todayLocalStr());
    const [capacity, setCapacity] = useState(day?.capacity || 100);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSave = async () => {
        if (!date || !capacity) { setError('Completa todos los campos'); return; }
        setLoading(true);
        try {
            if (day) {
                await handleUpdateDiningDay(day.id, { capacity: parseInt(capacity) });
            } else {
                await handleCreateDiningDay({
                    date: localStrToDate(date).toISOString(),
                    capacity: parseInt(capacity)
                });
            }
            onClose();
        } catch {
            setError('Error al guardar. El día puede ya existir.');
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
                <h3 className="text-lg font-semibold text-[#1a1a1a] mb-5">
                    {day ? 'Editar día' : 'Nuevo día de servicio'}
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-semibold tracking-widest text-[#444] uppercase block mb-1.5">
                            Fecha
                        </label>
                        <input type="date" value={date}
                            min={todayLocalStr()}
                            onChange={e => setDate(e.target.value)}
                            disabled={!!day}
                            className="w-full px-4 py-3 bg-[#f0f0f0] rounded-xl text-sm text-[#1a1a1a] outline-none border-2 border-transparent focus:border-[#1a1a1a] focus:bg-white transition-all disabled:opacity-50"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold tracking-widest text-[#444] uppercase block mb-1.5">
                            Capacidad
                        </label>
                        <input type="number" value={capacity} min={1} max={500}
                            onChange={e => setCapacity(e.target.value)}
                            className="w-full px-4 py-3 bg-[#f0f0f0] rounded-xl text-sm text-[#1a1a1a] outline-none border-2 border-transparent focus:border-[#1a1a1a] focus:bg-white transition-all"
                        />
                    </div>
                    {error && <p className="text-xs text-red-500">{error}</p>}
                    <button onClick={handleSave} disabled={loading}
                        className="w-full py-3.5 bg-[#1a1a1a] text-white text-sm font-semibold rounded-xl hover:bg-[#333] disabled:opacity-40 transition-all">
                        {loading ? 'Guardando...' : day ? 'Actualizar' : 'Crear día'}
                    </button>
                </div>
            </div>
        </div>
    );
};

DiningDayModal.propTypes = {
    day: PropTypes.shape({
        id: PropTypes.number,
        date: PropTypes.string,
        capacity: PropTypes.number,
    }),
    onClose: PropTypes.func.isRequired,
};

export default DiningDayModal;