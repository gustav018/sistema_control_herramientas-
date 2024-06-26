
import { Link, NavLink } from "react-router-dom";
const Aside = () => {
    return (
        <>
            <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
                {/* Sidebar - Brand */}
                <Link className="sidebar-brand d-flex align-items-center justify-content-center" to="/sistema/herramientas/list">
                    <div className="sidebar-brand-icon rotate-n-15">

                    </div>
                    <div className="sidebar-brand-text mx-3">Control de herramientas</div>
                </Link>
                {/* Divider */}
                <hr className="sidebar-divider my-0" />
                {/* Nav Item - Dashboard */}
                <li className="nav-item">

                    <Link className="nav-link" to="/sistema/herramientas/list">
                        <i className="fas fa-fw fa-tachometer-alt" />
                        <span>Dashboard</span></Link>
                </li>
                {/* Divider */}
                <hr className="sidebar-divider" />
                {/* Heading */}
                <div className="sidebar-heading">
                    Control
                </div>
                {/* Nav Item - Pages Collapse Menu */}
                <li className="nav-item ">
                    <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                        <i className="fas fa-fw fa-cog" />
                        <span>Herramientas</span>
                    </a>
                    <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
                        <div className="bg-white py-2 collapse-inner rounded">
                            <h6 className="collapse-header">Opciones:</h6>

                            <Link to="/sistema/herramientas/nuevo" className="collapse-item" >Crear herramienta</Link>
                            <Link to="/sistema/herramientas/list" className="collapse-item" >Lista de herramientas</Link>
                            <Link to="/sistema/herramientas/vencidas" className="collapse-item" >Calibraciones</Link>
                        </div>
                    </div>
                </li>

                {/* Nav Item - Colaboradores Collapse Menu */}
                <li className="nav-item">
                    <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseColaborador" aria-expanded="false" aria-controls="collapseColaborador">
                        <i className="fas fa-fw fa-users" />
                        <span>Colaboradores</span>
                    </a>
                    <div id="collapseColaborador" className="collapse" aria-labelledby="headingColaborador" data-parent="#accordionSidebar">
                        <div className="bg-white py-2 collapse-inner rounded">
                            <h6 className="collapse-header">Opciones:</h6>

                            <Link to="/sistema/colaboradores/list" className="collapse-item" >Lista de colaboradores</Link>
                            <Link to="/sistema/colaboradores/nuevo" className="collapse-item" >Crear colaborador</Link>
                        </div>
                    </div>
                </li>

                {/* Nav Item - Utilities Collapse Menu */}

                {/* Divider */}
                <hr className="sidebar-divider" />
                {/* Heading */}
                <div className="sidebar-heading">
                    Reportes
                </div>
                {/* Nav Item - Pages Collapse Menu */}
                <li className="nav-item active">
                    <a className="nav-link" href="#" data-toggle="collapse" data-target="#collapsePages" aria-expanded="true" aria-controls="collapsePages">
                        <i className="fas fa-fw fa-folder" />
                        <span>Reportes</span>
                    </a>
                    <div id="collapsePages" className="collapse show" aria-labelledby="headingPages" data-parent="#accordionSidebar">
                        <div className="bg-white py-2 collapse-inner rounded">
                            <NavLink to="/sistema/herramientas/reporte" className="collapse-item" >Reporte Formato ISO</NavLink>


                        </div>
                    </div>
                </li>
                {/* Nav Item - Charts */}

                {/* Divider */}
                <hr className="sidebar-divider d-none d-md-block" />
                {/* Sidebar Toggler (Sidebar) */}
                <div className="text-center d-none d-md-inline">
                    <button className="rounded-circle border-0" id="sidebarToggle" />
                </div>
            </ul>

        </>
    )
}

export default Aside