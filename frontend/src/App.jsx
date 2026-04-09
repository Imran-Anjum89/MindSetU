import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Listings from './pages/Listings';
import ShowListing from './pages/ShowListing';
import AuthLanding from './pages/AuthLanding';
import StudentSignup from './pages/StudentSignup';
import AdminSignup from './pages/AdminSignup';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <div className="container">
            <Routes>
              <Route path="/" element={<Listings />} />
              <Route path="/auth-landing" element={<AuthLanding />} />
              <Route path="/signup/student" element={<StudentSignup />} />
              <Route path="/signup/admin" element={<AdminSignup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/listings/:id" element={<ShowListing />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
