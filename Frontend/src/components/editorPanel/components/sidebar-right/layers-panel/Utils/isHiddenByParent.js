export const isHiddenByParent = (node, elements) => {
  let parentId = node.parentId;

  while (parentId) {
    const parent = elements.find((el) => el.id === parentId);

    if (!parent) return false;
    if (parent.visible === false) return true;

    parentId = parent.parentId;
  }

  return false;
};