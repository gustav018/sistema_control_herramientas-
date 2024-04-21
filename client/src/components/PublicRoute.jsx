import { Navigate } from "react-router-dom";
import PropTypes from 'prop-types';
import UserContext from '../context/UserContext';
import { useContext } from "react";

const PublicRoute = (props) => {
    const { redirectPath = "/", children } = props;
    const { user } = useContext(UserContext);

    return <>{user ? <Navigate to={redirectPath} replace /> : children}</>;
};

PublicRoute.propTypes = {
    user: PropTypes.object,
    redirectPath: PropTypes.string,
    children: PropTypes.node
}

export default PublicRoute