import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UtensilsCrossed } from "lucide-react";
import { loginRequest } from "../api/auth.js";

const Admin = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await loginRequest({
        email: values.email,
        password: values.password,
      });
      if (response.data.status === 401) {
        alert(response.data.message);
      } else {
        navigate("/statistics");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
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
            Administrador
          </h1>
          <p className="text-sm text-[#888]">Acceso restringido</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#e8e8e8] w-full max-w-sm p-6 space-y-5">

          {/* Step indicator */}
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-full bg-[#1a1a1a] text-white text-xs flex items-center justify-center font-semibold">
              1
            </div>
            <span className="text-sm text-[#1a1a1a] font-medium">Credenciales institucionales</span>
          </div>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={Yup.object({
              email: Yup.string()
                .email("Ingresa un email válido")
                .required("Requerido"),
              password: Yup.string().required("Requerido"),
            })}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold tracking-widest text-[#444] uppercase">
                    Email Institucional
                  </label>
                  <Field name="email">
                    {({ field, meta }) => (
                      <input
                        {...field}
                        type="email"
                        placeholder="admin@universidad.edu.co"
                        autoComplete="off"
                        className={`w-full px-4 py-3 bg-[#f0f0f0] rounded-xl text-sm text-[#1a1a1a] placeholder-[#bbb] outline-none border-2 transition-all duration-200
                          ${meta.touched && meta.error
                            ? "border-red-400 bg-white"
                            : "border-transparent focus:border-[#1a1a1a] focus:bg-white"
                          }`}
                      />
                    )}
                  </Field>
                  <ErrorMessage name="email" component="p" className="text-xs text-red-500 mt-1" />
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold tracking-widest text-[#444] uppercase">
                    Contraseña
                  </label>
                  <Field name="password">
                    {({ field, meta }) => (
                      <input
                        {...field}
                        type="password"
                        placeholder="••••••••"
                        className={`w-full px-4 py-3 bg-[#f0f0f0] rounded-xl text-sm text-[#1a1a1a] placeholder-[#bbb] outline-none border-2 transition-all duration-200
                          ${meta.touched && meta.error
                            ? "border-red-400 bg-white"
                            : "border-transparent focus:border-[#1a1a1a] focus:bg-white"
                          }`}
                      />
                    )}
                  </Field>
                  <ErrorMessage name="password" component="p" className="text-xs text-red-500 mt-1" />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#1a1a1a] text-white text-sm font-semibold tracking-widest uppercase rounded-xl hover:bg-[#333] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isSubmitting ? "Verificando..." : "Acceder"}
                </button>

                {/* Footer info */}
                <div className="space-y-3 pt-1">
                  <p className="text-center text-xs text-[#999]">
                    Solo para administradores autorizados
                  </p>
                  <div className="border-t border-[#f0f0f0] pt-3">
                    <p className="text-center text-xs text-[#bbb]">
                      Acceso restringido solo para administradores autorizados
                    </p>
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