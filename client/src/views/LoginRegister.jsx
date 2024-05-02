import UserForm from "../components/UserForm"

const LoginRegister = () => {
    return (
        <div className="container mt-3">
            <h1>Login y Registro</h1>
            <hr />
            <div className="row">
                <div className="col-6">
                    <UserForm formType="login" />
                </div>
                <div className="col-6">
                    <UserForm formType="registro" />
                </div>
            </div>
        </div>
    )
}

export default LoginRegister