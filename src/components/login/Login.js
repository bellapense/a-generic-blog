import React, {useState } from "react";
import { useAuth } from '../../contexts/AuthContext';
import { Link, useHistory } from "react-router-dom";

/* Firebase imports */
import 'firebase/database'

/* Styles */
import '../../styles/login.css'

/* Import header component */
import {SITE_NAME} from "../../constants";

/**
 * Enables the user to try to login and access the cms using:
 * Email address
 * Password
 * @returns {JSX.Element}
 */
export default function Login() {
    /* States for form fields */
    const [email, setEmail] = useState("")
    const [pass, setPass] = useState("")

    /* login function from Firebase */
    const { login } = useAuth()

    /* State for displaying error message. */
    const [error, setError] = useState(null)

    /* useHistory hook to push changes into the router in App.js */
    const history = useHistory();

    /* Handles when the user clicks the login button */
    const handleSubmit = async () => {
        // Attempt to login
        try {
            await login(email, pass)
            history.push("/cms-dashboard")
        } catch {
            setError(<div className="error"><p>Login failed. Invalid username or password.</p></div>)
        }
    }

    /* Variable for determining if the login button should be disabled. */
    const isDisabled = !(email.length && pass.length)

    return (
        <div className="login-page">
            <div className="login-header">
                <h1 className="site-name">
                    <Link to="/">
                        {SITE_NAME}
                    </Link>
                    <span className="sub-heading">Administrator Login</span>
                </h1>
            </div>
            {error}
            <form className="login-form">
                <div className="field">
                    <p>Username</p>
                    <input type="email" id="emailField" value={email}
                           onChange={event => { setEmail(event.target.value) }}
                           required />
                </div>
                <div className="field">
                    <p>Password</p>
                    <input type="password" id="passField" value={pass}
                           onChange={event => { setPass(event.target.value) }}
                           required />
                </div>
                {isDisabled ? <div id="login-button" className="site-button disabled">
                        <p>Login</p>
                    </div>
                    :
                    <div id="login-button" className="site-button" onClick={handleSubmit}>
                        <p>Login</p>
                    </div>
                }
            </form>
        </div>
    )
}