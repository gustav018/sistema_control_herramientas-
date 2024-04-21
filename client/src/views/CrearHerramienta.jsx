import SubMenu from "../components/SubMenu"


const CrearHerramienta = () => {
  return (
    <>
    <SubMenu>
<form className="user">
  <div className="form-group row">
    <div className="col-sm-6 mb-3 mb-sm-0">
      <input type="text" className="form-control form-control-user" id="identificacion" placeholder="Identificación" required minLength={3} />
    </div>
    <div className="col-sm-6">
      <input type="text" className="form-control form-control-user" id="descripcion" placeholder="Descripción" required minLength={3} defaultValue={""} />
    </div>
  </div>
  <div className="form-group">
    <input type="text" className="form-control form-control-user" id="ubicacion" placeholder="Ubicación" required minLength={3} />
  </div>
  <div className="form-group row">
    <div className="col-sm-6 mb-3 mb-sm-0">
      <input type="text" className="form-control form-control-user" id="calibradoPor" placeholder="Calibrado Por" required minLength={3} />
    </div>
    <div className="col-sm-6">
      <input type="text" className="form-control form-control-user" id="certificado" placeholder="Certificado" required minLength={3} />
    </div>
  </div>
  <div className="form-group">
    <input type="number" className="form-control form-control-user" id="frecuencia" placeholder="Frecuencia" required min={1} />
  </div>
  <div className="form-group">
    <input type="date" className="form-control form-control-user" id="ultimaCalibracion" placeholder="Fecha de Ultima Calibración" required />
  </div>
  <button type="submit" className="btn btn-primary btn-user btn-block">Registrar Herramienta</button>
</form>

   
    </SubMenu>
    
    </>
  )
}

export default CrearHerramienta