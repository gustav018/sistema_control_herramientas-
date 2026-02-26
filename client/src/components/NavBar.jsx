import { Link, useNavigate } from "react-router-dom"
import axios from "axios";
import { useContext } from "react";
import UserContext from '../context/UserContext';
import HerramientasVencidas from "./Herramientas/HerramientasVencidas";


const NavBar = () => {
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser();
    };

    const logoutUser = async () => {
        try {
            await axios.post("https://sistemacontrolherramientas-production.up.railway.app/api/auth/logout",
                { withCredentials: true }
            );
            localStorage.removeItem("user");
            setUser(null)
            navigate("/login")
        } catch (err) {
            console.log("Error: ", err)
        }
    }

    const printFirstName = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            console.log(user.firstName);
            return user.firstName;
        }
    };
    return (
        <>
            {/* Topbar */}
            <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                {/* Sidebar Toggle (Topbar) */}
                <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
                    <i className="fa fa-bars" />
                </button>
                {/* Topbar Search */}

                {/* Topbar Navbar */}
                <ul className="navbar-nav ml-auto">
                    {/* Nav Item - Search Dropdown (Visible Only XS) */}
                    <li className="nav-item dropdown no-arrow d-sm-none">
                        <a className="nav-link dropdown-toggle" href="#" id="searchDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i className="fas fa-search fa-fw" />
                        </a>
                        {/* Dropdown - Messages */}
                        <div className="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in" aria-labelledby="searchDropdown">
                            <form className="form-inline mr-auto w-100 navbar-search">
                                <div className="input-group">
                                    <input type="text" className="form-control bg-light border-0 small" placeholder="Search for..." aria-label="Search" aria-describedby="basic-addon2" />
                                    <div className="input-group-append">
                                        <button className="btn btn-primary" type="button">
                                            <i className="fas fa-search fa-sm" />
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </li>
                    {/* Nav Item - Alerts */}
                    <li className="nav-item dropdown no-arrow mx-1">
                        <a className="nav-link dropdown-toggle" href="#" id="alertsDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i className="fas fa-bell fa-fw" style={{ fontSize: "2rem" }} />
                            {/* Counter - Alerts */}
                            <span className="badge badge-danger badge-counter"><HerramientasVencidas /></span>
                        </a>
                        {/* Dropdown - Alerts */}
                        <div className="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="alertsDropdown">
                            <h6 className="dropdown-header">
                                Notificaciones
                            </h6>



                            <Link to="/sistema/herramientas/vencidas" className="dropdown-item d-flex align-items-center">
                                <div className="mr-3">
                                    <div className="icon-circle bg-warning">
                                        <i className="fas fa-exclamation-triangle text-white" />
                                    </div>
                                </div>
                                <div>
                                    <div className="small text-black-500">Tienes <strong><HerramientasVencidas /></strong> herramientas vencidas</div>


                                </div>
                            </Link>
                            <a className="dropdown-item text-center small text-gray-500" href="#">Show All Alerts</a>
                        </div>
                    </li>
                    {/* Nav Item - Messages */}

                    <div className="topbar-divider d-none d-sm-block" />
                    {/* Nav Item - User Information */}
                    <li className="nav-item dropdown no-arrow">
                        <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <span className="mr-2 d-none d-lg-inline text-gray-600 small" style={{ fontSize: "20px" }}>

                                {`Hola ${printFirstName()}`}
                            </span>
                            <i className="fas fa-user-circle fa-fw mr-2" style={{ fontSize: "2rem" }}></i>
                        </a>
                        {/* Dropdown - User Information */}
                        <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="userDropdown">
                            <a className="dropdown-item" href="#">
                                <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400" />
                                Profile
                            </a>

                            <div className="dropdown-divider" />
                            <button className="dropdown-item" onClick={handleLogout} >
                                <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400" />
                                Logout
                            </button>
                        </div>
                    </li>
                </ul>
            </nav>
            {/* End of Topbar */}
            {/* Begin Page Content */}

        </>
    )
}

export default NavBar