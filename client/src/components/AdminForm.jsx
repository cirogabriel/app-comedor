import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import {useNavigate} from "react-router-dom";
import { loginRequest } from "../api/auth.js";
import { MdAdminPanelSettings } from 'react-icons/md';
import Footer from "./Footer.jsx";


const AdminForm = () => {
    const navigate = useNavigate();

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await loginRequest({
                email: values.email,
                password: values.password
            })
            if (response.data.status === 401) {
                alert(response.data.message)
            } else {
                navigate('/statistics')
            }
        } catch (error) {
            console.log(error);
        } finally {
            setSubmitting(false);
        }
    };


    return (
        <div className="form-wrapper-admin">
            <div className="header-form">
                <MdAdminPanelSettings className="diner-icon" />
                <h2 className="title-form">ADMIN</h2>
            </div>
            <Formik
                initialValues={{
                    email: '',
                    password: ''
                }}
                validationSchema={Yup.object({
                    email: Yup.string()
                        .required("Requerido"),
                    password: Yup.string()
                        .required('Requerido')
                })}
                onSubmit={ handleSubmit }
            >
                <Form className="form-student">
                    <div className="form-group">
                        <label htmlFor="email" className="form-control-label">
                            EMAIL
                        </label>
                        <Field
                            name="email"
                            type="text"
                            className="form-control"
                            placeholder="Enter your email"
                            autoComplete="off"
                        />
                        <ErrorMessage
                            name="email"
                            component="div"
                            className="error-student_code"
                        />
                        <label htmlFor="password" className="form-control-label">
                            PASSWORD
                        </label>
                        <Field
                            name="password"
                            type="password"
                            className="form-control"
                            placeholder="Enter your password"
                        />
                        <ErrorMessage
                            name="password"
                            component="div"
                            className="error-student_code"
                        />
                    </div>

                    <div className="loginbttm">
                        <div className="login-button">
                            <button type="submit" className="btn btn-outline-primary">
                                LOG IN
                            </button>
                        </div>
                    </div>
                    <Footer/>
                </Form>
            </Formik>
        </div>
    );
};

export default AdminForm;