import { useState, useMemo, useRef, useEffect, type ReactNode } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getGroupedRowModel,
  getExpandedRowModel,
  flexRender,
  sortingFns,
  type ColumnDef,
  type SortingState,
  type GroupingState,
  type ExpandedState,
  type FilterFn,
  type SortingFn,
} from '@tanstack/react-table';
import {
  rankItem,
  compareItems,
  type RankingInfo,
} from '@tanstack/match-sorter-utils';

declare module '@tanstack/react-table' {
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

export interface FilterConfig<T> {
  label: string;
  getOptions: () => Array<{ key: string; label: string }>;
  matches: (row: T, selectedKeys: string[]) => boolean;
  renderOptionLabel?: (key: string, label: string) => ReactNode;
}

export interface GroupByOption {
  value: string;
  label: string;
}

interface DataGridProps<T extends object> {
  data: T[];
  columns: ColumnDef<T, any>[];
  filterConfigs?: FilterConfig<T>[];
  groupByOptions?: GroupByOption[];
  getColumnVisibility?: (grouping: GroupingState) => Record<string, boolean>;
  renderGroupLabel?: (columnId: string, value: unknown) => ReactNode;
  emptyMessage?: string;
  itemLabel?: string;
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};
fuzzyFilter.autoRemove = (val: unknown) => !val;

export const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0;
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]?.itemRank,
      rowB.columnFiltersMeta[columnId]?.itemRank,
    );
  }
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
};

function DataGrid<T extends object>({
  data,
  columns,
  filterConfigs = [],
  groupByOptions = [],
  getColumnVisibility,
  renderGroupLabel,
  emptyMessage = 'No results match your filters',
  itemLabel = 'item',
}: DataGridProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [grouping, setGrouping] = useState<GroupingState>([]);
  const [expanded, setExpanded] = useState<ExpandedState>(true);
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedKeys, setSelectedKeys] = useState<Record<number, string[]>>(
    {},
  );
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [groupOpen, setGroupOpen] = useState(false);
  const filtersRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        filtersRef.current &&
        !filtersRef.current.contains(e.target as Node)
      ) {
        setFiltersOpen(false);
      }
      if (groupRef.current && !groupRef.current.contains(e.target as Node)) {
        setGroupOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filterOptions = useMemo(
    () => filterConfigs.map((fc) => fc.getOptions()),
    [filterConfigs],
  );

  const filteredData = useMemo(
    () =>
      data.filter((row) =>
        filterConfigs.every((fc, i) => fc.matches(row, selectedKeys[i] ?? [])),
      ),
    [data, filterConfigs, selectedKeys],
  );

  const activeFilterCount = useMemo(
    () => Object.values(selectedKeys).reduce((sum, arr) => sum + arr.length, 0),
    [selectedKeys],
  );

  const hasFilters = activeFilterCount > 0 || !!globalFilter;

  const columnVisibility = useMemo(
    () => (getColumnVisibility ? getColumnVisibility(grouping) : {}),
    [getColumnVisibility, grouping],
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, grouping, expanded, globalFilter, columnVisibility },
    onSortingChange: setSorting,
    onGroupingChange: setGrouping,
    onExpandedChange: setExpanded,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: () => {},
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    autoResetExpanded: false,
    autoResetPageIndex: false,
    groupedColumnMode: false,
  });

  const rows = table.getRowModel().rows;
  const leafCount = rows.filter((r) => !r.getIsGrouped()).length;
  const visibleColCount = table.getVisibleLeafColumns().length;

  const toggleKey = (filterIndex: number, key: string) => {
    setSelectedKeys((prev) => {
      const current = prev[filterIndex] ?? [];
      const next = current.includes(key)
        ? current.filter((k) => k !== key)
        : [...current, key];
      return { ...prev, [filterIndex]: next };
    });
  };

  const clearFilters = () => {
    setSelectedKeys({});
    setGlobalFilter('');
  };

  const allGroupByOptions = [{ value: '', label: 'None' }, ...groupByOptions];

  return (
    <div>
      <div className="mb-4">
        <div
          className="field is-grouped is-flex-wrap-wrap"
          style={{ gap: '0.5rem' }}
        >
          <div className="control is-expanded">
            <div className="control has-icons-left">
              <input
                className="input"
                type="search"
                placeholder="Search…"
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                aria-label="Search"
              />
              <span className="icon is-left">
                <i className="fas fa-search" aria-hidden="true" />
              </span>
            </div>
          </div>

          {filterConfigs.length > 0 && (
            <div className="control" ref={filtersRef}>
              <div className={`dropdown${filtersOpen ? ' is-active' : ''}`}>
                <div className="dropdown-trigger">
                  <button
                    type="button"
                    className="button"
                    aria-haspopup="true"
                    aria-expanded={filtersOpen}
                    aria-controls="datagrid-filters-dropdown"
                    onClick={() => {
                      setFiltersOpen((v) => !v);
                      setGroupOpen(false);
                    }}
                  >
                    <span>Filter</span>
                    {activeFilterCount > 0 && (
                      <span>({activeFilterCount})</span>
                    )}
                    <span className="icon is-small ml-1">
                      <i className="fas fa-angle-down" aria-hidden="true" />
                    </span>
                  </button>
                </div>
                <div
                  className="dropdown-menu"
                  id="datagrid-filters-dropdown"
                  role="dialog"
                  aria-label="Filters"
                >
                  <div
                    className="dropdown-content"
                    style={{ minWidth: '220px' }}
                  >
                    {filterConfigs.map((fc, i) => (
                      <div key={i}>
                        {i > 0 && <hr className="dropdown-divider" />}
                        <div className="dropdown-item">
                          <fieldset>
                            <legend className="label is-small mb-2">
                              {fc.label}
                            </legend>
                            {filterOptions[i].map(({ key, label }) => (
                              <div className="field" key={key}>
                                <label className="checkbox is-capitalized">
                                  <input
                                    type="checkbox"
                                    className="mr-2"
                                    checked={(selectedKeys[i] ?? []).includes(
                                      key,
                                    )}
                                    onChange={() => toggleKey(i, key)}
                                  />
                                  {fc.renderOptionLabel
                                    ? fc.renderOptionLabel(key, label)
                                    : label}
                                </label>
                              </div>
                            ))}
                          </fieldset>
                        </div>
                      </div>
                    ))}
                    {hasFilters && (
                      <>
                        <hr className="dropdown-divider" />
                        <div className="dropdown-item">
                          <button
                            type="button"
                            className="button is-small is-light is-fullwidth"
                            onClick={clearFilters}
                          >
                            Clear all filters
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {groupByOptions.length > 0 && (
            <div className="control" ref={groupRef}>
              <div className={`dropdown${groupOpen ? ' is-active' : ''}`}>
                <div className="dropdown-trigger">
                  <button
                    type="button"
                    className="button"
                    aria-haspopup="true"
                    aria-expanded={groupOpen}
                    aria-controls="datagrid-group-dropdown"
                    onClick={() => {
                      setGroupOpen((v) => !v);
                      setFiltersOpen(false);
                    }}
                  >
                    <span>Group</span>
                    <span className="icon is-small ml-1">
                      <i className="fas fa-angle-down" aria-hidden="true" />
                    </span>
                  </button>
                </div>
                <div
                  className="dropdown-menu"
                  id="datagrid-group-dropdown"
                  role="dialog"
                  aria-label="Group"
                >
                  <div
                    className="dropdown-content"
                    style={{ minWidth: '180px' }}
                  >
                    <div className="dropdown-item">
                      <fieldset>
                        <legend className="label is-small mb-2">
                          Group by
                        </legend>
                        {allGroupByOptions.map(({ value, label }) => (
                          <div className="field" key={value || 'none'}>
                            <label className="radio">
                              <input
                                type="radio"
                                name="datagrid-group-by"
                                className="mr-2"
                                checked={
                                  grouping[0] === value ||
                                  (value === '' && grouping.length === 0)
                                }
                                onChange={() => {
                                  setGrouping(value ? [value] : []);
                                  setSorting(
                                    value ? [{ id: value, desc: false }] : [],
                                  );
                                }}
                              />
                              {label}
                            </label>
                          </div>
                        ))}
                      </fieldset>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {hasFilters && (
          <p className="is-size-7 has-text-grey mt-1">
            {leafCount} of {data.length} {itemLabel}s
          </p>
        )}
      </div>

      <div className="box" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table
            className="table is-fullwidth is-hoverable is-striped"
            style={{ marginBottom: 0 }}
          >
            <thead>
              <tr>
                {table.getFlatHeaders().map((header) => (
                  <th
                    key={header.id}
                    onClick={
                      header.column.getCanSort()
                        ? header.column.getToggleSortingHandler()
                        : undefined
                    }
                    style={{
                      cursor: header.column.getCanSort()
                        ? 'pointer'
                        : 'default',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                    {header.column.getIsSorted() === 'asc' && (
                      <i className="fas fa-sort-up ml-1" aria-hidden="true" />
                    )}
                    {header.column.getIsSorted() === 'desc' && (
                      <i className="fas fa-sort-down ml-1" aria-hidden="true" />
                    )}
                    {!header.column.getIsSorted() &&
                      header.column.getCanSort() && (
                        <i
                          className="fas fa-sort ml-1 has-text-grey-light"
                          aria-hidden="true"
                        />
                      )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={visibleColCount}
                    className="has-text-centered has-text-grey py-5"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                rows.map((row) => {
                  if (row.getIsGrouped()) {
                    const groupedColId = grouping[0];
                    const value = row.getGroupingValue(groupedColId);
                    return (
                      <tr
                        key={row.id}
                        className="has-background-light"
                        onClick={row.getToggleExpandedHandler()}
                        style={{ cursor: 'pointer' }}
                      >
                        <td colSpan={visibleColCount}>
                          <span className="icon-text">
                            <span className="icon">
                              <i
                                className={`fas fa-chevron-${row.getIsExpanded() ? 'down' : 'right'}`}
                              />
                            </span>
                            <strong className="is-capitalized">
                              {renderGroupLabel
                                ? renderGroupLabel(groupedColId, value)
                                : String(value)}
                            </strong>
                            <span className="ml-2 has-text-grey is-size-7">
                              ({row.subRows.length})
                            </span>
                          </span>
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!hasFilters && (
        <p className="has-text-grey is-size-7 mt-2">
          {data.length} {itemLabel}
          {data.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
}

export default DataGrid;
