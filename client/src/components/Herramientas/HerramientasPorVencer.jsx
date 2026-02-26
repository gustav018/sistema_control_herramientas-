import { useState, useEffect } from "react";
import useAxios from "../../hooks/useAxios";

const HerramientasPorVencer = () => {
    const idUsuarioLogin = () => JSON.parse(localStorage.getItem('user'))?._id || '';
    const idUsuario = idUsuarioLogin();
    const [herramientasPorVencer, setHerramientasPorVencer] = useState([]);

    const { data, isLoading, error } = useAxios(import.meta.env.VITE_API_URL + "/api/herramienta/user/" + idUsuario);

    useEffect(() => {
        if (data) {
            const herramientasFiltradas = data.filter(herramienta => {
                const proximaCalibracion = new Date(herramienta.proximaCalibracion);
                const hoy = new Date();
                const diasRestantes = Math.ceil((proximaCalibracion - hoy) / (1000 * 60 * 60 * 24));
                return diasRestantes <= 30 && diasRestantes >= 0;
            });
            setHerramientasPorVencer(herramientasFiltradas);
        }
    }, [data]);

    if (error) {
        return <div>{error.message}</div>;
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="text-gray-800">
            Herramientas a vencer en los próximos 30 días: {herramientasPorVencer.length}
        </div>
    );
};

export default HerramientasPorVencer;
