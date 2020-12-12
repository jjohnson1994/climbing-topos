export function domToSvgPoint({ x, y }: { x: number, y: number }, svg: SVGSVGElement) {
  const point = svg.createSVGPoint();

  point.x = x;
  point.y = y;

  return point.matrixTransform(svg.getScreenCTM()!.inverse());
}
