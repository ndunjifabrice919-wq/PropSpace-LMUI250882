/**
 * FilterSidebar — search and filter panel for the property feed.
 * Renders city search, price range, property type, and listing status filters.
 *
 * Props:
 *  - filters: { city, minPrice, maxPrice, propertyType, listingStatus }
 *  - onChange: callback(updatedFilters)
 *  - onReset: callback to clear all filters
 */
export default function FilterSidebar({ filters, onChange, onReset }) {
  const handle = (field) => (e) => onChange({ ...filters, [field]: e.target.value });

  return (
    <div className="filters-panel" role="search" aria-label="Property filters">
      {/* City search */}
      <div className="filter-group" style={{ flex: 2, minWidth: 180 }}>
        <label htmlFor="filter-city">City</label>
        <input
          id="filter-city"
          className="form-control"
          type="text"
          placeholder="e.g. Douala, Yaounde..."
          value={filters.city}
          onChange={handle('city')}
        />
      </div>

      {/* Min Price */}
      <div className="filter-group">
        <label htmlFor="filter-min-price">Min Price (FCFA)</label>
        <input
          id="filter-min-price"
          className="form-control"
          type="number"
          min="0"
          placeholder="0"
          value={filters.minPrice}
          onChange={handle('minPrice')}
        />
      </div>

      {/* Max Price */}
      <div className="filter-group">
        <label htmlFor="filter-max-price">Max Price (FCFA)</label>
        <input
          id="filter-max-price"
          className="form-control"
          type="number"
          min="0"
          placeholder="Any"
          value={filters.maxPrice}
          onChange={handle('maxPrice')}
        />
      </div>

      {/* Property Type */}
      <div className="filter-group">
        <label htmlFor="filter-type">Type</label>
        <select
          id="filter-type"
          className="form-control"
          value={filters.propertyType}
          onChange={handle('propertyType')}
        >
          <option value="">All Types</option>
          <option>Apartment</option>
          <option>House</option>
          <option>Studio</option>
        </select>
      </div>

      {/* Listing Status */}
      <div className="filter-group">
        <label htmlFor="filter-status">Status</label>
        <select
          id="filter-status"
          className="form-control"
          value={filters.listingStatus}
          onChange={handle('listingStatus')}
        >
          <option value="">Rent & Sale</option>
          <option value="Rent">For Rent</option>
          <option value="Sale">For Sale</option>
        </select>
      </div>

      {/* Reset button */}
      <div className="filter-group" style={{ flex: 0, minWidth: 'auto' }}>
        <label style={{ visibility: 'hidden' }}>Reset</label>
        <button
          id="btn-reset-filters"
          className="btn btn-outline btn-sm"
          onClick={onReset}
          type="button"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
