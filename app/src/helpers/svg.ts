const smoothing = 0.1;

const line = (pointA: number[], pointB: number[]) => {
  const lengthX = pointB[0] - pointA[0];
  const lengthY = pointB[1] - pointA[1];

  return {
    length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
    angle: Math.atan2(lengthY, lengthX)
  };
}

const controlPoint = (
  current: number[],
  previous: number[],
  next: number[],
  reverse = false
) => {
  const p = previous || current
  const n = next || current
  const o = line(p, n)
  const angle = o.angle + (reverse ? Math.PI : 0)
  const length = o.length * smoothing
  const x = current[0] + Math.cos(angle) * length
  const y = current[1] + Math.sin(angle) * length

  return [x, y]
}

const bezierCommand = (point: number[], i: number, a: number[][]) => {
  const cps = controlPoint(a[i - 1], a[i - 2], point)
  const cpe = controlPoint(point, a[i - 1], a[i + 1], true)

  return `C ${cps[0]},${cps[1]} ${cpe[0]},${cpe[1]} ${point[0]},${point[1]}`
}

export const domToSvgPoint = ({ clientX, clientY }: { clientX: number, clientY: number }, svg: SVGSVGElement) => {
  const point = svg.createSVGPoint();

  point.x = clientX;
  point.y = clientY;

  return point.matrixTransform(svg.getScreenCTM()!.inverse());
}

export const smoothPath = (points: [number, number][]) => {
  const d = points.reduce((acc, point, i, a) =>
    i === 0
      ? `M ${point[0]},${point[1]}`
      : `${acc} ${bezierCommand(point, i, a)}`
  , '');
  return d;
}
