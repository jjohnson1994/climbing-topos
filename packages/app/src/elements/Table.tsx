import { useTable, useSortBy, Column } from 'react-table';

interface Props {
  columns: Column[];
  data: object[];
  sortBy?: {
    id: string;
    desc: boolean;
  };
}

const Table = ({ columns, data, sortBy }: Props) => {
  const tableInstance = useTable(
    {
      // @ts-ignore Type 'Column<{}>[]' is not assignable to type 'readonly Column<Object>[]'
      columns,
      data,
      initialState: {
        ...(sortBy && { sortBy: [sortBy] }),
      },
    },
    useSortBy,
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <table className="table is-fullwidth" {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => {
          const { key: headerGroupKey, ...headerGroupProps } =
            headerGroup.getHeaderGroupProps();
          return (
            <tr key={headerGroupKey} {...headerGroupProps}>
              {headerGroup.headers.map((column) => {
                const { key: headerKey, ...headerProps } =
                  column.getHeaderProps(column.getSortByToggleProps());
                return (
                  <th key={headerKey} {...headerProps}>
                    {column.render('Header')}
                    <span>
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <i className="ml-1 fas fa-chevron-down" />
                        ) : (
                          <i className="ml-1 fas fa-chevron-up" />
                        )
                      ) : (
                        ''
                      )}
                    </span>
                  </th>
                );
              })}
            </tr>
          );
        })}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          const { key: rowKey, ...rowProps } = row.getRowProps();
          return (
            <tr key={rowKey} {...rowProps}>
              {row.cells.map((cell) => {
                const { key: cellKey, ...cellProps } = cell.getCellProps();
                return (
                  <td key={cellKey} {...cellProps}>
                    {cell.render('Cell')}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
