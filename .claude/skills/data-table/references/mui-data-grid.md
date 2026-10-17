# MUI DataGrid (X)

MUI's table component — the shortest path when a project already builds
its UI on MUI, since the grid matches the rest of the app's look with no
extra theming work (see `data-table/SKILL.md` — Choosing a Library). Its
server-side data source, tree data, and infinite loading are gated behind
the paid Pro/Premium tier — the free Community edition covers client-side
sorting/filtering/pagination only.

## Columns and Grid

```tsx
import { DataGrid, type GridColDef } from '@mui/x-data-grid';

const columns: GridColDef<Call>[] = [
  { field: 'patientName', headerName: 'Patient', flex: 1 },
  { field: 'createdAt', headerName: 'Date', valueFormatter: (value) => formatDate(value) },
];

<DataGrid<Call>
  rows={data}       // passed in as a prop — the grid does not fetch
  columns={columns}
  getRowId={(row) => row.id} // real id, not the row index — see data-table/SKILL.md
  pagination
/>
```

## Server-Side Data (Pro Tier)

```tsx
<DataGrid
  rows={rows}
  columns={columns}
  paginationMode="server"
  sortingMode="server"
  rowCount={totalCount}
  onPaginationModelChange={(model) => setQueryParams(model)}
  onSortModelChange={(model) => setQueryParams({ sort: model })}
/>
```

`paginationMode="server"`/`sortingMode="server"` hand control to the parent
— the grid no longer sorts/paginates the `rows` you pass, it trusts they're
already the correct page/order and asks you (via the `onXChange` callbacks)
to refetch when the user changes page/sort.

## Hard Rules

- Set `getRowId` on every grid — never rely on an assumed `id` field or the row index.
- Verify a needed feature (server-side data, tree data) is in the tier the project has a license for before designing around it.
- With `paginationMode="server"`, the `rows` prop is always exactly the current page — never the full dataset with client-side slicing layered on top.
