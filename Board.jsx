import React from 'react';
import Column from './Column';

export default function Board({ data, setData }) {
  return (
    <div className="board">
      {data.columnOrder.map((colId) => {
        const column = data.columns[colId];
        const tasks = column.taskIds.map((tid) => data.tasks[tid]);
        return (
          <Column
            key={column.id}
            column={column}
            tasks={tasks}
            data={data}
            setData={setData}
          />
        );
      })}
    </div>
  );
}
