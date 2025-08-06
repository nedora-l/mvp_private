// components/ChatGrid.tsx
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Message } from 'react-hook-form';

interface ChatGridProps {
  messages: Message[];
}

export default function ChatGrid({ messages }: ChatGridProps) {
  const columnDefs = [
    { field: 'timestamp', headerName: 'Time', width: 150 },
    { field: 'role', headerName: 'Role', width: 100 },
    { field: 'content', headerName: 'Content', flex: 1, wrapText: true },
    { field: 'tokens', headerName: 'Tokens', width: 100 },
  ];

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
      <AgGridReact
        rowData={messages}
        
        defaultColDef={{
          sortable: true,
          filter: true,
          resizable: true,
        }}
        pagination={true}
        paginationPageSize={10}
      />
    </div>
  );
}