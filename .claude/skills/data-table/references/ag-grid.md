# AG Grid

Batteries-included, enterprise-grade data grid — pivoting, range selection,
Excel-style editing, built-in virtualization. Reach for it only when that
feature list is a genuine requirement and shipping fast matters more than
owning every pixel of the table (see `data-table/SKILL.md` — Choosing a
Library); its advanced features (server-side row model, tree data,
Excel export) sit behind a paid Enterprise tier — confirm the license
covers what the project actually needs before committing to it.

## Column Definitions and Grid

```tsx
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';

const columnDefs: ColDef<Call>[] = [
  { field: 'patientName', headerName: 'Patient', sortable: true, filter: true },
  { field: 'createdAt', headerName: 'Date', valueFormatter: (p) => formatDate(p.value) },
];

<AgGridReact<Call>
  rowData={data}              // passed in as a prop — the grid does not fetch
  columnDefs={columnDefs}
  getRowId={(p) => p.data.id} // real id, not the row index — see data-table/SKILL.md
  pagination
/>
```

## Client vs. Server Row Model

AG Grid defaults to the **client-side row model** (all data loaded up
front, sorted/filtered/paginated in the browser). For a dataset too large
to load entirely, switch to the **server-side row model** — a different
`rowModelType` with a `datasource` the grid calls with sort/filter/page
params, not a manual `useEffect` fetch triggered by grid events:

```tsx
<AgGridReact
  rowModelType="serverSide"
  serverSideDatasource={{
    getRows: (params) => CallService.getPage(params.request).then(({ rows, total }) =>
      params.success({ rowData: rows, rowCount: total })
    ),
  }}
/>
```

Pick one row model per grid — mixing manually-fetched data with
`rowModelType="serverSide"`'s own fetch cycle produces duplicate or
conflicting requests.

## Hard Rules

- Set `getRowId` to a real data id on every grid — never the AG Grid default row index.
- Confirm which features the project needs are actually in the Community (free) tier before designing around an Enterprise-only one.
- Pick client-side or server-side row model once per grid — don't fetch data manually into a grid configured for `serverSide`.
