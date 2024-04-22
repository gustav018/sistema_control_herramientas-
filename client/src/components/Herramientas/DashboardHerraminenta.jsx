import { Link, NavLink } from "react-router-dom"
import TotalHerramientas from "./TotalHerramientas"
import HerramientasPorVencer from "./HerramientasPorVencer"
import HerramientasVencidas from "./HerramientasVencidas"


const DashboardHerraminenta = () => {
    return (
        <>
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Dashboard</h1>
                <NavLink to="/sistema/reporte" className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm" rel="noopener noreferrer"><i className="fas fa-download fa-sm text-white-50" /> Generar Reporte ISO</NavLink>
            </div>
            <div className="row">
                {/* Earnings (Monthly) Card Example */}
                <div className="col-xl-4 col-md-6 mb-4">
                    <div className="card border-left-primary shadow h-100 py-2" style={{ padding: '32px' }}>
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                    </div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                        <TotalHerramientas />

                                    </div>
                                </div>
                                <div className="col-auto">
                                    <i className="fas fa-toolbox fa-2x text-gray-300" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Earnings (Monthly) Card Example */}
                <div className="col-xl-4 col-md-6 mb-4">
                    <div className="card border-left-success shadow h-100 py-2" style={{ padding: '32px' }}>
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                                    </div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                        <HerramientasPorVencer />
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <i className="fas fa-hourglass-half fa-2x text-gray-300" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Earnings (Monthly) Card Example */}

                {/* Pending Requests Card Example */}
                <div className="col-xl-4 col-md-6 mb-4">
                    <div className="card border-left-warning shadow h-100 py-2" style={{ padding: '32px' }}>
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                    </div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                        Herramientas vencidas: <HerramientasVencidas />
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <Link to="/sistema/list" className="btn btn-primary ml-2">
                                        <span className="ml-2">Ver detalle</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DashboardHerraminenta