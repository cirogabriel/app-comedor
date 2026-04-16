import { Outlet } from 'react-router-dom'
//import Sidebar from "../components/Sidebar.jsx";
import Modal from "../components/Modal.jsx";
import { useAdmin } from "../context/adminContext.jsx";
import FooterAdmin from "../components/FooterAdmin.jsx";
import HeaderAdmin from "../components/HeaderAdmin.jsx";
import ListBook from './ListBook.jsx';



const HomeAdmin = () => {

    const {
        mostrarVentanaConfirmacion,
        setMostrarVentanaConfirmacion,
        limpiarCupos,
        mostrarVentanaResultado,
        resultadoMensaje,
        cerrarVentanaResultado
        } = useAdmin();

    return (
        <div className='admin-wrapper'>
            <HeaderAdmin/>
            <section className='section-admin'>
                <Outlet />
               
            </section>

            {mostrarVentanaConfirmacion && (
                <Modal
                    mensaje="¿Quieres limpiar todos los comensales?"
                    onClose={() => setMostrarVentanaConfirmacion(false)}
                >
                    <button
                        className="btn btn-outline-primary"
                        onClick={() => { limpiarCupos(); setMostrarVentanaConfirmacion(false); }}>
                        Aceptar
                    </button>
                </Modal>
            )}

            {mostrarVentanaResultado && (
                <Modal mensaje={resultadoMensaje} onClose={cerrarVentanaResultado} />
            )}

            <FooterAdmin/>
        </div>
    );
};

export default HomeAdmin;

