const getAllChildren = (parentId, elements) => {
  const children = elements.filter((el) => el.parentId === parentId);

  let result = [...children];

  children.forEach((child) => {
    result = [...result, ...getAllChildren(child.id, elements)];
  });

  return result;
};

export const toggleLock = (elements, id) => {
  const target = elements.find((el) => el.id === id);

  if (!target) return elements;

  const newLocked = !(target.locked ?? false);

  const children = getAllChildren(id, elements);

  const affectedIds = [id, ...children.map((c) => c.id)];

  return elements.map((el) =>
    affectedIds.includes(el.id)
      ? {
          ...el,
          locked: newLocked,
        }
      : el,
  );
};
