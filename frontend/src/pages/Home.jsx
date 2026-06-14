import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/properties')
      .then(res => {
        setProperties(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container">
      <div style={{textAlign: 'center', marginBottom: '3rem'}}>
        <h1 style={{fontSize: '3rem', marginBottom: '1rem'}}>Discover Your Dream Home</h1>
        <p style={{color: 'var(--text-muted)', fontSize: '1.2rem'}}>Explore our exclusive listings of premium properties</p>
      </div>
      
      {loading ? (
        <div className="text-center">Loading properties...</div>
      ) : properties.length === 0 ? (
        <div className="text-center">No properties found.</div>
      ) : (
        <div className="property-grid">
          {properties.map(p => (
            <div key={p._id} className="property-card">
              <div className="property-image" style={{backgroundImage: `url(${p.imageUrls?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'})`}}></div>
              <div className="property-content">
                <div className="property-price">${p.price.toLocaleString()}</div>
                <h3 className="property-title">{p.title}</h3>
                <p className="property-location">{p.city}, {p.country}</p>
                <span style={{background: 'var(--primary)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem'}}>{p.propertyType}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
