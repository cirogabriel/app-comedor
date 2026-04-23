import { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import * as Yup from "yup";
import Joyride from "react-joyride";
import { useAuth } from "../context/authContext.jsx";

const STATUS = { FINISHED: 'finished', SKIPPED: 'skipped' };

const steps = [
    {
        target: '#admin-email',
        content: 'Ingresa el email institucional. Para esta demo usa: admin@unsaac.edu.pe',
        disableBeacon: true,
        placement: 'bottom',
    },
    {
        target: '#admin-password',
        content: 'Ingresa la contraseña. Para esta demo usa: 134403',
        placement: 'bottom',
    },
    {
        target: '#admin-submit',
        content: 'Pulsa aquí para acceder al panel de administración.',
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

const Admin = () => {
    const navigate = useNavigate();
    const { login, isAuthenticated, loading } = useAuth();
    const [runTour, setRunTour] = useState(true);

    useEffect(() => {
        if (!loading && isAuthenticated) {
            navigate('/statistics', { replace: true });
        }
    }, [isAuthenticated, loading, navigate]);

    if (loading) return null;
    if (isAuthenticated) return null;

    const handleJoyrideCallback = (data) => {
        const { status } = data;
        if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
            setRunTour(false);
        }
    };

    const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
        try {
            await login({ email: values.email, password: values.password });
            navigate('/statistics', { replace: true });
        } catch (error) {
            setFieldError('password', error.message || 'Credenciales incorrectas');
        } finally {
            setSubmitting(false);
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

            <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">

                <div className="text-center mb-8 space-y-2">
                    <h1 className="text-4xl text-[#1a1a1a]"
                        style={{ fontFamily: "'Pacifico', cursive" }}>
                        Administrador
                    </h1>
                    <p className="text-sm text-[#888]">Acceso restringido</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-[#e8e8e8] w-full max-w-sm p-6 space-y-5">
                    <div className="flex items-center gap-3">
                        <div className="h-7 w-7 rounded-full bg-[#1a1a1a] text-white text-xs flex items-center justify-center font-semibold">
                            1
                        </div>
                        <span className="text-sm text-[#1a1a1a] font-medium">Credenciales institucionales</span>
                    </div>

                    <Formik
                        initialValues={{ email: "", password: "" }}
                        validationSchema={Yup.object({
                            email: Yup.string().email("Email inválido").required("Requerido"),
                            password: Yup.string().required("Requerido"),
                        })}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form className="space-y-4">
                                <div id="admin-email" className="space-y-1">
                                    <label className="text-xs font-semibold tracking-widest text-[#444] uppercase">
                                        Email Institucional
                                    </label>
                                    <Field name="email">
                                        {({ field, meta }) => (
                                            <input {...field} type="email"
                                                placeholder="admin@unsaac.edu.pe"
                                                autoComplete="off"
                                                className={`w-full px-4 py-3 bg-[#f0f0f0] rounded-xl text-sm text-[#1a1a1a] placeholder-[#bbb] outline-none border-2 transition-all
                                                    ${meta.touched && meta.error
                                                        ? 'border-red-400 bg-white'
                                                        : 'border-transparent focus:border-[#1a1a1a] focus:bg-white'}`}
                                            />
                                        )}
                                    </Field>
                                    <ErrorMessage name="email" component="p" className="text-xs text-red-500" />
                                </div>

                                <div id="admin-password" className="space-y-1">
                                    <label className="text-xs font-semibold tracking-widest text-[#444] uppercase">
                                        Contraseña
                                    </label>
                                    <Field name="password">
                                        {({ field, meta }) => (
                                            <input {...field} type="password"
                                                placeholder="••••••••"
                                                className={`w-full px-4 py-3 bg-[#f0f0f0] rounded-xl text-sm text-[#1a1a1a] placeholder-[#bbb] outline-none border-2 transition-all
                                                    ${meta.touched && meta.error
                                                        ? 'border-red-400 bg-white'
                                                        : 'border-transparent focus:border-[#1a1a1a] focus:bg-white'}`}
                                            />
                                        )}
                                    </Field>
                                    <ErrorMessage name="password" component="p" className="text-xs text-red-500" />
                                </div>

                                <button
                                    id="admin-submit"
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-3.5 bg-[#1a1a1a] text-white text-sm font-semibold tracking-widest uppercase rounded-xl hover:bg-[#333] disabled:opacity-40 transition-all">
                                    {isSubmitting ? "Verificando..." : "Acceder"}
                                </button>

                                <div className="space-y-3 pt-1">
                                    <p className="text-center text-xs text-[#999]">Solo para administradores autorizados</p>
                                    <div className="border-t border-[#f0f0f0] pt-3">
                                        <p className="text-center text-xs text-[#bbb]">Acceso restringido solo para administradores autorizados</p>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default Admin;