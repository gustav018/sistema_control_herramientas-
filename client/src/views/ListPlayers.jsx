import React, { useState } from 'react';
import DeleteHerramienta from "../components/DeleteHerramienta";
import SubMenu from "../components/SubMenu";
import useAxios from "../hooks/useAxios";
import DataTable from "react-data-table-component";

const ListPlayers = () => {
    const { data, isLoading, error, setData } = useAxios("http://localhost:8000/api/herramienta");

    const [filterText, setFilterText] = useState('');

    const handleFilterChange = (e) => {
        setFilterText(e.target.value);
    };

    if (error) {
        return <div>{error.message}</div>;
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const DeleteSuccessHerramienta = (herramientaId) => {
        setData(data.filter(herramienta => herramienta._id !== herramientaId));
    };

    const filteredData = data.filter(
        herramienta => herramienta.identificacion.toLowerCase().includes(filterText.toLowerCase())
    );

    const formatDate = (date) => {
        const d = new Date(date);
        const day = d.getDate().toString().padStart(2, '0');
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    };
    const consultaVencimineto = (date) => {
        const fechaProximaCalibracion = new Date(date);
        const diferencia = fechaProximaCalibracion - new Date();
        const dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24));
        
        return dias;
    }

    const columns = [
        {
            name: "Identificacion",
            selector: (row) => row.identificacion,
        },
        {
            name: "Descripcion",
            selector: (row) => row.descripcion,
        },
        {
            name: "Ubicacion",
            selector: (row) => row.ubicacion,
        },
        {
            name: "Calibrado por",
            selector: (row) => row.calibradoPor,
        },
        {
            name: "Fecha de Calibración",
            selector: (row) => formatDate(row.ultimaCalibracion),
        },
        {
            name: "Proxima Calibración",
            selector: (row) => formatDate(row.proximaCalibracion),
        },
        {
            name: "Dias para Vencimiento",
            selector: (row) => consultaVencimineto(row.proximaCalibracion),
        },
        {
            name: "Status",
            selector: (row) => {
                const diasVencimiento = consultaVencimineto(row.proximaCalibracion)
                const color = diasVencimiento < 0 ? 'red' : 'green';
                const texto = diasVencimiento < 0 ? 'Vencido' : 'Vigente';
                return <span style={{ color }}>{texto}</span>;
                
            },
        },
        {
            name: "Responsable",
            selector: (row) => row.colaboradorId,
        },
        {
            name: "Acciones",
            cell: (row) => <DeleteHerramienta herramientaId={row._id} identificacion={row.identificacion} successCallback={DeleteSuccessHerramienta} />
        }
    ];

    return (
        <SubMenu>
            <DataTable
                title="Lista de Herramientas"
                columns={columns}
                data={filteredData}
                progressPending={isLoading}
                progressComponent={<div>Loading...</div>}
                pagination
                paginationPerPage={5}
                persistTableHead
                subHeader
                subHeaderComponent={<FilterComponent filterText={filterText} onFilter={handleFilterChange} />}
                searchPlaceholder="Buscar..."
            />
        </SubMenu>
    );
};

const FilterComponent = ({ filterText, onFilter }) => (
    <input
        className='form-control'
        type="text"
        placeholder="Filtrar por identificación"
        value={filterText}
        onChange={onFilter}
    />
);

export default ListPlayers;

