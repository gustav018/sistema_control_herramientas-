
import DeleteHerramienta from "../components/DeleteHerramienta";
import SubMenu from "../components/SubMenu";
import useAxios from "../hooks/useAxios";
import MUIDataTable from "mui-datatables";
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import { TableRow, TableCell, Collapse, Box, Typography, Table, TableHead, TableBody } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleRight } from '@fortawesome/free-solid-svg-icons';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'; // Importa el icono de info

import DashboardHerraminenta from "../components/Herramientas/DashboardHerraminenta";
import { Link } from "react-router-dom";

const ListarHerramienta = () => {
    const idUsuarioLogin = () => JSON.parse(localStorage.getItem('user'))?._id || '';
    const idUsuario = idUsuarioLogin();


    const { data, isLoading, error, setData } = useAxios(import.meta.env.VITE_API_URL + "/api/herramienta/user/" + idUsuario);


    if (error) {
        return <div>{error.message}</div>;
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const DeleteSuccessHerramienta = (herramientaId) => {
        setData(data.filter(herramienta => herramienta._id !== herramientaId));
    };

    const formatDate = (date) => {
        const d = new Date(date);
        const day = d.getUTCDate().toString().padStart(2, '0'); // Utiliza getUTCDate() para obtener el día del mes en UTC
        const month = (d.getUTCMonth() + 1).toString().padStart(2, '0'); // Utiliza getUTCMonth() para obtener el mes en UTC
        const year = d.getUTCFullYear(); // Utiliza getUTCFullYear() para obtener el año en UTC
        const fechaFormateada = `${day}/${month}/${year}`;
        return fechaFormateada;
    };




    const consultaVencimineto = (date) => {
        const fechaProximaCalibracion = new Date(date);
        const diferencia = fechaProximaCalibracion - new Date();
        const dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24));
        return Number(dias);
    };

    const consultaStatus = (date, observaciones) => {
        const diasVencimiento = consultaVencimineto(date);
        const texto = (diasVencimiento <= 0 && observaciones == "En Calibracion") ? 'En calibracion' : (diasVencimiento <= 0 ? 'Vencido' : 'Vigente');
        return (texto);
    };
    const formatoStatus = (status) => {
        const color = status === 'Vencido' ? 'error' : 'success';
        return (
            <Stack direction="row" spacing={1}>
                <Chip label={status} color={color} />
            </Stack>
        );
    };
    const formatoObservaciones = (observaciones, herramientaId) => {
        if (observaciones === "") {
            return (
                <Link to={`/sistema/herramientas/calibrar/${herramientaId}`}>
                    <Chip
                        label="Enviar a calibración"
                        color="primary" // Cambia el color del chip según tus preferencias
                        icon={<FontAwesomeIcon icon={faArrowAltCircleRight} />} // Agrega el icono a tu chip
                    />
                </Link>
            );
        } else if (observaciones === "En Calibracion") {
            return (
                <Link to={`/sistema/herramientas/certificado/${herramientaId}`}>
                    <Chip
                        label="Actualizar Certificado"
                        color="warning"

                        icon={<FontAwesomeIcon icon={faInfoCircle} />} // Agrega el mismo icono aquí si deseas mantenerlo consistente
                    />
                </Link>
            );
        } else {
            return null;
        }
    };



    const columns = [
        {
            name: "Identificacion",
            options: {
                filter: false,
                sort: true,

            },
        },
        {
            name: "Descripcion",
            options: {
                filter: false,
                sort: true,
            }

        },
        {
            name: "Ubicacion",
            options: {
                display: false,
                filter: false,
            }
        },
        {
            name: "Calibrado por",
            options: {
                display: false,
                filter: false,

            }
        },
        {
            name: "Fecha de Calibración",
            options: {
                display: false,
                sort: true,


            }
        },
        {
            name: "Proxima Calibración",
            options: {
            },
        },
        {
            name: "Dias para Vencimiento",
            options: {
                filter: false,
                sort: true,
                sortOrder: 'asc',

            },
        },
        {
            name: "Status",
            options: {
                filter: true,
                sort: true,
                sortOrder: 'asc',
                customBodyRender: (value) => formatoStatus(value),

            },
        },
        {
            name: "Observaciones",
            options: {
                filter: false,
            }
        },
        {
            name: "Responsable",
            options: {
                viewColumns: false,
                filter: false,
                display: false,

            }
        },
        {
            name: "Acciones",
            options: {
                filter: false,

            },
        },
    ];


    const datos = data
        .map((herramienta, index) => ({
            id: index,
            "Identificacion": herramienta.identificacion,
            "Descripcion": herramienta.descripcion,
            "Ubicacion": herramienta.userId.sucursal,
            "Calibrado por": herramienta.calibradoPor,
            "Fecha de Calibración": formatDate(herramienta.ultimaCalibracion),
            "Proxima Calibración": formatDate(herramienta.proximaCalibracion),
            "Dias para Vencimiento": consultaVencimineto(herramienta.proximaCalibracion),
            "Status": consultaStatus(herramienta.proximaCalibracion, herramienta.observaciones),
            "Observaciones": formatoObservaciones(herramienta.observaciones, herramienta._id),
            "Responsable": `${herramienta.colaboradorId.nombre} ${herramienta.colaboradorId.apellido}`,
            "Acciones": (
                <>

                    <Link to={`/sistema/herramientas/update/${herramienta._id}`} className="btn btn-outline-warning btn-sm me-3" title="Editar herramienta"><i className="fa fa-edit"></i></Link>
                    <DeleteHerramienta herramientaId={herramienta._id} identificacion={herramienta.identificacion} successCallback={DeleteSuccessHerramienta} />
                </>
            )
        }));

    const options = {
        filterType: 'checkbox',
        expandableRows: true,
        renderExpandableRow: (rowData) => {
            const colSpan = rowData.length + 1;
            return (
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={colSpan}>
                        <Collapse in={open} timeout="auto" unmountOnExit>

                            <Box sx={{ margin: 1 }}>
                                <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: 'bold' }}>
                                    Detalles
                                </Typography>
                                <Table size="small" aria-label="purchases">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Responsable</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Ubicacion</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Calibrado por</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Fecha de Calibración</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Proxima Calibración</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell component="th" scope="row">
                                                {rowData[9]}
                                            </TableCell>
                                            <TableCell>{rowData[2]}</TableCell>
                                            <TableCell>{rowData[3]}</TableCell>
                                            <TableCell>{rowData[4]}</TableCell>
                                            <TableCell>{rowData[5]}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            );
        },
        customSort: (data, colIndex, order) => {
            // Sort the data based on the "Status" column (index 7)
            if (colIndex === 7) {
                return data.sort((a, b) => {
                    if (order === 'asc') {
                        return a.data[colIndex].localeCompare(b.data[colIndex]);
                    } else {
                        return b.data[colIndex].localeCompare(a.data[colIndex]);
                    }
                });
            }
            return data;
        },
        sortOrder: {
            name: 'Status', // Sort by the "Status" column
            direction: 'asc', // Sort in ascending order
        },
        sort: true, // Enable sorting
    };

    return (
        <SubMenu>

            <DashboardHerraminenta />


            <hr />
            <MUIDataTable
                title={"Lista de Herramientas"}
                data={datos}
                columns={columns}
                options={options}
                searchable={true}
                key={row => row.id} // Adding the "key" prop here
            />

        </SubMenu>
    );
};

export default ListarHerramienta;
