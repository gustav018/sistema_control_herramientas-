import { Navigate, Route, Routes } from 'react-router-dom'

import CrearHerramienta from './components/Herramientas/CrearHerramienta'
import Contenedor from './components/Contenedor'
import LoginRegister from './views/LoginRegister'
import { useState } from 'react'
import UserContext from './context/UserContext'
import PublicRoute from './components/PublicRoute'
import PrivateRoute from './components/PrivateRoute'
import ReporteIso from './views/ReporteIso'
import Reporte from './components/Herramientas/Reporte'

import ListarHerramienta from './views/ListarHerramienta'
import ColaboradorForm from './components/Colaboradores/ColaboradorForm'
import ColaboradorList from './components/Colaboradores/ColaboradorList'
import ColaboradorFormUpdate from './components/Colaboradores/ColaboradorFormUpdate'
import HerramientasFormUpdate from './components/Herramientas/HerramientasFormUpdate'
import ListarHerramientasVencidas from './components/Herramientas/ListarHerramientasVencidas'
import './index.css'
import EstadoCalibracion from './components/Herramientas/EstadoCalibracion'
import ActualizarCertificado from './components/Herramientas/ActualizarCertificado'
import ForgotPassword from './views/ForgotPassword'
import ResetPassword from './views/ResetPassword'
const App = () => {

    const userDetails = JSON.parse(localStorage.getItem("user"));
    const userInfo = userDetails ? userDetails : null;
    const [user, setUser] = useState(userInfo)

    const setUserKeyValue = (clave, valor) => {
        setUser({ ...user, [clave]: valor })
    }

    const objetoContexto = {
        user,
        setUser,
        setUserKeyValue
    }

    return (
        <UserContext.Provider value={objetoContexto}>
            <Routes>
                <Route path="/" element={<Navigate to="/sistema/herramientas/list" />} />
                <Route path="/login" element={
                    <PublicRoute>
                        <LoginRegister />
                    </PublicRoute>
                } />
                <Route path="/recovery" element={
                    <PublicRoute>
                        <ForgotPassword/>
                    </PublicRoute>
                } />
                <Route path="/resetPassword/:token" element={
                    <PublicRoute>
                        <ResetPassword/>
                    </PublicRoute>
                } />
                <Route path="/sistema/" element={
                    <PrivateRoute>
                        <Contenedor />
                    </PrivateRoute>
                }>
                    {/* Ruta Herramientas */}


                    <Route path="herramientas/list" element={<ListarHerramienta />} />
                    <Route path="pdf" element={<ReporteIso />} />
                    <Route path="herramientas/reporte" element={<Reporte />} />
                    <Route path="herramientas/nuevo" element={<CrearHerramienta />} />
                    <Route path="herramientas/vencidas" element={<ListarHerramientasVencidas />} />
                    <Route path="herramientas/update/:id" element={<HerramientasFormUpdate />} />                    {/* Fin ruta herramientas */}
                    <Route path="herramientas/calibrar/:id" element={<EstadoCalibracion />} />
                    <Route path="herramientas/certificado/:id" element={<ActualizarCertificado />} />
                    {/* Ruta Colaboradores */}
                    <Route path="colaboradores/nuevo" element={<ColaboradorForm />} />
                    <Route path="colaboradores/list" element={<ColaboradorList />} />
                    <Route path='colaboradores/update/:id' element={<ColaboradorFormUpdate />} />
                    {/* Fin ruta Colaboradores */}
                </Route>
            </Routes>
        </UserContext.Provider>
    )
}

export default App