import { Navigate, Route, Routes } from 'react-router-dom'
import ListPlayers from './views/ListPlayers'
import StatusGame from './views/StatusGame'
import AddPlayer from './views/AddPlayer'
import CrearHerramienta from './views/CrearHerramienta'
import Contenedor from './components/Contenedor'
import LoginRegister from './views/LoginRegister'
import { useState } from 'react'
import UserContext from './context/UserContext'
import PublicRoute from './components/PublicRoute'
import PrivateRoute from './components/PrivateRoute'

import Listar from './views/Listar'
import ReporteIso from './views/ReporteIso'
import Reporte from './views/Reporte'

import ListarHerramienta from './views/ListarHerramienta'

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
                    <Route path="lista" element={<ListPlayers />} />
                    <Route path="listar" element={<Listar />} />
                    <Route path="list" element={<ListarHerramienta />} />
                    <Route path="pdf" element={<ReporteIso />} />
                    <Route path="reporte" element={<Reporte />} />
                    <Route path="nuevo" element={<CrearHerramienta />} />
                    <Route path="addplayer" element={<AddPlayer />} />
                    <Route path="status/:game" element={<StatusGame />} />
                </Route>
            </Routes>
        </UserContext.Provider>
    )
}

export default App