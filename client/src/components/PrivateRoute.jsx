import { Navigate } from "react-router-dom";
import PropTypes from 'prop-types';
import { useContext } from "react";
import UserContext from '../context/UserContext';

const PrivateRoute = (props) => {
    const { user } = useContext(UserContext);
    const { redirectPath = "/login", children } = props;
    return <>{!user ? <Navigate to={redirectPath} replace /> : children}</>;
};

PrivateRoute.propTypes = {
    user: PropTypes.object,
    redirectPath: PropTypes.string,
    children: PropTypes.node
}

export default PrivateRoute