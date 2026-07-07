import { useMemo, useReducer } from "react";
import type { LubricantRecord } from "../data/types.ts";
import { searchRecords, sortRecords, type ScoredRecord, type SortColumn, type SortDirection } from "../lib/search.ts";

interface State {
  query: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}

type Action =
  | { type: "SET_QUERY"; query: string }
  | { type: "CLEAR" }
  | { type: "SET_SORT"; column: SortColumn };

const initialState: State = {
  query: "",
  sortColumn: "score",
  sortDirection: "desc",
};

/** Numeric-ish columns default to descending on first click (highest first); text columns default ascending. */
const DEFAULT_DESCENDING_COLUMNS = new Set<SortColumn>(["score"]);

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_QUERY":
      return { ...state, query: action.query };
    case "CLEAR":
      return { ...state, query: "" };
    case "SET_SORT": {
      if (state.sortColumn === action.column) {
        return { ...state, sortDirection: state.sortDirection === "asc" ? "desc" : "asc" };
      }
      return {
        ...state,
        sortColumn: action.column,
        sortDirection: DEFAULT_DESCENDING_COLUMNS.has(action.column) ? "desc" : "asc",
      };
    }
    default:
      return state;
  }
}

export interface UseLubricantSearchResult {
  query: string;
  setQuery: (query: string) => void;
  clear: () => void;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
  setSort: (column: SortColumn) => void;
  results: ScoredRecord[];
  totalCount: number;
}

export function useLubricantSearch(records: LubricantRecord[]): UseLubricantSearchResult {
  const [state, dispatch] = useReducer(reducer, initialState);

  const results = useMemo(() => {
    const matched = searchRecords(records, state.query);
    return sortRecords(matched, state.sortColumn, state.sortDirection);
  }, [records, state.query, state.sortColumn, state.sortDirection]);

  return {
    query: state.query,
    setQuery: (query: string) => dispatch({ type: "SET_QUERY", query }),
    clear: () => dispatch({ type: "CLEAR" }),
    sortColumn: state.sortColumn,
    sortDirection: state.sortDirection,
    setSort: (column: SortColumn) => dispatch({ type: "SET_SORT", column }),
    results,
    totalCount: records.length,
  };
}
