import { Log } from '@climbingtopos/types';
import { gradingSystems } from '@climbingtopos/globals';
import { DateTime } from 'luxon';
import ProfileDashboard, { DashboardData } from './ProfileDashboard';

function convertGradeValueToLabel(
  gradeValue: string,
  gradingSystem: string,
): string | null {
  const system = gradingSystems.find(({ title }) => title === gradingSystem);
  if (!system) return null;
  return system.grades[parseInt(gradeValue)] ?? null;
}

function computeDashboardData(logs: Log[]): DashboardData {
  const uniqueCragSlugs = new Set(logs.map((l) => l.cragSlug));

  const ratingsWithValues = logs.filter((l) => l.rating > 0);
  const averageRating =
    ratingsWithValues.length > 0
      ? ratingsWithValues.reduce((sum, l) => sum + l.rating, 0) /
        ratingsWithValues.length
      : 0;

  const styleCount: Record<string, number> = {};
  for (const log of logs) {
    if (log.routeType) {
      styleCount[log.routeType] = (styleCount[log.routeType] || 0) + 1;
    }
  }
  const favouriteStyle =
    Object.entries(styleCount).sort(([, a], [, b]) => b - a)[0]?.[0] ?? '';

  const monthCounts: Record<string, number> = {};
  for (const log of logs) {
    const date = DateTime.fromISO(log.dateSent);
    if (date.isValid) {
      const key = date.toFormat('yyyy-MM');
      monthCounts[key] = (monthCounts[key] || 0) + 1;
    }
  }
  const climbsByMonth = Object.entries(monthCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, count]) => ({
      month: DateTime.fromFormat(key, 'yyyy-MM').toFormat('MMM yy'),
      count,
    }));

  const gradeCounts: Record<string, number> = {};
  for (const log of logs) {
    const label = convertGradeValueToLabel(log.gradeTaken, log.gradingSystem);
    if (label) {
      gradeCounts[label] = (gradeCounts[label] || 0) + 1;
    }
  }
  const gradeDistribution = Object.entries(gradeCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 12)
    .map(([grade, count]) => ({ grade, count }));

  const routeTypeCounts: Record<string, number> = {};
  for (const log of logs) {
    if (log.routeType) {
      routeTypeCounts[log.routeType] =
        (routeTypeCounts[log.routeType] || 0) + 1;
    }
  }
  const routeTypeDistribution = Object.entries(routeTypeCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([type, count]) => ({ type, count }));

  const cragCounts: Record<string, number> = {};
  for (const log of logs) {
    if (log.cragTitle) {
      cragCounts[log.cragTitle] = (cragCounts[log.cragTitle] || 0) + 1;
    }
  }
  const topCrags = Object.entries(cragCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([crag, count]) => ({ crag, count }));

  const ratingBuckets: Record<string, number> = {
    '1 ★': 0,
    '2 ★': 0,
    '3 ★': 0,
    '4 ★': 0,
    '5 ★': 0,
  };
  for (const log of logs) {
    if (log.rating >= 1 && log.rating <= 5) {
      const key = `${log.rating} ★`;
      ratingBuckets[key] = (ratingBuckets[key] || 0) + 1;
    }
  }
  const ratingDistribution = Object.entries(ratingBuckets)
    .filter(([, count]) => count > 0)
    .map(([rating, count]) => ({ rating, count }));

  return {
    totalLogs: logs.length,
    uniqueCrags: uniqueCragSlugs.size,
    averageRating,
    favouriteStyle,
    climbsByMonth,
    gradeDistribution,
    routeTypeDistribution,
    topCrags,
    ratingDistribution,
  };
}

function ProfileStats({ logs }: { logs: Log[] }) {
  const data = computeDashboardData(logs);
  return <ProfileDashboard data={data} />;
}

export default ProfileStats;
