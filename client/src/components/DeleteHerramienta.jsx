import axios from "axios"
import Swal from 'sweetalert2'
import PropTypes from 'prop-types';

const DeleteHerramienta = ({ herramientaId, identificacion, successCallback }) => {

    const deleteHerramienta = (herramientaId, identificacion) => {

        Swal.fire({
            title: "Seguro que quieres eliminar?",
            text: `Estas a punto de eliminar una herramienta ${identificacion}.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, eliminalo!"
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://localhost:8000/api/herramienta/${herramientaId}`, { withCredentials: true })
                    .then(res => {
                        console.log(res)
                        successCallback(herramientaId)
                    })
            }
        });
    }

    return (
        <button title="Eliminar herramienta" onClick={() => deleteHerramienta(herramientaId, identificacion)} className="btn btn-outline-danger btn-sm">
            <i className="fa fa-trash"></i>
        </button>
    )
}

DeleteHerramienta.propTypes = {
    herramientaId: PropTypes.string.isRequired,
    identificacion: PropTypes.string.isRequired,
    successCallback: PropTypes.func.isRequired
}

export default DeleteHerramienta