import React, { useState, useMemo, useRef } from 'react';
import './App.css';
import TreeNode from './components/TreeNode';
import AccountForm from './components/AccountForm';
import GLTab from './components/GLTab';
import { initialAccounts } from './data/masterData';
import {
  filterTree, insertNode, updateNode, deleteNode, generateId,
} from './utils/accountUtils';

export default function App() {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [view, setView] = useState('list');
  const [formMode, setFormMode] = useState('create');
  const [editingAccount, setEditingAccount] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [expandedIds, setExpandedIds] = useState(new Set(['1', '2', '2-1']));
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const formRef = useRef();

  const filtered = useMemo(() => filterTree(accounts, search), [accounts, search]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const handleToggle = id => setExpandedIds(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const openCreate = (parentNode = null) => {
    setEditingAccount(parentNode ? { parentId: parentNode.id } : { parentId: '' });
    setFormMode('create');
    setView('form');
  };

  const openEdit = (node) => { setEditingAccount(node); setFormMode('edit'); setView('form'); };
  const handleDelete = (node) => setDeleteConfirm(node);

  const confirmDelete = () => {
    setAccounts(prev => deleteNode(prev, deleteConfirm.id));
    if (selectedId === deleteConfirm.id) setSelectedId(null);
    setDeleteConfirm(null);
    showToast(`Deleted: ${deleteConfirm.description}`);
  };

  const handleSaveAndClose = (form) => {
    if (formMode === 'create') {
      const newNode = { ...form, id: generateId(), children: [] };
      setAccounts(prev => insertNode(prev, form.parentId || null, newNode));
      setSelectedId(newNode.id);
      if (form.parentId) setExpandedIds(prev => new Set([...prev, form.parentId]));
      showToast(`Added: ${newNode.description}`);
    } else {
      setAccounts(prev => updateNode(prev, form));
      showToast(`Updated: ${form.description}`);
    }
    setView('list');
  };

  const handleSave = (form) => {
    if (formMode === 'create') {
      const newNode = { ...form, id: generateId(), children: [] };
      setAccounts(prev => insertNode(prev, form.parentId || null, newNode));
      setSelectedId(newNode.id);
      setEditingAccount(newNode);
      setFormMode('edit');
      if (form.parentId) setExpandedIds(prev => new Set([...prev, form.parentId]));
      showToast(`Saved: ${newNode.description}`);
    } else {
      setAccounts(prev => updateNode(prev, form));
      setEditingAccount(form);
      showToast(`Saved: ${form.description}`);
    }
  };

  // ── FORM VIEW ──
  if (view === 'form') {
    const title = `GL Account (${formMode === 'create' ? 'create' : 'edit'})`;
    return (
      <div className="app-root">
        {/* Form top bar */}
        <div className="fv-topbar">
          <div className="fv-topbar-left">
            <button className="fv-nav-btn" onClick={() => setView('list')}>←</button>
            <button className="fv-nav-btn">→</button>
            <span className="fv-title">{title}</span>
          </div>
          <div className="fv-topbar-right">
            <span className="fv-link-icon">🔗</span>
            <span className="fv-link-icon">⋮</span>
          </div>
        </div>
        {/* Form action bar */}
        <div className="fv-actionbar">
          <button className="fv-btn-save-close" onClick={() => formRef.current?.saveAndClose()}>Save and close</button>
          <button className="fv-btn-save" onClick={() => formRef.current?.save()}>Save</button>
          <button className="fv-btn-gl">General Ledger</button>
          <div style={{ flex: 1 }} />
          <button className="fv-btn-more">More actions ▾</button>
          <button className="fv-btn-help">?</button>
        </div>
        <AccountForm
          ref={formRef}
          account={editingAccount}
          accounts={accounts}
          onSaveAndClose={handleSaveAndClose}
          onSave={handleSave}
        />
        {toast && <Toast msg={toast} />}
      </div>
    );
  }

  // ── LIST VIEW ──
  return (
    <div className="app-root">
      {/* List top bar */}
      <div className="lv-topbar">
        <div className="lv-topbar-left">
          <button className="fv-nav-btn">←</button>
          <button className="fv-nav-btn">→</button>
          <span className="lv-title">Chart of Accounts</span>
        </div>
        <div className="lv-topbar-right">
          <span className="fv-link-icon">🔗</span>
          <span className="fv-link-icon">⋮</span>
        </div>
      </div>

      {/* List action bar */}
      <div className="lv-actionbar">
        <div className="lv-actionbar-left">
          <button className="lv-btn-create" onClick={() => openCreate()}>Create</button>
          <button className="lv-btn-icon" title="Lock">🔒</button>
          <button className="lv-btn-gl">General Ledger</button>
          <button className="lv-btn-icon" title="Grid">⊞</button>
        </div>
        <div className="lv-actionbar-right">
          <div className="lv-search">
            <input
              type="text"
              placeholder="Search (Ctrl+F)"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search
              ? <button className="lv-search-clear" onClick={() => setSearch('')}>✕</button>
              : <span className="lv-search-icon">🔍</span>
            }
          </div>
          <button className="lv-btn-search-opt">🔍 ▾</button>
          <button className="lv-btn-more">More actions ▾</button>
          <button className="lv-btn-help">?</button>
        </div>
      </div>

      {/* List table */}
      <div className="lv-table-wrap">
        {/* Column headers */}
        <div className="lv-thead">
          <span className="lv-th lv-th-toggle"></span>
          <span className="lv-th lv-th-badge"></span>
          <span className="lv-th lv-th-code">Code</span>
          <span className="lv-th lv-th-desc">Description</span>
          <span className="lv-th lv-th-section">Section</span>
          <span className="lv-th lv-th-type">Type</span>
          <span className="lv-th lv-th-sm">O ↓</span>
          <span className="lv-th lv-th-sm">Cur</span>
          <span className="lv-th lv-th-sm">Q</span>
          <span className="lv-th lv-th-sm">Dep</span>
          <span className="lv-th lv-th-dim">Dimension 1</span>
        </div>

        {/* Rows */}
        <div className="lv-tbody">
          {filtered.length === 0 ? (
            <div className="lv-empty">No accounts found</div>
          ) : (
            filtered.map(node => (
              <TreeNode
                key={node.id}
                node={node}
                level={0}
                selectedId={selectedId}
                expandedIds={expandedIds}
                onSelect={n => setSelectedId(n.id)}
                onToggle={handleToggle}
                onAdd={openCreate}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>

      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-title">Delete Account</div>
            <p>Are you sure you want to delete <strong>{deleteConfirm.code} — {deleteConfirm.description}</strong>?</p>
            {deleteConfirm.children?.length > 0 && (
              <p className="modal-warning">⚠ This account has child accounts that will also be deleted.</p>
            )}
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn-delete" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
      {toast && <Toast msg={toast} />}
    </div>
  );
}

function Toast({ msg }) {
  return (
    <div className="toast">
      <span>ℹ</span> {msg}
    </div>
  );
}
