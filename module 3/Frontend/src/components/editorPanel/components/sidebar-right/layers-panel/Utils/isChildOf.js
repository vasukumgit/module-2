export const isChildOf = (childId, parentId, elements) => {
  const child = elements.find((el) => el.id === childId);

  if (!child) return false;

  if (child.parentId === parentId) {
    return true;
  }

  if (!child.parentId) {
    return false;
  }

  return isChildOf(child.parentId, parentId, elements);
};
