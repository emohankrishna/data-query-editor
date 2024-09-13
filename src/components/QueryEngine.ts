import { COLUMN_NOT_PRESENT, INVALID_QUERY, NOT_SUPPORTED, TABLE_NOT_PRESENT } from "../constants";
import { IDatabase } from "../types/QueryResult";
export const parseQuery = (query: string) => {
  const originalQuery = query;
  query = query.toLowerCase().trim();
  const selectRegex = /^select (.+) from \w+/i;
  const isWhereExist = query.includes('where');
  const isHavingExist = query.includes('having');
  const isOrderByExist = query.includes('order by');
  let columnAlias = new Map()
  if (isWhereExist) {
    return { columns: [], tableName: "", error: NOT_SUPPORTED.WHERE_CLAUSE, columnAlias };
  } else if (isHavingExist){
    return { columns: [], tableName: "", error: NOT_SUPPORTED.HAVING_CLAUSE, columnAlias };
  } else if (isOrderByExist){
    return { columns: [], tableName: "", error: NOT_SUPPORTED.ORDER_BY, columnAlias };
  }
  const selectMatch = query.match(selectRegex);
  if (!selectMatch){
    return { columns: [], tableName: '', error: INVALID_QUERY, columnAlias}
  }
  let columns = selectMatch
    ? selectMatch[1].split(",").map((col) => col.trim())
    : [];

  let tableName = "";
  let error = null;
  if (selectMatch) {
    const querySplit = query.split("from");
    if (querySplit.length < 2) {
      error = INVALID_QUERY
      console.error(error);
      return { columns: [], tableName: "", error: error, columnAlias };
    }
    querySplit.shift()
    if (querySplit[0].split(',').filter(val => !!val).length > 1){
      tableName = ''
      return { columns, tableName: tableName, error: NOT_SUPPORTED.MULTIPLE_TABLE, columnAlias };
    }
    tableName = querySplit[0].trim();
    if (tableName.includes(',')){
      return { columns, tableName: '', error: INVALID_QUERY, columnAlias };
    }
    tableName = tableName.replace(';', '');
  }
  const isColumnNameContainsSpace = columns.some(column => {
    if (column.includes('as')){
      const columnNameSplit = column.split('as').map(val => val.trim());
      if (columnNameSplit.length != 2){
        return true
      } else {
        const [name] = columnNameSplit
        return name.includes(' ')
      }
    } else {
      return column.includes(' ')
    }
  });
  if (isColumnNameContainsSpace){
    return { columns, tableName:'', error: `${INVALID_QUERY}`, columnAlias };
  }
  const isContainAs = query.includes('as')

  if (isContainAs) {
    const [colAlias, error]:[Map<string, string>, Error|null]  = getColumnAliases(originalQuery);
    if (error) {
      return  { columns, tableName: tableName, error: error.message, columnAlias };
    }
    columnAlias = colAlias
    columns = [...colAlias.keys()]
  }
  return { columns, tableName: tableName, error: '', columnAlias };
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
  const selectedData = tableData?.map((row: {[key:string]:unknown}) => {
    if (columns[0] === "*") {
      columns = Object.keys(row)
      return row; // Select all columns
    } else {
      // Select only the specified columns
      return columns.reduce((accumulator:{[key:string]:unknown}, col) => {
        const columnName = col.toLowerCase();
        accumulator[columnName]= row[columnName];
        return accumulator;
      }, {});
    }
  });


  return { entries: selectedData, columns: columns, error:'' };
};


function getColumnAliases(query:string): [Map<string, string>, Error|null] {
  const selectRegex = /SELECT\s+(.+?)\s+FROM/i;
  const match = query.match(selectRegex);

  if (!match) {
    return [new Map(), new Error(INVALID_QUERY)];
  }

  const columnsPart = match[1].split(',');

  const aliasMap = new Map() ;

  columnsPart.forEach(column => {
    // split based on 'as' key word
    const [original, alias] = column.trim().split(/\s+as\s+/i);
    // If there is no alias, keep original column name
    aliasMap.set(original.trim(), alias ? alias.trim() : original.trim()); 
  });

  return [aliasMap, null];
}