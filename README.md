# TanStack Table: A Highly Customizable Table with Hook-based Implementation

## Overview

This project demonstrates a powerful and flexible implementation of tables using the TanStack Table library. The approach leverages React hooks to encapsulate table logic, state management, and behavior in a reusable way. The core of this implementation is the `useTanStackTable` custom hook, which exports both the table instance and a preconfigured table component (`RootTable`).

By using closures within the hook, the implementation keeps the logic modular and ensures a seamless flow between table configuration and UI rendering.

---

## Features

- **Encapsulated Logic**: All table-related logic is encapsulated within the `useTanStackTable` hook.
- **Dynamic Export**: Directly export a table-ready component (`RootTable`) along with the table instance.
- **Sorting**: Multi-column sorting with manual sorting control.
- **Filtering**: Debounced and customizable column filtering.
- **Pagination**: Server-side pagination with adjustable page sizes.
- **Row Selection**: Supports both single and multi-row selection.
- **Dynamic Styling**: Conditional styling for rows and cells based on data.

---

## Installation

Install required dependencies:

```bash
npm install @tanstack/react-table
npm install react-query
```

---

## Core Concept: The `useTanStackTable` Hook

The `useTanStackTable` hook centralizes all table functionality. It exports two main items:

1. **`RootTable`**: A preconfigured table component ready for rendering.
2. **`table`**: The TanStack Table instance, allowing additional customizations if needed.

### Hook API

| Parameter            | Type                                  | Description                             |
| -------------------- | ------------------------------------- | --------------------------------------- |
| `columns`            | `ColumnDef<TData, any>[]`             | Column definitions for the table.       |
| `paginatedTableData` | `{ data: TData[]; ... }`              | Data and metadata for pagination.       |
| `sorting`            | `SortingState`                        | Sorting state for the table.            |
| `setSorting`         | `(state: SortingState) => void`       | Function to update sorting state.       |
| `pagination`         | `PaginationState`                     | Current pagination state.               |
| `setPagination`      | `(state: PaginationState) => void`    | Function to update pagination state.    |
| `columnFilters`      | `ColumnFiltersState`                  | Active filters for the table.           |
| `setColumnFilters`   | `(state: ColumnFiltersState) => void` | Function to update filters.             |
| `rowSelection`       | `RowSelectionState`                   | State of selected rows.                 |
| `setRowSelection`    | `(state: RowSelectionState) => void`  | Function to update row selection state. |
| `columnVisibility`   | `Record<string, boolean>`             | Visibility state for each column.       |

---

## How It Works

### Hook Usage

The hook takes several state management functions (`setSorting`, `setPagination`, etc.) and integrates them into a centralized table instance. This instance is configured with sorting, filtering, pagination, and row selection logic. The table instance and a ready-to-use component are returned for immediate use.

### Example:

```tsx
const { RootTable, table } = useTanStackTable({
  columns: cols,
  columnFilters,
  paginatedTableData: data,
  rowSelection,
  setRowSelection,
  pagination,
  setColumnFilters,
  setPagination,
  sorting,
  setSorting,
  columnVisibility: {
    id: false,
  },
});
```

### Why Export the Table?

Exporting the `table` instance allows developers to:

- Access advanced table configurations.
- Apply additional customizations at runtime.
- Debug or inspect table state dynamically.

---

## Complete Usage Example

```tsx
import {
  ColumnFilter,
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
} from "@tanstack/react-table";
import React, { useMemo, useState } from "react";

export default function ExampleTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const cols: ColumnDef<{ id: string; name: string; status: string }>[] = [
    {
      header: "ID",
      accessorKey: "id",
      enableSorting: true,
    },
    {
      header: "Name",
      accessorKey: "name",
      enableSorting: true,
    },
    {
      header: "Status",
      accessorKey: "status",
      enableSorting: false,
    },
  ];

  const data = useMemo(
    () => [
      { id: "1", name: "Item 1", status: "Active" },
      { id: "2", name: "Item 2", status: "Inactive" },
    ],
    []
  );

  const { RootTable, table } = useTanStackTable({
    columns: cols,
    columnFilters,
    paginatedTableData: { data, total: 2, limit: 10, total_filtered: 2 },
    rowSelection,
    setRowSelection,
    pagination,
    setColumnFilters,
    setPagination,
    sorting,
    setSorting,
    columnVisibility: {
      id: true,
    },
  });

  return (
    <div>
      <RootTable
        isError={false}
        isLoading={false}
        refetch={() => {}}
        cols={cols}
      />
    </div>
  );
}
```

---

## Key Benefits of This Implementation

1. **Encapsulation**: Keeps table logic isolated from UI components.
2. **Flexibility**: Offers direct access to both the table instance and a preconfigured component.
3. **Customizability**: Makes it easy to modify table behavior, styles, and features as needed.

---

## Conclusion

The `useTanStackTable` hook simplifies table management by integrating logic and UI seamlessly. By leveraging closures and direct exports, this approach ensures a scalable, maintainable, and highly customizable solution for implementing tables in React applications.

# ComboSearchBox: A Dynamic and Async Searchable Dropdown Component

## Overview

The `ComboSearchBox` is a flexible component designed for dynamic, asynchronous searches within a dropdown. It enables users to search for options fetched from an API or other remote sources while providing a seamless user experience. The component's key features include:

- **Dynamic searching**: Updates options based on user input.
- **Initial value support**: Displays a default selection while asynchronously fetching options.
- **Custom callbacks**: Handles selected values and provides access to the entire list of loaded options.
- **Debounced input**: Reduces redundant API calls by debouncing user input.

---

## Features

- **Asynchronous Search**: Fetches options dynamically based on the search term.
- **Initial Value Handling**: Supports preselected values to ensure a consistent user experience.
- **Debounced Queries**: Limits API calls by waiting for user input stabilization.
- **Customizable Design**: Fully customizable items and dropdown rendering.
- **Contextual Callbacks**: Provides both the selected item and the current list of options for further actions.

---

## Installation

Install the required dependencies:

```bash
npm install @tanstack/react-query
npm install use-debounce
```

---

## Core Props and API

| Prop            | Type                                             | Description                                                                          |
| --------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------ |
| `asyncSearchFn` | `(searchTerm: string) => Promise<...>`           | A function to fetch options based on the search term.                                |
| `queryKey`      | `string`                                         | Unique key for caching queries.                                                      |
| `initialValue`  | `{ value: string; label: string }`               | Default selected value when the component is initialized.                            |
| `onSelect`      | `(value: string, items: SearchResponse) => void` | Callback triggered when an item is selected, providing the selected value and items. |
| `className`     | `string`                                         | Additional CSS classes for customization.                                            |
| `disabled`      | `boolean`                                        | Whether the dropdown is disabled.                                                    |

---

## How to Use the ComboSearchBox

### Basic Example

```tsx
import React from "react";
import { ComboSearchBox } from "@/components/extensions/ComboSearchBox";

export default function BasicUsage() {
  return (
    <ComboSearchBox
      queryKey="exampleQuery"
      asyncSearchFn={async (search) => {
        const response = await fetch(`/api/search?query=${search}`);
        const data = await response.json();
        return {
          options: data.map((item) => ({
            label: item.name,
            value: item.id,
          })),
          total: data.length,
        };
      }}
      onSelect={(value, items) => {
        console.log("Selected value:", value);
        console.log("Current options:", items);
      }}
    />
  );
}
```

### Using `initialValue`

The `initialValue` prop is ideal for preselecting a value when the component mounts. This prevents the dropdown from appearing empty before async options load.

```tsx
import React, { useEffect, useState } from "react";
import { ComboSearchBox } from "@/components/extensions/ComboSearchBox";

export default function WithInitialValue() {
  const [initialValue, setInitialValue] = useState({
    label: "John Doe",
    value: "123",
  });

  useEffect(() => {
    async function fetchInitialValue() {
      const response = await fetch("/api/user/123");
      const user = await response.json();
      setInitialValue({ label: user.name, value: user.id });
    }
    fetchInitialValue();
  }, []);

  return (
    <ComboSearchBox
      queryKey="userSearch"
      initialValue={initialValue}
      asyncSearchFn={async (search) => {
        const response = await fetch(`/api/users?q=${search}`);
        const data = await response.json();
        return {
          options: data.map((user) => ({
            label: user.name,
            value: user.id,
          })),
          total: data.length,
        };
      }}
      onSelect={(value, items) => {
        console.log("Selected:", value);
        console.log("Items:", items);
      }}
    />
  );
}
```

### Advanced Example with Contextual Callbacks

This example demonstrates accessing the full list of items in the `onSelect` callback to perform additional logic.

```tsx
<ComboSearchBox
  queryKey="advancedSearch"
  asyncSearchFn={async (search) => {
    const response = await fetch(`/api/products?search=${search}`);
    const products = await response.json();
    return {
      options: products.map((product) => ({
        label: product.name,
        value: product.id,
      })),
      total: products.length,
    };
  }}
  onSelect={(selectedValue, items) => {
    const selectedProduct = items.options.find(
      (option) => option.value === selectedValue
    );
    console.log("Selected Product:", selectedProduct);
  }}
/>
```

---

## Benefits of the ComboSearchBox

1. **Enhanced Usability**: Preselect values without delaying async data loading.
2. **Efficiency**: Minimize API calls with debounced queries and controlled fetch triggers.
3. **Flexibility**: Tailored to diverse use cases, including user searches, product selection, or dynamic filtering.
4. **Contextual Control**: Access the full list of fetched options for advanced interactions.

---

## Conclusion

The `ComboSearchBox` component provides a robust solution for implementing searchable dropdowns in React. With its support for asynchronous data fetching, initial values, and flexible callbacks, it simplifies complex workflows while ensuring a smooth user experience. Use it to create efficient and user-friendly interfaces in your applications.
