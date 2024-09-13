import { useState } from "react";
import "./App.css";
import QueryEditor from "./components/QueryEditor";
import ResultTable from "./components/ResultTable";
import mockData from "./mockData/mockDatabase.ts";
import { executeQuery, parseQuery } from "./components/QueryEngine.ts";
import { ITable } from "./types/QueryResult.ts";

function App() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<{ entries: object[], columns: string[] }>({ entries: [], columns: [] });
  const [queryError, setQueryError] = useState('')
  const handleExecute = () => {
    const parsedResults = parseQuery(query)
    const { error } = parsedResults
    if (error) {
      setQueryError(error)
      return 
    }
    const results: { entries: object[], columns: string[], error:string } = executeQuery(
      parsedResults,
      mockData
    );
    if (results.error){
      setQueryError(results.error)
      setData({entries: [], columns: []})
      return
    }
    setQueryError('')
    setData({entries: results.entries, columns: results.columns});
  };
  return (
    <div className="app-container">
      <QueryEditor
        query={query}
        onChange={setQuery}
        onExecute={handleExecute}
        error= {queryError}
      ></QueryEditor>
      <ResultTable
        data={data.entries}
        error={queryError}
        columns={data.columns}
        keyColumn="id"
      ></ResultTable>
    </div>
  );
}

export default App;
