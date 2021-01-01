export function domToSvgPoint({ x, y }: { x: number, y: number }, svg: SVGSVGElement) {
  const point = svg.createSVGPoint();

  point.x = x;
  point.y = y;

  return point.matrixTransform(svg.getScreenCTM()!.inverse());
}

const smoothing = 0.2;

function line (pointA: number[], pointB: number[]) {
  const lengthX = pointB[0] - pointA[0];
  const lengthY = pointB[1] - pointA[1];

  return {
    length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
    angle: Math.atan2(lengthY, lengthX)
  };
}

function controlPoint(
  current: number[],
  previous: number[],
  next: number[],
  reverse = false
) {
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

export function ReducePath(points: number[][], increment = 10) {
  const reducedPath: number[][] = []

  let i;
  for(i = 0; i < points.length; i += increment) {
    reducedPath.push(points[i]);
  }

  if (points.length % increment === 0) {
    reducedPath.push(points[points.length - 1]);
  }

  return reducedPath;
}

export function SmoothPath(points: number[][]) {
  const d = points.reduce((acc, point, i, a) => i === 0
    ? `M ${point[0]},${point[1]}`
    : `${acc} ${bezierCommand(point, i, a)}`
  , '');
  return d;
}
