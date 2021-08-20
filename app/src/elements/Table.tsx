interface Props {
  columns: string[];
  data: string[][];
  special: Record<string, (fieldValue: any) => any>
}

const Table = ({ columns, data, special }: Props) => {
  const getColumnTitle = (column: number) => {
    return columns[column];
  }

  const getFieldValue = (row: number, column: number) => {
    const columnTitle = getColumnTitle(column);
    const columnValue = data[row][column];

    if (Object.keys(special).includes(columnTitle)) {
      return special[columnTitle](columnValue);
    }

    return columnValue;
  }

  return (
    <table className="table is-fullwidth">
      <thead>
        <tr>
          { columns.map(column => (
            <th key={ `tableHead_${column}` }>{ column }</th>
          ))}
        </tr>
      </thead>
      <tbody>
        { data.map((column, rowIndex) => (
          <tr> {
            column.map((_field, colIndex) => (
              <td key={ `tableBody_${rowIndex}_${colIndex}` }>
                { getFieldValue(rowIndex, colIndex) }
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Table;
