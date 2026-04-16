import { UtensilsCrossed, X, CheckCircle, XCircle, AlertCircle } from "lucide-react";

const StudentModal = ({ data, onClose, onCancel }) => {
  const { status, message, hasReservation, studentData } = data;

  const isSuccess = status === 200;
  const isAlreadyBooked = status === 409;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-2xl shadow-xl border border-[#e8e8e8] w-full max-w-sm p-6 space-y-5 z-10">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#aaa] hover:text-[#1a1a1a] transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Icon + Title */}
        <div className="text-center space-y-3 pt-2">
          <div className="flex justify-center">
            <div className="h-14 w-14 rounded-full border-2 border-[#1a1a1a] flex items-center justify-center">
              <UtensilsCrossed className="h-6 w-6 text-[#1a1a1a]" strokeWidth={1.5} />
            </div>
          </div>
          <div>
            <h2
              className="text-2xl font-light text-[#1a1a1a]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {isAlreadyBooked ? "Ya tienes reserva" : isSuccess ? "¡Reserva lista!" : "Sin disponibilidad"}
            </h2>
            {studentData?.nombre && (
              <p className="text-sm text-[#888] mt-1">{studentData.nombre}</p>
            )}
          </div>
        </div>

        {/* Status badge */}
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl ${isSuccess ? "bg-green-50 border border-green-100" : isAlreadyBooked ? "bg-blue-50 border border-blue-100" : "bg-red-50 border border-red-100"}`}>
          {isSuccess
            ? <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
            : isAlreadyBooked
            ? <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
            : <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          }
          <p className="text-sm text-[#444] leading-snug">{message}</p>
        </div>

        {/* Student basic data if available */}
        {studentData && (
          <div className="bg-[#f7f7f7] rounded-xl px-4 py-3 space-y-1">
            {studentData.codigo && (
              <div className="flex justify-between text-xs">
                <span className="text-[#999] uppercase tracking-wide">Código</span>
                <span className="text-[#1a1a1a] font-medium">{studentData.codigo}</span>
              </div>
            )}
            {studentData.carrera && (
              <div className="flex justify-between text-xs">
                <span className="text-[#999] uppercase tracking-wide">Carrera</span>
                <span className="text-[#1a1a1a] font-medium">{studentData.carrera}</span>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2 pt-1">
          {isSuccess && (
            <button
              onClick={onClose}
              className="w-full py-3.5 bg-[#1a1a1a] text-white text-sm font-semibold tracking-widest uppercase rounded-xl hover:bg-[#333] transition-all"
            >
              Confirmar Reserva
            </button>
          )}

          {isAlreadyBooked && (
            <>
              {/*
               * NOTA: Botón de cancelación implementado en UI.
               * NO funcional hasta que el backend soporte el campo `estado` y el endpoint de cancelación.
               */}
              <button
                onClick={onCancel}
                className="w-full py-3.5 border border-[#1a1a1a] text-[#1a1a1a] text-sm font-semibold tracking-widest uppercase rounded-xl hover:bg-[#1a1a1a] hover:text-white transition-all"
              >
                Cancelar Reserva
              </button>
            </>
          )}

          <button
            onClick={onClose}
            className="w-full py-3 text-[#999] text-sm hover:text-[#1a1a1a] transition-colors"
          >
            Salir
          </button>
        </div>

      </div>
    </div>
  );
};

export default StudentModal;