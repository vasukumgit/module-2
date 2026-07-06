export const duplicateSelected = (elements, selectedIds) => {
  const selected = elements.filter((el) => selectedIds.includes(el.id));

  const duplicates = selected.map((el) => ({
    ...el,
    id: `copy-${Date.now()}-${Math.random()}`,
    name: `${el.name || el.type} Copy`,
    x: (el.x || 0) + 20,
    y: (el.y || 0) + 20,
    order: elements.length,
  }));

  return {
    elements: [...elements, ...duplicates],
    selectedIds: duplicates.map((d) => d.id),
  };
};
