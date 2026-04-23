import PropTypes from "prop-types";
import { useState } from "react";
import { Calendar, Edit2, Plus } from "lucide-react";
import { useAdmin } from "../../context/adminContext.jsx";

const DiningDayCard = ({ diningDay, available }) => {
    const { handleCreateDiningDay, handleUpdateDiningDay } = useAdmin();
    const [editing, setEditing] = useState(false);
    const [capacity, setCapacity] = useState(diningDay?.capacity || 100);

    const today = new Date().toLocaleDateString('es-PE', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    const handleSave = async () => {
        try {
            if (diningDay) {
                await handleUpdateDiningDay(diningDay.id, { capacity: parseInt(capacity) });
            } else {
                const date = new Date();
                date.setHours(12, 0, 0, 0);
                await handleCreateDiningDay({ date: date.toISOString(), capacity: parseInt(capacity) });
            }
            setEditing(false);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-[#e8e8e8] p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 min-w-0">
                    <Calendar className="h-5 w-5 text-[#1a1a1a] flex-shrink-0" strokeWidth={1.5} />
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#1a1a1a] capitalize truncate">{today}</p>
                        <p className="text-xs text-[#999]">Día de servicio</p>
                    </div>
                </div>
                <button onClick={() => setEditing(!editing)}
                    className="p-2 text-[#bbb] hover:text-[#1a1a1a] hover:bg-[#f5f5f0] rounded-lg transition-all flex-shrink-0">
                    {diningDay ? <Edit2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </button>
            </div>

            {!diningDay && !editing ? (
                <div className="text-center py-4">
                    <p className="text-sm text-[#aaa] mb-3">No hay día habilitado para hoy</p>
                    <button onClick={() => setEditing(true)}
                        className="px-4 py-2 bg-[#1a1a1a] text-white text-sm rounded-xl hover:bg-[#333] transition-all">
                        Habilitar hoy
                    </button>
                </div>
            ) : editing ? (
                <div className="flex flex-wrap items-center gap-3">
                    <label className="text-sm text-[#666]">Capacidad:</label>
                    <input type="number" value={capacity}
                        onChange={e => setCapacity(e.target.value)}
                        min={1} max={500}
                        className="w-24 px-3 py-2 rounded-xl bg-[#f5f5f0] border border-transparent focus:border-[#1a1a1a] focus:bg-white text-sm outline-none transition-all"
                    />
                    <button onClick={handleSave}
                        className="px-4 py-2 bg-[#1a1a1a] text-white text-sm rounded-xl hover:bg-[#333] transition-all">
                        Guardar
                    </button>
                    <button onClick={() => setEditing(false)}
                        className="px-4 py-2 text-[#888] text-sm hover:text-[#1a1a1a] transition-colors">
                        Cancelar
                    </button>
                </div>
            ) : (
                <div className="flex items-center gap-6">
                    <div>
                        <p className="text-xs text-[#999]">Capacidad</p>
                        <p className="text-2xl font-semibold text-[#1a1a1a]">{diningDay.capacity}</p>
                    </div>
                    <div className="text-[#e0e0e0]">|</div>
                    <div>
                        <p className="text-xs text-[#999]">Cupos disponibles</p>
                        <p className="text-2xl font-semibold text-green-600">
                            {available !== null ? available : '—'}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

DiningDayCard.propTypes = {
    diningDay: PropTypes.shape({
        id: PropTypes.number,
        capacity: PropTypes.number,
    }),
    available: PropTypes.number,
};

export default DiningDayCard;