import PropTypes from "prop-types";
import { useState } from "react";
import { BadgeCheck, BadgeInfo, ShieldAlert, XCircle, X, Loader2, Trash2 } from "lucide-react";

const StudentModal = ({ data, onClose, onCancel }) => {
    const { status, message, bookingId, studentData, noDiningDay, cancelled, cancelError } = data;
    const [cancelling, setCancelling] = useState(false);

    const isSuccess    = status === 200 && !cancelled;
    const isCancelled  = cancelled === true;
    const isBooked     = status === 409 && !!bookingId;
    const isFullBooked = status === 409 && !bookingId;
    const isNotFound   = status === 404;
    const isNoDining   = status === 503 || noDiningDay;

    const handleCancel = async () => {
        if (!bookingId || cancelling) return;
        setCancelling(true);
        await onCancel(bookingId);
        setCancelling(false);
    };

    const getConfig = () => {
        if (isSuccess)    return { icon: BadgeCheck,  title: 'Reserva Confirmada',     subtitle: 'Tu lugar ha sido reservado para hoy.' };
        if (isCancelled)  return { icon: XCircle,     title: 'Reserva Cancelada',      subtitle: 'Tu reserva fue eliminada.' };
        if (isBooked)     return { icon: BadgeInfo,   title: 'Ya Reservaste',           subtitle: 'Tienes un lugar para el servicio de hoy.' };
        if (isFullBooked) return { icon: ShieldAlert, title: 'Sin Cupos Disponibles',  subtitle: 'Todos los cupos se han llenado para hoy.' };
        if (isNotFound)   return { icon: XCircle,     title: 'No Encontrado',           subtitle: 'El código no corresponde a ningún estudiante.' };
        if (isNoDining)   return { icon: ShieldAlert, title: 'Sin Servicio Hoy',        subtitle: 'No hay comedor programado para hoy.' };
        return              { icon: XCircle,     title: 'Error',                   subtitle: message || 'Ocurrió un error inesperado.' };
    };

    const { icon: Icon, title, subtitle } = getConfig();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white w-full max-w-xs rounded-2xl z-10 overflow-hidden shadow-xl">

                {/* Close */}
                <button onClick={onClose}
                    className="absolute top-3.5 right-3.5 text-[#ccc] hover:text-[#1a1a1a] transition-colors">
                    <X className="h-4 w-4" />
                </button>

                {/* Cuerpo */}
                <div className="px-6 pt-8 pb-6 flex flex-col items-center text-center space-y-4">

                    {/* Icono */}
                    <div className="h-11 w-11 rounded-full border border-[#e8e8e8] flex items-center justify-center">
                        <Icon className="h-5 w-5 text-[#1a1a1a]" strokeWidth={1.5} />
                    </div>

                    {/* Título y subtítulo */}
                    <div className="space-y-1.5">
                        <h2 className="text-base font-semibold text-[#1a1a1a] tracking-tight">
                            {title}
                        </h2>
                        <p className="text-sm text-[#888] leading-relaxed">
                            {subtitle}
                        </p>
                    </div>

                    {/* Card del estudiante */}
                    {studentData?.name && (isSuccess || isBooked) && (
                        <div className="w-full border border-[#e8e8e8] rounded-xl px-4 py-3 space-y-0.5">
                            <p className="text-[10px] text-[#bbb] uppercase tracking-widest">
                                Verificar
                            </p>
                            <p className="text-sm text-[#1a1a1a]">
                                {studentData.name} {studentData.surname}
                            </p>
                        </div>
                    )}

                    {/* Info sin comedor */}
                    {isNoDining && (
                        <div className="w-full border border-[#e8e8e8] rounded-xl px-4 py-3 space-y-0.5">
                            <p className="text-[10px] text-[#bbb] uppercase tracking-widest">
                                Horario regular
                            </p>
                            <p className="text-sm text-[#1a1a1a]">
                                Lunes a viernes · 11:30 – 14:00
                            </p>
                        </div>
                    )}

                    {/* Error cancelación */}
                    {cancelError && (
                        <p className="text-xs text-red-400 w-full text-left">{cancelError}</p>
                    )}

                    {/* Botones */}
                    <div className="w-full pt-1 space-y-2">

                        {/* Un botón */}
                        {(isSuccess || isCancelled || isFullBooked || isNotFound || isNoDining) && (
                            <button onClick={onClose}
                                className="w-full py-3 bg-[#1a1a1a] text-white text-sm font-medium rounded-xl hover:bg-[#333] transition-all">
                                Entendido
                            </button>
                        )}

                        {/* Dos botones — ya reservado */}
                        {isBooked && (
                            <div className="flex gap-2">
                                <button onClick={onClose}
                                    className="flex-1 py-3 bg-white border border-[#e8e8e8] text-[#1a1a1a] text-sm font-medium rounded-xl hover:bg-[#f5f5f0] transition-all">
                                    Entendido
                                </button>
                                <button onClick={handleCancel} disabled={cancelling}
                                    className="flex-1 py-3 bg-[#1a1a1a] text-white text-sm font-medium rounded-xl hover:bg-[#333] disabled:opacity-40 transition-all flex items-center justify-center gap-1.5">
                                    {cancelling
                                        ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /><span>Cancelando</span></>
                                        : <><Trash2 className="h-3.5 w-3.5" /><span>Cancelar</span></>
                                    }
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

StudentModal.propTypes = {
    data: PropTypes.shape({
        status: PropTypes.number,
        message: PropTypes.string,
        bookingId: PropTypes.number,
        studentData: PropTypes.shape({
            name: PropTypes.string,
            surname: PropTypes.string,
        }),
        noDiningDay: PropTypes.bool,
        cancelled: PropTypes.bool,
        cancelError: PropTypes.string,
    }).isRequired,
    onClose: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export default StudentModal;