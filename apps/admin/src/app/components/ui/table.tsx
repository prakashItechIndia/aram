import { ReactNode } from 'react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  width?: string;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
}

export function Table<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  emptyMessage = 'No data available',
  onRowClick,
}: TableProps<T>) {
  if (loading) {
    return (
      <div className="border border-[#DBDBDB] rounded-[16px] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F3F3F3] h-[48px]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left px-[16px] py-[12px] text-[14px] leading-[20px] font-semibold text-[#3D3D3D]"
                  style={{ width: col.width }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} className="h-[52px] border-t border-[#DBDBDB]">
                {columns.map((col) => (
                  <td key={col.key} className="px-[16px] py-[12px]">
                    <div className="h-4 bg-[#F3F3F3] rounded animate-pulse" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  
  if (data.length === 0) {
    return (
      <div className="border border-[#DBDBDB] rounded-[16px] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F3F3F3] h-[48px]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left px-[16px] py-[12px] text-[14px] leading-[20px] font-semibold text-[#3D3D3D]"
                  style={{ width: col.width }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
        </table>
        <div className="text-center py-[48px] text-[#6E6E6E]">
          <p className="text-[16px] leading-[24px]">{emptyMessage}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="border border-[#DBDBDB] rounded-[16px] overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-[#F3F3F3] h-[48px]">
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-left px-[16px] py-[12px] text-[14px] leading-[20px] font-semibold text-[#3D3D3D]"
                style={{ width: col.width }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              className={`h-[52px] border-t border-[#DBDBDB] ${
                onRowClick ? 'cursor-pointer hover:bg-[#FEF7F6]' : ''
              }`}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="px-[16px] py-[12px] text-[14px] leading-[20px] text-[#3D3D3D]"
                >
                  {col.render ? col.render(item) : item[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
