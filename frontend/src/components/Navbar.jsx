import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">PropSpace</Link>
      <div className="navbar-links">
        <Link to="/" className="btn" style={{color: 'var(--text)'}}>Feed</Link>
        {user ? (
          <>
            <Link to="/dashboard" className="btn" style={{color: 'var(--text)'}}>Dashboard</Link>
            <button onClick={logout} className="btn btn-danger" style={{padding: '0.5rem 1rem'}}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-primary" style={{padding: '0.5rem 1rem'}}>Login</Link>
            <Link to="/register" className="btn" style={{border: '1px solid var(--border)', padding: '0.5rem 1rem', color: 'var(--text)'}}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
