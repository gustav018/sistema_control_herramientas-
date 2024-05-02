import { Link } from "react-router-dom";
import { passwordReset } from "../api/route";
import { useEffect, useState } from "react";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState({});
    const [resetSuccess, setResetSuccess] = useState(false);
    const token = window.location.pathname.split('/').pop();

    const reset = async (data) => {
        try {
            const result = await passwordReset(data, token);
            console.log(result);
            setResetSuccess(true);
        } catch (error) {
            setError(error);
            console.log(error);
            const validationErrors = error.response.data?.message.errors;
            setError({
                password: validationErrors?.password,
                confirmPassword: validationErrors?.confirmPassword,
            });
            console.log(error);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const data = {
            password: password,
            confirmPassword: confirmPassword
        };
        await reset(data);
    };

    useEffect(() => {
        setError({});
    }, [password, confirmPassword]);

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ width: '300px', minHeight: '100vh' }}>
            {!resetSuccess ? (
                <div>
                    <h1 style={{ fontSize: '1.5rem', color: '#4b3a2e' }}>Recupera tu contraseña</h1>
                    <form onSubmit={handleFormSubmit}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label htmlFor="password" style={{ marginBottom: '0.5rem', display: 'block' }}>Contraseña</label>
                            <input
                                required
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-control"
                                error={error?.password ? true : false}
                            />
                            {error?.password && <p style={{ color: 'red', fontSize: '0.8rem' }}>{error.password.message}</p>}
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label htmlFor="confirmPassword" style={{ marginBottom: '0.5rem', display: 'block' }}>Confirmar contraseña</label>
                            <input
                                required
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="form-control"
                                error={error?.confirmPassword ? true : false}
                            />
                            {error?.confirmPassword && <p style={{ color: 'red', fontSize: '0.8rem' }}>{error.confirmPassword.message}</p>}
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <button type="submit" className="btn btn-primary">Cambiar Contraseña</button>
                        </div>
                    </form>
                    <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                        <Link to="/login" style={{ textDecoration: 'none', color: '#3B3561' }}>
                            Volver a inicio
                        </Link>
                    </div>
                </div>
            ) : (
                <div>
                    <h1 style={{ fontSize: '1.5rem', color: '#4b3a2e' }}>Contraseña cambiada con éxito</h1>
                    <p style={{ marginTop: '1rem', textAlign: 'center' }}>
                        Por favor, inicia sesión con tu nueva contraseña.
                    </p>
                    <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                        <Link to="/login" className="btn btn-primary">Iniciar sesión</Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResetPassword;
