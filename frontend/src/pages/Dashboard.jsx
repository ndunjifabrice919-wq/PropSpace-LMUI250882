import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import PropertyCard from '../components/PropertyCard';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';

const API_BASE = 'http://localhost:5000/api';

const EMPTY_PROPERTY = {
  title: '', description: '', price: '', city: '', country: '',
  propertyType: 'Apartment', listingStatus: 'Sale', bedrooms: 1, imageUrls: '',
};

const EMPTY_PROFILE = { displayName: '', phone: '', avatar: '', bio: '' };
const EMPTY_SECURITY = { currentPassword: '', newPassword: '', confirmNewPassword: '' };

export default function Dashboard() {
  const { user, refreshProfile } = useContext(AuthContext);

  const [myListings, setMyListings] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [listingsError, setListingsError] = useState('');

  // Modal visibility
  const [activeModal, setActiveModal] = useState(null); // 'create' | 'edit' | 'profile' | 'security'
  const [editingId, setEditingId] = useState(null);

  // Form data
  const [propertyForm, setPropertyForm] = useState(EMPTY_PROPERTY);
  const [profileForm, setProfileForm] = useState(EMPTY_PROFILE);
  const [securityForm, setSecurityForm] = useState(EMPTY_SECURITY);

  // Form feedback
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // ── Fetch my listings ──────────────────────────────────────────────────────
  const fetchMyListings = async () => {
    setListingsLoading(true);
    setListingsError('');
    try {
      const res = await axios.get(`${API_BASE}/properties/my-listings`);
      setMyListings(res.data);
    } catch (err) {
      setListingsError(err.response?.data?.message || 'Failed to load your listings.');
    } finally {
      setListingsLoading(false);
    }
  };

  // Run exactly once on mount
  useEffect(() => {
    fetchMyListings();
    // No subscriptions to clean up here
  }, []);

  // Sync profile form when user context loads
  useEffect(() => {
    if (user) {
      setProfileForm({
        displayName: user.displayName || '',
        phone: user.phone || '',
        avatar: user.avatar || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const closeModal = () => {
    setActiveModal(null);
    setEditingId(null);
    setFormError('');
    setFormSuccess('');
  };

  const setProp = (field) => (e) =>
    setPropertyForm((prev) => ({ ...prev, [field]: e.target.value }));

  // ── Property CRUD ──────────────────────────────────────────────────────────
  const openCreateModal = () => {
    setPropertyForm(EMPTY_PROPERTY);
    setActiveModal('create');
  };

  const openEditModal = (listing) => {
    setPropertyForm({
      title: listing.title,
      description: listing.description,
      price: listing.price,
      city: listing.city,
      country: listing.country,
      propertyType: listing.propertyType,
      listingStatus: listing.listingStatus,
      bedrooms: listing.bedrooms ?? 1,
      imageUrls: (listing.imageUrls || []).join(', '),
    });
    setEditingId(listing._id);
    setActiveModal('edit');
  };

  const handlePropertySubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const { title, description, price, city, country, propertyType, listingStatus } = propertyForm;
    if (!title || !description || !price || !city || !country || !propertyType || !listingStatus) {
      setFormError('Please fill in all required fields.');
      return;
    }
    if (Number(price) <= 0) {
      setFormError('Price must be a positive number.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...propertyForm,
        price: Number(propertyForm.price),
        bedrooms: Number(propertyForm.bedrooms) || 1,
        imageUrls: propertyForm.imageUrls
          ? propertyForm.imageUrls.split(',').map((u) => u.trim()).filter(Boolean)
          : [],
      };

      if (activeModal === 'edit') {
        await axios.put(`${API_BASE}/properties/${editingId}`, payload);
      } else {
        await axios.post(`${API_BASE}/properties`, payload);
      }
      closeModal();
      fetchMyListings();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save listing. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently remove this listing?')) return;
    try {
      await axios.delete(`${API_BASE}/properties/${id}`);
      fetchMyListings();
    } catch {
      alert('Could not delete the listing. Please try again.');
    }
  };

  // ── Profile & Security ─────────────────────────────────────────────────────
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setSubmitting(true);
    try {
      await axios.put(`${API_BASE}/users/profile`, profileForm);
      await refreshProfile();
      setFormSuccess('Profile updated successfully!');
    } catch (err) {
      setFormError(err.response?.data?.message || 'Profile update failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSecuritySubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    const { currentPassword, newPassword, confirmNewPassword } = securityForm;
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setFormError('All password fields are required.');
      return;
    }
    if (newPassword.length < 6) {
      setFormError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setFormError('New passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      await axios.put(`${API_BASE}/users/security`, { currentPassword, newPassword });
      setSecurityForm(EMPTY_SECURITY);
      setFormSuccess('Password changed successfully!');
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to update password.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return <LoadingSpinner label="Loading dashboard..." />;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="container">

      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="dashboard-user-info">
          {user.avatar ? (
            <img className="user-avatar-lg" src={user.avatar} alt="avatar" />
          ) : (
            <div className="user-avatar-initials">
              {(user.username || 'U')[0].toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="page-title">My Dashboard</h1>
            <p className="text-muted">
              Welcome back, <strong>{user.displayName || user.username}</strong>
            </p>
            {user.bio && <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>{user.bio}</p>}
          </div>
        </div>
        <div className="dashboard-actions">
          <button id="btn-open-profile" className="btn btn-ghost btn-sm" onClick={() => setActiveModal('profile')}>
            ✏️ Edit Profile
          </button>
          <button id="btn-open-security" className="btn btn-ghost btn-sm" onClick={() => setActiveModal('security')}>
            🔒 Change Password
          </button>
          <button id="btn-open-create" className="btn btn-primary" onClick={openCreateModal}>
            + New Listing
          </button>
        </div>
      </div>

      {/* My Listings */}
      <h2 className="section-title">
        🏘️ My Listings
        <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          ({myListings.length})
        </span>
      </h2>

      {listingsLoading && <LoadingSpinner label="Loading your listings..." />}

      {!listingsLoading && listingsError && (
        <div className="error-state" role="alert">
          ⚠️ {listingsError}
          <button className="btn btn-outline btn-sm mt-2" onClick={fetchMyListings}>Retry</button>
        </div>
      )}

      {!listingsLoading && !listingsError && myListings.length === 0 && (
        <div className="empty-state">
          <span className="empty-state-icon">📋</span>
          <h3>No listings yet</h3>
          <p>Click <strong>+ New Listing</strong> to post your first property.</p>
        </div>
      )}

      {!listingsLoading && !listingsError && myListings.length > 0 && (
        <div className="property-grid">
          {myListings.map((listing) => (
            <PropertyCard
              key={listing._id}
              property={{ ...listing, owner: user }}
              actions={
                <>
                  <button
                    id={`btn-edit-${listing._id}`}
                    className="btn btn-ghost btn-sm w-full"
                    onClick={() => openEditModal(listing)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    id={`btn-delete-${listing._id}`}
                    className="btn btn-danger btn-sm w-full"
                    onClick={() => handleDelete(listing._id)}
                  >
                    🗑️ Delete
                  </button>
                </>
              }
            />
          ))}
        </div>
      )}

      {/* ── Profile Modal ── */}
      {activeModal === 'profile' && (
        <Modal title="Edit Profile" onClose={closeModal}>
          {formError && <div className="form-error">{formError}</div>}
          {formSuccess && <div className="form-success">{formSuccess}</div>}
          <form onSubmit={handleProfileSubmit}>
            <div className="form-group">
              <label htmlFor="profile-displayname">Display Name</label>
              <input id="profile-displayname" className="form-control" value={profileForm.displayName}
                onChange={(e) => setProfileForm({ ...profileForm, displayName: e.target.value })} />
            </div>
            <div className="form-group">
              <label htmlFor="profile-phone">Phone Number</label>
              <input id="profile-phone" className="form-control" value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} />
            </div>
            <div className="form-group">
              <label htmlFor="profile-avatar">Avatar URL</label>
              <input id="profile-avatar" className="form-control" placeholder="https://..." value={profileForm.avatar}
                onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })} />
            </div>
            <div className="form-group">
              <label htmlFor="profile-bio">Short Bio</label>
              <textarea id="profile-bio" className="form-control" rows={2} maxLength={300} value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                placeholder="Tell others a bit about yourself..." />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline" onClick={closeModal} style={{ flex: 1 }}>Cancel</button>
              <button id="btn-save-profile" type="submit" className="btn btn-primary" disabled={submitting} style={{ flex: 1 }}>
                {submitting ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Security Modal ── */}
      {activeModal === 'security' && (
        <Modal title="Change Password" onClose={closeModal}>
          {formError && <div className="form-error">{formError}</div>}
          {formSuccess && <div className="form-success">{formSuccess}</div>}
          <form onSubmit={handleSecuritySubmit}>
            <div className="form-group">
              <label htmlFor="sec-current">Current Password</label>
              <input id="sec-current" type="password" className="form-control"
                value={securityForm.currentPassword}
                onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })} required />
            </div>
            <div className="form-group">
              <label htmlFor="sec-new">New Password</label>
              <input id="sec-new" type="password" className="form-control" placeholder="Min. 6 characters"
                value={securityForm.newPassword}
                onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })} required />
            </div>
            <div className="form-group">
              <label htmlFor="sec-confirm">Confirm New Password</label>
              <input id="sec-confirm" type="password" className="form-control"
                value={securityForm.confirmNewPassword}
                onChange={(e) => setSecurityForm({ ...securityForm, confirmNewPassword: e.target.value })} required />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline" onClick={closeModal} style={{ flex: 1 }}>Cancel</button>
              <button id="btn-save-password" type="submit" className="btn btn-danger" disabled={submitting} style={{ flex: 1 }}>
                {submitting ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Create / Edit Listing Modal ── */}
      {(activeModal === 'create' || activeModal === 'edit') && (
        <Modal
          title={activeModal === 'edit' ? 'Edit Listing' : 'New Listing'}
          onClose={closeModal}
          maxWidth="600px"
        >
          {formError && <div className="form-error">{formError}</div>}
          <form onSubmit={handlePropertySubmit}>
            <div className="form-group">
              <label htmlFor="prop-title">Title *</label>
              <input id="prop-title" className="form-control" placeholder="e.g. Modern 2-bed in Victoria Island"
                value={propertyForm.title} onChange={setProp('title')} required />
            </div>
            <div className="form-group">
              <label htmlFor="prop-desc">Description *</label>
              <textarea id="prop-desc" className="form-control" rows={3}
                value={propertyForm.description} onChange={setProp('description')} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="prop-price">Price ($) *</label>
                <input id="prop-price" type="number" className="form-control" min="1"
                  value={propertyForm.price} onChange={setProp('price')} required />
              </div>
              <div className="form-group">
                <label htmlFor="prop-bedrooms">Bedrooms</label>
                <input id="prop-bedrooms" type="number" className="form-control" min="0"
                  value={propertyForm.bedrooms} onChange={setProp('bedrooms')} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="prop-type">Property Type *</label>
                <select id="prop-type" className="form-control" value={propertyForm.propertyType} onChange={setProp('propertyType')}>
                  <option>Apartment</option>
                  <option>House</option>
                  <option>Studio</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="prop-status">Listing Status *</label>
                <select id="prop-status" className="form-control" value={propertyForm.listingStatus} onChange={setProp('listingStatus')}>
                  <option value="Sale">For Sale</option>
                  <option value="Rent">For Rent</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="prop-city">City *</label>
                <input id="prop-city" className="form-control" value={propertyForm.city} onChange={setProp('city')} required />
              </div>
              <div className="form-group">
                <label htmlFor="prop-country">Country *</label>
                <input id="prop-country" className="form-control" value={propertyForm.country} onChange={setProp('country')} required />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="prop-images">Image URLs <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(comma-separated)</span></label>
              <input id="prop-images" className="form-control" placeholder="https://img1.com, https://img2.com"
                value={propertyForm.imageUrls} onChange={setProp('imageUrls')} />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline" onClick={closeModal} style={{ flex: 1 }}>Cancel</button>
              <button id="btn-submit-listing" type="submit" className="btn btn-primary" disabled={submitting} style={{ flex: 1 }}>
                {submitting ? 'Saving...' : activeModal === 'edit' ? 'Save Changes' : 'Post Listing'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
