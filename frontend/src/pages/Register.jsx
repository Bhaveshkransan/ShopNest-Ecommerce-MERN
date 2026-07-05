import { Link } from 'react-router-dom'
import { useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import '../styles/auth.css'

const Register = () => {

    const navigate = useNavigate()
    const { login } = useContext(AuthContext)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault();
 
        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            });
            const data = await response.json();
            if (response.ok) {
                alert('Registration successful! You can now check your email for verification.');
                login(data);
                navigate('/');
            }
            else {
                alert(data.message || 'Registration failed. Please try again.');
                console.error('Registration error:', data);
            }
        }
        catch (error) {
            console.error('Error during registration:', error);
        }
    }


    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Register</h2>

                <form className="auth-form" onSubmit={handleSubmit} autoComplete="off">

                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="auth-btn">
                        Register
                    </button>

                    <div className="auth-footer">
                        Already have an account?
                        <Link to="/login"> Login</Link>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default Register
