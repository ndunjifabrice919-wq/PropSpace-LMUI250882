import { Link } from 'react-router-dom';

/**
 * PropertyCard — reusable card for displaying a property listing.
 * Used in both the public Home feed and the private Dashboard.
 *
 * Props:
 *  - property: the property object
 *  - actions: optional JSX for edit/delete buttons (Dashboard only)
 */
export default function PropertyCard({ property: p, actions }) {
  const authorName = p.owner?.displayName || p.owner?.username || 'Unknown';
  const firstImage = p.imageUrls?.[0];

  return (
    <div className="property-card">
      {/* Image */}
      <div className="property-image-wrap">
        {firstImage ? (
          <img src={firstImage} alt={p.title} loading="lazy" />
        ) : (
          <div className="property-image-placeholder">🏠</div>
        )}
        <div className="property-badges">
          <span className={`badge ${p.listingStatus === 'Rent' ? 'badge-rent' : 'badge-sale'}`}>
            {p.listingStatus}
          </span>
          <span className="badge badge-type">{p.propertyType}</span>
        </div>
      </div>

      {/* Content */}
      <div className="property-content">
        <div className="property-price">
          {p.price.toLocaleString()} CFA
          {p.listingStatus === 'Rent' && (
            <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-muted)' }}>/mo</span>
          )}
        </div>
        <Link to={`/properties/${p._id}`} className="property-title" style={{ color: 'inherit' }}>
          {p.title}
        </Link>
        <p className="property-location">
          📍 {p.city}, {p.country}
        </p>
        <div className="property-meta">
          {p.bedrooms != null && (
            <span>🛏 {p.bedrooms} bed{p.bedrooms !== 1 ? 's' : ''}</span>
          )}
        </div>

        {/* Author info */}
        <div className="property-author">
          {p.owner?.avatar ? (
            <img className="author-avatar-sm" src={p.owner.avatar} alt={authorName} />
          ) : (
            <div
              className="author-avatar-sm"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--primary-light)', fontSize: '0.7rem', fontWeight: 700,
                color: 'var(--primary)'
              }}
            >
              {authorName[0]?.toUpperCase()}
            </div>
          )}
          <span>Listed by {authorName}</span>
        </div>
      </div>

      {/* Optional action buttons (Edit / Delete) */}
      {actions && (
        <div className="property-actions">
          {actions}
        </div>
      )}
    </div>
  );
}
