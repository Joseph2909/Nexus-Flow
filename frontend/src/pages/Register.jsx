
import { useState } from 'react';
import { Link } from 'react-router-dom';

import {
    Network,
    User,
    Mail,
    Lock,
    Eye,
    EyeOff
} from 'lucide-react';

import './Register.css';

function Register() {

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        terms: false
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    // Handle Input Changes
    const handleChange = (e) => {

        const { name, value, checked, type } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        setErrors(prev => ({
            ...prev,
            [name]: ''
        }));

        setSuccessMessage('');
    };

    // Validate Registration Form
    const validateForm = () => {

        const newErrors = {};

        const name = formData.name.trim();
        const email = formData.email.trim();

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Full Name Validation
        if (!name) {
            newErrors.name = 'Full name is required';
        } else if (name.length < 3) {
            newErrors.name = 'Name must contain at least 3 characters';
        }

        // Email Validation
        if (!email) {
            newErrors.email = 'Email address is required';
        } else if (!emailRegex.test(email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Password Validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must contain at least 8 characters';
        }

        // Confirm Password Validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (
            formData.password !== formData.confirmPassword
        ) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        // Terms Validation
        if (!formData.terms) {
            newErrors.terms = 'Please accept the Terms & Conditions';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // Handle Registration
    const handleRegister = (e) => {

        e.preventDefault();

        setSuccessMessage('');

        if (validateForm()) {

            setSuccessMessage(
                'Registration details validated successfully! Backend connection is pending.'
            );

            console.log('Validated registration data:', {
                name: formData.name.trim(),
                email: formData.email.trim()
            });
        }
    };

    return (
        <div className="register-page">

            <div className="register-card">

                {/* Logo */}
                <div className="register-logo">
                    <Network size={48} strokeWidth={2.2} />
                </div>

                {/* Brand */}
                <div className="register-brand">
                    <h1>NexusFlow</h1>
                    <p>Create your account to get started</p>
                </div>

                {/* Heading */}
                <div className="register-heading">
                    <h2>Create Account</h2>
                    <p>Enter your details to join NexusFlow</p>
                </div>

                {/* Registration Form */}
                <form
                    className="register-form"
                    onSubmit={handleRegister}
                    noValidate
                >

                    {/* Full Name */}
                    <div className="register-field">
                        <div className={`register-input-group ${errors.name ? 'input-error' : ''}`}>
                            <User size={17} />

                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                                autoComplete="name"
                                aria-invalid={!!errors.name}
                            />
                        </div>

                        {errors.name && (
                            <span className="register-error">
                                {errors.name}
                            </span>
                        )}
                    </div>

                    {/* Email */}
                    <div className="register-field">
                        <div className={`register-input-group ${errors.email ? 'input-error' : ''}`}>
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
                            <span className="register-error">
                                {errors.email}
                            </span>
                        )}
                    </div>

                    {/* Password */}
                    <div className="register-field">
                        <div className={`register-input-group ${errors.password ? 'input-error' : ''}`}>
                            <Lock size={17} />

                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                autoComplete="new-password"
                                aria-invalid={!!errors.password}
                            />

                            <button
                                type="button"
                                className="register-password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                            </button>
                        </div>

                        {errors.password && (
                            <span className="register-error">
                                {errors.password}
                            </span>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="register-field">
                        <div className={`register-input-group ${errors.confirmPassword ? 'input-error' : ''}`}>
                            <Lock size={17} />

                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                autoComplete="new-password"
                                aria-invalid={!!errors.confirmPassword}
                            />

                            <button
                                type="button"
                                className="register-password-toggle"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                aria-label="Toggle confirm password visibility"
                            >
                                {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                            </button>
                        </div>

                        {errors.confirmPassword && (
                            <span className="register-error">
                                {errors.confirmPassword}
                            </span>
                        )}
                    </div>

                    {/* Terms */}
                    <div className="register-terms">

                        <label>
                            <input
                                type="checkbox"
                                name="terms"
                                checked={formData.terms}
                                onChange={handleChange}
                            />

                            <span>
                                I agree to the <a href="#terms">Terms & Conditions</a>
                            </span>
                        </label>

                        {errors.terms && (
                            <span className="register-error">
                                {errors.terms}
                            </span>
                        )}

                    </div>

                    {/* Success Message */}
                    {successMessage && (
                        <div className="register-success" role="status">
                            {successMessage}
                        </div>
                    )}

                    {/* Submit */}
                    <button type="submit" className="register-button">
                        Create Account <span>→</span>
                    </button>

                </form>

                {/* Footer */}
                <div className="register-footer">
                    Already have an account?
                    <Link to="/login"> Sign In</Link>
                </div>

            </div>

            {/* Background Waves */}
            <div className="register-wave register-wave-one"></div>
            <div className="register-wave register-wave-two"></div>

        </div>
    );
}

export default Register;
