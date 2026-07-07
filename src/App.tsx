import lubricantsData from "./data/lubricants.generated.json";
import metaData from "./data/meta.generated.json";
import type { LubricantRecord, RevisionMeta } from "./data/types.ts";
import { useLubricantSearch } from "./hooks/useLubricantSearch.ts";
import { Header } from "./components/Header.tsx";
import { SearchPanel } from "./components/SearchPanel.tsx";
import { ResultsBar } from "./components/ResultsBar.tsx";
import { ResultsTable } from "./components/ResultsTable.tsx";

const records = lubricantsData as LubricantRecord[];
const meta = metaData as RevisionMeta;

function App() {
  const { query, setQuery, clear, sortColumn, sortDirection, setSort, results } = useLubricantSearch(records);

  return (
    <>
      <Header meta={meta} resultCount={results.length} />
      <SearchPanel query={query} onQueryChange={setQuery} onClear={clear} />
      <ResultsBar
        shownCount={results.length}
        totalCount={records.length}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
      />
      <ResultsTable
        results={results}
        query={query}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={setSort}
      />
    </>
  );
}

export default App;
