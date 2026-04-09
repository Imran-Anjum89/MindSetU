import { Link } from 'react-router-dom';

export default function AuthLanding() {
    return (
        <div className="container" style={{ textAlign: 'center', marginTop: '5rem' }}>
            <h1>Welcome to CounselConnect</h1>
            <p>Please choose your role to continue</p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '3rem' }}>
                <div className="card" style={{ width: '18rem', padding: '2rem', border: '1px solid #ddd' }}>
                    <h3>Student</h3>
                    <p>Find your dream college and book counseling sessions.</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <Link to="/signup/student" className="btn btn-primary">Sign Up as Student</Link>
                        <Link to="/login" className="btn btn-outline-primary">Login</Link>
                    </div>
                </div>

                <div className="card" style={{ width: '18rem', padding: '2rem', border: '1px solid #ddd' }}>
                    <h3>College Admin</h3>
                    <p>Register your college and manage counseling sessions.</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <Link to="/signup/admin" className="btn btn-success">Register College</Link>
                        <Link to="/login" className="btn btn-outline-success">Login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
