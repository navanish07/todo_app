import React, { useState } from 'react';

function NoteModal({ isOpen, onClose, todo }) {
  const [noteContent, setNoteContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !todo) return null;

  const handleNoteSubmit = async (e) => {
    e.preventDefault();
    if (!noteContent.trim()) {
      setError("Note content cannot be empty.");
      return;
    }
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/todos/${todo.id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: noteContent }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(`Failed to add note: ${errorData.error || res.statusText}`);
      }

      // Success!
      setNoteContent(''); // Clear content
      onClose();

    } catch (err) {
      console.error("Error adding note:", err);
      setError(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
      setNoteContent(''); // Clear content on close
      setError(null);
      onClose();
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 transition-opacity duration-300">
      <div className="bg-white rounded-lg shadow-xl w-11/12 md:w-1/2 lg:w-1/3 p-6 m-4 transform transition-all duration-300 scale-100 opacity-100">
        <h2 className="text-xl font-bold mb-2 text-gray-800">Add Note</h2>
        <p className="text-sm text-gray-600 mb-4">For Todo: <span className="font-medium">{todo.title}</span></p>

        <form onSubmit={handleNoteSubmit}>
          {/* Note Content Textarea */}
          <div className="mb-4">
            <label htmlFor="noteContent" className="block mb-1 font-medium text-gray-700">Note <span className="text-red-500">*</span></label>
            <textarea
              id="noteContent"
              name="noteContent"
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="4"
              required
              placeholder="Add your note here..."
            ></textarea>
          </div>

           {/* Error Display */}
           {error && (
                <p className="text-red-500 text-sm mb-3">{error}</p>
           )}


          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NoteModal;