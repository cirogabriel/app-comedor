import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import ReCAPTCHA from "react-google-recaptcha";
import { ArrowLeft } from "lucide-react";
import Joyride from "react-joyride";
import { bookRequest, cancelBookRequest } from "../api/auth.js";
import StudentModal from "../components/StudentModal.jsx";

const STATUS = { FINISHED: 'finished', SKIPPED: 'skipped' };

const steps = [
    {
        target: '#field-codigo',
        content: 'Ingresa tu código de estudiante. Para esta demo usa: 134401',
        disableBeacon: true,
        placement: 'bottom',
    },
    {
        target: '#field-password',
        content: 'Ingresa tu contraseña de matrícula de 6 dígitos. Para esta demo usa: 241101',
        placement: 'bottom',
    },
    {
        target: '#recaptcha-box',
        content: 'Verifica que no eres un robot marcando esta casilla.',
        placement: 'top',
    },
    {
        target: '#btn-submit',
        content: 'Pulsa aquí para verificar y reservar tu cupo.',
        placement: 'top',
    },
];

const joyrideStyles = {
    options: {
        arrowColor: '#1a1a1a',
        backgroundColor: '#1a1a1a',
        overlayColor: 'rgba(0,0,0,0.4)',
        primaryColor: '#1a1a1a',
        textColor: '#ffffff',
        zIndex: 1000,
    },
    tooltip: {
        borderRadius: '16px',
        padding: '16px 20px',
        fontSize: '13px',
        lineHeight: '1.6',
    },
    tooltipTitle: { display: 'none' },
    buttonNext: {
        backgroundColor: '#ffffff',
        color: '#1a1a1a',
        borderRadius: '10px',
        fontSize: '12px',
        fontWeight: 600,
        padding: '6px 16px',
        border: 'none',
    },
    buttonBack: {
        color: '#aaaaaa',
        fontSize: '12px',
        marginRight: '8px',
    },
    buttonSkip: {
        color: '#888888',
        fontSize: '12px',
    },
};

const Student = () => {
    const navigate = useNavigate();
    const recaptchaRef = useRef(null);
    const [captchaToken, setCaptchaToken] = useState(null);
    const [modalData, setModalData] = useState(null);
    const [runTour, setRunTour] = useState(true);

    const handleJoyrideCallback = (data) => {
        const { status } = data;
        if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
            setRunTour(false);
        }
    };

    const handleReservation = async (values, { setSubmitting, resetForm }) => {
        if (!captchaToken) return;
        try {
            const res = await bookRequest({
                code: values.codigo,
                password: values.password,
                captchaToken,
            });
            switch (res.data.status) {
                case 200:
                    setModalData({
                        status: 200,
                        message: res.data.message,
                        bookingId: res.data.bookingId,
                        studentData: res.data.student || null,
                    });
                    resetForm();
                    break;
                case 409:
                    setModalData({
                        status: 409,
                        message: res.data.message,
                        bookingId: res.data.bookingId || null,
                        studentData: res.data.student || null,
                    });
                    break;
                case 404:
                    setModalData({ status: 404, message: res.data.message, studentData: null });
                    break;
                case 503:
                    setModalData({ status: 503, message: res.data.message, noDiningDay: true, studentData: null });
                    break;
                default:
                    setModalData({ status: res.data.status, message: res.data.message, studentData: null });
            }
        } catch {
            setModalData({ status: 500, message: "Error de conexión. Intenta nuevamente.", studentData: null });
        } finally {
            setSubmitting(false);
            recaptchaRef.current?.reset();
            setCaptchaToken(null);
        }
    };

    const handleCancelReservation = async (bookingId) => {
        try {
            await cancelBookRequest(bookingId);
            setModalData(prev => ({
                ...prev,
                status: 200,
                message: 'Tu reserva fue cancelada.',
                bookingId: null,
                cancelled: true,
            }));
        } catch {
            setModalData(prev => ({ ...prev, cancelError: 'No se pudo cancelar. Intenta nuevamente.' }));
        }
    };

    return (
        <div className="min-h-screen bg-[#f5f5f0] flex flex-col">

            <Joyride
                steps={steps}
                run={runTour}
                continuous
                showSkipButton
                showProgress
                callback={handleJoyrideCallback}
                styles={joyrideStyles}
                locale={{
                    back: 'Atrás',
                    close: 'Cerrar',
                    last: 'Entendido',
                    next: 'Siguiente',
                    skip: 'Omitir',
                }}
            />

            {/* Navbar */}
            <nav className="border-b border-[#e0e0e0] bg-[#f5f5f0] px-6 py-4 flex items-center justify-between">
                <button onClick={() => navigate("/")}
                    className="flex items-center gap-2 text-[#666] hover:text-[#1a1a1a] transition-colors text-sm">
                    <ArrowLeft className="h-4 w-4" />
                    <span>Volver</span>
                </button>
                <span className="text-lg text-[#1a1a1a]"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                    comedor
                </span>
                <div className="w-16" />
            </nav>

            {/* Main */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">

                <div className="text-center mb-8 space-y-2">
                    <h1 className="text-4xl text-[#1a1a1a]"
                        style={{ fontFamily: "'Pacifico', cursive" }}>
                        Tu Reserva
                    </h1>
                    <p className="text-sm text-[#888]">Ingresa para acceder</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-[#e8e8e8] w-full max-w-sm p-6 space-y-5">
                    <div className="flex items-center gap-3">
                        <div className="h-7 w-7 rounded-full bg-[#1a1a1a] text-white text-xs flex items-center justify-center font-semibold">
                            1
                        </div>
                        <span className="text-sm text-[#1a1a1a] font-medium">Ingresa tus credenciales</span>
                    </div>

                    <Formik
                        initialValues={{ codigo: "", password: "" }}
                        validationSchema={Yup.object({
                            codigo: Yup.string().length(6, "Debe tener exactamente 6 caracteres").required("Requerido"),
                            password: Yup.string().min(6, "Mínimo 6 caracteres").required("Requerido"),
                        })}
                        onSubmit={handleReservation}
                    >
                        {({ isSubmitting }) => (
                            <Form className="space-y-4">
                                <div id="field-codigo" className="space-y-1">
                                    <label className="text-xs font-semibold tracking-widest text-[#444] uppercase">
                                        Código de Estudiante
                                    </label>
                                    <Field name="codigo" type="text"
                                        placeholder="Ej: 134401"
                                        autoComplete="off"
                                        className="w-full px-4 py-3 bg-[#f7f7f7] border border-transparent rounded-xl text-sm text-[#1a1a1a] placeholder-[#bbb] focus:outline-none focus:border-[#1a1a1a] focus:bg-white transition-all"
                                    />
                                    <ErrorMessage name="codigo" component="p" className="text-xs text-red-500" />
                                </div>

                                <div id="field-password" className="space-y-1">
                                    <label className="text-xs font-semibold tracking-widest text-[#444] uppercase">
                                        Contraseña
                                    </label>
                                    <Field name="password" type="password"
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 bg-[#f7f7f7] border border-transparent rounded-xl text-sm text-[#1a1a1a] placeholder-[#bbb] focus:outline-none focus:border-[#1a1a1a] focus:bg-white transition-all"
                                    />
                                    <ErrorMessage name="password" component="p" className="text-xs text-red-500" />
                                </div>

                                <div id="recaptcha-box" className="flex justify-center">
                                    <ReCAPTCHA
                                        ref={recaptchaRef}
                                        sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                                        onChange={(token) => setCaptchaToken(token)}
                                        onExpired={() => setCaptchaToken(null)}
                                        onError={() => setCaptchaToken(null)}
                                    />
                                </div>

                                <button
                                    id="btn-submit"
                                    type="submit"
                                    disabled={isSubmitting || !captchaToken}
                                    className="w-full py-3.5 bg-[#1a1a1a] text-white text-sm font-semibold tracking-widest uppercase rounded-xl hover:bg-[#333] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200">
                                    {isSubmitting ? "Verificando..." : "Ingresar"}
                                </button>

                                <div className="pt-2 border-t border-[#f0f0f0] space-y-1">
                                    <p className="text-xs text-[#999]">
                                        <span className="font-semibold text-[#666]">Horarios:</span> Lunes a viernes 11:30 – 14:00
                                    </p>
                                    <p className="text-xs text-[#999]">
                                        <span className="font-semibold text-[#666]">Soporte:</span> comedor@unsaac.edu.pe
                                    </p>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>

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