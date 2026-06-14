import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Dashboard() {
  const { user, token, fetchProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const [myProperties, setMyProperties] = useState([]);
  
  // Modals state
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPropertyId, setCurrentPropertyId] = useState(null);
  
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);

  // Forms data
  const [propertyData, setPropertyData] = useState({ title: '', description: '', price: '', city: '', country: '', propertyType: 'Apartment' });
  const [profileData, setProfileData] = useState({ name: '', phone: '', avatar: '' });
  const [securityData, setSecurityData] = useState({ oldPassword: '', newPassword: '' });

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

  useEffect(() => {
    if (user) {
      setProfileData({ name: user.name || '', phone: user.phone || '', avatar: user.avatar || '' });
    }
  }, [user]);

  // --- PROPERTY CRUD ---
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

  const openCreateModal = () => {
    setIsEditing(false);
    setPropertyData({ title: '', description: '', price: '', city: '', country: '', propertyType: 'Apartment' });
    setShowPropertyModal(true);
  };

  const openEditModal = (property) => {
    setIsEditing(true);
    setCurrentPropertyId(property._id);
    setPropertyData({
      title: property.title, description: property.description, price: property.price,
      city: property.city, country: property.country, propertyType: property.propertyType
    });
    setShowPropertyModal(true);
  };

  const handlePropertySubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/properties/${currentPropertyId}`, propertyData);
      } else {
        await axios.post('http://localhost:5000/api/properties', propertyData);
      }
      setShowPropertyModal(false);
      fetchProperties();
    } catch (err) {
      alert('Failed to save property');
    }
  };

  // --- PROFILE & SECURITY ---
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:5000/api/users/profile', profileData);
      fetchProfile(); // Refresh context
      setShowProfileModal(false);
      alert('Profile updated successfully!');
    } catch (err) {
      alert('Failed to update profile');
    }
  };

  const handleSecuritySubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:5000/api/users/security', securityData);
      setShowSecurityModal(false);
      setSecurityData({ oldPassword: '', newPassword: '' });
      alert('Password updated successfully!');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update password');
    }
  };

  if (!user) return <div className="text-center mt-4">Loading Dashboard...</div>;

  return (
    <div className="container">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
          {user.avatar ? (
            <img src={user.avatar} alt="Avatar" style={{width: 60, height: 60, borderRadius: '50%', objectFit: 'cover'}} />
          ) : (
            <div style={{width: 60, height: 60, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold'}}>{user.username[0].toUpperCase()}</div>
          )}
          <div>
            <h1 style={{fontSize: '2rem'}}>Dashboard</h1>
            <p style={{color: 'var(--text-muted)'}}>Welcome, {user.name || user.username}</p>
          </div>
        </div>
        <div style={{display: 'flex', gap: '1rem'}}>
          <button className="btn" style={{border: '1px solid var(--border)', color: 'var(--text)'}} onClick={() => setShowProfileModal(true)}>Profile Settings</button>
          <button className="btn" style={{border: '1px solid var(--border)', color: 'var(--text)'}} onClick={() => setShowSecurityModal(true)}>Change Password</button>
          <button className="btn btn-primary" onClick={openCreateModal}>+ Add New Listing</button>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
          <div className="form-card" style={{margin: 0, width: '100%', maxWidth: '400px'}}>
            <h2 className="mb-4">Update Profile</h2>
            <form onSubmit={handleProfileSubmit}>
              <div className="form-group"><label>Full Name</label><input className="form-control" value={profileData.name} onChange={e=>setProfileData({...profileData, name: e.target.value})} /></div>
              <div className="form-group"><label>Phone Number</label><input className="form-control" value={profileData.phone} onChange={e=>setProfileData({...profileData, phone: e.target.value})} /></div>
              <div className="form-group"><label>Avatar URL</label><input className="form-control" value={profileData.avatar} onChange={e=>setProfileData({...profileData, avatar: e.target.value})} /></div>
              <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
                <button type="button" className="btn" style={{flex: 1, border: '1px solid var(--border)', color: 'white'}} onClick={() => setShowProfileModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{flex: 1}}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Security Modal */}
      {showSecurityModal && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
          <div className="form-card" style={{margin: 0, width: '100%', maxWidth: '400px'}}>
            <h2 className="mb-4">Change Password</h2>
            <form onSubmit={handleSecuritySubmit}>
              <div className="form-group"><label>Old Password</label><input type="password" className="form-control" value={securityData.oldPassword} onChange={e=>setSecurityData({...securityData, oldPassword: e.target.value})} required/></div>
              <div className="form-group"><label>New Password</label><input type="password" className="form-control" value={securityData.newPassword} onChange={e=>setSecurityData({...securityData, newPassword: e.target.value})} required/></div>
              <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
                <button type="button" className="btn" style={{flex: 1, border: '1px solid var(--border)', color: 'white'}} onClick={() => setShowSecurityModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-danger" style={{flex: 1}}>Update Password</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Property Modal */}
      {showPropertyModal && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
          <div className="form-card" style={{margin: 0, width: '100%', maxHeight: '90vh', overflowY: 'auto'}}>
            <h2 className="mb-4">{isEditing ? 'Edit Listing' : 'Create New Listing'}</h2>
            <form onSubmit={handlePropertySubmit}>
              <div className="form-group"><label>Title</label><input className="form-control" value={propertyData.title} onChange={e=>setPropertyData({...propertyData, title: e.target.value})} required/></div>
              <div className="form-group"><label>Description</label><textarea className="form-control" value={propertyData.description} onChange={e=>setPropertyData({...propertyData, description: e.target.value})} required/></div>
              <div style={{display: 'flex', gap: '1rem'}}>
                <div className="form-group" style={{flex: 1}}><label>Price</label><input type="number" className="form-control" value={propertyData.price} onChange={e=>setPropertyData({...propertyData, price: e.target.value})} required/></div>
                <div className="form-group" style={{flex: 1}}><label>Type</label>
                  <select className="form-control" value={propertyData.propertyType} onChange={e=>setPropertyData({...propertyData, propertyType: e.target.value})}>
                    <option>Apartment</option><option>House</option><option>Studio</option>
                  </select>
                </div>
              </div>
              <div style={{display: 'flex', gap: '1rem'}}>
                <div className="form-group" style={{flex: 1}}><label>City</label><input className="form-control" value={propertyData.city} onChange={e=>setPropertyData({...propertyData, city: e.target.value})} required/></div>
                <div className="form-group" style={{flex: 1}}><label>Country</label><input className="form-control" value={propertyData.country} onChange={e=>setPropertyData({...propertyData, country: e.target.value})} required/></div>
              </div>
              <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
                <button type="button" className="btn" style={{flex: 1, border: '1px solid var(--border)', color: 'white'}} onClick={() => setShowPropertyModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{flex: 1}}>{isEditing ? 'Save Changes' : 'Submit Listing'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Property Grid */}
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
                <button className="btn" style={{flex: 1, border: '1px solid var(--border)', color: 'white'}} onClick={() => openEditModal(p)}>Edit</button>
                <button className="btn btn-danger" style={{flex: 1}} onClick={() => handleDelete(p._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
