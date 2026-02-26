import { useEffect, useState } from "react"
import useForm from "../../hooks/useForm";
import axios from "axios"
import Swal from 'sweetalert2'
import { Link, useNavigate, useParams } from "react-router-dom"


const ColaboradorFormUpdate = () => {
    {/* nombre, apellido, cedula, email, celular */ }
    const { id } = useParams();
    const navegate = useNavigate()

    const initialValues = {
        nombre: 'Cargando..',
        apellido: 'Cargando..',
        cedula: 'Cargando..',
        email: 'Cargando..',
        celular: 'Cargando..'
    }

    const { values: colaborador, handleChange, setValues } = useForm(initialValues)

    useEffect(() => {
        axios.get(`https://sistemacontrolherramientas-production.up.railway.app/api/colaborador/${id}`, { withCredentials: true }) // Agregar esta linea para enviar las cookies en el request
            .then(res => {
                console.log(res.data.colaborador)
                setValues({

                    nombre: res.data.colaborador.nombre,
                    apellido: res.data.colaborador.apellido,
                    cedula: res.data.colaborador.cedula,
                    email: res.data.colaborador.email,
                    celular: res.data.colaborador.celular
                })
            })
            .catch(err => console.log(err))
    }, [id, setValues]);



    const [error, setError] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.put(`https://sistemacontrolherramientas-production.up.railway.app/api/colaborador/${id}`, colaborador, { withCredentials: true })
            .then(res => {
                console.log(res.data.colaborador)
                Swal.fire({
                    icon: "success",
                    title: "Actualizado!",
                    text: "Actualizaste un colaborador!!",
                });
                navegate("/sistema/colaboradores/list")

            })
            .catch(err => {
                console.log(err)
                setError(err.response.data.error.message)
            })
    }

    return (
        <form onSubmit={handleSubmit} style={{ margin: "20px" }} className="user">
            <h5 className="text-gray-900 mb-4">Actualizar Colaborador</h5>

            <div className="text-danger">{error}</div>
            <div className="form-group row">
                <div className="col-sm-6 mb-3 mb-sm-0">
                    <input type="text" className="form-control" name="nombre" value={colaborador.nombre} onChange={handleChange} placeholder="Nombre" required minLength={3} />
                </div>
                <div className="col-sm-6">
                    <input type="text" className="form-control " name="apellido" value={colaborador.apellido} onChange={handleChange} placeholder="Apellido" required minLength={3} />
                </div>
            </div>
            <div className="form-group row">
                <div className="col-sm-6 mb-3 mb-sm-0">
                    <input type="text" className="form-control " name="cedula" value={colaborador.cedula} onChange={handleChange} placeholder="Cedula" required minLength={3} />
                </div>
                <div className="col-sm-6">
                    <input type="email" className="form-control " name="email" value={colaborador.email} onChange={handleChange} placeholder="Email" required minLength={3} />
                </div>
            </div>
            <div className="form-group row">
                <div className="col-sm-6 mb-3 mb-sm-0">
                    <input type="tel" className="form-control " name="celular" value={colaborador.celular} onChange={handleChange} placeholder="Celular" required minLength={3} />
                </div>
            </div>
            <div className="form-group row justify-content-center">
                <div className="col-sm-6 mb-3 mb-sm-0 text-center">
                    <button type="submit" className="btn btn-primary  mr-3">Actualizar Colaborador</button>
                    <Link to="/sistema/colaboradores/list" className="btn btn-danger">Cancelar - Volver</Link>
                </div>
            </div>

        </form>
    )
}

export default ColaboradorFormUpdate