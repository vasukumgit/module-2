const getAllChildren = (parentId, elements) => {
  const children = elements.filter((el) => el.parentId === parentId);

  let result = [...children];

  children.forEach((child) => {
    result = [...result, ...getAllChildren(child.id, elements)];
  });

  return result;
};

export const toggleVisibility = (elements, id) => {
  const target = elements.find((el) => el.id === id);

  if (!target) return elements;

  const newVisibility = !(target.visible ?? true);

  const children = getAllChildren(id, elements);
  const affectedIds = [id, ...children.map((c) => c.id)];

  return elements.map((el) =>
    affectedIds.includes(el.id)
      ? {
          ...el,
          visible: newVisibility,
        }
      : el,
  );
};
