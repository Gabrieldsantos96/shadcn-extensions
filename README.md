# **TanStack Table Integration with State Management and Client-Side Data Fetching**

## **Overview**

This implementation leverages **TanStack Table**, **React Query**, and custom hooks to create a fully customizable, client-driven data table. The solution separates state management, table configuration, and data fetching into distinct layers, ensuring scalability and maintainability.

---

## **Features**

- **Centralized State Management**: Control sorting, pagination, filtering, and row selection using `useTableState`.
- **Client-Side Integration**: Seamlessly fetch, paginate, and filter data with `useExampleFetchData`.
- **Reusable Table Logic**: Configure and render the table using `useTanStackTable`.
- **Customizable Components**: Export the `table` instance for advanced customization and direct API access.
- **Predefined Components**: Includes a `RootTable` and pagination components for quick integration.

---

## **Components and Hooks**

### **1. `useTableState`**

A custom hook to manage table states using `useReducer`. This handles sorting, pagination, filtering, and row selection with dispatchable actions.

#### **API**

- **Input**: `initialState` (optional) - Partial state for initialization.
- **Output**:
  - Current states:
    - `sorting`: Array of sorting configurations.
    - `pagination`: Object with `pageIndex` and `pageSize`.
    - `columnFilters`: Array of active column filters.
    - `rowSelection`: Object representing selected rows.
  - Dispatch functions:
    - `setSorting`
    - `setPagination`
    - `setColumnFilters`
    - `setRowSelection`

#### **Example Usage**

```tsx
const {
  sorting,
  setSorting,
  pagination,
  setPagination,
  columnFilters,
  setColumnFilters,
  rowSelection,
  setRowSelection,
} = useTableState({
  pagination: { pageIndex: 0, pageSize: 10 },
  columnFilters: [],
});
```

---

### **2. `useTanStackTable`**

A custom hook that integrates TanStack Table's core logic with the state management from `useTableState` and client-side data from `useExampleFetchData`.

#### **Props**

- **`columns`**: Array of column definitions.
- **`paginatedTableData`**: Client-side response containing:
  - `data`: Array of rows.
  - `total_filtered`: Total rows after filtering.
  - `limit`: Page size.
- **State and Dispatch**:
  - `sorting`, `setSorting`
  - `pagination`, `setPagination`
  - `columnFilters`, `setColumnFilters`
  - `rowSelection`, `setRowSelection`
- **Optional**:
  - `columnVisibility`: Object to dynamically control column visibility.

#### **Example Usage**

```tsx
const { RootTable, table } = useTanStackTable({
  columns,
  paginatedTableData: data,
  sorting,
  setSorting,
  pagination,
  setPagination,
  columnFilters,
  setColumnFilters,
  rowSelection,
  setRowSelection,
});
```

#### **Output**

- **`table`**: TanStack Table instance for direct API access and advanced customizations.
- **`RootTable`**: Preconfigured table component that accepts the following props:
  - `isLoading`: Boolean indicating loading state.
  - `isError`: Boolean indicating error state.
  - `refetch`: Function to refetch data.
  - `cols`: Column definitions.

**Why Export `table`?**
Exporting the `table` instance allows developers to:

- Directly access TanStack Table APIs.
- Create highly customizable components by extending the table logic.
- Integrate the table into various layouts or UI libraries seamlessly.

---

### **3. `useExampleFetchData`**

A React Query-based hook for fetching client-side data with sorting, filtering, and pagination.

#### **Props**

- **`columnFilters`**: Array of active filters.
- **`pagination`**: Object with `pageIndex` and `pageSize`.
- **`sorting`**: Array of sorting configurations.

#### **Example Usage**

```tsx
const { isLoading, data, isError, refetch } = useExampleFetchData({
  columnFilters,
  pagination,
  sorting,
});
```

#### **Output**

- **`isLoading`**: Indicates if data is loading.
- **`data`**: Fetched data from the client.
- **`isError`**: Indicates if an error occurred.
- **`refetch`**: Function to refetch data.

---

## **Complete Example**

```tsx
import React from "react";
import { Card } from "@/components/ui/card";
import TablePagination from "@/components/extensions/TanStackTable/TablePagination";
import useTanStackTable from "@/components/extensions/TanStackTable/useTanStackTable";
import { useTableState } from "@/components/extensions/TanStackTable/useTableState";
import { useExampleFetchData } from "@/components/extensions/TanStackTable/useExampleFetchData";

export default function ExampleTable() {
  const columns = [
    { header: "Name", accessorKey: "name" },
    { header: "Status", accessorKey: "status" },
    { header: "Type", accessorKey: "type" },
  ];

  const {
    sorting,
    setSorting,
    pagination,
    setPagination,
    columnFilters,
    setColumnFilters,
    rowSelection,
    setRowSelection,
  } = useTableState({
    pagination: { pageIndex: 0, pageSize: 10 },
    columnFilters: [],
  });

  const { isLoading, data, isError, refetch } = useExampleFetchData({
    columnFilters,
    pagination,
    sorting,
  });

  const { RootTable, table } = useTanStackTable({
    columns,
    paginatedTableData: data,
    sorting,
    setSorting,
    pagination,
    setPagination,
    columnFilters,
    setColumnFilters,
    rowSelection,
    setRowSelection,
  });

  return (
    <Card>
      <RootTable
        isLoading={isLoading}
        isError={isError}
        refetch={refetch}
        cols={columns}
      />
      {!!table.getRowModel().rows.length && <TablePagination table={table} />}
    </Card>
  );
}
```

---

## **Benefits**

1. **Centralized State**: Easily manage all table-related states.
2. **Customizable Table Instance**: Direct access to the `table` instance enables advanced customizations and API usage.
3. **Client-Side Fetching**: Fetch and manipulate data directly from the client, supporting real-time updates.
4. **Reusable Hooks**: Hooks are designed to be reused across different table setups.
5. **Flexible Components**: Tailor columns, states, and hooks to fit your specific needs.

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

# DialogManager: Trigger Dialogs Programmatically with Async Results

## Overview

The `DialogManager` provides a powerful and flexible way to display modal dialogs programmatically and retrieve their results asynchronously. This is particularly useful for confirmation dialogs, alerts, or notifications where the outcome directly affects application logic.

Key features include:

- **Event-Driven Architecture**: Uses a custom event manager to trigger dialogs from anywhere in the application.
- **Async Results**: Returns a `Promise` that resolves with the user's response.
- **Dynamic Dialogs**: Supports multiple dialog types (e.g., info, warning, error, success) with customizable content.
- **Reusable Components**: Encapsulates dialog rendering in a listener component for ease of integration.

---

## Features

1. **Programmatic Dialogs**:
   - Call dialogs using `showDialog` and handle user responses asynchronously.
2. **Dynamic Configuration**:
   - Configure dialog type, message, and actions dynamically.
3. **Multiple Dialog Management**:
   - Handle multiple simultaneous dialogs with unique IDs.
4. **Flexibility**:
   - Customize buttons, icons, and dialog behavior based on context.

---

## Installation

Install any required dependencies (if not already installed):

```bash
npm install react
npm install uuid
```

---

## How It Works

### Core Components

#### 1. `DialogListener`

This component listens for dialog events and renders active dialogs dynamically.

```tsx
function DialogListener() {
  const { handleRemoveDialog, messages } = useDialog({
    dialogEventManager,
  });

  return (
    <div>
      {messages.map((message) => (
        <DialogMessage
          key={message.id}
          message={message}
          showConfirmButton={message.showConfirmButton!}
          action={message.action!}
          onClose={() => handleRemoveDialog(message.id)}
          isOpen={messages.map((s) => s.id).includes(message.id) || false}
        />
      ))}
    </div>
  );
}
```

#### 2. `DialogMessage`

Responsible for rendering individual dialogs and handling user actions.

```tsx
export const DialogMessage = ({
  message,
  isOpen,
  action,
  showConfirmButton,
  onClose,
}: DialogMessageProps) => {
  function handleConfirm() {
    action(true);
    onClose();
  }

  function handleClose() {
    action(false);
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-2">
            {message.type === "error" && (
              <AlertCircle className="size-8 text-red-500" />
            )}
            {message.type === "warning" && (
              <AlertTriangle className="size-8 text-yellow-500" />
            )}
            {message.type === "info" && (
              <InfoIcon className="size-8 text-blue-500" />
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>{message.message}</p>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
          {!!showConfirmButton && (
            <Button onClick={handleConfirm}>Confirm</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
```

#### 3. `showDialog`

A function to trigger dialogs programmatically and handle their results via a `Promise`.

```tsx
export function showDialog(props: IDialogEventProps): Promise<boolean> {
  return new Promise((resolve) => {
    dialogEventManager.emit("callDialogPopup", {
      ...props,
      id: crypto.randomUUID(),
      action: (response: boolean) => {
        resolve(response);
      },
    });
  });
}
```

---

## Usage

### Basic Example

```tsx
import { showDialog } from "./UseDialog";

async function handlePopup() {
  const res = await showDialog({
    type: "info",
    message: "Do you want to delete user X?",
    showConfirmButton: true,
  });

  if (res) {
    alert("User deleted");
  } else {
    alert("Action canceled");
  }
}
```

### Adding the Listener

Ensure `DialogListener` is included in the component tree to render dialogs:

```tsx
import { DialogListener } from "./DialogPopup/DialogListener";

function App() {
  return (
    <div>
      {/* Your application components */}
      <DialogListener />
    </div>
  );
}
```

### Customizing Dialogs

You can extend the `showDialog` function to add more customization options, such as additional buttons or dynamic content.

---

## API Reference

### `showDialog`

| Parameter           | Type                          | Description                                |
| ------------------- | ----------------------------- | ------------------------------------------ | --------- | ---------- | -------------------------------- |
| `type`              | `'info'                       | 'error'                                    | 'warning' | 'success'` | Type of dialog icon and styling. |
| `message`           | `string`                      | The message to display in the dialog.      |
| `showConfirmButton` | `boolean`                     | Whether to show a confirmation button.     |
| `action`            | `(response: boolean) => void` | Callback invoked with the user's response. |

---

## Benefits

1. **Asynchronous Handling**: Simplifies user interaction by allowing dialogs to return promises.
2. **Global Accessibility**: Trigger dialogs from anywhere in your application.
3. **Dynamic Content**: Supports highly customizable dialogs based on context.
4. **Reusability**: Encapsulates logic and rendering for easy reuse across multiple projects.

---

## Conclusion

The `DialogManager` offers a robust and flexible way to manage dialogs programmatically. By leveraging event-driven architecture and promises, it provides a clean and scalable solution for handling user interactions that require confirmation or additional input.

# MaskedInput: A Flexible and Reusable Input Component with Masking

## Overview

The `MaskedInput` component provides a reusable solution for input fields with dynamic masking functionality. It supports both string-based and function-based masks, making it highly adaptable for various use cases such as phone numbers, dates, or custom formats.

Key features include:

- **Dynamic Masking**: Supports both static string masks and custom function-based masks.
- **Controlled and Uncontrolled Usage**: Handles initial values and updates seamlessly.
- **Callback Support**: Triggers a callback with the raw value stripped of formatting.
- **Reusable Design**: Encapsulated logic for easy integration and reusability across different projects.

---

## Features

1. **Flexible Masking**:
   - Apply masks as strings or custom functions.
   - Dynamically updates the mask as the user types.
2. **Raw Value Handling**:
   - Extracts and provides the raw, unformatted value through a callback (`onCallback`).
3. **Initial Value Support**:
   - Automatically formats and sets the initial value.
4. **Customizable Styling**:
   - Accepts additional class names for seamless styling.

---

## Installation

Install the required dependencies:

```bash
npm install react
```

---

## Props

| Prop           | Type                      | Description                                                             |
| -------------- | ------------------------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `mask`         | `string                   | (value: string) => string`                                              | The mask to apply. Supports static string or dynamic function-based masks. |
| `initialValue` | `string`                  | The initial value for the input field.                                  |
| `onCallback`   | `(value: string) => void` | Callback triggered with the raw, unformatted value whenever it changes. |
| `className`    | `string`                  | Additional CSS classes for styling the input field.                     |

---

## Usage Examples

### Basic Usage with String Mask

```tsx
import React from "react";
import { MaskedInput } from "@/components/ui/masked-input";

export default function BasicExample() {
  return (
    <MaskedInput
      mask="(###) ###-####"
      onCallback={(value) => console.log("Raw value:", value)}
    />
  );
}
```

### Using a Function-Based Mask

```tsx
import React from "react";
import { MaskedInput } from "@/components/ui/masked-input";

function customMask(value: string): string {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
}

export default function FunctionMaskExample() {
  return (
    <MaskedInput
      mask={customMask}
      onCallback={(value) => console.log("Raw value:", value)}
    />
  );
}
```

### Initial Value Example

```tsx
import React from "react";
import { MaskedInput } from "@/components/ui/masked-input";

export default function InitialValueExample() {
  return (
    <MaskedInput
      mask="#### #### #### ####"
      initialValue="1234567812345678"
      onCallback={(value) => console.log("Raw value:", value)}
    />
  );
}
```

### Styling with `className`

```tsx
import React from "react";
import { MaskedInput } from "@/components/ui/masked-input";

export default function StyledExample() {
  return (
    <MaskedInput
      mask="##/##/####"
      className="border border-gray-300 p-2 rounded-md"
      onCallback={(value) => console.log("Raw value:", value)}
    />
  );
}
```

---

## How It Works

1. **Mask Application**:

   - If `mask` is a string, the `applyMask` utility formats the input value.
   - If `mask` is a function, it is called with the current value to determine the formatted output.

2. **State Management**:

   - The `value` state holds the formatted value.
   - The `useEffect` hook ensures the initial value is formatted on mount.

3. **Callback Execution**:
   - When the value changes or the input loses focus, the raw value (digits only) is passed to the `onCallback` function.

---

## API Reference

### `applyMask`

Utility function that applies a string-based mask to a given value.

```ts
function applyMask(value: string, mask: string): string;
```

- **`value`**: The input value to format.
- **`mask`**: The mask string (e.g., `###-###-####`).

---

## Benefits

1. **Ease of Use**:
   - Simple integration with flexible masking options.
2. **Customizability**:
   - Supports both standard and custom mask functions.
3. **Performance**:
   - Efficient state updates and controlled rendering.
4. **Reusability**:
   - Designed as a standalone component for diverse input scenarios.

---

## Conclusion

The `MaskedInput` component simplifies the implementation of masked input fields in React. Its support for dynamic and custom masks, combined with features like initial value formatting and raw value callbacks, makes it a versatile tool for handling formatted inputs. Integrate it into your projects to enhance user input experience and maintain consistent data formatting.
