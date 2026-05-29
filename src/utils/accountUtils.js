// Flatten tree to array
export function flattenTree(nodes, result = []) {
  for (const node of nodes) {
    result.push(node);
    if (node.children?.length) flattenTree(node.children, result);
  }
  return result;
}

// Find node by id in tree
export function findNode(nodes, id) {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children?.length) {
      const found = findNode(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

// Get breadcrumb path for a node
export function getBreadcrumb(nodes, id) {
  const flat = flattenTree(nodes);
  const path = [];
  let current = flat.find(n => n.id === id);
  while (current) {
    path.unshift(current);
    current = current.parentId ? flat.find(n => n.id === current.parentId) : null;
  }
  return path;
}

// Insert node into tree
export function insertNode(nodes, parentId, newNode) {
  if (!parentId) return [...nodes, newNode];
  return nodes.map(node => {
    if (node.id === parentId) {
      return { ...node, children: [...(node.children || []), newNode] };
    }
    if (node.children?.length) {
      return { ...node, children: insertNode(node.children, parentId, newNode) };
    }
    return node;
  });
}

// Update node in tree
export function updateNode(nodes, updatedNode) {
  return nodes.map(node => {
    if (node.id === updatedNode.id) return { ...updatedNode, children: node.children };
    if (node.children?.length) {
      return { ...node, children: updateNode(node.children, updatedNode) };
    }
    return node;
  });
}

// Delete node from tree
export function deleteNode(nodes, id) {
  return nodes
    .filter(node => node.id !== id)
    .map(node => ({
      ...node,
      children: node.children?.length ? deleteNode(node.children, id) : [],
    }));
}

// Filter tree by search query
export function filterTree(nodes, query) {
  if (!query) return nodes;
  const q = query.toLowerCase();
  return nodes.reduce((acc, node) => {
    const filteredChildren = filterTree(node.children || [], query);
    const matches =
      node.description.toLowerCase().includes(q) ||
      node.code.toLowerCase().includes(q);
    if (matches || filteredChildren.length > 0) {
      acc.push({ ...node, children: filteredChildren });
    }
    return acc;
  }, []);
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
