import axios from "axios"
import Swal from 'sweetalert2'
import PropTypes from 'prop-types';

const DeleteColaborador = ({ colaboradorId, identificacion, successCallback }) => {

    const deleteColaborador = (colaboradorId, identificacion) => {

        Swal.fire({
            title: "Seguro que quieres eliminar?",
            text: `Estas a punto de eliminar a ${identificacion}.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, eliminalo!"
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://localhost:8000/api/colaborador/${colaboradorId}`, { withCredentials: true })
                    .then(res => {
                        console.log(res)
                        successCallback(colaboradorId)
                    })
            }
        });
    }

    return (
        <button onClick={() => deleteColaborador(colaboradorId, identificacion)} className="btn btn-outline-danger btn-sm">
            <i className="fa fa-trash"></i>
        </button>
    )
}

DeleteColaborador.propTypes = {
    colaboradorId: PropTypes.string.isRequired,
    identificacion: PropTypes.string.isRequired,
    successCallback: PropTypes.func.isRequired
}

export default DeleteColaborador