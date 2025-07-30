// Adds a user; disables submit if input is empty. Enter key submits.

import { useState } from 'react';

export default function AddUser({ onAdd }) {
  const [name, setName] = useState('');

  const submit = () => onAdd(name.trim(), () => setName(''));

  return (
    <div className="card shadow-sm rounded-3 mb-4 card-accent-primary">
      <div className="card-body">
        <label className="form-label fw-semibold">Add New User</label>
        <div className="input-group">
          <input
            className="form-control"
            placeholder="Enter user name"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
          />
          <button className="btn btn-primary" onClick={submit}>Add</button>
        </div>
      </div>
    </div>
  );
}
