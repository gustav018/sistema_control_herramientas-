import { useState, useEffect } from "react";

import useAxios from "../../hooks/useAxios";

const HerramientasVencidas = () => {
    const idUsuarioLogin = () => JSON.parse(localStorage.getItem('user'))?._id || '';
    const idUsuario = idUsuarioLogin();
    const [totalHerramientasVencidas, setTotalHerramientasVencidas] = useState(0);

    const { data, isLoading, error } = useAxios(import.meta.env.VITE_API_URL + "/api/herramienta/user/" + idUsuario);

    useEffect(() => {
        if (data) {
            const herramientasVencidas = data.filter(herramienta => {
                const proximaCalibracion = new Date(herramienta.proximaCalibracion);
                const hoy = new Date();
                return proximaCalibracion < hoy;
            });
            setTotalHerramientasVencidas(herramientasVencidas.length);
        }
    }, [data]);

    if (error) {
        return <div>{error.message}</div>;
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            {totalHerramientasVencidas}
        </>


    );
};

export default HerramientasVencidas;
