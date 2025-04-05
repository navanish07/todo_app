import React from 'react';

function TodoModal({ isOpen, onClose, editingTodo, formData, onFormChange, onSubmit }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 transition-opacity duration-300">
      <div className="bg-white rounded-lg shadow-xl w-11/12 md:w-1/2 lg:w-1/3 p-6 m-4 transform transition-all duration-300 scale-100 opacity-100">
        <h2 className="text-xl font-bold mb-5 text-gray-800">{editingTodo ? 'Edit Todo' : 'Add New Todo'}</h2>
        <form onSubmit={onSubmit}>
          {/* Title Input */}
          <div className="mb-4">
            <label htmlFor="title" className="block mb-1 font-medium text-gray-700">Title <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={onFormChange}
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              placeholder="e.g., Buy groceries"
            />
          </div>
          {/* Description Textarea */}
          <div className="mb-4">
            <label htmlFor="description" className="block mb-1 font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={onFormChange}
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
              placeholder="Optional: Add more details..."
            ></textarea>
          </div>
          {/* Priority Select */}
          <div className="mb-4">
            <label htmlFor="priority" className="block mb-1 font-medium text-gray-700">Priority</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={onFormChange}
              className="w-full border border-gray-300 px-3 py-2 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          {/* Completed Checkbox (Only show when editing) */}
          {editingTodo && (
            <div className="mb-6">
              <label htmlFor="completed" className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="completed"
                  name="completed"
                  checked={formData.completed}
                  onChange={onFormChange}
                  className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">Mark as Completed</span>
              </label>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {editingTodo ? 'Update Todo' : 'Add Todo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TodoModal;