import React, { useState } from 'react';
import { flattenTree } from '../utils/accountUtils';

const GL_TABS = [
  { key: 'inventory', label: 'Inventory GL Account', fields: ['Inventory Account', 'COGS Account', 'Price Difference Account', 'Returns Account'] },
  { key: 'fixedAssets', label: 'Fixed Assets', fields: ['Asset Account', 'Accumulated Depreciation', 'Depreciation Expense', 'Gain/Loss on Disposal'] },
  { key: 'manpower', label: 'Manpower', fields: ['Salaries Expense', 'Payroll Liability', 'Employee Benefits', 'Bonus Expense'] },
  { key: 'purchase', label: 'Purchase Accounts', fields: ['Purchase Account', 'Purchase Returns', 'Purchase Discount', 'Freight Account'] },
];

export default function GLTab({ accounts }) {
  const [activeTab, setActiveTab] = useState('inventory');
  const [values, setValues] = useState({});
  const flat = flattenTree(accounts);
  const tab = GL_TABS.find(t => t.key === activeTab);

  const set = (field, val) => setValues(v => ({ ...v, [`${activeTab}_${field}`]: val }));
  const get = field => values[`${activeTab}_${field}`] || '';

  return (
    <div className="gl-tab-panel">
      <div className="gl-tabs">
        {GL_TABS.map(t => (
          <button
            key={t.key}
            className={`gl-tab-btn ${activeTab === t.key ? 'active' : ''}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="gl-tab-content">
        <div className="form-grid">
          {tab.fields.map(field => (
            <div className="form-field" key={field}>
              <label>{field}</label>
              <select value={get(field)} onChange={e => set(field, e.target.value)}>
                <option value="">— Select Account —</option>
                {flat.map(n => (
                  <option key={n.id} value={n.id}>{n.code} — {n.description}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
        <div className="form-actions">
          <button className="btn-cancel">Cancel</button>
          <button className="btn-save">Save</button>
        </div>
      </div>
    </div>
  );
}
