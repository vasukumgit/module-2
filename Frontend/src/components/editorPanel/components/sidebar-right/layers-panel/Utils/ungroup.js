import { normalizeOrders } from "./normalizeOrders";

export const ungroup = (elements, selectedIds) => {
  const groupsToUngroup = elements.filter(
    (el) => selectedIds.includes(el.id) && el.type === "group",
  );

  if (groupsToUngroup.length === 0) return elements;

  let updated = [...elements];

  groupsToUngroup.forEach((group) => {
    // move children one level up
    updated = updated.map((el) => {
      if (el.parentId === group.id) {
        return {
          ...el,
          parentId: group.parentId ?? null,
        };
      }
      return el;
    });

    // remove group
    updated = updated.filter((el) => el.id !== group.id);
  });

  return normalizeOrders(updated);
};
