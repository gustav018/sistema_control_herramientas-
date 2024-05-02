import { Link } from "react-router-dom";
import { passwordForgot } from "../api/route";
import { useEffect, useState } from "react";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState({});
    const [emailSent, setEmailSent] = useState(false);
    const [buttonClicks, setButtonClicks] = useState(0);

    const sendEmail = async (data) => {
        try {
            const result = await passwordForgot(data);
            console.log(result);
            setEmailSent(true);
        } catch (error) {
            setError(error);
            console.log(error);
            const validationErrors = error.response.data;
            setError({
                email: validationErrors.email
            });
            console.log(error);
        }
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (buttonClicks < 4) {
            setButtonClicks(prevCount => prevCount + 1);
            const data = {
                email: email
            };
            await sendEmail(data);
        }
    }

    useEffect(() => {
        setError({});
    }, [email]);

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ width: '300px', minHeight: '100vh' }}>
            <div>
                <h1 style={{ fontSize: '1.5rem', color: '#4b3a2e' }}>Recupera tu contraseña!</h1>
                <form noValidate style={{ marginTop: '1.5rem' }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="email" style={{ marginBottom: '0.5rem', display: 'block' }}>E-mail</label>
                        <input
                            required
                            type="email"
                            id="email"
                            name="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {error?.email && (
                            <p style={{ color: 'red', fontSize: '0.8rem' }}>{error?.email?.message}</p>
                        )}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            onClick={handleFormSubmit}
                            disabled={buttonClicks >= 4}
                        >
                            Enviar email
                        </button>
                    </div>
                </form>
                {buttonClicks >= 4 && (
                    <div className="alert alert-danger mt-3" role="alert">
                        Se han enviado demasiados correos. Por favor, inténtalo de nuevo más tarde.
                    </div>
                )}
                {emailSent && (
                    <div className="alert alert-success mt-3" role="alert">
                        ¡El correo electrónico ha sido enviado con éxito! Revisa tu correo.
                    </div>
                )}
                <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                    <Link to="/login" style={{ textDecoration: 'none', color: '#3B3561', display: emailSent ? 'none' : 'block' }}>
                        Volver a inicio
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword;
