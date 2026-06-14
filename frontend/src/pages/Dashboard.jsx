import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Dashboard() {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [myProperties, setMyProperties] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', price: '', city: '', country: '', propertyType: 'Apartment' });

  const fetchProperties = () => {
    axios.get('http://localhost:5000/api/properties/my-listings')
      .then(res => setMyProperties(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchProperties();
  }, [token, navigate]);

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this listing?')) {
      try {
        await axios.delete(`http://localhost:5000/api/properties/${id}`);
        fetchProperties();
      } catch (err) {
        alert('Failed to delete property');
      }
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/properties', formData);
      setShowModal(false);
      setFormData({ title: '', description: '', price: '', city: '', country: '', propertyType: 'Apartment' });
      fetchProperties();
    } catch (err) {
      alert('Failed to create property');
    }
  };

  if (!user) return <div className="text-center mt-4">Loading Dashboard...</div>;

  return (
    <div className="container">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
        <div>
          <h1 style={{fontSize: '2rem'}}>Dashboard</h1>
          <p style={{color: 'var(--text-muted)'}}>Manage your personal property portfolio, {user.username}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add New Listing</button>
      </div>

      {showModal && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
          <div className="form-card" style={{margin: 0, width: '100%', maxHeight: '90vh', overflowY: 'auto'}}>
            <h2 className="mb-4">Create New Listing</h2>
            <form onSubmit={handleCreate}>
              <div className="form-group"><label>Title</label><input className="form-control" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} required/></div>
              <div className="form-group"><label>Description</label><textarea className="form-control" value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} required/></div>
              <div style={{display: 'flex', gap: '1rem'}}>
                <div className="form-group" style={{flex: 1}}><label>Price</label><input type="number" className="form-control" value={formData.price} onChange={e=>setFormData({...formData, price: e.target.value})} required/></div>
                <div className="form-group" style={{flex: 1}}><label>Type</label>
                  <select className="form-control" value={formData.propertyType} onChange={e=>setFormData({...formData, propertyType: e.target.value})}>
                    <option>Apartment</option><option>House</option><option>Studio</option>
                  </select>
                </div>
              </div>
              <div style={{display: 'flex', gap: '1rem'}}>
                <div className="form-group" style={{flex: 1}}><label>City</label><input className="form-control" value={formData.city} onChange={e=>setFormData({...formData, city: e.target.value})} required/></div>
                <div className="form-group" style={{flex: 1}}><label>Country</label><input className="form-control" value={formData.country} onChange={e=>setFormData({...formData, country: e.target.value})} required/></div>
              </div>
              <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
                <button type="button" className="btn" style={{flex: 1, border: '1px solid var(--border)', color: 'white'}} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{flex: 1}}>Submit Listing</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {myProperties.length === 0 ? (
        <div className="form-card text-center" style={{marginTop: '2rem'}}>
          <p>You haven't listed any properties yet.</p>
        </div>
      ) : (
        <div className="property-grid">
          {myProperties.map(p => (
            <div key={p._id} className="property-card">
              <div className="property-image" style={{backgroundImage: `url(${p.imageUrls?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'})`}}></div>
              <div className="property-content">
                <div className="property-price">${p.price.toLocaleString()}</div>
                <h3 className="property-title">{p.title}</h3>
                <p className="property-location">{p.city}, {p.country}</p>
                <span style={{background: 'var(--primary)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem'}}>{p.propertyType}</span>
              </div>
              <div className="property-actions">
                <button className="btn" style={{flex: 1, border: '1px solid var(--border)', color: 'white'}} onClick={() => alert('Edit feature coming soon!')}>Edit</button>
                <button className="btn btn-danger" style={{flex: 1}} onClick={() => handleDelete(p._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
