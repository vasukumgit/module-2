export const createClipGroup = (elements, selectedIds) => {
  if (selectedIds.length < 2) return elements;

  const selected = elements.filter((el) => selectedIds.includes(el.id));

  const groupX = Math.min(...selected.map((el) => el.x));
  const groupY = Math.min(...selected.map((el) => el.y));

  const groupId = `group-${Date.now()}`;

  let updated = elements.map((el) => {
    if (!selectedIds.includes(el.id)) return el;

    // return {
    //   ...el,
    //   parentId: groupId,

    //   // IMPORTANT
    //   x: el.x - groupX,
    //   y: el.y - groupY,

    //   isMask: el.id === selectedIds[0],
    // };

    return {
      ...el,
      parentId: groupId,
      isMask: el.id === selectedIds[0],

      globalCompositeOperation:
        el.id === selectedIds[0] ? "destination-in" : "source-over",
    };
  });

  updated.push({
    id: groupId,
    type: "group",
    name: "Clip Group",

    x: groupX,
    y: groupY,

    parentId: null,
    order: Math.max(...elements.map((e) => e.order || 0)) + 1,

    collapsed: false,
    visible: true,
    locked: false,
    clip: true,
  });

  return updated;
};
