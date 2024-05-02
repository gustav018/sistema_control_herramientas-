
import PropTypes from 'prop-types';



const SubMenu = ({ children }) => {
    return (
        <>

            <div className="container-fluid">
                {/* Page Heading */}
                {children}
            </div>

        </>
    )
}

SubMenu.propTypes = {
    children: PropTypes.node
}

export default SubMenu