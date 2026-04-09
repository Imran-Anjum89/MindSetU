import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

export default function UserProfileModal({ show, onHide }) {
    const { user, setUser, logout } = useContext(AuthContext);
    const [isEditing, setIsEditing] = useState(false);

    // Form State
    const [organization, setOrganization] = useState('');
    const [coursePost, setCoursePost] = useState('');
    const [currentYear, setCurrentYear] = useState('');

    useEffect(() => {
        if (user) {
            setOrganization(user.collegeName || user.username.split('_')[0] || '');
            setCoursePost(user.enrollmentNumber || "Admin");
            setCurrentYear(user.currentYear || '');
        }
    }, [user]);

    if (!user) return null;

    const passKey = user.role === 'admin' ? user.passKey : "N/A";

    const handleSave = async () => {
        try {
            const updates = {};
            // Basic role-based mapping to updates
            if (user.role === 'student') {
                updates.collegeName = organization;
                updates.enrollmentNumber = coursePost;
                updates.currentYear = currentYear;
            } else {
                updates.collegeName = organization;
            }

            const res = await axios.put('/api/auth/update', updates);
            setUser(res.data.user); // Update global user state
            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (err) {
            console.error(err);
            alert("Failed to update profile: " + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className={`modal fade ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">User Profile</h5>
                        <button type="button" className="btn-close" onClick={onHide} aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="container-fluid">
                            <div className="row">
                                {/* Left Column: User Details */}
                                <div className="col-lg-5">
                                    <div className="d-flex align-items-center mb-4">
                                        <img src="https://placehold.co/100x100/EFEFEF/333?text=Photo" alt="User Photo" className="rounded-circle me-3" />
                                        <div>
                                            <h4>{user.username}</h4>
                                            <p className="text-muted mb-0">{user.email}</p>
                                        </div>
                                    </div>

                                    {!isEditing ? (
                                        <div>
                                            <ul className="list-group list-group-flush">
                                                <li className="list-group-item"><strong>Organization/College:</strong> <span>{user.collegeName || "Not Set"}</span></li>
                                                <li className="list-group-item"><strong>Enrollment/Role:</strong> <span>{user.enrollmentNumber || "Student"}</span></li>
                                                {user.role === 'admin' && (
                                                    <li className="list-group-item"><strong>Pass-key:</strong> <span>{passKey}</span></li>
                                                )}
                                                {user.role === 'student' && user.currentYear && (
                                                    <li className="list-group-item"><strong>Current Year:</strong> <span>{user.currentYear}</span></li>
                                                )}
                                            </ul>
                                            <div className="mt-4">
                                                <button className="btn btn-outline-primary me-2" onClick={() => setIsEditing(true)}>Edit Details</button>
                                                <button onClick={() => { logout(); onHide(); }} className="btn btn-outline-danger">Log Out</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <form>
                                            <div className="mb-2">
                                                <label className="form-label">Organization / College</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={organization}
                                                    onChange={(e) => setOrganization(e.target.value)}
                                                />
                                            </div>
                                            {user.role === 'student' && (
                                                <>
                                                    <div className="mb-3">
                                                        <label className="form-label">Enrollment Number</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={coursePost}
                                                            onChange={e => setCoursePost(e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="form-label">Current Year</label>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            value={currentYear}
                                                            onChange={e => setCurrentYear(e.target.value)}
                                                        />
                                                    </div>
                                                </>
                                            )}

                                            <button type="button" className="btn btn-primary btn-sm me-2" onClick={handleSave}>Save Changes</button>
                                            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsEditing(false)}>Cancel</button>
                                        </form>
                                    )}
                                </div>

                                {/* Right Column: Daily Record (Visual Only for now to match UI) */}
                                <div className="col-lg-7 border-start">
                                    <h5>Daily Record</h5>
                                    <div className="card p-3 my-3 bg-light">
                                        <p className="mb-2 fw-bold">How are you feeling today?</p>
                                        <div className="d-flex justify-content-around">
                                            <button className="btn fs-4">😊</button>
                                            <button className="btn fs-4">😐</button>
                                            <button className="btn fs-4">😔</button>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <h6>Mood Graph (Last 7 Days)</h6>
                                            <div style={{ height: '150px', background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <p className="text-muted small">Graph Placeholder</p>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <button className="btn btn-sm">&lt;</button>
                                                <h6 className="mb-0">October 2025</h6>
                                                <button className="btn btn-sm">&gt;</button>
                                            </div>
                                            <div className="calendar-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px', textAlign: 'center' }}>
                                                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d} className="fw-bold small">{d}</div>)}
                                                {/* Mock Calendar Days */}
                                                {[...Array(30)].map((_, i) => (
                                                    <div key={i} className="small p-1">{i + 1}</div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
