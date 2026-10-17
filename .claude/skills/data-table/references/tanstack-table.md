# TanStack Table

Headless table engine — it manages column/sort/filter/pagination state and
gives you back a model to render however you want; it renders zero DOM
itself. Default choice for new projects (see `data-table/SKILL.md` —
Choosing a Library). Row virtualization is a separate library (TanStack
Virtual) — add it only once row count actually causes jank, not upfront.

## Columns and Table Instance

```tsx
import { createColumnHelper, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';

const col = createColumnHelper<Call>();
const columns = [
  col.accessor('patientName', { header: 'Patient' }),
  col.accessor('createdAt', {
    header: 'Date',
    cell: (info) => formatDate(info.getValue()),
  }),
];

const table = useReactTable({
  data,       // passed in as a prop — this hook does not fetch
  columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(), // opt in per feature you need
});
```

Each row model (`getCoreRowModel`, `getSortedRowModel`,
`getPaginationRowModel`, `getFilteredRowModel`) is opt-in — only include
the ones the table actually uses, they compose additively.

## Rendering (You Own the DOM)

```tsx
<table className="border-separate border-spacing-y-1">
  <thead>
    {table.getHeaderGroups().map((hg) => (
      <tr key={hg.id}>
        {hg.headers.map((h) => (
          <th key={h.id} onClick={h.column.getToggleSortingHandler()}>
            {flexRender(h.column.columnDef.header, h.getContext())}
          </th>
        ))}
      </tr>
    ))}
  </thead>
  <tbody>
    {table.getRowModel().rows.map((row) => (
      <tr key={row.id}>
        {row.getVisibleCells().map((cell) => (
          <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
        ))}
      </tr>
    ))}
  </tbody>
</table>
```

`row.id` defaults to the row index — pass `getRowId: (row) => row.id` to
`useReactTable` so it uses the data's real id instead (see the shared
row-identity rule in `data-table/SKILL.md`).

## Server-Side Pagination/Sorting

```ts
useReactTable({
  data, columns,
  manualPagination: true,
  manualSorting: true,
  rowCount: totalCount, // from the server response
  getCoreRowModel: getCoreRowModel(),
});
```

`manualPagination`/`manualSorting` tell the table "don't slice/sort this
data yourself, the server already did" — pair with server-driven query
params, never both client and server sorting at once.

## Hard Rules

- Always set `getRowId` to a real data id — never rely on the index-based default.
- Only include the row models the table actually uses (sorted/filtered/paginated) — don't import all of them by default.
- `manualPagination`/`manualSorting` and client-side row models are mutually exclusive per table.
