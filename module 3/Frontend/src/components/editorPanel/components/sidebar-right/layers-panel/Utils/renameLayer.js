export const renameLayer = (elements, id, value) => {
  return elements.map((el) =>
    el.id === id
      ? {
          ...el,
          name: value,
        }
      : el
  );
};