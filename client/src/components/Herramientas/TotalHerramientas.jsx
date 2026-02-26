/// total herramientas por usuario
import { useState, useEffect } from "react";
import useAxios from "../../hooks/useAxios";

const TotalHerramientas = () => {

    const [totalHerramientas, setTotalHerramientas] = useState(0);

    const idUsuarioLogin = () => JSON.parse(localStorage.getItem('user'))?._id || '';
    const idUsuario = idUsuarioLogin();


    const { data, isLoading, error, } = useAxios(import.meta.env.VITE_API_URL + "/api/herramienta/user/" + idUsuario);

    useEffect(() => {
        if (data) {
            setTotalHerramientas(data.length);
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
            Total de Herramientas: {totalHerramientas}
        </div>
    );
};

export default TotalHerramientas;
