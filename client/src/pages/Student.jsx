import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { UtensilsCrossed, ArrowLeft, Shield } from "lucide-react";
import { bookRequest } from "../api/auth.js";
import StudentModal from "../components/StudentModal.jsx";

const Student = () => {
  const navigate = useNavigate();
  const [captchaChecked, setCaptchaChecked] = useState(false);
  const [modalData, setModalData] = useState(null); // { status, message, hasReservation, studentData }

  const handleReservation = async (values, { setSubmitting }) => {
    if (!captchaChecked) return;

    try {
      const res = await bookRequest({ code: values.codigo });

      /*
       * NOTA: El campo `password` está implementado en el formulario pero NO se envía
       * a la API todavía porque el backend/BD no tiene ese campo aún.
       * Cuando esté listo, agregar `password: values.password` al bookRequest.
       * values.password está disponible aquí cuando se necesite.
       */

      switch (res.data.status) {
        case 200:
          setModalData({
            status: 200,
            message: res.data.message,
            hasReservation: false,
            studentData: res.data.student || null,
          });
          break;
        case 409:
          setModalData({
            status: 409,
            message: res.data.message,
            hasReservation: true,
            studentData: res.data.student || null,
          });
          break;
        case 404:
        default:
          setModalData({
            status: res.data.status,
            message: res.data.message,
            hasReservation: false,
            studentData: null,
          });
      }
    } catch (error) {
      console.error(error);
      setModalData({
        status: 500,
        message: "Error de conexión. Intenta nuevamente.",
        hasReservation: false,
        studentData: null,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelReservation = async () => {
    /*
     * NOTA: Cancelación de reserva implementada en UI pero NO funcional todavía.
     * Requiere endpoint en la API y campo `estado` en BD.
     * Descomentar cuando el backend esté listo:
     *
     * try {
     *   await cancelBookRequest({ code: currentCode });
     *   setModalData(null);
     * } catch (e) { console.error(e); }
     */
    alert("Función de cancelación próximamente disponible.");
  };

  return (
    <div className="min-h-screen bg-[#f5f5f0] flex flex-col">

      {/* Navbar */}
      <nav className="border-b border-[#e0e0e0] bg-[#f5f5f0] px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-[#666] hover:text-[#1a1a1a] transition-colors text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver</span>
        </button>
        <span
          className="text-lg text-[#1a1a1a]"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          comedor
        </span>
        <div className="w-16" /> 
      </nav>

      {/* Main */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">

        {/* Header */}
        <div className="text-center mb-8 space-y-3">
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-full border-2 border-[#1a1a1a] flex items-center justify-center">
              <UtensilsCrossed className="h-5 w-5 text-[#1a1a1a]" strokeWidth={1.5} />
            </div>
          </div>
          <h1
            className="text-4xl font-light text-[#1a1a1a]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Tu Reserva
          </h1>
          <p className="text-sm text-[#888]">Ingresa para acceder</p>
        </div>

        {/* Card Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#e8e8e8] w-full max-w-sm p-6 space-y-5">

          {/* Step indicator */}
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-full bg-[#1a1a1a] text-white text-xs flex items-center justify-center font-semibold">
              1
            </div>
            <span className="text-sm text-[#1a1a1a] font-medium">Ingresa tus credenciales</span>
          </div>

          <Formik
            initialValues={{ codigo: "", password: "" }}
            validationSchema={Yup.object({
              codigo: Yup.string()
                .length(6, "Debe tener exactamente 6 caracteres (ej: 024001)")
                .required("Requerido"),
              /*
               * NOTA: Validación de contraseña implementada pero campo no enviado a API.
               * Activar cuando el backend soporte contraseñas.
               */
              password: Yup.string()
                .min(6, "Mínimo 6 caracteres")
                .required("Requerido"),
            })}
            onSubmit={handleReservation}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">

                {/* Código */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold tracking-widest text-[#444] uppercase">
                    Código de Estudiante
                  </label>
                  <Field
                    name="codigo"
                    type="text"
                    placeholder="Ej: 024001"
                    autoComplete="off"
                    className="w-full px-4 py-3 bg-[#f7f7f7] border border-transparent rounded-xl text-sm text-[#1a1a1a] placeholder-[#bbb] focus:outline-none focus:border-[#1a1a1a] focus:bg-white transition-all"
                  />
                  <ErrorMessage name="codigo" component="p" className="text-xs text-red-500 mt-1" />
                </div>

                {/* Contraseña */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold tracking-widest text-[#444] uppercase">
                    Contraseña
                  </label>
                  <Field
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-[#f7f7f7] border border-transparent rounded-xl text-sm text-[#1a1a1a] placeholder-[#bbb] focus:outline-none focus:border-[#1a1a1a] focus:bg-white transition-all"
                  />
                  <ErrorMessage name="password" component="p" className="text-xs text-red-500 mt-1" />
                  {/* NOTA: Campo password visible en UI pero no enviado a API aún */}
                </div>

                {/* Captcha */}
                <div
                  className="flex items-center justify-between px-4 py-3 border border-[#e0e0e0] rounded-xl bg-[#f7f7f7] cursor-pointer select-none"
                  onClick={() => setCaptchaChecked(!captchaChecked)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-5 w-5 rounded border-2 flex items-center justify-center transition-all ${captchaChecked ? "bg-[#1a1a1a] border-[#1a1a1a]" : "border-[#aaa] bg-white"}`}>
                      {captchaChecked && (
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-[#1a1a1a]">No soy un robot</p>
                      <p className="text-xs text-[#999]">Protección de seguridad</p>
                    </div>
                  </div>
                  <Shield className="h-5 w-5 text-[#aaa]" strokeWidth={1.5} />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting || !captchaChecked}
                  className="w-full py-3.5 bg-[#1a1a1a] text-white text-sm font-semibold tracking-widest uppercase rounded-xl hover:bg-[#333] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isSubmitting ? "Verificando..." : "Ingresar"}
                </button>

                {/* Info footer */}
                <div className="pt-2 border-t border-[#f0f0f0] space-y-1">
                  <p className="text-xs text-[#999]">
                    <span className="font-semibold text-[#666]">Horarios:</span> Lunes a viernes 11:30 – 14:00
                  </p>
                  <p className="text-xs text-[#999]">
                    <span className="font-semibold text-[#666]">Soporte:</span> comedor@universidad.edu.co
                  </p>
                </div>

              </Form>
            )}
          </Formik>
        </div>
      </div>

      {/* Modal */}
      {modalData && (
        <StudentModal
          data={modalData}
          onClose={() => setModalData(null)}
          onCancel={handleCancelReservation}
        />
      )}
    </div>
  );
};

export default Student;