// src/components/TodoDetailModal.jsx
import React, { useState, useEffect } from 'react';

function TodoDetailModal({ isOpen, onClose, todo }) {
  const [details, setDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && todo?.id) {
      setIsLoading(true); setError(null); setDetails(null);

      fetch(`/api/todos/${todo.id}`) // Backend now fetches notes too
        .then(async (res) => {
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(`Failed to fetch details: ${errorData.error || res.statusText}`);
          }
          return res.json();
        })
        .then(data => { setDetails(data); })
        .catch(err => { console.error("Error fetching todo details:", err); setError(err.message); })
        .finally(() => { setIsLoading(false); });
    }
  }, [isOpen, todo]);

  if (!isOpen || !todo) return null;

  const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      try { return new Date(dateString).toLocaleString(); }
      catch (e) { return dateString; }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 transition-opacity duration-300">
      <div className="bg-white rounded-lg shadow-xl w-11/12 md:w-2/3 lg:w-1/2 p-6 m-4 transform transition-all duration-300 scale-100 opacity-100 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
           <h2 className="text-xl font-bold text-gray-800">Todo Details</h2>
           <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">×</button>
        </div>

        {isLoading && <p className="text-center text-gray-600 py-4">Loading details...</p>}
        {error && <p className="text-center text-red-500 py-4">Error: {error}</p>}

        {details && !isLoading && !error && (
          <div className="space-y-4">
            {/* Basic Info */}
            <div>
              <h3 className="text-lg font-semibold">{details.title}</h3>
              {details.description && <p className="text-gray-700 mt-1 whitespace-pre-wrap">{details.description}</p>} {/* Added whitespace-pre-wrap */}
            </div>
            <hr/>
            {/* Status Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm"> {/* Adjusted gap */}
                <p><span className="font-medium text-gray-600">Status:</span> {details.completed ? 'Completed' : 'Pending'}</p>
                <p><span className="font-medium text-gray-600">Priority:</span> <span className={`capitalize px-1.5 py-0.5 rounded text-xs font-medium ${ details.priority === 'high' ? 'bg-red-100 text-red-700' : details.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{details.priority}</span></p>
                <p><span className="font-medium text-gray-600">Created:</span> {formatDate(details.created_at)}</p>
                <p><span className="font-medium text-gray-600">Last Updated:</span> {formatDate(details.updated_at)}</p>
            </div>
             {/* Notes (Display Fetched Notes) */}
             <div className="pt-2"> {/* Added padding top */}
                 <h4 className="font-medium text-gray-600 mb-2">Notes:</h4>
                  {details.notes?.length > 0 ? (
                     <ul className="space-y-3 max-h-48 overflow-y-auto border border-gray-200 rounded p-3 bg-gray-50"> {/* Added scroll for notes */}
                         {details.notes.map(note => (
                             <li key={note.id} className="text-sm border-b border-gray-200 pb-2 last:border-b-0">
                                <p className="text-gray-800 whitespace-pre-wrap mb-1">{note.content}</p>
                                <p className="text-xs text-gray-500 text-right">{formatDate(note.created_at)}</p>
                             </li>
                         ))}
                     </ul>
                 ) : (
                     <p className="text-gray-500 italic text-sm px-3 py-2 border border-gray-200 rounded bg-gray-50">No notes added yet.</p>
                 )}
             </div>
             {/* --- End Display Related Data --- */}
          </div>
        )}

         {/* Close Button */}
         <div className="flex justify-end mt-6 pt-4 border-t border-gray-200"> {/* Added padding/border */}
            <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                Close
            </button>
         </div>
      </div>
    </div>
  );
}

export default TodoDetailModal;