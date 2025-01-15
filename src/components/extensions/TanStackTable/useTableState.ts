import { useReducer } from "react";
import {
  ColumnFiltersState,
  OnChangeFn,
  PaginationState,
  RowSelectionState,
  SortingState,
} from "@tanstack/react-table";
import {
  IPickedTableState,
  IUseTableAction,
  IUseTableReturn,
  IUseTableStateParams,
} from "@/app/types/ITable";

const defaultState: IPickedTableState = {
  sorting: [],
  rowSelection: {},
  columnFilters: [],
  pagination: { pageIndex: 0, pageSize: 10 },
};

function tableReducer(
  state: IUseTableStateParams,
  action: IUseTableAction
): IUseTableStateParams {
  switch (action.type) {
    case "SET_SORTING":
      return { ...state, sorting: action.payload };
    case "SET_ROW_SELECTION":
      return { ...state, rowSelection: action.payload };
    case "SET_COLUMN_FILTERS":
      return { ...state, columnFilters: action.payload };
    case "SET_PAGINATION":
      return { ...state, pagination: action.payload };
    default:
      throw new Error(`Unhandled action type`);
  }
}

export function useTableState(
  initialState: IUseTableStateParams
): IUseTableReturn {
  const mergedState = { ...defaultState, ...initialState };

  const [state, dispatch] = useReducer(tableReducer, mergedState);

  const setSorting: OnChangeFn<SortingState> = (updaterOrValue) => {
    const nextValue =
      typeof updaterOrValue === "function"
        ? (updaterOrValue as (prev: SortingState) => SortingState)(
            state.sorting!
          )
        : updaterOrValue;
    dispatch({ type: "SET_SORTING", payload: nextValue });
  };

  const setRowSelection: OnChangeFn<RowSelectionState> = (updaterOrValue) => {
    const nextValue =
      typeof updaterOrValue === "function"
        ? (updaterOrValue as (prev: RowSelectionState) => RowSelectionState)(
            state.rowSelection!
          )
        : updaterOrValue;
    dispatch({ type: "SET_ROW_SELECTION", payload: nextValue });
  };

  const setColumnFilters: OnChangeFn<ColumnFiltersState> = (updaterOrValue) => {
    const nextValue =
      typeof updaterOrValue === "function"
        ? (updaterOrValue as (prev: ColumnFiltersState) => ColumnFiltersState)(
            state.columnFilters!
          )
        : updaterOrValue;
    dispatch({ type: "SET_COLUMN_FILTERS", payload: nextValue });
  };

  const setPagination: OnChangeFn<PaginationState> = (updaterOrValue) => {
    const nextValue =
      typeof updaterOrValue === "function"
        ? (updaterOrValue as (prev: PaginationState) => PaginationState)(
            state.pagination!
          )
        : updaterOrValue;
    dispatch({ type: "SET_PAGINATION", payload: nextValue });
  };

  return {
    ...defaultState,
    ...state,
    setSorting,
    setRowSelection,
    setColumnFilters,
    setPagination,
  };
}
