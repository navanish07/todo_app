import React from 'react';

function UserSwitcher({ users, currentUser, isLoading, onSwitchUser }) {
  if (isLoading) {
    return <span className="text-gray-500 text-sm">Loading users...</span>;
  }

  if (users.length === 0) {
    return <span className="text-red-500 text-sm">No users found!</span>;
  }

  return (
    <div className="relative group">
      <button className="flex items-center space-x-2 px-3 py-1.5 bg-gray-200 border border-gray-300 rounded hover:bg-gray-300 text-sm font-medium">
        <span>{currentUser ? currentUser.username : 'Select User'}</span>
        <i className="fas fa-chevron-down text-xs"></i>
      </button>
      <div className="absolute top-full right-0 min-w-[150px] bg-white border rounded shadow-lg mt-1 hidden group-hover:block z-20">
        {users.map(user => (
          <div
            key={user.id}
            className={`px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm ${currentUser?.id === user.id ? 'font-semibold bg-gray-100' : ''}`}
            onClick={() => onSwitchUser(user.id)} // Switch by ID
          >
            {user.username} {/* Display username from DB */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserSwitcher;