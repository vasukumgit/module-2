export const isVisible = (el, elements) => {
  if (!el.visible) return false;

  let parent = el.parentId;

  while (parent) {
    const p = elements.find((e) => e.id === parent);

    if (!p) return true;

    if (!p.visible) return false;

    parent = p.parentId;
  }

  return true;
};