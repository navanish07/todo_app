import React from 'react';

function TodoItem({ todo, onToggleComplete, onEdit, onDelete, onAddNote, onViewDetails }) {
  return (
    <div
      className={`flex items-center p-4 border-b border-gray-200 ${todo.completed ? 'bg-gray-100 opacity-70' : 'hover:bg-gray-50'} group`} // Added group for potential hover effects on container
    >
      {/* Checkbox */}
      <div className="mr-4 flex-shrink-0">
        <input
          type="checkbox"
          id={`todo-check-${todo.id}`}
          checked={todo.completed}
          onChange={() => onToggleComplete(todo)}
          className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
        />
      </div>

      {/* Todo Info (Clickable for Details) */}
      <div
          className="flex-1 min-w-0 cursor-pointer"
          onClick={() => onViewDetails(todo)} // Make this area clickable for details
          title="Click to view details"
      >
        <h3 className={`text-lg font-semibold ${todo.completed ? 'line-through' : ''}`}>
          {todo.title}
        </h3>
        {todo.description && (
          <p className={`text-sm text-gray-600 mt-1 truncate ${todo.completed ? 'line-through' : ''}`}>
            {todo.description}
          </p>
        )}
        <div className="flex items-center gap-2 text-sm mt-1">
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
            todo.priority === 'high'
              ? 'bg-red-100 text-red-700'
              : todo.priority === 'medium'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-green-100 text-green-700'
          }`}>
            Priority: {todo.priority}
          </span>
          {/* Placeholder for tags/users if added later */}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-1 sm:gap-2 flex-shrink-0 ml-4"> {/* Reduced gap on small screens */}
        <button
          className="p-1 text-gray-500 hover:text-blue-600" // Adjusted padding/color
          title="Add note"
          onClick={(e) => { e.stopPropagation(); onAddNote(todo); }} // Call handler passed from parent
        >
          <i className="fas fa-sticky-note fa-fw"></i> {/* Added fa-fw for fixed width */}
        </button>
        <button
          className="p-1 text-gray-500 hover:text-yellow-600"
          title="Edit todo"
          onClick={(e) => { e.stopPropagation(); onEdit(todo); }}
        >
          <i className="fas fa-edit fa-fw"></i>
        </button>
        <button
          className="p-1 text-gray-500 hover:text-red-600"
          title="Delete todo"
          onClick={(e) => { e.stopPropagation(); onDelete(todo.id); }}
        >
          <i className="fas fa-trash fa-fw"></i>
        </button>
      </div>
    </div>
  );
}

export default TodoItem;