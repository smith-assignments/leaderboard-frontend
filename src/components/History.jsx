// Paginated claim feed. Prev/Next buttons are disabled appropriately; shows subtle loading state.

export default function History({ page, limit, total, items, onPageChange, loading }) {
  const totalPages = Math.max(1, Math.ceil((total || 0) / (limit || 1)));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="card shadow-sm rounded-3 card-accent-secondary">
      <div className="card-header bg-white d-flex justify-content-between align-items-center">
        <h5 className="card-title m-0">Recent Claims</h5>
        <small className="text-muted">
          Page {page} / {totalPages}
        </small>
      </div>

      <div className="card-body">
        {loading ? (
          <div className="d-flex align-items-center justify-content-center py-4">
            <div className="spinner-border" role="status" aria-hidden="true"></div>
            <span className="ms-2">Loading…</span>
          </div>
        ) : items?.length ? (
          <ul className="list-group list-group-flush">
            {items.map(h => (
              <li key={h.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div className="me-3">
                  <div className="fw-semibold">{h.userName}</div>
                  <small className="text-muted">{new Date(h.timestamp).toLocaleString()}</small>
                </div>
                
                <span className={
                  `badge fs-6 ${
                    h.points >= 8 ? 'text-bg-primary' :
                    h.points >= 4 ? 'text-bg-success' : 'text-bg-warning'
                  }`
                }>
                  +{h.points}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-muted">No claims yet.</div>
        )}
      </div>

      <div className="card-footer bg-white d-flex gap-2 justify-content-between">
        <button className="btn btn-outline-secondary" disabled={!canPrev || loading} onClick={() => canPrev && onPageChange(page - 1)}>
          ‹ Prev
        </button>
        <div className="d-flex align-items-center gap-2">
          <span className="badge badge-soft-secondary">Total: {total || 0}</span>
          <span className="badge badge-soft-secondary">Per page: {limit}</span>
        </div>
        <button className="btn btn-outline-secondary" disabled={!canNext || loading} onClick={() => canNext && onPageChange(page + 1)}>
          Next ›
        </button>
      </div>
    </div>
  );
}
