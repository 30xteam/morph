---
name: data-table
description: >
  Use when building or reviewing a data table/grid — columns, sorting,
  filtering, pagination, or row selection. Trigger on tasks like "add a
  table", "add sorting to this column", "paginate this list", "add row
  selection to the grid", or "which table library should I use".
  Library-agnostic — loads a `references/<library>.md` for the concrete
  library the project uses (TanStack Table, AG Grid, MUI DataGrid). Do NOT
  trigger for fetching the data the table displays — see `data-fetching`.
  Do NOT trigger for a plain, non-interactive `<table>` with no sorting/
  filtering/pagination — that's just a component, see `react-patterns`.
metadata:
  version: 1.0
  collection: noxen
---

# Noxen — Data Table

Part of the **Noxen** skill set. This skill covers interactive-table
patterns independent of which library a project uses — load the matching
`references/*.md` for the concrete library actually installed. A table with
no sorting, filtering, or pagination is just markup — don't reach for a
table library for that, see `react-patterns` instead.

## Load the Right Reference

| Concern | Reference |
|---|---|
| Project uses TanStack Table | `references/tanstack-table.md` |
| Project uses AG Grid | `references/ag-grid.md` |
| Project uses MUI DataGrid | `references/mui-data-grid.md` |
| Starting a new project, no library chosen yet | Read `## Choosing a Library` below |

## Choosing a Library (New Projects)

Default to **TanStack Table**: headless (zero bundled UI, so it never
fights your design system), MIT-licensed with no paid tier, and by far the
smallest of the three. The cost is that you build every cell, header, and
pagination control yourself — budget for that.

Reach for **AG Grid** when the requirement list is genuinely enterprise-grade
(pivoting, Excel-style range selection/editing, huge datasets with built-in
virtualization) and shipping fast matters more than owning every pixel —
know going in that its most advanced features sit behind a paid tier.

Reach for **MUI DataGrid** only if the project is already built on MUI —
it's the shortest path in that specific case, but locks the table's look
to MUI's design language, and (like AG Grid) gates server-side data, tree
data, and infinite loading behind a paid tier.

## Patterns That Hold Regardless of Library

**The table displays data; it does not fetch it.** Pass already-fetched
data in as a prop from a `data-fetching` hook — a table component reaching
into `useQuery` itself couples a presentational concern to a data-fetching
one and makes the table impossible to reuse with a different data source.

**Sorting/filtering state is either server-driven or table-driven — pick
one per table.** For a large dataset, sort/filter params belong in the
query key so the *server* returns the right page; for a small in-memory
list, let the table library sort/filter client-side. Mixing both for the
same column is a bug waiting to happen (double-sorting, or sorting an
already-paginated slice).

**Row identity needs a stable key.** Use a real unique id from the data,
never the array index — an index-keyed row misattributes state (selection,
expanded rows) when the underlying list is sorted, filtered, or paginated.

## Hard Rules

- A table component receives data as a prop — it never calls a data-fetching hook itself.
- Row keys come from a stable unique id in the data, never the array index.
- Sorting/filtering is either fully server-driven or fully client-driven per table — never both for the same column.
