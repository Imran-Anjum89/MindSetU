import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import UserProfileModal from './UserProfileModal';

export default function Navbar() {
    const { user } = useContext(AuthContext); // Removed logout from here, it's in the modal now
    const [showProfile, setShowProfile] = useState(false);

    return (
        <>
            <nav className="navbar navbar-expand-sm bg-body-tertiary border-bottom sticky-top">
                <div className="container-fluid">
                    <Link className="navbar-brand d-flex align-items-center" to="/">
                        <img src="/images/logo.jpeg" alt="MindsetU Logo" width="60" height="60" className="me-2" />
                        <span style={{ fontWeight: 'bold', fontFamily: "'Poppins', sans-serif", fontSize: '1.3rem', color: '#2b6cb0' }}>
                            MindsetU
                        </span>
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <div className="navbar-nav ms-auto">
                            <form className="d-flex" role="search">
                                <input className="form-control me-2 search-inp" type="search" placeholder="Search Organizations" aria-label="Search" />
                                <button className="btn search-btn" type="submit"><i className="fa-solid fa-magnifying-glass"></i> Search</button>
                            </form>
                        </div>
                        <div className="navbar-nav ms-auto align-items-center">
                            {/* "Add your Organization" is removed as requested */}

                            {!user ? (
                                <>
                                    <Link className="nav-link" to="/auth-landing">Sign up</Link>
                                    <Link className="nav-link" to="/login">Log in</Link>
                                </>
                            ) : (
                                <button
                                    className="nav-link btn btn-link text-decoration-none"
                                    onClick={() => setShowProfile(true)}
                                    title="User Profile"
                                >
                                    <i className="fa-solid fa-user fa-lg"></i>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Profile Modal */}
            <UserProfileModal show={showProfile} onHide={() => setShowProfile(false)} />
        </>
    );
}
