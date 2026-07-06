// export const buildTree = (layers, parentId = null) => {
//   return layers
//     .filter((layer) => layer.parentId === parentId)
//     .sort((a, b) => {
//       // 🔥 MASK ALWAYS FIRST
//       if (a.isMask) return -1;
//       if (b.isMask) return 1;

//       return (a.order || 0) - (b.order || 0);
//     })
//     .map((layer) => ({
//       ...layer,
//       children: buildTree(layers, layer.id),
//     }));
// };

export const buildTree = (layers, parentId = null) => {
  return layers
    .filter((layer) => (layer.parentId ?? null) === parentId)
    .sort((a, b) => {
      if (a.isMask) return -1;
      if (b.isMask) return 1;

      return (a.order || 0) - (b.order || 0);
    })
    .map((layer) => ({
      ...layer,
      children: buildTree(layers, layer.id),
    }));
};
