export const selectLayer = (selectedIds, setSelectedIds, id, e) => {
  if (e.ctrlKey || e.metaKey) {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  } else {
    setSelectedIds([id]);
  }
};