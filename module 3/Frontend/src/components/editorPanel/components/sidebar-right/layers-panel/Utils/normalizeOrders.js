export const normalizeOrders = (items) => {
  const updated = [...items];

  const parentGroups = [...new Set(updated.map((item) => item.parentId))];

  parentGroups.forEach((parentId) => {
    updated
      .filter((item) => item.parentId === parentId)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .forEach((item, index) => {
        item.order = index;
      });
  });

  return updated;
};
