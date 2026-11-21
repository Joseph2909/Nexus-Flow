
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Network,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Code2
} from 'lucide-react';

import './Login.css';

function Login() {
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        setErrors(prev => ({
            ...prev,
            [name]: ''
        }));

        setSuccessMessage('');
    };

    const validateForm = () => {
        const newErrors = {};

        const email = formData.email.trim();

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            newErrors.email = 'Email address is required';
        } else if (!emailRegex.test(email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password =
                'Password must contain at least 8 characters';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = (e) => {
        e.preventDefault();

        setSuccessMessage('');

        if (validateForm()) {
            setSuccessMessage(
                'Validation successful! Backend authentication is not connected yet.'
            );

            console.log('Validated login data:', {
                email: formData.email.trim()
            });
        }
    };

    return (
        <div className="login-page">

            <div className="login-card">

                <div className="login-logo">
                    <Network size={54} strokeWidth={2.2} />
                </div>

                <div className="login-brand">
                    <h1>NexusFlow</h1>
                    <p>Sign in to your account</p>
                </div>

                <form onSubmit={handleLogin} className="login-form" noValidate>

                    <div className="login-field">
                        <div className="login-input-group">
                            <Mail size={17} />

                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                autoComplete="email"
                                aria-invalid={!!errors.email}
                            />
                        </div>

                        {errors.email && (
                            <span className="field-error">
                                {errors.email}
                            </span>
                        )}
                    </div>

                    <div className="login-field">
                        <div className="login-input-group">
                            <Lock size={17} />

                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                autoComplete="current-password"
                                aria-invalid={!!errors.password}
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                            </button>
                        </div>

                        {errors.password && (
                            <span className="field-error">
                                {errors.password}
                            </span>
                        )}
                    </div>

                    <div className="login-options">
                        <label>
                            <input type="checkbox" />
                            Remember me
                        </label>

                        <Link to="/forgot-password">
                            Forgot password?
                        </Link>
                    </div>

                    {successMessage && (
                        <div className="login-success" role="status">
                            {successMessage}
                        </div>
                    )}

                    <button type="submit" className="login-button">
                        Sign In <span>→</span>
                    </button>

                </form>

                <div className="login-divider">
                    <span>or continue with</span>
                </div>

                <div className="social-login">
                    <button type="button" aria-label="Google login">
                        <span className="google-icon">G</span>
                    </button>

                    <button type="button" aria-label="GitHub login">
                        <Code2 size={21} />
                    </button>
                </div>

                <div className="login-footer">
                    Don't have an account?
                    <Link to="/register"> Create Account</Link>
                </div>

            </div>

            <div className="login-wave login-wave-one"></div>
            <div className="login-wave login-wave-two"></div>

        </div>
    );
}

export default Login;
