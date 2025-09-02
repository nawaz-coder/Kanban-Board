import React, { useState, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import Board from './components/Board';

// Default initial data
const initialData = {
  tasks: {
    'task-1': { id: 'task-1', title: 'Set up project', description: 'Create Vite + React app' },
    'task-2': { id: 'task-2', title: 'Create Board UI', description: '' },
    'task-3': { id: 'task-3', title: 'Add DnD', description: '' }
  },
  columns: {
    todo: { id: 'todo', title: 'To Do', taskIds: ['task-1', 'task-2'] },
    inprogress: { id: 'inprogress', title: 'In Progress', taskIds: ['task-3'] },
    done: { id: 'done', title: 'Done', taskIds: [] }
  },
  columnOrder: ['todo', 'inprogress', 'done']
};

export default function App() {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('kanban-data');
    return saved ? JSON.parse(saved) : initialData;
  });

  useEffect(() => {
    localStorage.setItem('kanban-data', JSON.stringify(data));
  }, [data]);

  function onDragEnd(result) {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    // Reorder within same column
    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = { ...start, taskIds: newTaskIds };
      const newData = {
        ...data,
        columns: { ...data.columns, [newColumn.id]: newColumn }
      };
      setData(newData);
      return;
    }

    // Move from one column to another
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = { ...start, taskIds: startTaskIds };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = { ...finish, taskIds: finishTaskIds };

    const newData = {
      ...data,
      columns: { ...data.columns, [newStart.id]: newStart, [newFinish.id]: newFinish }
    };
    setData(newData);
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Board data={data} setData={setData} />
    </DragDropContext>
  );
}
