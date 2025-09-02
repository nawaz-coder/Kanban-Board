import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';

export default function TaskCard({ task, index, updateTask, deleteTask, columnId }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [desc, setDesc] = useState(task.description || '');

  function save() {
    const t = title.trim();
    updateTask({ ...task, title: t || 'Untitled', description: desc });
    setEditing(false);
  }

  function handleDelete() {
    if (confirm('Delete this task?')) deleteTask(task.id);
  }

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          className={`task-card ${snapshot.isDragging ? 'dragging' : ''}`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {editing ? (
            <div>
              <input
                className="input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
              <textarea
                className="textarea"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={3}
                placeholder="Description (optional)"
              />
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn" onClick={save} type="button">Save</button>
                <button className="btn ghost" onClick={() => setEditing(false)} type="button">Cancel</button>
              </div>
            </div>
          ) : (
            <div>
              <div className="task-title">{task.title}</div>
              {task.description && <div className="task-desc">{task.description}</div>}
              <div className="task-actions">
                <button className="btn small" onClick={() => setEditing(true)}>Edit</button>
                <button className="btn small danger" onClick={handleDelete}>Delete</button>
              </div>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}
