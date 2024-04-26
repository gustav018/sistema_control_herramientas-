import axios from "axios";
import SubMenu from "../SubMenu"
import { useState, useEffect } from "react";
import useForm from "../../hooks/useForm";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import useAxios from "../../hooks/useAxios";



const HerramientasFormUpdate = () => {
    const { id } = useParams();


    const { data: herramientasData, isLoading: isLoadingHerramientas } = useAxios("http://localhost:8000/api/herramienta");

    const navigate = useNavigate();



    const initialValues = {
        identificacion: '',
        descripcion: '',
        calibradoPor: '',
        certificado: '',
        frecuencia: '',
        ultimaCalibracion: '',
        proximaCalibracion: '',
        colaboradorId: '',

    }
    const { values: herramienta, handleChange, setValues } = useForm(initialValues)

    const [error, setError] = useState("")

    useEffect(() => {

        if (herramienta.ultimaCalibracion && herramienta.frecuencia) {
            const ultimaCalibracionDate = new Date(herramienta.ultimaCalibracion);
            const frecuenciaDays = calculateFrecuenciaInDays(herramienta.frecuencia);
            ultimaCalibracionDate.setDate(ultimaCalibracionDate.getDate() + frecuenciaDays);

            const proximaCalibracion = ultimaCalibracionDate.toISOString().split('T')[0];
            handleChange({ target: { name: 'proximaCalibracion', value: proximaCalibracion } });
        }

        axios.get(`http://localhost:8000/api/herramienta/${id}`, { withCredentials: true }) // Agregar esta linea para enviar las cookies en el request
            .then(res => {
                console.log(res.data.herramienta)
                setValues({
                    identificacion: res.data.herramienta.identificacion,
                    descripcion: res.data.herramienta.descripcion,
                    calibradoPor: res.data.herramienta.calibradoPor,
                    certificado: res.data.herramienta.certificado,
                    frecuencia: res.data.herramienta.frecuencia,
                    ultimaCalibracion: formatDate(res.data.herramienta.ultimaCalibracion),
                    proximaCalibracion: formatDate(res.data.herramienta.proximaCalibracion),
                    colaboradorId: res.data.herramienta.colaboradorId._id,
                    userId: res.data.herramienta.userId
                })
            })
            .catch(err => console.log(err))
    }, [isLoadingHerramientas, herramientasData, id, setValues]);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const dateObject = new Date(dateString);
        const year = dateObject.getFullYear();
        let month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
        let day = dateObject.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };



    const calculateFrecuenciaInDays = (frecuencia) => {
        switch (frecuencia) {
            case 'diario':
                return 1;
            case 'semanal':
                return 7;
            case 'quincenal':
                return 15;
            case 'mensual':
                return 30;
            case 'trimestral':
                return 90;
            case 'semestral':
                return 180;
            case 'anual':
                return 365;
            case 'anio_y_medio':
                return ((365 / 2) + 365);
            default:
                return 0;
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.put(`http://localhost:8000/api/herramienta/${id}`, herramienta, { withCredentials: true })
            .then(res => {
                console.log(res.data.herramienta)
                Swal.fire({
                    icon: "success",
                    title: "Actualizado!",
                    text: "Actualizaste una herramienta!!",
                });
                navigate("/sistema/herramientas/list")

            })
            .catch(err => {
                console.log(err)
                setError(err.response.data.error.message)
            })
    }
    const { data, isLoading } = useAxios("http://localhost:8000/api/colaborador");

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <SubMenu>
                <form onSubmit={handleSubmit}>
                    <h2 className="h4 text-gray-900 mb-4">Actualizar herramienta</h2>
                    <div className="text-danger">{error}</div>
                    <div className="form-group row">
                        <div className="col-sm-6 mb-3 mb-sm-0">
                            <label htmlFor="descripcion">Descripción</label>
                            <input type="text" className="form-control form-control-user" id="descripcion" placeholder="Descripción" name="descripcion" value={herramienta.descripcion} onChange={handleChange} required minLength={3} />
                        </div>
                        <div className="col-sm-6">
                            <label htmlFor="identificacion">Identificación</label>
                            <input type="text" className="form-control form-control-user" id="identificacion" placeholder="Identificación" name="identificacion" value={herramienta.identificacion} onChange={handleChange} required minLength={3} />
                        </div>

                    </div>

                    <div className="form-group row">
                        <div className="col-sm-6 mb-3 mb-sm-0">
                            <label htmlFor="calibradoPor">Calibrado Por</label>
                            <input type="text" className="form-control form-control-user" id="calibradoPor" placeholder="Calibrado Por" name="calibradoPor" value={herramienta.calibradoPor} onChange={handleChange} required minLength={3} />
                        </div>
                        <div className="col-sm-6">
                            <label htmlFor="certificado">Certificado</label>
                            <input type="text" className="form-control form-control-user" id="certificado" placeholder="Certificado" name="certificado" value={herramienta.certificado} onChange={handleChange} required minLength={3} />
                        </div>
                    </div>
                    <div className="form-group row">

                        <div className="col-sm-6 mb-3 mb-sm-0">
                            <label htmlFor="frecuencia">Frecuencia {herramienta.frecuencia}</label>
                            <select className="form-select form-control-user" id="frecuencia" name="frecuencia" value={herramienta.frecuencia} onChange={handleChange} required>
                                <option value="">Selecciona una opción</option>
                                <option value="diario">Diario</option>
                                <option value="semanal">Semanal</option>
                                <option value="quincenal">Quincenal</option>
                                <option value="mensual">Mensual</option>
                                <option value="trimestral">Trimestral</option>
                                <option value="semestral">Semestral</option>
                                <option value="anual">Anual</option>
                                <option value="anio_y_medio">Año y medio</option>
                            </select>
                        </div>
                        <div className="col-sm-6">
                            <label htmlFor="colaboradorId"> Colaborador </label>

                            <select className="form-select form-control-user" id="colaboradorId" style={{ width: "93%" }} name="colaboradorId" value={herramienta.colaboradorId} onChange={handleChange} required>
                                <option value="">Selecciona una opción</option>
                                {data.map(colaborador => (
                                    <option key={colaborador._id} value={colaborador._id}>
                                        {`${colaborador.nombre} ${colaborador.apellido}`}
                                    </option>
                                ))}
                            </select>

                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-sm-6">
                            <label htmlFor="ultimaCalibracion"> Ultima Calibración </label>
                            <input type="date" className="form-control form-control-user" id="ultimaCalibracion" placeholder="Fecha de Ultima Calibración" name="ultimaCalibracion" value={herramienta.ultimaCalibracion} onChange={handleChange} required />

                        </div>

                        <div className="col-sm-6">
                            <label htmlFor="proximaCalibracion"> Proximo Calibración </label>
                            <input type="date" className="form-control " id="proximaCalibracion" placeholder="Fecha de Proximo Calibración" name="proximaCalibracion" value={herramienta.proximaCalibracion} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="form-group">


                    </div>
                    
                    <div className="form-group row justify-content-center">
                        <div className="col-sm-6 mb-3 mb-sm-0 text-center">
                            <button type="submit" className="btn btn-primary  mr-3">Actualizar Herramienta</button>
                            <Link to="/sistema/herramientas/list" className="btn btn-danger">Cancelar - Volver</Link>
                        </div>
                    </div>
                </form>


            </SubMenu>

        </>
    )
}

export default HerramientasFormUpdate
