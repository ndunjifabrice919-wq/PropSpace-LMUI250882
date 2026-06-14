/**
 * LoadingSpinner — animated spinner with optional label.
 */
export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="spinner-wrap">
      <div className="spinner" role="status" aria-label="loading" />
      <span>{label}</span>
    </div>
  );
}
