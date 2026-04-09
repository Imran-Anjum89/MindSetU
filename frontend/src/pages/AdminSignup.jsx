import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminSignup() {
    const [formData, setFormData] = useState({
        collegeEmail: '',
        collegeName: '', // Title of listing
        description: '',
        nrifRanking: '',
        totalStudents: '',
        totalCounselors: '',
        password: '',
        location: '',
        country: '',
        price: ''
    });
    const [image, setImage] = useState(null);

    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (image) data.append('image', image);

        try {
            const res = await axios.post('/api/auth/signup/admin', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setUser(res.data.user);
            alert(`College Registered! Your PassKey is: ${res.data.passKey} (Save this!)`);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || "Signup failed");
        }
    };

    return (
        <div className="container" style={{ maxWidth: '600px', marginTop: '3rem', paddingBottom: '3rem' }}>
            <h2>Register College (Admin)</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>College Email (Login Email)</label>
                    <input type="email" name="collegeEmail" className="form-control" onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label>College Full Name</label>
                    <input type="text" name="collegeName" className="form-control" onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label>College Image (Logo/Campus)</label>
                    <input type="file" name="image" className="form-control" onChange={handleFileChange} />
                </div>
                <div className="mb-3">
                    <label>Description</label>
                    <textarea name="description" className="form-control" onChange={handleChange} required />
                </div>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label>NRIF Ranking</label>
                        <input type="number" name="nrifRanking" className="form-control" onChange={handleChange} required />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label>Total Students</label>
                        <input type="number" name="totalStudents" className="form-control" onChange={handleChange} required />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label>Total Counselors</label>
                        <input type="number" name="totalCounselors" className="form-control" onChange={handleChange} required />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label>Application Fee (Price)</label>
                        <input type="number" name="price" className="form-control" onChange={handleChange} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label>Location (City)</label>
                        <input type="text" name="location" className="form-control" onChange={handleChange} required />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label>Country</label>
                        <input type="text" name="country" className="form-control" onChange={handleChange} required />
                    </div>
                </div>

                <div className="mb-3">
                    <label>Password</label>
                    <input type="password" name="password" className="form-control" onChange={handleChange} required />
                </div>

                <button type="submit" className="btn btn-success">Register College</button>
            </form>
        </div>
    );
}
