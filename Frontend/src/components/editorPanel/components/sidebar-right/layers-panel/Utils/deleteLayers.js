export const deleteSelected = (
  elements,
  selectedIds
) => {
  return elements.filter(
    (el) => !selectedIds.includes(el.id)
  );
};