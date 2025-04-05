import React from 'react';
import TodoItem from './TodoItem'; // We'll create this next

function TodoList({
  todos,
  isLoading,
  currentUser,
  onToggleComplete,
  onEdit,
  onDelete,
  onAddNote,
  onViewDetails
}) {

  if (isLoading) {
    return <div className="p-10 text-center text-gray-500">Loading todos...</div>;
  }

  if (!currentUser) {
      return <div className="p-10 text-center text-gray-500">Please select a user to view their todos.</div>;
  }

  if (todos.length === 0) {
    return <div className="p-10 text-center text-gray-600">No todos found for {currentUser.username}. Add one!</div>;
  }

  return (
    <div className="bg-white rounded shadow overflow-hidden">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddNote={onAddNote}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}

export default TodoList;