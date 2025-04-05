import React from 'react';
import UserSwitcher from './UserSwitcher';

function Header({ users, currentUser, isLoadingUsers, onSwitchUser }) {
  return (
    <header className="bg-white p-4 shadow flex justify-between items-center sticky top-0 z-10">
      <h1 className="text-2xl font-bold text-gray-800">Todo App</h1>

      {/* User Selection and Info */}
      <div className="flex items-center space-x-4">
        <UserSwitcher
          users={users}
          currentUser={currentUser}
          isLoading={isLoadingUsers}
          onSwitchUser={onSwitchUser}
        />

        {/* Display Current User */}
        {currentUser && (
          <div className="flex items-center space-x-2 pl-2 border-l border-gray-300">
            <span className="font-medium text-gray-700 text-sm">Viewing as:</span>
            <span className="font-semibold text-blue-600 text-sm">{currentUser.username}</span>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;