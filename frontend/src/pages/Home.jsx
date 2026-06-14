import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import PropertyCard from '../components/PropertyCard';
import FilterSidebar from '../components/FilterSidebar';
import LoadingSpinner from '../components/LoadingSpinner';

const API_BASE = 'http://localhost:5000/api';

const DEFAULT_FILTERS = {
  city: '',
  minPrice: '',
  maxPrice: '',
  propertyType: '',
  listingStatus: '',
};

export default function Home() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // Build query params from non-empty filter values
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== '')
      );
      const res = await axios.get(`${API_BASE}/properties`, { params });
      setProperties(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load listings. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch once on mount and whenever filters change
  useEffect(() => {
    const debounce = setTimeout(fetchProperties, 350);
    return () => clearTimeout(debounce);
  }, [fetchProperties]);

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-eyebrow">
          <span>🏙️</span> Real Estate Marketplace
        </div>
        <h1 className="hero-title">
          Find Your Perfect<br />Property Today
        </h1>
        <p className="hero-subtitle">
          Browse thousands of verified listings — apartments, houses, and studios
          available for rent or sale across the globe.
        </p>
      </section>

      {/* Filters + Listings */}
      <div className="container">
        <FilterSidebar
          filters={filters}
          onChange={setFilters}
          onReset={() => setFilters(DEFAULT_FILTERS)}
        />

        {/* Results Header */}
        <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>
            Available Listings
          </h2>
          {!loading && !error && (
            <span className="text-muted" style={{ fontSize: '0.9rem' }}>
              {properties.length} propert{properties.length !== 1 ? 'ies' : 'y'} found
            </span>
          )}
        </div>

        {/* States */}
        {loading && <LoadingSpinner label="Fetching listings..." />}

        {!loading && error && (
          <div className="error-state" role="alert">
            <p>⚠️ {error}</p>
            <button className="btn btn-outline btn-sm mt-2" onClick={fetchProperties}>
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && properties.length === 0 && (
          <div className="empty-state">
            <span className="empty-state-icon">🔍</span>
            <h3>No listings found</h3>
            <p>Try adjusting your filters or check back later.</p>
          </div>
        )}

        {!loading && !error && properties.length > 0 && (
          <div className="property-grid">
            {properties.map((p) => (
              <PropertyCard key={p._id} property={p} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
