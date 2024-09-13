import { ITable } from "../types/QueryResult.ts";
import "./ResultTable.css";
interface ResultTable<T> {
  data: T[];
  columns: (keyof T)[];
  error:string
}
const ResultTable = <T extends ITable>({ data, columns, error = '' }: ResultTable<T>) => {
  return (
    <div className="grid-container-root">
      <h3>Query Results : </h3>
      {!error && <table className="table-container">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={`heading-${index}`} className="table-header">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.isArray(data) && data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={`row-${rowIndex}`} className="table-row">
                {columns.map((column, colIndex) => (
                  <td key={`${rowIndex}-${colIndex}`} className="table-cell">
                    {row[column]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr> No Results Found</tr>
          )}
        </tbody>
      </table>}
    </div>
  );
};

export default ResultTable;
