import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import NavBar from './NavBar'
import Aside from './Aside'



const Contenedor = () => {
    return (
        <>

            <div id="wrapper">
                {/* Sidebar */}
                <Aside />
                {/* End of Sidebar */}
                {/* Content Wrapper */}
                <div id="content-wrapper" className="d-flex flex-column">
                    {/* Main Content */}
                    <div id="content">
                        <NavBar />

                        <Outlet />
                        {/* /.container-fluid */}
                    </div>
                    {/* End of Main Content */}
                    {/* Footer */}
                    <Footer />
                    {/* End of Footer */}
                </div>
                {/* End of Content Wrapper */}
            </div>
            {/* End of Page Wrapper */}
            {/* Scroll to Top Button*/}
            <a className="scroll-to-top rounded" href="#page-top">
                <i className="fas fa-angle-up" />
            </a>
            {/* Logout Modal*/}

        </>

    )
}

export default Contenedor