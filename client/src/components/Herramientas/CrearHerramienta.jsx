import axios from "axios";
import SubMenu from "../SubMenu"
import { useState } from "react";
import useForm from "../../hooks/useForm";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import useAxios from "../../hooks/useAxios";
import ColaboradorSelect from "../Colaboradores/ColaboradorSelect";


const CrearHerramienta = () => {

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
    userId: ''
  }
  const { values: herramienta, handleChange, clearData } = useForm(initialValues)
  const [error, setError] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    axios.post('http://localhost:8000/api/herramienta', herramienta)
      .then(res => {
        console.log(res.data.herramienta)

        clearData()
        Swal.fire({
          icon: "success",
          title: "Genial!",
          text: "Agregaste una herramienta!!",
          showCancelButton: true,
          confirmButtonText: 'Ir a la lista de herramientas',
          cancelButtonText: 'Crear otra herramienta',
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/sistema/list');

          }
        });
        setError("")
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
  const idUsuarioLogin = () => JSON.parse(localStorage.getItem('user'))?._id || '';
    const idUsuario = idUsuarioLogin();
  return (
    <>
      <SubMenu>
        <form onSubmit={handleSubmit}>
          <h2 className="h4 text-gray-900 mb-4">Crear herramienta</h2>
          <div className="text-danger">{error}</div>
          <div className="form-group row">
            <div className="col-sm-6 mb-3 mb-sm-0">
              <input type="text" className="form-control form-control-user" id="identificacion" placeholder="Identificación" name="identificacion" value={herramienta.identificacion} onChange={handleChange} required minLength={3} />
            </div>
            <div className="col-sm-6">
              <input type="text" className="form-control form-control-user" id="descripcion" placeholder="Descripción" name="descripcion" value={herramienta.descripcion} onChange={handleChange} required minLength={3} />
            </div>
          </div>

          <div className="form-group row">
            <div className="col-sm-6 mb-3 mb-sm-0">
              <input type="text" className="form-control form-control-user" id="calibradoPor" placeholder="Calibrado Por" name="calibradoPor" value={herramienta.calibradoPor} onChange={handleChange} required minLength={3} />
            </div>
            <div className="col-sm-6">
              <input type="text" className="form-control form-control-user" id="certificado" placeholder="Certificado" name="certificado" value={herramienta.certificado} onChange={handleChange} required minLength={3} />
            </div>
          </div>
          <div className="form-group row">
            <div className="col-sm-6 mb-3 mb-sm-0">
              <label htmlFor="frecuencia">Frecuencia</label>
              <select className="form-select form-control-user" id="frecuencia" style={{ width: "93%" }} name="frecuencia" value={herramienta.frecuencia} onChange={handleChange} required>
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
              <label htmlFor="ultimaCalibracion"> colaboradorId </label>

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

            <input type="text" className="form-control form-control-user" id="userId" placeholder="User Id" name="userId" value={idUsuario} onChange={handleChange} required disabled/>
          </div>
          <button type="submit" className="btn btn-primary btn-user btn-block">Registrar Herramienta</button>
          <ColaboradorSelect />
        </form>


      </SubMenu>

    </>
  )
}

export default CrearHerramienta