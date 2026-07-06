export const toggleGroup = (elements, id) => {
  return elements.map((el) =>
    el.id === id
      ? {
          ...el,
          collapsed: !el.collapsed,
        }
      : el
  );
};