import "./QueryEditor.css";
interface QueryEditorProps {
  query: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  onExecute: () => void;
  error: string;
}
const QueryEditor: React.FC<QueryEditorProps> = ({
  query,
  onChange,
  onExecute,
  placeholder = "Please enter your query...",
  maxLength,
  rows,
  error = '',
}) => {
  return (
    <div className="query-editor">
      <div className="editor">
        <textarea
          value={query}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          rows={rows}
          maxLength={maxLength}
          className={`text-area ${error ? 'error': ''}`}
        />
        <button className="btn btn-primary" onClick={onExecute}>
          Execute
        </button>
      </div>
      {error.length > 0 ? (
        <div className="error">
          {error}
        </div>
      ) : null}
    </div>
  );
};

export default QueryEditor;
