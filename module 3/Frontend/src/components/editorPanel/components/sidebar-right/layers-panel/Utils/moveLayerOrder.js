export const moveLayerOrder = (
  elements,
  selectedIds,
  direction // "forward" | "backward"
) => {
  if (!selectedIds.length) return elements;

  const selectedId = selectedIds[0];

  const selected = elements.find(el => el.id === selectedId);

  if (!selected) return elements;

  const siblings = elements
    .filter(el => el.parentId === selected.parentId)
    .sort((a, b) => a.order - b.order);

  const index = siblings.findIndex(el => el.id === selectedId);

  if (index === -1) return elements;

  if (direction === "forward" && index < siblings.length - 1) {
    [siblings[index], siblings[index + 1]] =
      [siblings[index + 1], siblings[index]];
  }

  if (direction === "backward" && index > 0) {
    [siblings[index], siblings[index - 1]] =
      [siblings[index - 1], siblings[index]];
  }

  siblings.forEach((item, idx) => {
    item.order = idx;
  });

  return elements.map(el => {
    const updated = siblings.find(s => s.id === el.id);
    return updated || el;
  });
};