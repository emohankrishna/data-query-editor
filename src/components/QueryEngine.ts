import { COLUMN_NOT_PRESENT, INVALID_QUERY, NOT_SUPPORTED, TABLE_NOT_PRESENT } from "../constants";
import { IDatabase } from "../types/QueryResult";
export const parseQuery = (query: string) => {
  query = query.toLowerCase().trim();
  const selectRegex = /^select (.+) from \w+/i;
  const isWhereExist = query.includes('where');
  const isHavingExist = query.includes('having');
  const isOrderByExist = query.includes('order by');
  if (isWhereExist) {
    return { columns: [], tableName: "", error: NOT_SUPPORTED.WHERE_CLAUSE };
  } else if (isHavingExist){
    return { columns: [], tableName: "", error: NOT_SUPPORTED.HAVING_CLAUSE };
  } else if (isOrderByExist){
    return { columns: [], tableName: "", error: NOT_SUPPORTED.ORDER_BY };
  }
  const selectMatch = query.match(selectRegex);
  if (!selectMatch){
    return { columns: [], tableName: '', error: INVALID_QUERY}
  }
  const columns = selectMatch
    ? selectMatch[1].split(",").map((col) => col.trim())
    : [];

  let tableName = "";
  let error = null;
  if (selectMatch) {
    const querySplit = query.split("from");
    if (querySplit.length < 2) {
      error = INVALID_QUERY
      console.error(error);
      return { columns: [], tableName: "", error: error };
    }
    querySplit.shift()
    if (querySplit[0].split(',').filter(val => !!val).length > 1){
      tableName = ''
      return { columns, tableName: tableName, error: NOT_SUPPORTED.MULTIPLE_TABLE };
    }
    tableName = querySplit[0].trim();
    if (tableName.includes(',')){
      return { columns, tableName: '', error: INVALID_QUERY};
    }
    tableName = tableName.replace(';', '');
  }
  const isColumnNameContainsSpace = columns.some(column => column.includes(' '));
  if (isColumnNameContainsSpace){
    return { columns, tableName:'', error: `${INVALID_QUERY}` };
  }
  return { columns, tableName: tableName, error: '' };
};

export const executeQuery = (parsedResults:{tableName:string, columns:string[]}, data: IDatabase) => {
  const { tableName } = parsedResults;
  let { columns } = parsedResults;
  if (!data[tableName] || !Array.isArray(data[tableName])){
    return { entries: [], columns: [], error: TABLE_NOT_PRESENT };
  }
  // Filter data based on the WHERE clause
  const tableData = data[tableName];
  const columnSetInTable =
    tableData.length > 0 ? new Set<string>([...Object.keys(tableData[0]), '*']) : new Set();

  const anyInvalidColumn = columns.some((val) => !columnSetInTable.has(val));
  if (anyInvalidColumn) {
    return { entries: [], columns: [], error: `${COLUMN_NOT_PRESENT} ${tableName}` };
  }


  // Select specified columns
  const selectedData = tableData?.map((row:{[key:string]: unknown}) => {
    if (columns[0] === "*") {
      columns = Object.keys(row)
      return row; // Select all columns
    } else {
      // Select only the specified columns
      return columns.reduce((accumulator, col) => {
        const columnName = col.toLowerCase();
        accumulator[columnName]= row[columnName];
        return accumulator;
      }, {});
    }
  });


  return { entries: selectedData, columns: columns, error:'' };
};
