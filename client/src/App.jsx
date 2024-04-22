import { Navigate, Route, Routes } from 'react-router-dom'
import ListPlayers from './views/ListPlayers'
import CrearHerramienta from './components/Herramientas/CrearHerramienta'
import Contenedor from './components/Contenedor'
import LoginRegister from './views/LoginRegister'
import { useState } from 'react'
import UserContext from './context/UserContext'
import PublicRoute from './components/PublicRoute'
import PrivateRoute from './components/PrivateRoute'

import Listar from './views/Listar'
import ReporteIso from './views/ReporteIso'
import Reporte from './components/Herramientas/Reporte'

import ListarHerramienta from './views/ListarHerramienta'
import ColaboradorForm from './components/Colaboradores/ColaboradorForm'
import ColaboradorList from './components/Colaboradores/ColaboradorList'
import ColaboradorFormUpdate from './components/Colaboradores/ColaboradorFormUpdate'
import HerramientasFormUpdate from './components/Herramientas/HerramientasFormUpdate'

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
                <Route path="/" element={<Navigate to="/sistema/list" />} />
                <Route path="/login" element={
                    <PublicRoute>
                        <LoginRegister />
                    </PublicRoute>
                } />
                <Route path="/sistema/" element={
                    <PrivateRoute>
                        <Contenedor />
                    </PrivateRoute>
                }>
                     {/* Ruta Herramientas */}
                    <Route path="lista" element={<ListPlayers />} />
                    <Route path="listar" element={<Listar />} />
                    <Route path="herramientas/list" element={<ListarHerramienta />} />
                    <Route path="pdf" element={<ReporteIso />} />
                    <Route path="herramientas/reporte" element={<Reporte />} />
                    <Route path="herramientas/nuevo" element={<CrearHerramienta />} />
                    <Route path="herramientas/update/:id" element={<HerramientasFormUpdate />} />
                      {/* Fin ruta herramientas */}
                 
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