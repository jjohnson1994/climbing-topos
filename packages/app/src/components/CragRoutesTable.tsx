import { useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { createColumnHelper } from '@tanstack/react-table'
import { Log, Route } from '@climbingtopos/types'
import { gradingSystems } from '@climbingtopos/globals'
import RatingStarsDisplay from '@/components/RatingStarsDisplay'
import DataGrid, { type FilterConfig, type GroupByOption, fuzzySort } from '@/components/DataGrid'

interface Props {
  routes: Route[]
  loggedRoutes: Log[]
  isAuthenticated: boolean
}

const columnHelper = createColumnHelper<Route>()

function gradeLabel(route: Route): string {
  const system = gradingSystems.find((s) => s.title === route.gradingSystem)
  return system?.grades[route.gradeModal] ?? route.grade ?? ''
}

function CragRoutesTable({ routes, loggedRoutes, isAuthenticated: _isAuthenticated }: Props) {
  const loggedSlugs = useMemo(
    () => new Set(loggedRoutes.map((l) => l.routeSlug)),
    [loggedRoutes],
  )

  const routeTypes = useMemo(
    () => Array.from(new Set(routes.map((r) => r.routeType).filter(Boolean))).sort(),
    [routes],
  )

  const areas = useMemo(
    () =>
      Array.from(new Map(routes.map((r) => [r.areaSlug, r.areaTitle])).entries()).sort(
        (a, b) => a[1].localeCompare(b[1]),
      ),
    [routes],
  )

  const columns = useMemo(
    () => [
      columnHelper.accessor('title', {
        header: 'Route',
        enableGrouping: false,
        sortingFn: fuzzySort,
        cell: ({ row }) => {
          const route = row.original
          if (!route) return null
          return (
            <Link
              to="/crags/$cragSlug/areas/$areaSlug/topos/$topoSlug/routes/$routeSlug"
              params={{
                cragSlug: route.cragSlug,
                areaSlug: route.areaSlug,
                topoSlug: route.topoSlug,
                routeSlug: route.slug,
              }}
              className={loggedSlugs.has(String(route.slug)) ? 'line-through' : ''}
            >
              {route.title}
            </Link>
          )
        },
      }),
      columnHelper.accessor('areaTitle', {
        header: 'Area',
        cell: (info) => <span className="is-capitalized">{info.getValue()}</span>,
      }),
      columnHelper.accessor((row) => gradeLabel(row), {
        id: 'grade',
        header: 'Grade',
        sortingFn: (rowA, rowB) => {
          const a = rowA.original?.gradeModal ?? rowA.subRows[0]?.original?.gradeModal ?? 0
          const b = rowB.original?.gradeModal ?? rowB.subRows[0]?.original?.gradeModal ?? 0
          return a - b
        },
      }),
      columnHelper.accessor('routeType', {
        header: 'Type',
        enableGlobalFilter: false,
        cell: (info) => <span className="is-capitalized">{info.getValue()}</span>,
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
  )

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
  )

  const groupByOptions = useMemo<GroupByOption[]>(
    () => [
      ...(areas.length > 1 ? [{ value: 'areaTitle', label: 'Area' }] : []),
      ...(routeTypes.length > 1 ? [{ value: 'routeType', label: 'Type' }] : []),
      { value: 'grade', label: 'Grade' },
      { value: 'rating', label: 'Rating' },
    ],
    [areas, routeTypes],
  )

  const getColumnVisibility = useMemo(
    () => (grouping: string[]) => ({
      areaTitle: areas.length > 1 && grouping[0] !== 'areaTitle',
      routeType: routeTypes.length > 1 && grouping[0] !== 'routeType',
      grade: grouping[0] !== 'grade',
      rating: grouping[0] !== 'rating',
    }),
    [areas, routeTypes],
  )

  const renderGroupLabel = (columnId: string, value: unknown) => {
    if (columnId === 'rating') {
      return <RatingStarsDisplay stars={value as number} />
    }
    return String(value)
  }

  return (
    <DataGrid
      data={routes}
      columns={columns}
      filterConfigs={filterConfigs}
      groupByOptions={groupByOptions}
      getColumnVisibility={getColumnVisibility}
      renderGroupLabel={renderGroupLabel}
      emptyMessage="No routes match your filters"
      itemLabel="route"
    />
  )
}

export default CragRoutesTable
