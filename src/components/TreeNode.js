import { useState } from 'react';

export default function TreeNode({
  node, level = 0, selectedId, expandedIds, onSelect, onToggle, onAdd, onEdit, onDelete,
}) {
  const [hovering, setHovering] = useState(false);
  const isExpanded = expandedIds.has(node.id);
  const isSelected = selectedId === node.id;
  const hasChildren = node.children?.length > 0;
  const dim1 = node.dimensions?.find(d => d.trackAmount || d.trackQuantity);

  return (
    <div>
      <div
        className={`lv-row ${isSelected ? 'lv-row-sel' : ''}`}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onClick={() => onSelect(node)}
        onDoubleClick={() => onEdit(node)}
      >
        {/* Toggle */}
        <span
          className="lv-td lv-td-toggle"
          style={{ paddingLeft: `${level * 14}px` }}
          onClick={e => { e.stopPropagation(); if (hasChildren) onToggle(node.id); }}
        >
          {hasChildren ? (isExpanded ? '▾' : '▸') : null}
        </span>

        {/* T badge */}
        <span className="lv-td lv-td-badge">
          <span className="lv-badge">T</span>
        </span>

        {/* Code */}
        <span className="lv-td lv-td-code">{node.code}</span>

        {/* Description */}
        <span className="lv-td lv-td-desc">{node.description}</span>

        {/* Section */}
        <span className="lv-td lv-td-section">{node.section}</span>

        {/* Type */}
        <span className="lv-td lv-td-type">{node.type}</span>

        {/* O (off-balance) */}
        <span className="lv-td lv-td-sm">{node.offBalance ? '✓' : ''}</span>

        {/* Cur */}
        <span className="lv-td lv-td-sm"></span>

        {/* Q */}
        <span className="lv-td lv-td-sm">
          {node.dimensions?.some(d => d.trackQuantity) ? <span className="lv-check">✓</span> : ''}
        </span>

        {/* Dep */}
        <span className="lv-td lv-td-sm"></span>

        {/* Dimension 1 */}
        <span className="lv-td lv-td-dim">{dim1?.name || ''}</span>

        {/* Hover actions */}
        {hovering && (
          <span className="lv-row-actions" onClick={e => e.stopPropagation()}>
            <button title="Add Child" onClick={() => onAdd(node)}>+</button>
            <button title="Edit" onClick={() => onEdit(node)}>✎</button>
            <button title="Delete" onClick={() => onDelete(node)}>✕</button>
          </span>
        )}
      </div>

      {isExpanded && hasChildren && node.children.map(child => (
        <TreeNode
          key={child.id}
          node={child}
          level={level + 1}
          selectedId={selectedId}
          expandedIds={expandedIds}
          onSelect={onSelect}
          onToggle={onToggle}
          onAdd={onAdd}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
