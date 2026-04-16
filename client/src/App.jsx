import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import LoginAdmin from "./pages/LoginAdmin.jsx";
import NotFound from "./pages/NotFound.jsx";
import { AuthProvider } from "./context/authContext.jsx";
import { AdminProvider } from "./context/adminContext.jsx";
import ListBook from "./pages/ListBook.jsx";
import HomeAdmin from "./pages/HomeAdmin.jsx";
import Student from "./pages/Student.jsx";
import Admin from "./pages/Admin.jsx";
import './App.css'

function App() {
    return (
        <AuthProvider>
            <AdminProvider>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/estudiante' element={<Student />} />
                    <Route path='/admin' element={<Admin />} />
                    <Route path='/login' element={<LoginAdmin />} />
                    <Route path='/statistics' element={<HomeAdmin />}>
                        <Route path='listbook' element={<ListBook />} />
                    </Route>
                    <Route path='*' element={<NotFound />} />
                </Routes>
            </AdminProvider>
        </AuthProvider>
    );
}



export default App
