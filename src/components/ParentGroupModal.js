import React, { useState, useMemo } from 'react';
import { filterTree, flattenTree } from '../utils/accountUtils';

function ModalRow({ node, level, highlightedId, expandedIds, onToggle, onHighlight, onSelect }) {
  const isExpanded = expandedIds.has(node.id);
  const isHighlighted = highlightedId === node.id;
  const hasChildren = node.children?.length > 0;

  return (
    <div>
      <div
        className={`pm-row ${isHighlighted ? 'pm-row-hl' : ''}`}
        style={{ paddingLeft: `${level * 18 + 6}px` }}
        onClick={() => onHighlight(node.id)}
        onDoubleClick={() => onSelect(node.id)}
      >
        {/* expand toggle */}
        <span
          className="pm-toggle"
          onClick={e => { e.stopPropagation(); if (hasChildren) onToggle(node.id); }}
        >
          {hasChildren
            ? (isExpanded ? '▾' : '▸')
            : <span style={{ display: 'inline-block', width: 10 }} />}
        </span>

        {/* T badge */}
        <span className="pm-badge">T</span>

        {/* Code */}
        <span className="pm-code">{node.code}</span>

        {/* Description */}
        <span className="pm-desc">{node.description}</span>

        {/* Section */}
        <span className="pm-section">{node.section}</span>

        {/* Type */}
        <span className="pm-type">{node.type}</span>

        {/* Off-B */}
        <span className="pm-offb">{node.offBalance ? '✓' : ''}</span>

        {/* Q */}
        <span className="pm-q">
          {node.dimensions?.some(d => d.trackQuantity) ? '✓' : ''}
        </span>
      </div>

      {isExpanded && hasChildren && node.children.map(child => (
        <ModalRow
          key={child.id}
          node={child}
          level={level + 1}
          highlightedId={highlightedId}
          expandedIds={expandedIds}
          onToggle={onToggle}
          onHighlight={onHighlight}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

export default function ParentGroupModal({ accounts, currentId, selectedId, onSelect, onClose }) {
  const [search, setSearch] = useState('');
  const [highlighted, setHighlighted] = useState(selectedId || '');
  const [expandedIds, setExpandedIds] = useState(() => {
    const ids = new Set();
    flattenTree(accounts).forEach(n => { if (n.children?.length) ids.add(n.id); });
    return ids;
  });

  const baseAccounts = useMemo(() => {
    if (!currentId) return accounts;
    return accounts.map(n => removeNode(n, currentId)).filter(Boolean);
  }, [accounts, currentId]);

  const filtered = useMemo(() => filterTree(baseAccounts, search), [baseAccounts, search]);
  const totalCount = flattenTree(filtered).length;

  const toggle = id => setExpandedIds(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const handleConfirmSelect = (id) => {
    const target = id || highlighted;
    if (target) onSelect(target);
  };

  return (
    <div className="pm-overlay" onClick={onClose}>
      <div className="pm-modal" onClick={e => e.stopPropagation()}>

        {/* Title bar */}
        <div className="pm-titlebar">
          <span className="pm-title">Chart of Accounts</span>
          <div className="pm-titlebar-right">
            <button className="pm-icon-btn" title="Link">🔗</button>
            <button className="pm-icon-btn" title="Info">ℹ</button>
            <button className="pm-icon-btn" title="Maximize">⛶</button>
            <button className="pm-icon-btn pm-close-btn" onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="pm-toolbar">
          <button
            className="pm-btn-select"
            onClick={() => handleConfirmSelect()}
            disabled={!highlighted}
          >
            Select
          </button>
          <div className="pm-search">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
            />
            {search
              ? <button className="pm-search-clear" onClick={() => setSearch('')}>✕</button>
              : <span className="pm-search-icon">🔍</span>
            }
          </div>
          <button className="pm-btn-outline">More actions ▾</button>
          <button className="pm-btn-help">?</button>
        </div>

        {/* Column headers */}
        <div className="pm-col-header">
          <span className="pmh-toggle"></span>
          <span className="pmh-badge"></span>
          <span className="pmh-code">Code</span>
          <span className="pmh-desc">Description</span>
          <span className="pmh-section">Section</span>
          <span className="pmh-type">Type</span>
          <span className="pmh-offb">Off-B</span>
          <span className="pmh-q">Q</span>
        </div>

        {/* Rows */}
        <div className="pm-body">
          {filtered.length === 0 ? (
            <div className="pm-empty">No accounts found</div>
          ) : (
            filtered.map(node => (
              <ModalRow
                key={node.id}
                node={node}
                level={0}
                highlightedId={highlighted}
                expandedIds={expandedIds}
                onToggle={toggle}
                onHighlight={setHighlighted}
                onSelect={handleConfirmSelect}
              />
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pm-footer">
          <span>{totalCount} record{totalCount !== 1 ? 's' : ''}</span>
          <div className="pm-footer-nav">
            <button className="pm-nav-btn">◀◀</button>
            <button className="pm-nav-btn">◀</button>
            <button className="pm-nav-btn">▶</button>
            <button className="pm-nav-btn">▶▶</button>
          </div>
        </div>

      </div>
    </div>
  );
}

function removeNode(node, id) {
  if (node.id === id) return null;
  return { ...node, children: (node.children || []).map(c => removeNode(c, id)).filter(Boolean) };
}
