import { useState } from "react"

import axios from "axios"
import Swal from 'sweetalert2'
import PropTypes from 'prop-types';
import useForm from "../../hooks/useForm";
import { useNavigate } from "react-router-dom";


const ColaboradorForm = () => {
    const navigate = useNavigate();
{/* nombre, apellido, cedula, email, celular */}
    const initialValues = {
        nombre:'',
        apellido: '',
        cedula: "",
        email: "",
        celular: ""
    }
    const {values: colaborador, handleChange, clearData} = useForm(initialValues)
    const [error, setError] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post('http://localhost:8000/api/colaborador', colaborador)
            .then(res => {
                console.log(res.data.colaborador)

                clearData()
                Swal.fire({
                    icon: "success",
                    title: "Genial!",
                    text: "Agregaste un colaborador!!",
                    showCancelButton: true,
                    confirmButtonText: 'Ir a la lista de colaboradores',
                    cancelButtonText: 'Crear otro colaborador',
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate('/sistema/colaboradores/list');

                    }
                });
                setError("")
            })
            .catch(err => {
                console.log(err)
                setError(err.response.data.error.message)
            })
    }

    return (
        <form className="user" onSubmit={handleSubmit} style={{ margin: "20px" }}>
            <h5 className="text-gray-900 mb-4">Registrar Colaborador</h5>
            <div className="text-danger">{error}</div>
            <div className="form-group row">
                <div className="col-sm-6 mb-3 mb-sm-0">
                    <input type="text" className="form-control form-control-user" name="nombre" value={colaborador.nombre} onChange={handleChange} placeholder="Nombre" required minLength={3} />
                </div>
                <div className="col-sm-6">
                    <input type="text" className="form-control form-control-user" name="apellido" value={colaborador.apellido} onChange={handleChange} placeholder="Apellido" required minLength={3} />
                </div>
            </div>
            <div className="form-group row">
                <div className="col-sm-6 mb-3 mb-sm-0">
                    <input type="text" className="form-control form-control-user" name="cedula" value={colaborador.cedula} onChange={handleChange} placeholder="Cedula" required minLength={3} />
                </div>
                <div className="col-sm-6">
                    <input type="email" className="form-control form-control-user" name="email" value={colaborador.email} onChange={handleChange} placeholder="Email" required minLength={3} />
                </div>
            </div>
            <div className="form-group row">
                <div className="col-sm-6 mb-3 mb-sm-0">
                    <input type="tel" className="form-control form-control-user" name="celular" value={colaborador.celular} onChange={handleChange} placeholder="Celular" required minLength={3} />
                </div>
            </div>
            <button type="submit" className="btn btn-primary btn-user btn-block">Registrar Colaborador</button>
        </form>
    )
}

ColaboradorForm.propTypes = {
    updateColaboradors: PropTypes.func
}

export default ColaboradorForm