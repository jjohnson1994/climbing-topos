interface Props {
  columns: string[];
  data: string[][];
  fieldComponents: Record<string, (fieldValue: any) => any>;
  fieldClasses: Record<string, string>;
}

const Table = ({ columns, data, fieldComponents, fieldClasses }: Props) => {
  const getColumnTitle = (column: number) => {
    return columns[column];
  }

  const getFieldValue = (row: number, column: number) => {
    const columnTitle = getColumnTitle(column);
    const columnValue = data[row][column];

    if (Object.keys(fieldComponents).includes(columnTitle)) {
      return fieldComponents[columnTitle](columnValue);
    }

    return columnValue;
  }

  const getFieldClasses = (column: number): string => {
    const columnTitle = getColumnTitle(column);

    if (Object.keys(fieldClasses).includes(columnTitle)) {
      return fieldClasses[columnTitle];
    }

    return '';
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
              <td
                key={ `tableBody_${rowIndex}_${colIndex}` }
                className={ getFieldClasses(colIndex) }
              >
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
