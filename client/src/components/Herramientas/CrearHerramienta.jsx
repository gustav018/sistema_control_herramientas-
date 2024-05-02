import axios from "axios";
import SubMenu from "../SubMenu"
import { useState, useEffect } from "react";
import useForm from "../../hooks/useForm";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import useAxios from "../../hooks/useAxios";



const CrearHerramienta = () => {
  const [totalHerramientas, setTotalHerramientas] = useState(0);

  const { data: herramientasData, isLoading: isLoadingHerramientas } = useAxios("http://localhost:8000/api/herramienta");

  const navigate = useNavigate();
  const idUsuarioLogin = () => JSON.parse(localStorage.getItem('user'))?._id || '';
  const idUsuario = idUsuarioLogin();

  const initialValues = {
    identificacion: '',
    descripcion: '',
    calibradoPor: '',
    certificado: '',
    frecuencia: '',
    ultimaCalibracion: '',
    proximaCalibracion: '',
    colaboradorId: '',
    userId: idUsuario,
    observaciones: '',
  }
  const { values: herramienta, handleChange, clearData } = useForm(initialValues)
  const [error, setError] = useState("")

  useEffect(() => {
    if (herramienta.descripcion) {
      const identificacion = transformDescriptionToIdentificacion(herramienta.descripcion);
      handleChange({ target: { name: 'identificacion', value: identificacion } });
    }
    if (herramienta.ultimaCalibracion && herramienta.frecuencia) {
      const ultimaCalibracionDate = new Date(herramienta.ultimaCalibracion);
      const frecuenciaDays = calculateFrecuenciaInDays(herramienta.frecuencia);
      ultimaCalibracionDate.setDate(ultimaCalibracionDate.getDate() + frecuenciaDays);

      const proximaCalibracion = ultimaCalibracionDate.toISOString().split('T')[0];
      handleChange({ target: { name: 'proximaCalibracion', value: proximaCalibracion } });
    }
    if (!isLoadingHerramientas && herramientasData) {
      setTotalHerramientas(herramientasData.length);
    }
  }, [herramienta.descripcion, herramienta.ultimaCalibracion, herramienta.frecuencia, isLoadingHerramientas, herramientasData]);


  const transformDescriptionToIdentificacion = (description) => {
    const upperCaseDescription = description.toUpperCase();
    const words = upperCaseDescription.split(' ');
    const filteredWords = words.filter(word => word.length > 2);
    let identificacion = '';
    filteredWords.forEach((word, index) => {
      if (index < filteredWords.length - 1) {
        identificacion += word.charAt(0) + '';
      } else {
        identificacion += word.charAt(0);
      }

    });
    identificacion += `-TR-00${totalHerramientas}`;
    return identificacion;
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
            navigate('/sistema/herramientas/list');

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

  return (
    <>
      <SubMenu>
        <form onSubmit={handleSubmit}>
          <h2 className="h4 text-gray-900 mb-4">Crear herramienta</h2>
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
              <label htmlFor="frecuencia">Frecuencia</label>
              <select className="form-select form-control-user" id="frecuencia" name="frecuencia" onChange={handleChange} value={herramienta.frecuencia} required>
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
            <input type="text" className="form-control form-control-user" id="userId" placeholder="User Id" name="userId" value={herramienta.userId} onChange={handleChange} style={{ display: "none" }} required />
            <input type="text" className="form-control form-control-user" id="observaciones" placeholder="Observaciones" name="observaciones" value={herramienta.observaciones} onChange={handleChange} style={{ display: "none" }} />
          </div>
          <button type="submit" className="btn btn-primary btn-user btn-block">Registrar Herramienta</button>
        </form>
      </SubMenu>

    </>
  )
}

export default CrearHerramienta
