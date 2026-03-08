

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

export interface DashboardData {
  totalLogs: number;
  uniqueCrags: number;
  averageRating: number;
  favouriteStyle: string;
  climbsByMonth: Array<{ month: string; count: number }>;
  gradeDistribution: Array<{ grade: string; count: number }>;
  routeTypeDistribution: Array<{ type: string; count: number }>;
  topCrags: Array<{ crag: string; count: number }>;
  ratingDistribution: Array<{ rating: string; count: number }>;
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="column">
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

export default function ProfileDashboard({ data }: { data: DashboardData }) {
  if (data.totalLogs === 0) {
    return (
      <div className="box">
        <EmptyState message="Log some climbs to see your stats here." />
      </div>
    );
  }

  return (
    <div>
      <div className="columns is-multiline">
        <StatCard label="Climbs Logged" value={data.totalLogs} />
        <StatCard label="Crags Visited" value={data.uniqueCrags} />
        <StatCard
          label="Avg Rating"
          value={
            data.averageRating > 0
              ? `${data.averageRating.toFixed(1)} / 5`
              : 'N/A'
          }
        />
        <StatCard
          label="Favourite Style"
          value={
            data.favouriteStyle
              ? data.favouriteStyle.charAt(0).toUpperCase() +
                data.favouriteStyle.slice(1)
              : 'N/A'
          }
        />
      </div>

      <div className="columns is-multiline">
        {data.climbsByMonth.length > 1 && (
          <div className="column is-full">
            <div className="box">
              <h2 className="subtitle is-6 has-text-weight-semibold mb-4">
                Activity Over Time
              </h2>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart
                  data={data.climbsByMonth}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <defs>
                    <linearGradient
                      id="climbsGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#2980b9" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2980b9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '4px',
                      fontSize: '13px',
                    }}
                    formatter={(value) => [value, 'Climbs']}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#2980b9"
                    strokeWidth={2}
                    fill="url(#climbsGradient)"
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {data.gradeDistribution.length > 0 && (
          <div className="column is-half">
            <div className="box" style={{ height: '100%' }}>
              <h2 className="subtitle is-6 has-text-weight-semibold mb-4">
                Grade Distribution
              </h2>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart
                  data={data.gradeDistribution}
                  margin={{ top: 5, right: 20, left: 0, bottom: 30 }}
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
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '4px', fontSize: '13px' }}
                    formatter={(value) => [value, 'Climbs']}
                  />
                  <Bar dataKey="count" fill="#27ae60" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {data.routeTypeDistribution.length > 0 && (
          <div className="column is-half">
            <div className="box" style={{ height: '100%' }}>
              <h2 className="subtitle is-6 has-text-weight-semibold mb-4">
                Route Types
              </h2>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={data.routeTypeDistribution}
                    dataKey="count"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={2}
                  >
                    {data.routeTypeDistribution.map((entry, index) => (
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

        {data.topCrags.length > 0 && (
          <div className="column is-half">
            <div className="box" style={{ height: '100%' }}>
              <h2 className="subtitle is-6 has-text-weight-semibold mb-4">
                Top Crags
              </h2>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart
                  data={data.topCrags}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
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
                    dataKey="crag"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    width={110}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '4px', fontSize: '13px' }}
                    formatter={(value) => [value, 'Climbs']}
                  />
                  <Bar dataKey="count" fill="#e67e22" radius={[0, 3, 3, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {data.ratingDistribution.length > 0 && (
          <div className="column is-half">
            <div className="box" style={{ height: '100%' }}>
              <h2 className="subtitle is-6 has-text-weight-semibold mb-4">
                Ratings Given
              </h2>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart
                  data={data.ratingDistribution}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
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
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '4px', fontSize: '13px' }}
                    formatter={(value) => [value, 'Climbs']}
                  />
                  <Bar dataKey="count" fill="#8e44ad" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
