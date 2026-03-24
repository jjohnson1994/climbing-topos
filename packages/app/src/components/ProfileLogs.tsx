import { useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { createColumnHelper } from '@tanstack/react-table'
import { Log } from '@climbingtopos/types'
import { useGradeHelpers } from '@/api/grades'
import RatingStarsDisplay from '@/components/RatingStarsDisplay'
import DataGrid, { type FilterConfig, type GroupByOption, fuzzySort } from '@/components/DataGrid'

const columnHelper = createColumnHelper<Log>()

function ProfileLogs({ logs }: { logs: Log[] }) {
  const { convertGradeValueToGradeLabel } = useGradeHelpers()

  const routeTypes = useMemo(
    () => Array.from(new Set(logs.map((l) => l.routeType).filter(Boolean))).sort(),
    [logs],
  )

  const crags = useMemo(
    () =>
      Array.from(new Map(logs.map((l) => [l.cragSlug, l.cragTitle])).entries()).sort(
        (a, b) => a[1].localeCompare(b[1]),
      ),
    [logs],
  )

  const columns = useMemo(
    () => [
      columnHelper.accessor('routeTitle', {
        header: 'Route',
        enableGrouping: false,
        sortingFn: fuzzySort,
        cell: ({ row }) => {
          const log = row.original
          if (!log) return null
          return (
            <Link
              to="/crags/$cragSlug/areas/$areaSlug/topos/$topoSlug/routes/$routeSlug"
              params={{
                cragSlug: log.cragSlug,
                areaSlug: log.areaSlug,
                topoSlug: log.topoSlug,
                routeSlug: log.routeSlug,
              }}
            >
              {log.routeTitle}
            </Link>
          )
        },
      }),
      columnHelper.accessor('cragTitle', {
        header: 'Crag',
      }),
      columnHelper.accessor('routeType', {
        header: 'Type',
        enableGlobalFilter: false,
        cell: (info) => <span className="is-capitalized">{info.getValue()}</span>,
      }),
      columnHelper.accessor(
        (row) => convertGradeValueToGradeLabel(parseInt(row.gradeTaken), row.gradingSystem),
        {
          id: 'grade',
          header: 'Grade',
          enableGlobalFilter: false,
          sortingFn: (rowA, rowB) => {
            const a = parseInt(rowA.original?.gradeTaken ?? rowA.subRows[0]?.original?.gradeTaken ?? '0')
            const b = parseInt(rowB.original?.gradeTaken ?? rowB.subRows[0]?.original?.gradeTaken ?? '0')
            return a - b
          },
        },
      ),
      columnHelper.accessor('rating', {
        header: 'Rating',
        enableGlobalFilter: false,
        cell: (info) => <RatingStarsDisplay stars={info.getValue()} />,
      }),
      columnHelper.accessor('dateSent', {
        header: 'Date',
        enableGlobalFilter: false,
        cell: (info) => new Date(info.getValue()).toLocaleDateString(),
      }),
    ],
    [convertGradeValueToGradeLabel],
  )

  const filterConfigs = useMemo<FilterConfig<Log>[]>(
    () => [
      ...(routeTypes.length > 0
        ? [
            {
              label: 'Type',
              getOptions: () => routeTypes.map((t) => ({ key: t, label: t })),
              matches: (row: Log, selected: string[]) =>
                !selected.length || selected.includes(row.routeType),
            },
          ]
        : []),
      ...(crags.length > 0
        ? [
            {
              label: 'Crag',
              getOptions: () => crags.map(([slug, title]) => ({ key: slug, label: title })),
              matches: (row: Log, selected: string[]) =>
                !selected.length || selected.includes(row.cragSlug),
            },
          ]
        : []),
      {
        label: 'Rating',
        getOptions: () =>
          Array.from(new Set(logs.map((l) => l.rating).filter((r) => r != null)))
            .sort((a, b) => a - b)
            .map((r) => ({ key: String(r), label: String(r) })),
        matches: (row: Log, selected: string[]) =>
          !selected.length || selected.includes(String(row.rating)),
        renderOptionLabel: (key) => <RatingStarsDisplay stars={Number(key)} />,
      },
    ],
    [routeTypes, crags, logs],
  )

  const groupByOptions = useMemo<GroupByOption[]>(
    () => [
      ...(crags.length > 1 ? [{ value: 'cragTitle', label: 'Crag' }] : []),
      ...(routeTypes.length > 1 ? [{ value: 'routeType', label: 'Type' }] : []),
      { value: 'grade', label: 'Grade' },
      { value: 'rating', label: 'Rating' },
      { value: 'dateSent', label: 'Date' },
    ],
    [crags, routeTypes],
  )

  const getColumnVisibility = useMemo(
    () => (grouping: string[]) => ({
      cragTitle: grouping[0] !== 'cragTitle',
      routeType: grouping[0] !== 'routeType',
      grade: grouping[0] !== 'grade',
      rating: grouping[0] !== 'rating',
      dateSent: grouping[0] !== 'dateSent',
    }),
    [],
  )

  const renderGroupLabel = (columnId: string, value: unknown) => {
    if (columnId === 'rating') {
      return <RatingStarsDisplay stars={value as number} />
    }
    if (columnId === 'dateSent') {
      return new Date(String(value)).toLocaleDateString()
    }
    return String(value)
  }

  return (
    <DataGrid
      data={logs}
      columns={columns}
      filterConfigs={filterConfigs}
      groupByOptions={groupByOptions}
      getColumnVisibility={getColumnVisibility}
      renderGroupLabel={renderGroupLabel}
      emptyMessage="No logs match your filters"
      itemLabel="log"
    />
  )
}

export default ProfileLogs
