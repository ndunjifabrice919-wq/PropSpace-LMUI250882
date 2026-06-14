import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setFormData({ ...formData, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { username, email, password, confirmPassword } = formData;

    // Client-side validation
    if (!username || !email || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (username.length < 3) {
      setError('Username must be at least 3 characters long.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await register(username, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-card">
        <h1 className="form-card-title">Create account</h1>
        <p className="form-card-subtitle">Join PropSpace and start listing today</p>

        {error && (
          <div className="form-error" role="alert">{error}</div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="reg-username">Username</label>
            <input
              id="reg-username"
              className="form-control"
              type="text"
              autoComplete="username"
              placeholder="e.g. johndoe"
              value={formData.username}
              onChange={set('username')}
              required
              minLength={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-email">Email address</label>
            <input
              id="reg-email"
              className="form-control"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={set('email')}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="reg-password">Password</label>
              <input
                id="reg-password"
                className="form-control"
                type="password"
                autoComplete="new-password"
                placeholder="Min. 6 characters"
                value={formData.password}
                onChange={set('password')}
                required
                minLength={6}
              />
            </div>
            <div className="form-group">
              <label htmlFor="reg-confirm">Confirm Password</label>
              <input
                id="reg-confirm"
                className="form-control"
                type="password"
                autoComplete="new-password"
                placeholder="Repeat password"
                value={formData.confirmPassword}
                onChange={set('confirmPassword')}
                required
              />
            </div>
          </div>

          <button
            id="btn-register-submit"
            type="submit"
            className="btn btn-primary btn-full mt-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner spinner-sm" style={{ borderTopColor: 'white' }} />
                Creating account...
              </>
            ) : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-3" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Already have an account?{' '}
          <Link to="/login" id="link-to-login">Sign in here</Link>
        </p>
      </div>
    </div>
  );
}
