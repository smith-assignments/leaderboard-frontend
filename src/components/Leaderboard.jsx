// Renders the ranked list. Server guarantees deterministic order; no client-side sorting.

export default function Leaderboard({ rows }) {
  return (
    <div className="card shadow-sm rounded-3 card-accent-primary">
      <div className="card-header bg-white d-flex align-items-center">
        <h5 className="card-title m-0">Leaderboard</h5>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle mb-0 table-tinted">
            <thead>
              <tr>
                <th scope="col">Rank</th>
                <th scope="col">Name</th>
                <th scope="col">Total Points</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.userId}>
                  <td>
                    <span className="badge text-bg-secondary">{r.rank}</span>
                  </td>
                  <td className="fw-medium">{r.name}</td>
                  <td className="fw-semibold">{r.totalPoints}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-muted">No data</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
