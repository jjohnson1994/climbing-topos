import { Route as RouteType, Log } from '@climbingtopos/types';
import { gradingSystems } from '@climbingtopos/globals';
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
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

function convertGradeValueToLabel(gradeValue: number | string, gradingSystem: string): string | null {
  const system = gradingSystems.find(({ title }) => title === gradingSystem);
  if (!system) return null;
  return system.grades[parseInt(String(gradeValue))] ?? null;
}

export default function RouteStats({ route, logs }: { route: RouteType; logs: Log[] }) {
  if (!route.logCount) {
    return (
      <div className="box">
        <EmptyState message="No logs yet — be the first to log this route." />
      </div>
    );
  }

  const gradeDistribution = route.gradeTally
    ? Object.entries(route.gradeTally)
        .map(([gradeValue, count]) => ({
          grade: convertGradeValueToLabel(gradeValue, route.gradingSystem) ?? gradeValue,
          gradeValue: parseInt(gradeValue),
          count,
        }))
        .sort((a, b) => a.gradeValue - b.gradeValue)
    : [];

  const ratingDistribution = [1, 2, 3, 4, 5].map((r) => ({
    rating: `${r} ★`,
    count: route.ratingTally?.[r] ?? 0,
  }));

  const totalRatingCount = ratingDistribution.reduce((sum, { count }) => sum + count, 0);
  const totalRatingSum = [1, 2, 3, 4, 5].reduce(
    (sum, r) => sum + r * (route.ratingTally?.[r] ?? 0),
    0,
  );
  const averageRating = totalRatingCount > 0 ? totalRatingSum / totalRatingCount : 0;

  const monthCounts: Record<number, number> = {};
  for (const log of logs) {
    if (log.dateSent) {
      const month = new Date(log.dateSent).getMonth();
      monthCounts[month] = (monthCounts[month] ?? 0) + 1;
    }
  }
  const monthlyDistribution = MONTHS.map((month, i) => ({
    month,
    count: monthCounts[i] ?? 0,
  }));
  const hasMonthlyData = monthlyDistribution.some(({ count }) => count > 0);

  const timelineCounts: Record<string, number> = {};
  for (const log of logs) {
    if (log.dateSent) {
      const d = new Date(log.dateSent);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      timelineCounts[key] = (timelineCounts[key] ?? 0) + 1;
    }
  }
  const activityTimeline = Object.entries(timelineCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, count]) => {
      const [year, month] = key.split('-');
      return { label: `${MONTHS[parseInt(month) - 1]} ${year}`, count };
    });

  const uniqueClimbers = new Set(logs.map((l) => l.user?.sub).filter(Boolean)).size;
  const mostCommonGradeLabel = route.gradeModal != null
    ? convertGradeValueToLabel(route.gradeModal, route.gradingSystem)
    : null;

  return (
    <div>
      <div className="columns is-mobile is-multiline">
        <StatCard
          className="is-half-mobile is-one-quarter-tablet"
          label="Total Logs"
          value={route.logCount}
        />
        <StatCard
          className="is-half-mobile is-one-quarter-tablet"
          label="Avg Rating"
          value={averageRating > 0 ? `${averageRating.toFixed(1)} / 5` : 'N/A'}
        />
        {mostCommonGradeLabel && (
          <StatCard
            className="is-half-mobile is-one-quarter-tablet"
            label="Most Logged Grade"
            value={mostCommonGradeLabel}
          />
        )}
        {uniqueClimbers > 0 && (
          <StatCard
            className="is-half-mobile is-one-quarter-tablet"
            label="Unique Climbers"
            value={uniqueClimbers}
          />
        )}
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
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
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
                    formatter={(value) => [value, 'Logs']}
                  />
                  <Bar dataKey="count" fill="#27ae60" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {totalRatingCount > 0 && (
          <div className="column is-half">
            <div className="box" style={{ height: '100%' }}>
              <h2 className="subtitle is-6 has-text-weight-semibold mb-4">
                Ratings
              </h2>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart
                  data={ratingDistribution}
                  margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="rating" tick={{ fontSize: 12 }} tickLine={false} />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    width={30}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '4px', fontSize: '13px' }}
                    formatter={(value) => [value, 'Logs']}
                  />
                  <Bar dataKey="count" fill="#8e44ad" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {hasMonthlyData && (
          <div className="column is-half">
            <div className="box" style={{ height: '100%' }}>
              <h2 className="subtitle is-6 has-text-weight-semibold mb-4">
                When People Climb It
              </h2>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart
                  data={monthlyDistribution}
                  margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    width={30}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '4px', fontSize: '13px' }}
                    formatter={(value) => [value, 'Logs']}
                  />
                  <Bar dataKey="count" fill="#2980b9" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activityTimeline.length > 1 && (
          <div className="column is-half">
            <div className="box" style={{ height: '100%' }}>
              <h2 className="subtitle is-6 has-text-weight-semibold mb-4">
                Activity Over Time
              </h2>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart
                  data={activityTimeline}
                  margin={{ top: 5, right: 10, left: -10, bottom: 30 }}
                >
                  <defs>
                    <linearGradient id="routeActivityGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2980b9" stopOpacity={0.7} />
                      <stop offset="95%" stopColor="#2980b9" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    angle={-45}
                    textAnchor="end"
                    interval="preserveStartEnd"
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
                    formatter={(value) => [value, 'Logs']}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#2980b9"
                    strokeWidth={1.5}
                    fill="url(#routeActivityGradient)"
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
