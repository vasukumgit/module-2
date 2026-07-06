export const getSvgPaths = (svgText) => {
  try {
    const parser = new DOMParser();

    const svgDoc = parser.parseFromString(svgText, "image/svg+xml");

    const svgElement = svgDoc.querySelector("svg");
    const viewBox = svgElement?.getAttribute("viewBox");
    const svgFill = svgElement?.getAttribute("fill");
    const svgStroke = svgElement?.getAttribute("stroke");
    const svgStrokeWidth = svgElement?.getAttribute("stroke-width");

    const pathElements = svgDoc.querySelectorAll(
      "path, polygon, polyline, rect, circle, ellipse, line",
    );

    return Array.from(pathElements).map((el) => ({
      type: el.tagName,

      // path
      data: el.getAttribute("d"),

      // polygon/polyline
      points: el.getAttribute("points"),

      // rect
      x: el.getAttribute("x"),
      y: el.getAttribute("y"),
      width: el.getAttribute("width"),
      height: el.getAttribute("height"),
      rx: el.getAttribute("rx"),

      // circle
      cx: el.getAttribute("cx"),
      cy: el.getAttribute("cy"),
      r: el.getAttribute("r"),

      // ellipse
      rxEllipse: el.getAttribute("rx"),
      ryEllipse: el.getAttribute("ry"),

      // line
      x1: el.getAttribute("x1"),
      y1: el.getAttribute("y1"),
      x2: el.getAttribute("x2"),
      y2: el.getAttribute("y2"),

      fill: el.getAttribute("fill") || svgFill,

      stroke: el.getAttribute("stroke") || svgStroke,

      strokeWidth: el.getAttribute("stroke-width") || svgStrokeWidth,
    }));
  } catch (err) {
    console.log("SVG parse error", err);
    return [];
  }
};

export const getSvgPathString = (svgText) => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgText, "image/svg+xml");

    const paths = [...doc.querySelectorAll("path")];

    return paths
      .map((p) => p.getAttribute("d"))
      .filter(Boolean);
  } catch (err) {
    console.log("Path extract error", err);
    return [];
  }
};
