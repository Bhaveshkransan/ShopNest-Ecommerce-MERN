import { useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext.jsx'
import { useNavigate, Link } from 'react-router-dom'
import '../styles/auth.css'

const Login = () => {
    const { login } = useContext(AuthContext)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await fetch(
                '/api/auth/login',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                }
            )

            const data = await response.json()

            if (response.ok) {
                login(data)
                navigate('/')
            } else {
                alert(data.message)
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Login</h2>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button className="auth-btn" type="submit">
                        Login
                    </button>
                </form>

                <div className="auth-footer">
                    Don't have an account?{' '}
                    <Link to="/register">Register</Link>
                </div>
            </div>
        </div>
    )
}

export default Login