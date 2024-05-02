import MUIDataTable from "mui-datatables";
import SubMenu from "../SubMenu";
import DeleteColaborador from "./DeleteColaborador";
import useAxios from "../../hooks/useAxios";
import { Link } from "react-router-dom";



const ColaboradorList = () => {
    {/* nombre, apellido, cedula, email, celular */ }
    const { data, isLoading, error, setData } = useAxios("http://localhost:8000/api/colaborador");

    if (error) {
        return <div>{error.message}</div>;
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const DeleteSuccessColaborador = (colaboradorId) => {
        setData(data.filter(colaborador => colaborador._id !== colaboradorId));
    };

    const columns = [
        {
            name: "Nombre",
            options: {
                filter: true,
                sort: true,
            }
        },
        {
            name: "Apellido",
        },
        {
            name: "Cedula",

        },
        {
            name: "Email",
        },
        {
            name: "Celular",
        },

        {
            name: "Acciones",
            options: {
                filter: false,
                sort: false,
            }
        },
    ];


    const datos = data.map((colaborador, index) => ({
        id: index,
        "Nombre": colaborador.nombre,
        "Apellido": colaborador.apellido,
        "Cedula": colaborador.cedula,
        "Email": colaborador.email,
        "Celular": colaborador.celular,
        "Acciones": (
            <>
                <Link to={`/sistema/colaboradores/update/${colaborador._id}`} className="btn btn-outline-warning btn-sm me-3"><i className="fa fa-edit"></i></Link>
                <DeleteColaborador colaboradorId={colaborador._id} identificacion={`${colaborador.nombre} ${colaborador.apellido}`} successCallback={DeleteSuccessColaborador} />
            </>
        )
    }));


    const options = {

    };
    return (
        <>
            <SubMenu >


                <MUIDataTable
                    title={"Lista de Colaboradores"}
                    data={datos}
                    columns={columns}
                    options={options}
                    searchable={true}
                />
            </SubMenu>

        </>
    )
}

export default ColaboradorList