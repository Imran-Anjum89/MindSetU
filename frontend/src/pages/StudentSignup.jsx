import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function StudentSignup() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        collegeName: '',
        currentYear: '',
        enrollmentNumber: '',
        password: ''
    });
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/auth/signup/student', formData);
            setUser(res.data.user);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || "Signup failed");
        }
    };

    return (
        <div className="container" style={{ maxWidth: '500px', marginTop: '3rem' }}>
            <h2>Student Signup</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Username</label>
                    <input type="text" name="username" className="form-control" onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label>Email</label>
                    <input type="email" name="email" className="form-control" onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label>College Name</label>
                    <input type="text" name="collegeName" className="form-control" onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label>Current Year (e.g., 1, 2, 3, 4)</label>
                    <input type="number" name="currentYear" className="form-control" onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label>Enrollment Number</label>
                    <input type="text" name="enrollmentNumber" className="form-control" onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label>Password</label>
                    <input type="password" name="password" className="form-control" onChange={handleChange} required />
                </div>
                <button type="submit" className="btn btn-primary">Sign Up</button>
            </form>
        </div>
    );
}
