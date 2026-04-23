import PropTypes from "prop-types";
import { Mail, Clock, User, X } from "lucide-react";
import { useAdmin } from "../../context/adminContext.jsx";

const BookingCard = ({ booking }) => {
    const { cancelBooking } = useAdmin();
    const { student, status, createdAt, diningDay } = booking;

    const initials = `${student.name[0]}${student.surname[0]}`.toUpperCase();
    const date = new Date(diningDay?.date || createdAt).toLocaleDateString('es-PE', {
        timeZone: 'America/Lima',
        day: 'numeric', month: 'short', year: 'numeric'
    });
    const createdTime = new Date(createdAt).toLocaleTimeString('es-PE', {
        hour: '2-digit', minute: '2-digit'
    });

    return (
        <div className="group bg-white rounded-2xl border border-[#e8e8e8] hover:border-[#1a1a1a]/20 hover:shadow-sm transition-all p-4">
            <div className="flex items-start gap-3">

                {/* Avatar */}
                <div className={`h-10 w-10 md:h-11 md:w-11 rounded-xl flex items-center justify-center text-sm font-semibold flex-shrink-0
                    ${status ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                    {initials}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-[#1a1a1a] truncate">
                                {student.name} {student.surname}
                            </p>
                            <p className="text-xs text-[#999]">Código: {student.code}</p>
                        </div>
                        {/* Badge estado */}
                        <span className={`flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-lg border
                            ${status
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : 'bg-red-50 text-red-600 border-red-200'
                            }`}>
                            {status ? 'Confirmada' : 'Cancelada'}
                        </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-1.5 sm:gap-4">
                        {student.email && (
                            <div className="flex items-center gap-1.5">
                                <Mail className="h-3.5 w-3.5 text-[#bbb] flex-shrink-0" />
                                <span className="text-xs text-[#888] truncate">{student.email}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-[#bbb] flex-shrink-0" />
                            <span className="text-xs text-[#888]">{createdTime}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5 text-[#bbb] flex-shrink-0" />
                            <span className="text-xs text-[#888]">{date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className={`h-2 w-2 rounded-full flex-shrink-0 ${status ? 'bg-green-500' : 'bg-red-400'}`} />
                            <span className="text-xs text-[#888] truncate">{student.career}</span>
                        </div>
                    </div>
                </div>

                {/* Cancelar — solo si está confirmada */}
                {status && (
                    <button
                        onClick={() => cancelBooking(booking.id)}
                        className="opacity-0 group-hover:opacity-100 flex-shrink-0 p-2 text-[#bbb] hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Cancelar reserva">
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
        </div>
    );
};

BookingCard.propTypes = {
    booking: PropTypes.shape({
        id: PropTypes.number.isRequired,
        status: PropTypes.bool.isRequired,
        createdAt: PropTypes.string.isRequired,
        student: PropTypes.shape({
            name: PropTypes.string.isRequired,
            surname: PropTypes.string.isRequired,
            code: PropTypes.string.isRequired,
            email: PropTypes.string,
            career: PropTypes.string,
        }).isRequired,
        diningDay: PropTypes.shape({
            date: PropTypes.string,
        }),
    }).isRequired,
};

export default BookingCard;