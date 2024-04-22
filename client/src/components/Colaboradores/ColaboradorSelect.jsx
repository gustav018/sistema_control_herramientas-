import { useState, useEffect } from 'react';
import SelectSearch from 'react-select-search';
import useAxios from "../../hooks/useAxios";

const ColaboradorSelect = () => {
    const { data, isLoading, error } = useAxios("http://localhost:8000/api/colaborador");
    const [selectedColaborador, setSelectedColaborador] = useState('');

    useEffect(() => {
        // Llama a tu lógica de selección aquí después de que cambie el colaborador seleccionado
        console.log("Colaborador seleccionado:", selectedColaborador);
    }, [selectedColaborador]);

    if (error) {
        return <div>{error.message}</div>;
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    // Convertir datos de colaboradores a formato requerido por react-select-search
    const options = [
        {name: 'Swedish', value: 'sv'},
        {name: 'English', value: 'en'},
        {
            type: 'group',
            name: 'Group name',
            items: [
                {name: 'Spanish', value: 'es'},
            ]
        },
    ];

    return (
        <div className="mb-3">
            holña
            </div>

    );
}

export default ColaboradorSelect;

