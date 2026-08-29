import { useMemo, useState, useEffect, lazy, Suspense } from 'react';
import { Link } from '@tanstack/react-router';
import { createColumnHelper, type Row } from '@tanstack/react-table';
import { Log, Route } from '@climbingtopos/types';
import { gradingSystems } from '@climbingtopos/globals';
import RatingStarsDisplay from '@/components/RatingStarsDisplay';
const AreaRouteTableMenu = lazy(() => import('./AreaRouteTableMenu'));

import DataGrid, {
  type FilterConfig,
  type GroupByOption,
  type SortOption,
  fuzzySort,
} from '@/components/DataGrid';

interface Props {
  routes: Route[];
  loggedRoutes: Log[];
  isAuthenticated: boolean;
}

const columnHelper = createColumnHelper<Route>();

function gradeLabel(route: Route): string {
  const system = gradingSystems.find((s) => s.title === route.gradingSystem);
  return system?.grades[route.gradeModal] ?? route.grade ?? '';
}

const routeTypeColor: Record<string, string> = {
  boulder: 'is-warning',
  sport: 'is-link',
  trad: 'is-success',
  aid: 'is-dark',
  alpine: 'is-dark',
  mixed: 'is-dark',
};

function CragRoutesTable({
  routes,
  loggedRoutes,
  isAuthenticated,
}: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const loggedSlugs = useMemo(
    () => new Set(loggedRoutes.map((l) => l.routeSlug)),
    [loggedRoutes],
  );

  const routeTypes = useMemo(
    () =>
      Array.from(
        new Set(routes.map((r) => r.routeType).filter(Boolean)),
      ).sort(),
    [routes],
  );

  const areas = useMemo(
    () =>
      Array.from(
        new Map(routes.map((r) => [r.areaSlug, r.areaTitle])).entries(),
      ).sort((a, b) => a[1].localeCompare(b[1])),
    [routes],
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor('title', {
        header: 'Route',
        enableGrouping: false,
        sortingFn: fuzzySort,
        cell: ({ row }) => {
          const route = row.original;
          if (!route) return null;
          return (
            <Link
              to="/crags/$cragSlug/areas/$areaSlug/topos/$topoSlug/routes/$routeSlug"
              params={{
                cragSlug: route.cragSlug,
                areaSlug: route.areaSlug,
                topoSlug: route.topoSlug,
                routeSlug: route.slug,
              }}
              className={
                loggedSlugs.has(String(route.slug)) ? 'line-through' : ''
              }
            >
              {route.title}
            </Link>
          );
        },
      }),
      columnHelper.accessor('areaTitle', {
        header: 'Area',
        cell: (info) => (
          <span className="is-capitalized">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor((row) => gradeLabel(row), {
        id: 'grade',
        header: 'Grade',
        sortingFn: (rowA, rowB) => {
          const a =
            rowA.original?.gradeModal ??
            rowA.subRows[0]?.original?.gradeModal ??
            0;
          const b =
            rowB.original?.gradeModal ??
            rowB.subRows[0]?.original?.gradeModal ??
            0;
          return a - b;
        },
      }),
      columnHelper.accessor('routeType', {
        header: 'Type',
        enableGlobalFilter: false,
        cell: (info) => (
          <span className="is-capitalized">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor('rating', {
        header: 'Rating',
        enableGlobalFilter: false,
        cell: (info) => <RatingStarsDisplay stars={info.getValue()} />,
      }),
      columnHelper.accessor('logCount', {
        header: 'Ticks',
        enableGrouping: false,
        enableGlobalFilter: false,
        cell: (info) => info.getValue() ?? 0,
      }),
    ],
    [loggedSlugs],
  );

  const filterConfigs = useMemo<FilterConfig<Route>[]>(
    () => [
      ...(routeTypes.length > 0
        ? [
            {
              label: 'Type',
              getOptions: () => routeTypes.map((t) => ({ key: t, label: t })),
              matches: (row: Route, selected: string[]) =>
                !selected.length || selected.includes(row.routeType),
            },
          ]
        : []),
      ...(areas.length > 0
        ? [
            {
              label: 'Area',
              getOptions: () =>
                areas.map(([slug, title]) => ({ key: slug, label: title })),
              matches: (row: Route, selected: string[]) =>
                !selected.length || selected.includes(row.areaSlug),
            },
          ]
        : []),
    ],
    [routeTypes, areas],
  );

  const sortOptions = useMemo<SortOption[]>(
    () => [
      { value: 'title', label: 'Name' },
      { value: 'grade', label: 'Grade' },
      { value: 'rating', label: 'Rating' },
      { value: 'logCount', label: 'Ticks' },
    ],
    [],
  );

  const groupByOptions = useMemo<GroupByOption[]>(
    () => [
      ...(areas.length > 1 ? [{ value: 'areaTitle', label: 'Area' }] : []),
      ...(routeTypes.length > 1 ? [{ value: 'routeType', label: 'Type' }] : []),
      { value: 'grade', label: 'Grade' },
      { value: 'rating', label: 'Rating' },
    ],
    [areas, routeTypes],
  );

  const getColumnVisibility = useMemo(
    () => (grouping: string[]) => ({
      areaTitle: areas.length > 1 && grouping[0] !== 'areaTitle',
      routeType: routeTypes.length > 1 && grouping[0] !== 'routeType',
      grade: grouping[0] !== 'grade',
      rating: grouping[0] !== 'rating',
    }),
    [areas, routeTypes],
  );

  const renderGroupLabel = (columnId: string, value: unknown) => {
    if (columnId === 'rating') {
      return <RatingStarsDisplay stars={value as number} />;
    }
    return String(value);
  };

  const renderCard = (row: Row<Route>) => {
    const route = row.original;
    const isLogged = loggedSlugs.has(String(route.slug));
    const typeColor = routeTypeColor[route.routeType] ?? 'is-light';
    const hasSecondaryInfo =
      areas.length > 1 || route.rating > 0 || (route.logCount ?? 0) > 0;
    return (
      <div
        key={row.id}
        className="px-4 py-3"
        style={{ borderBottom: '1px solid #f5f5f5' }}
      >
        <div
          className="is-flex is-align-items-center"
          style={{ gap: '0.75rem' }}
        >
          <span
            className={`tag is-medium ${typeColor}`}
            style={{
              minWidth: '3.25rem',
              flexShrink: 0,
              justifyContent: 'center',
              fontWeight: 700,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {gradeLabel(route) || '—'}
          </span>
          <div className="is-flex is-flex-column " style={{ flexGrow: 1 }}>
            <Link
              to="/crags/$cragSlug/areas/$areaSlug/topos/$topoSlug/routes/$routeSlug"
              params={{
                cragSlug: route.cragSlug,
                areaSlug: route.areaSlug,
                topoSlug: route.topoSlug,
                routeSlug: route.slug,
              }}
              className={`has-text-weight-semibold is-flex-grow-1${isLogged ? ' has-text-grey' : ''}`}
              style={{
                textDecoration: isLogged ? 'line-through' : 'none',
                minWidth: 0,
              }}
            >
              {route.title}
            </Link>
            {hasSecondaryInfo && (
              <div
                className="is-flex is-align-items-center is-flex-wrap-wrap"
                style={{
                  marginTop: '0.2rem',
                  gap: '0.5rem',
                }}
              >
                {areas.length > 1 && (
                  <span className="is-size-7 has-text-grey is-capitalized">
                    {route.areaTitle}
                  </span>
                )}
                {route.rating > 0 && (
                  <RatingStarsDisplay stars={route.rating} />
                )}
                {(route.logCount ?? 0) > 0 && (
                  <span
                    className="is-size-7 has-text-grey"
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    {route.logCount}{' '}
                    <i className="fas fa-check" aria-hidden="true" />
                  </span>
                )}
              </div>
            )}
          </div>
          <span className="tag is-light is-capitalized is-flex-shrink-0">
            {route.routeType}
          </span>
          {mounted && (
            <Suspense fallback={null}>
              <AreaRouteTableMenu isAuthenticated={isAuthenticated} route={route} />
            </Suspense>
          )}
        </div>
      </div>
    );
  };

  return (
    <DataGrid
      data={routes}
      columns={columns}
      filterConfigs={filterConfigs}
      groupByOptions={groupByOptions}
      getColumnVisibility={getColumnVisibility}
      renderGroupLabel={renderGroupLabel}
      sortOptions={sortOptions}
      renderCard={renderCard}
      emptyMessage="No routes match your filters"
      itemLabel="route"
    />
  );
}

export default CragRoutesTable;
