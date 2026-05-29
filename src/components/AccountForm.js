import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { ACCOUNT_TYPES, SECTIONS, DIMENSIONS } from '../data/masterData';
import { flattenTree } from '../utils/accountUtils';
import ParentGroupModal from './ParentGroupModal';

const emptyForm = {
  code: '', description: '', parentId: '', type: 'Dr/Cr',
  section: '', offBalance: false, details: '',
  dimensions: DIMENSIONS.map(d => ({ ...d, trackAmount: false, trackQuantity: false })),
};

const AccountForm = forwardRef(function AccountForm({ account, accounts, onSaveAndClose, onSave }, ref) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [showParentModal, setShowParentModal] = useState(false);

  useEffect(() => {
    if (account) {
      const dims = DIMENSIONS.map(d => {
        const existing = account.dimensions?.find(x => x.id === d.id);
        return existing ? { ...d, ...existing } : { ...d, trackAmount: false, trackQuantity: false };
      });
      setForm({ ...emptyForm, ...account, dimensions: dims });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [account]);

  const flat = flattenTree(accounts).filter(n => !account?.id || n.id !== account.id);
  const selectedParent = flat.find(n => n.id === form.parentId);

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const validate = () => {
    const e = {};
    if (!form.code.trim()) e.code = true;
    if (!form.description.trim()) e.description = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  useImperativeHandle(ref, () => ({
    saveAndClose: () => { if (validate()) onSaveAndClose(form); },
    save: () => { if (validate()) onSave(form); },
  }));

  return (
    <div className="cf-page">
      <div className="cf-body">

        {/* Code + Parent Group */}
        <div className="cf-row">
          <label className="cf-lbl">Code</label>
          <input
            className={`cf-inp cf-inp-code ${errors.code ? 'cf-inp-err' : ''}`}
            value={form.code}
            onChange={e => set('code', e.target.value)}
            autoFocus
          />
          {errors.code && <span className="cf-req">*</span>}

          <label className="cf-lbl cf-lbl-ml">Parent Group</label>
          <div className="cf-parent">
            <input
              className="cf-inp cf-inp-pg"
              readOnly
              value={selectedParent ? selectedParent.description : ''}
              onClick={() => setShowParentModal(true)}
            />
            <button className="cf-pg-arrow" onClick={() => setShowParentModal(true)}>▼</button>
            <button className="cf-pg-link" onClick={() => setShowParentModal(true)}>🔗</button>
          </div>
        </div>

        {/* Description */}
        <div className="cf-row">
          <label className="cf-lbl">Description</label>
          <input
            className={`cf-inp cf-inp-desc ${errors.description ? 'cf-inp-err' : ''}`}
            value={form.description}
            onChange={e => set('description', e.target.value)}
          />
          {errors.description && <span className="cf-req">*</span>}
        </div>

        {/* Type */}
        <div className="cf-row">
          <label className="cf-lbl">Type</label>
          <div className="cf-radios">
            {ACCOUNT_TYPES.map(t => (
              <label key={t} className="cf-radio">
                <input
                  type="radio"
                  name="cf-type"
                  value={t}
                  checked={form.type === t}
                  onChange={() => set('type', t)}
                />
                <span>{t}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Section */}
        <div className="cf-row">
          <label className="cf-lbl">Section</label>
          <div className="cf-sel-wrap">
            <select
              className="cf-sel"
              value={form.section}
              onChange={e => set('section', e.target.value)}
            >
              <option value=""></option>
              {SECTIONS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Off-Balance */}
        <div className="cf-row">
          <label className="cf-lbl"></label>
          <label className="cf-chk">
            <input
              type="checkbox"
              checked={form.offBalance}
              onChange={e => set('offBalance', e.target.checked)}
            />
            <span>Off-Balance</span>
          </label>
        </div>

        {/* Extra Dimensions */}
        <div className="cf-row cf-row-top">
          <label className="cf-lbl cf-lbl-top">Extra Dimensions &nbsp; </label>
          <textarea
            className="cf-textarea"
            readOnly
            value={form.section}
            rows={4}
            placeholder="Select a Section above to see value here..."
          />
        </div>

        {/* Details */}
        <div className="cf-row cf-row-top">
          <label className="cf-lbl cf-lbl-top">Details</label>
          <textarea
            className="cf-textarea"
            value={form.details}
            onChange={e => set('details', e.target.value)}
            rows={5}
          />
        </div>

      </div>

      {showParentModal && (
        <ParentGroupModal
          accounts={accounts}
          currentId={account?.id}
          selectedId={form.parentId}
          onSelect={id => { set('parentId', id); setShowParentModal(false); }}
          onClose={() => setShowParentModal(false)}
        />
      )}
    </div>
  );
});

export default AccountForm;
