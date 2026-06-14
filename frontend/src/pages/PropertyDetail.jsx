import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

const API_BASE = 'http://localhost:5000/api';

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const fetchProperty = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`${API_BASE}/properties/${id}`, {
          signal: controller.signal,
        });
        setProperty(res.data);
      } catch (err) {
        if (axios.isCancel(err)) return; // Ignore abort
        if (err.response?.status === 404) {
          setError('This property listing could not be found.');
        } else {
          setError('Failed to load property details. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();

    // Cleanup: abort fetch on unmount (prevents memory leak)
    return () => controller.abort();
  }, [id]);

  if (loading) return <LoadingSpinner label="Loading property details..." />;

  if (error) {
    return (
      <div className="container">
        <div className="error-state mt-4">
          <p>⚠️ {error}</p>
          <button className="btn btn-outline btn-sm mt-2" onClick={() => navigate(-1)}>
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!property) return null;

  const owner = property.owner;
  const ownerName = owner?.displayName || owner?.username || 'Unknown';
  const firstImage = property.imageUrls?.[0];

  return (
    <div className="container">
      {/* Back link */}
      <Link to="/" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'inline-flex', gap: '0.3rem', alignItems: 'center', marginBottom: '1.5rem' }}>
        ← Back to listings
      </Link>

      {/* Hero Image */}
      {firstImage ? (
        <img
          className="detail-hero-img"
          src={firstImage}
          alt={property.title}
        />
      ) : (
        <div style={{
          width: '100%', height: 320, borderRadius: 'var(--radius-lg)',
          background: 'linear-gradient(135deg, var(--surface), var(--surface-hover))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '4rem', marginBottom: '2rem', border: '1px solid var(--border)'
        }}>🏠</div>
      )}

      <div className="detail-grid">
        {/* Left — Main Info */}
        <div>
          {/* Badges */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <span className={`badge ${property.listingStatus === 'Rent' ? 'badge-rent' : 'badge-sale'}`}>
              {property.listingStatus}
            </span>
            <span className="badge badge-type">{property.propertyType}</span>
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '0.5rem' }}>
            {property.title}
          </h1>

          <p style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            📍 {property.city}, {property.country}
          </p>

          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '1.5rem' }}>
            {property.price.toLocaleString()} CFA
            {property.listingStatus === 'Rent' && (
              <span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--text-muted)' }}>/month</span>
            )}
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            {property.bedrooms != null && (
              <div className="detail-stat">
                🛏 <strong>{property.bedrooms}</strong> Bedroom{property.bedrooms !== 1 ? 's' : ''}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="detail-info-card">
            <h2 style={{ fontWeight: 700, marginBottom: '0.75rem' }}>About this property</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
              {property.description}
            </p>
          </div>

          {/* Image gallery */}
          {property.imageUrls?.length > 1 && (
            <div style={{ marginTop: '1.5rem' }}>
              <h2 style={{ fontWeight: 700, marginBottom: '0.75rem' }}>Photos</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
                {property.imageUrls.slice(1).map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`${property.title} photo ${i + 2}`}
                    style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right — Contact Card */}
        <div>
          <div className="detail-info-card" style={{ position: 'sticky', top: '88px' }}>
            <h2 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Contact Owner</h2>

            {/* Owner avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {owner?.avatar ? (
                <img src={owner.avatar} alt={ownerName}
                  style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }} />
              ) : (
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary), #14B8A6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: '1.2rem', color: 'white'
                }}>
                  {ownerName[0]?.toUpperCase()}
                </div>
              )}
              <div>
                <div style={{ fontWeight: 700 }}>{ownerName}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Property Owner</div>
              </div>
            </div>

            {owner?.phone && (
              <div className="detail-stat" style={{ marginBottom: '0.75rem' }}>
                📞 {owner.phone}
              </div>
            )}
            {owner?.email && (
              <div className="detail-stat" style={{ marginBottom: '1.25rem' }}>
                ✉️ {owner.email}
              </div>
            )}

            {owner?.email && (
              <a
                href={`mailto:${owner.email}?subject=Enquiry about: ${property.title}`}
                className="btn btn-primary btn-full"
                id="btn-contact-owner"
              >
                Send Enquiry
              </a>
            )}

            <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--bg-alt)', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: 'var(--text-dim)' }}>
              Listed on {new Date(property.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
