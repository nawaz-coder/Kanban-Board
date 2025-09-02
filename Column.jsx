import React, { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';


function makeId() {
  return 'task-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export default function Column({ column, tasks, data, setData }) {
  const [newTitle, setNewTitle] = useState('');

  function handleAddTask(e) {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return;
    const id = makeId();
    const newTask = { id, title, description: '' };
    const newTasks = { ...data.tasks, [id]: newTask };
    const newColumn = { ...column, taskIds: [...column.taskIds, id] };
    const newColumns = { ...data.columns, [column.id]: newColumn };
    setData({ ...data, tasks: newTasks, columns: newColumns });
    setNewTitle('');
  }

  // Helper passed to TaskCard for delete and edit
  function updateTask(updatedTask) {
    setData({ ...data, tasks: { ...data.tasks, [updatedTask.id]: updatedTask } });
  }
  function deleteTask(taskId) {
    const newTasks = { ...data.tasks };
    delete newTasks[taskId];
    const newColumns = { ...data.columns };
    // Remove taskId from the column
    for (const colId of Object.keys(newColumns)) {
      newColumns[colId] = {
        ...newColumns[colId],
        taskIds: newColumns[colId].taskIds.filter((tid) => tid !== taskId)
      };
    }
    setData({ ...data, tasks: newTasks, columns: newColumns });
  }

  return (
    <div className="column">
      <h3 className="column-title">{column.title}</h3>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`task-list ${snapshot.isDraggingOver ? 'drag-over' : ''}`}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                updateTask={updateTask}
                deleteTask={deleteTask}
                columnId={column.id}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <form className="add-task-form" onSubmit={handleAddTask}>
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Add a task..."
          className="input"
        />
        <button type="submit" className="btn small">Add</button>
      </form>
    </div>
  );
}
