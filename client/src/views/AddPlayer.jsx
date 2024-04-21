import { useState } from "react"
import useForm from "../hooks/useForm"
import SubMenu from "../components/SubMenu"
import axios from "axios"
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom"

const AddPlayer = () => {
    const navegate = useNavigate()
    const initialValues = {
        name:'',
        position: ''
    }
    const {values: player, handleChange} = useForm(initialValues)
    const [error, setError] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post('http://localhost:8000/api/player', player)
            .then(res => {
                console.log(res.data.player)
                navegate("/")
                Swal.fire({
                    icon: "success",
                    title: "Genial!",
                    text: "Agregaste un Jugador!!",
                });
                setError("")
            })
            .catch(err => {
                console.log(err)
                setError(err.response.data.error.message)
            })
    }

    return (
        <SubMenu>
            <form onSubmit={handleSubmit}>
                <div className="text-danger">{error}</div>
                <div>
                    <label className="mt-3">Name: </label>
                    <input type="text" className="form-control" name="name" value={player.name} onChange={handleChange} />
                </div>
                <div>
                    <label className="mt-3">Position: </label>
                    <input type="text" className="form-control" name="position" value={player.position} onChange={handleChange} />
                </div>
                <div>
                    <label className="mt-3">User Id: </label>
                    <input type="text" className="form-control" name="userId" value={JSON.parse(localStorage.getItem('user')).id} readOnly />
                </div>
                <button type="submit" className="btn btn-primary mt-3">Submit</button>
            </form>
        </SubMenu>
    )
}

export default AddPlayer
