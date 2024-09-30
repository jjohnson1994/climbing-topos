import { useTable, useSortBy, Column } from "react-table";

interface Props {
  columns: Column[];
  data: Object[];
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
    useSortBy
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <table className="table is-fullwidth" {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.render("Header")}
                <span>
                  {column.isSorted ? (
                    column.isSortedDesc ? (
                      <i className="ml-1 fas fa-chevron-down" />
                    ) : (
                      <i className="ml-1 fas fa-chevron-up" />
                    )
                  ) : (
                    ""
                  )}
                </span>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
