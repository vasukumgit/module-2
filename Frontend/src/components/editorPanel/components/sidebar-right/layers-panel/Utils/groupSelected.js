import { normalizeOrders } from "./normalizeOrders";

export const groupSelected = (elements, selectedIds) => {
  if (selectedIds.length < 2) return elements;

  const groupId = `group-${Date.now()}`;

  const firstSelected = elements.find((el) => selectedIds.includes(el.id));

  const groupLayer = {
    id: groupId,
    type: "group",
    name: "Group",
    parentId: firstSelected?.parentId ?? null,
    collapsed: false,
    visible: true,
    locked: false,
    order: elements.length,
  };

  const updatedElements = elements.map((el) =>
    selectedIds.includes(el.id) ? { ...el, parentId: groupId } : el,
  );

  const finalData = [...updatedElements, groupLayer];

  return normalizeOrders(finalData);
};
