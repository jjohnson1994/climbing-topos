import tzlookup from 'tz-lookup';
import { Crag } from '@climbingtopos/types';
import { gradingSystems } from '@climbingtopos/globals';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const ROUTE_TYPE_COLORS: Record<string, string> = {
  boulder: '#e67e22',
  sport: '#2980b9',
  trad: '#27ae60',
  aid: '#8e44ad',
  alpine: '#2c3e50',
  mixed: '#c0392b',
};

const FALLBACK_COLORS = [
  '#2980b9',
  '#27ae60',
  '#e67e22',
  '#8e44ad',
  '#c0392b',
  '#2c3e50',
];

function StatCard({
  label,
  value,
  className = '',
}: {
  label: string;
  value: string | number;
  className?: string;
}) {
  return (
    <div className={`column ${className}`}>
      <div className="box has-text-centered" style={{ height: '100%' }}>
        <p className="heading">{label}</p>
        <p className="title is-3">{value}</p>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div
      className="has-text-centered has-text-grey"
      style={{ paddingTop: '2rem', paddingBottom: '2rem' }}
    >
      {message}
    </div>
  );
}

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

function getSunTimes(
  date: Date,
  lat: number,
  lon: number,
): { sunrise: Date | null; sunset: Date | null } {
  const rad = Math.PI / 180;
  const day = Math.floor(
    (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
      Date.UTC(date.getFullYear(), 0, 0)) /
      86400000,
  );
  const lngHour = lon / 15;

  function calc(isSunrise: boolean): Date | null {
    const t = day + ((isSunrise ? 6 : 18) - lngHour) / 24;
    const M = 0.9856 * t - 3.289;
    const L =
      (((M +
        1.916 * Math.sin(M * rad) +
        0.02 * Math.sin(2 * M * rad) +
        282.634) %
        360) +
        360) %
      360;
    let RA = (Math.atan(0.91764 * Math.tan(L * rad)) / rad + 360) % 360;
    RA = (RA + Math.floor(L / 90) * 90 - Math.floor(RA / 90) * 90) / 15;
    const sinDec = 0.39782 * Math.sin(L * rad);
    const cosDec = Math.cos(Math.asin(sinDec));
    const cosH =
      (Math.cos(90.833 * rad) - sinDec * Math.sin(lat * rad)) /
      (cosDec * Math.cos(lat * rad));
    if (cosH > 1 || cosH < -1) return null;
    let H = isSunrise ? 360 - Math.acos(cosH) / rad : Math.acos(cosH) / rad;
    H /= 15;
    const UT = (((H + RA - 0.06571 * t - 6.622 - lngHour) % 24) + 24) % 24;
    const hours = Math.floor(UT);
    const minutes = Math.floor((UT - hours) * 60);
    return new Date(
      Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        hours,
        minutes,
      ),
    );
  }

  return { sunrise: calc(true), sunset: calc(false) };
}

function decimalHoursToHHMM(h: number): string {
  const hh = Math.floor(h);
  const mm = Math.floor((h - hh) * 60);
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

function getUtcOffsetHours(date: Date, timezone: string): number {
  const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
  const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
  return (tzDate.getTime() - utcDate.getTime()) / 3600000;
}

function utcDateToDecimalHours(d: Date, timezone: string): number {
  const offset = getUtcOffsetHours(d, timezone);
  const local = new Date(d.getTime() + offset * 3600000);
  return local.getUTCHours() + local.getUTCMinutes() / 60;
}

function SunTimesTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{
    dataKey?: string;
    value?: number;
    payload?: { date?: string };
  }>;
}) {
  if (!active || !payload?.length) return null;
  const sunrise = payload.find((p) => p.dataKey === 'sunrise')?.value;
  const daylight = payload.find((p) => p.dataKey === 'daylight')?.value;
  const date = payload[0]?.payload?.date;
  if (sunrise == null || daylight == null) return null;
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #eee',
        borderRadius: 4,
        padding: '8px 12px',
        fontSize: 13,
      }}
    >
      <p style={{ marginBottom: 4, fontWeight: 600 }}>{date}</p>
      <p style={{ margin: '2px 0' }}>Sunrise: {decimalHoursToHHMM(sunrise)}</p>
      <p style={{ margin: '2px 0' }}>
        Sunset: {decimalHoursToHHMM(sunrise + daylight)}
      </p>
      <p style={{ margin: '2px 0', color: '#888' }}>
        Daylight: {decimalHoursToHHMM(daylight)}
      </p>
    </div>
  );
}

function SunTimesChart({
  latitude,
  longitude,
}: {
  latitude: number | string;
  longitude: number | string;
}) {
  const lat = parseFloat(String(latitude));
  const lng = parseFloat(String(longitude));
  if (isNaN(lat) || isNaN(lng)) return null;

  const year = new Date().getFullYear();
  const timezone = tzlookup(lat, lng);

  const data: Array<{
    dayIndex: number;
    date: string;
    month: string;
    sunrise: number;
    daylight: number;
  }> = [];
  const monthTickIndices: number[] = [];

  for (let month = 0; month < 12; month++) {
    monthTickIndices.push(data.length);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const { sunrise, sunset } = getSunTimes(
        new Date(year, month, day),
        lat,
        lng,
      );
      const sunriseH = sunrise ? utcDateToDecimalHours(sunrise, timezone) : 0;
      const sunsetH = sunset ? utcDateToDecimalHours(sunset, timezone) : 0;
      data.push({
        dayIndex: data.length,
        date: `${day} ${MONTHS[month]}`,
        month: MONTHS[month],
        sunrise: sunriseH,
        daylight: sunsetH - sunriseH,
      });
    }
  }

  const today = new Date();
  const { sunrise: todaySunrise, sunset: todaySunset } = getSunTimes(
    today,
    lat,
    lng,
  );
  const todaySunriseLabel = todaySunrise
    ? decimalHoursToHHMM(utcDateToDecimalHours(todaySunrise, timezone))
    : null;
  const todaySunsetLabel = todaySunset
    ? decimalHoursToHHMM(utcDateToDecimalHours(todaySunset, timezone))
    : null;

  return (
    <div className="column is-full">
      <div className="box">
        <div
          className="is-flex is-align-items-baseline"
          style={{ gap: '0.75rem', marginBottom: '1rem' }}
        >
          <h2 className="subtitle is-6 has-text-weight-semibold mb-0">
            Daylight Hours
          </h2>
          {todaySunriseLabel && todaySunsetLabel && (
            <span className="has-text-grey" style={{ fontSize: '13px' }}>
              Today: sunrise {todaySunriseLabel} · sunset {todaySunsetLabel}
            </span>
          )}
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart
            data={data}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="daylightGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f1c40f" stopOpacity={0.7} />
                <stop offset="95%" stopColor="#f1c40f" stopOpacity={0.4} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f0f0f0"
              vertical={false}
            />
            <XAxis
              dataKey="dayIndex"
              type="number"
              domain={[0, data.length - 1]}
              ticks={monthTickIndices}
              tickFormatter={(val: number) =>
                MONTHS[monthTickIndices.indexOf(val)]
              }
              tick={{ fontSize: 12 }}
              tickLine={false}
            />
            <YAxis
              domain={[0, 24]}
              tickCount={8}
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={decimalHoursToHHMM}
              width={40}
            />
            <Tooltip content={<SunTimesTooltip />} />
            <Area
              type="monotone"
              dataKey="sunrise"
              stackId="1"
              stroke="none"
              fill="transparent"
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="daylight"
              stackId="1"
              stroke="#e2ac00"
              strokeWidth={1.5}
              fill="url(#daylightGradient)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function WrappedYAxisTick({
  x,
  y,
  payload,
}: {
  x?: number;
  y?: number;
  payload?: { value: string };
}) {
  const text = payload?.value ?? '';
  const maxWidth = 96;
  const fontSize = 11;
  const charWidth = fontSize * 0.56;
  const charsPerLine = Math.floor(maxWidth / charWidth);
  const maxLines = 2;

  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const test = currentLine ? `${currentLine} ${word}` : word;
    if (test.length > charsPerLine && currentLine) {
      lines.push(currentLine);
      currentLine = word;
      if (lines.length >= maxLines) break;
    } else {
      currentLine = test;
    }
  }
  if (currentLine && lines.length < maxLines) lines.push(currentLine);

  const placed = lines.join(' ');
  if (lines.length === maxLines && placed.length < text.length) {
    let last = lines[maxLines - 1];
    while ((last + '…').length > charsPerLine) last = last.slice(0, -1);
    lines[maxLines - 1] = last + '…';
  }

  const lineHeight = 13;
  const startDy = -((lines.length - 1) * lineHeight) / 2;

  return (
    <g transform={`translate(${x},${y})`}>
      {lines.map((line, i) => (
        <text
          key={i}
          x={0}
          y={startDy + i * lineHeight}
          textAnchor="end"
          fontSize={fontSize}
          fill="#666"
        >
          {line}
        </text>
      ))}
    </g>
  );
}

function convertGradeValueToLabel(
  gradeValue: string,
  gradingSystem: string,
): string | null {
  const system = gradingSystems.find(({ title }) => title === gradingSystem);
  if (!system) return null;
  return system.grades[parseInt(gradeValue)] ?? null;
}

export default function CragStats({ crag }: { crag: Crag }) {
  const routes = crag.routes ?? [];

  if (routes.length === 0) {
    return (
      <div className="box">
        <EmptyState message="No routes yet — add some to see stats here." />
      </div>
    );
  }

  let totalRatingSum = 0;
  let totalRatingCount = 0;

  const ratingBuckets: Record<string, number> = {
    '1 ★': 0,
    '2 ★': 0,
    '3 ★': 0,
    '4 ★': 0,
    '5 ★': 0,
  };
  const gradeCounts: Record<string, { label: string; gradeValue: number; count: number }> = {};
  const routeTypeCounts: Record<string, number> = {};

  for (const route of routes) {
    if (route.ratingTally) {
      for (const [ratingStr, count] of Object.entries(route.ratingTally)) {
        const rating = parseInt(ratingStr);
        if (rating >= 1 && rating <= 5) {
          totalRatingSum += rating * count;
          totalRatingCount += count;
          const key = `${rating} ★`;
          ratingBuckets[key] = (ratingBuckets[key] || 0) + count;
        }
      }
    }

    const label = convertGradeValueToLabel(route.grade, route.gradingSystem);
    if (label) {
      const key = `${route.gradingSystem}:${route.grade}`;
      if (!gradeCounts[key]) {
        gradeCounts[key] = { label, gradeValue: parseInt(route.grade), count: 0 };
      }
      gradeCounts[key].count += 1;
    }

    if (route.routeType) {
      routeTypeCounts[route.routeType] =
        (routeTypeCounts[route.routeType] || 0) + 1;
    }
  }

  const averageRating =
    totalRatingCount > 0 ? totalRatingSum / totalRatingCount : 0;

  const routeTypeDistribution = Object.entries(routeTypeCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([type, count]) => ({ type, count }));

  const favouriteStyle = routeTypeDistribution[0]?.type ?? '';

  const gradeDistribution = Object.values(gradeCounts)
    .sort((a, b) => a.gradeValue - b.gradeValue)
    .slice(0, 12)
    .map(({ label, count }) => ({ grade: label, count }));

  const topRoutes = [...routes]
    .filter((r) => r.logCount > 0)
    .sort((a, b) => b.logCount - a.logCount)
    .slice(0, 10)
    .map((r) => ({ title: r.title, count: r.logCount }));

  const ratingDistribution = Object.entries(ratingBuckets).map(
    ([rating, count]) => ({ rating, count }),
  );

  return (
    <div>
      <div className="columns is-mobile is-multiline">
        <StatCard
          className="is-half-mobile is-one-third-tablet"
          label="Routes"
          value={crag.routeCount ?? routes.length}
        />
        <StatCard
          className="is-half-mobile is-one-third-tablet"
          label="Areas"
          value={crag.areaCount ?? crag.areas?.length ?? 0}
        />
        <StatCard
          className="is-half-mobile is-one-third-tablet"
          label="Total Logs"
          value={crag.logCount ?? 0}
        />
        <StatCard
          className="is-half-mobile is-half-tablet"
          label="Avg Rating"
          value={averageRating > 0 ? `${averageRating.toFixed(1)} / 5` : 'N/A'}
        />
        <StatCard
          label="Most Common Style"
          value={
            favouriteStyle
              ? favouriteStyle.charAt(0).toUpperCase() + favouriteStyle.slice(1)
              : 'N/A'
          }
        />
      </div>

      <div className="columns is-multiline">
        {gradeDistribution.length > 0 && (
          <div className="column is-half">
            <div className="box" style={{ height: '100%' }}>
              <h2 className="subtitle is-6 has-text-weight-semibold mb-4">
                Grade Distribution
              </h2>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart
                  data={gradeDistribution}
                  margin={{ top: 5, right: 10, left: -10, bottom: 30 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f0f0f0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="grade"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    angle={-45}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    width={30}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '4px', fontSize: '13px' }}
                    formatter={(value) => [value, 'Routes']}
                  />
                  <Bar dataKey="count" fill="#27ae60" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {routeTypeDistribution.length > 0 && (
          <div className="column is-half">
            <div className="box" style={{ height: '100%' }}>
              <h2 className="subtitle is-6 has-text-weight-semibold mb-4">
                Route Types
              </h2>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={routeTypeDistribution}
                    dataKey="count"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={2}
                  >
                    {routeTypeDistribution.map((entry, index) => (
                      <Cell
                        key={entry.type}
                        fill={
                          ROUTE_TYPE_COLORS[entry.type] ||
                          FALLBACK_COLORS[index % FALLBACK_COLORS.length]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '4px', fontSize: '13px' }}
                    formatter={(value, name) => [value, name]}
                  />
                  <Legend
                    formatter={(value) =>
                      value.charAt(0).toUpperCase() + value.slice(1)
                    }
                    iconType="circle"
                    iconSize={10}
                    wrapperStyle={{ fontSize: '13px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {topRoutes.length > 0 && (
          <div className="column is-half">
            <div className="box" style={{ height: '100%' }}>
              <h2 className="subtitle is-6 has-text-weight-semibold mb-4">
                Most Logged Routes
              </h2>
              <ResponsiveContainer
                width="100%"
                height={topRoutes.length * 40 + 20}
              >
                <BarChart
                  data={topRoutes}
                  layout="vertical"
                  margin={{ top: 5, right: 10, left: -40, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f0f0f0"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    allowDecimals={false}
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="title"
                    tick={<WrappedYAxisTick />}
                    tickLine={false}
                    width={140}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '4px', fontSize: '13px' }}
                    formatter={(value) => [value, 'Logs']}
                  />
                  <Bar dataKey="count" fill="#e67e22" radius={[0, 3, 3, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {totalRatingCount > 0 && (
          <div className="column is-half">
            <div className="box" style={{ height: '100%' }}>
              <h2 className="subtitle is-6 has-text-weight-semibold mb-4">
                Route Ratings
              </h2>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart
                  data={ratingDistribution}
                  margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f0f0f0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="rating"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    width={30}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '4px', fontSize: '13px' }}
                    formatter={(value) => [value, 'Routes']}
                  />
                  <Bar dataKey="count" fill="#8e44ad" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <SunTimesChart latitude={crag.latitude} longitude={crag.longitude} />
      </div>
    </div>
  );
}
