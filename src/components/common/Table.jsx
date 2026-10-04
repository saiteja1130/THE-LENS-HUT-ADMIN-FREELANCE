function Table({
  columns,
  data,
  keyExtractor,
  onRowClick,
  isLoading = false
}) {
  return <div className="w-full overflow-x-auto">
      <table className="w-full text-left text-sm text-slate-600">
        <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
          <tr>
            {columns.map((col, idx) => <th
    key={idx}
    scope="col"
    className={`py-3.5 px-4 whitespace-nowrap ${col.headerClassName || ""}`}
  >
                {col.header}
              </th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {isLoading ? <tr>
              <td colSpan={columns.length} className="py-12 text-center text-slate-400">
                Loading data...
              </td>
            </tr> : data.length === 0 ? <tr>
              <td colSpan={columns.length} className="py-8 text-center text-slate-400">
                No items to display
              </td>
            </tr> : data.map((item) => <tr
    key={keyExtractor(item)}
    onClick={() => onRowClick && onRowClick(item)}
    className={`hover:bg-slate-50/70 transition-colors ${onRowClick ? "cursor-pointer" : ""}`}
  >
                {columns.map((col, idx) => <td key={idx} className={`py-3.5 px-4 align-middle ${col.className || ""}`}>
                    {col.render ? col.render(item) : col.accessor ? String(item[col.accessor] ?? "") : null}
                  </td>)}
              </tr>)}
        </tbody>
      </table>
    </div>;
}
export {
  Table
};
