'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';

import Header from '@/components/Header';
import TodoList from '@/components/TodoList';
import TodoModal from '@/components/TodoModal';
import NoteModal from '@/components/NoteModal';
import TodoDetailModal from '@/components/TodoDetailModal';
import FilterSortControls from '@/components/FilterSortControls';

export default function HomePage() {
  // --- State ---
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [todos, setTodos] = useState([]);

  // --- New Filter/Sort State ---
  const [filterPriority, setFilterPriority] = useState('all'); // 'all', 'high', 'medium', 'low'
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('DESC'); 


  // UI Control State
  const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [selectedTodoForNote, setSelectedTodoForNote] = useState(null);
  const [selectedTodoForDetail, setSelectedTodoForDetail] = useState(null);
  const [formData, setFormData] = useState({
    title: '', description: '', priority: 'medium', completed: false,
  });

  // Loading/Error State
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingTodos, setIsLoadingTodos] = useState(false);
  const [error, setError] = useState(null);

  // --- Data Fetching ---
  useEffect(() => {
    async function fetchUsers() {
      setIsLoadingUsers(true); setError(null);
      try {
        const res = await fetch('/api/users');
        if (!res.ok) throw new Error(`Failed to fetch users: ${res.statusText}`);
        const data = await res.json();
        setUsers(data); setCurrentUser(data[0] || null);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err.message); setUsers([]); setCurrentUser(null);
      } finally { setIsLoadingUsers(false); }
    }
    fetchUsers();
  }, []);

  const fetchTodosForCurrentUser = useCallback(async () => {
    if (!currentUser) { setTodos([]); return; }

    setIsLoadingTodos(true); setError(null);

    // Build query params string
    const params = new URLSearchParams({ userId: currentUser.id });
    if (filterPriority !== 'all') {
      params.append('filterPriority', filterPriority);
    }
    if (sortBy) {
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);
    }

    try {
      const apiUrl = `/api/todos?${params.toString()}`;
      console.log("Fetching todos from:", apiUrl); // Debugging
      const res = await fetch(apiUrl);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(`Failed to fetch todos: ${res.statusText} (${errorData.details || 'No details'})`);
      }
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      console.error(`Error fetching todos:`, err);
      setError(err.message); setTodos([]);
    } finally {
      setIsLoadingTodos(false);
    }
  }, [currentUser, filterPriority, sortBy, sortOrder]);

  useEffect(() => {
    fetchTodosForCurrentUser();
  }, [fetchTodosForCurrentUser]);

  const handleSwitchUser = (userId) => {
    const user = users.find(u => u.id === userId);
    if (user) setCurrentUser(user);
  };
  const openAddTodoModal = () => {
    if (!currentUser) { alert("Please select a user first."); return; }
    setEditingTodo(null);
    setFormData({ title: '', description: '', priority: 'medium', completed: false });
    setIsTodoModalOpen(true);
  };
  const openEditTodoModal = (todo) => {
    setEditingTodo(todo);
    setFormData({ title: todo.title, description: todo.description || '', priority: todo.priority, completed: todo.completed });
    setIsTodoModalOpen(true);
  };
  const closeTodoModal = () => setIsTodoModalOpen(false);
  const handleTodoFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };
  const handleTodoSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) { alert("Cannot save todo: No user selected."); return; }
    if (!formData.title.trim()) { alert('Title is required'); return; }
    const url = editingTodo ? `/api/todos/${editingTodo.id}` : '/api/todos';
    const method = editingTodo ? 'PUT' : 'POST';
    const bodyPayload = editingTodo ? formData : { ...formData, user_id: currentUser.id };
    try {
      const res = await fetch(url, { method: method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(bodyPayload) });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(`Failed to ${editingTodo ? 'update' : 'add'} todo: ${res.statusText} (${errorData.error || errorData.details || 'No details'})`);
      }
      await fetchTodosForCurrentUser();
      closeTodoModal();
    } catch (err) { console.error(`Error ${editingTodo ? 'updating' : 'adding'} todo:`, err); alert(`Error: ${err.message}`); }
  };
  const openNoteModal = (todo) => { 
    setSelectedTodoForNote(todo); setIsNoteModalOpen(true);
  };
  const closeNoteModal = () => { 
    setIsNoteModalOpen(false); setSelectedTodoForNote(null);
  };
  const openDetailModal = (todo) => {
    setSelectedTodoForDetail(todo); setIsDetailModalOpen(true);
  };
  const closeDetailModal = () => { 
    setIsDetailModalOpen(false); setSelectedTodoForDetail(null);
  };
  const handleDeleteTodo = async (todoId) => {
    if (!confirm(`Are you sure you want to delete todo ID: ${todoId}?`)) return;
    try {
      const res = await fetch(`/api/todos/${todoId}`, { method: 'DELETE' });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(`Failed to delete todo: ${res.statusText} (${errorData.error || 'No details'})`);
      }
      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch (err) { console.error('Failed to delete todo:', err); alert(`Error: ${err.message}`); }
  };
  const handleToggleComplete = async (todo) => {
    const updatedTodoData = { completed: !todo.completed };
    try {
      const res = await fetch(`/api/todos/${todo.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updatedTodoData) });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(`Failed to update todo status: ${res.statusText} (${errorData.error || 'No details'})`);
      }
      const updatedTodoFromServer = await res.json();
      setTodos(prevTodos => prevTodos.map(t => (t.id === todo.id ? updatedTodoFromServer : t)));
    } catch (err) { console.error(`Error toggling todo complete:`, err); alert(`Error: ${err.message}`); }
  };

  const handleFilterChange = (e) => setFilterPriority(e.target.value);
  const handleSortByChange = (e) => setSortBy(e.target.value);
  const handleSortOrderChange = () => setSortOrder(prev => prev === 'ASC' ? 'DESC' : 'ASC');


  return (
    <>
      <Head>
        <title>Todo List App</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>

      <div className="flex flex-col min-h-screen bg-gray-100">
        <Header users={users} currentUser={currentUser} isLoadingUsers={isLoadingUsers} onSwitchUser={handleSwitchUser} />

        <main className="flex-1 p-4 md:p-6">
          <section className="max-w-4xl mx-auto flex flex-col gap-4">
            {/* Top Bar: Title, Add Button */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 mb-2">
              <h2 className="text-xl font-semibold text-gray-700 whitespace-nowrap">
                {currentUser ? `${currentUser.username}'s Todos` : 'Select a user to see todos'}
              </h2>
              <button
                className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2 ${!currentUser || isLoadingTodos ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={openAddTodoModal}
                disabled={!currentUser || isLoadingTodos}
              >
                <i className="fas fa-plus text-sm"></i> Add Todo
              </button>
            </div>

             <FilterSortControls
                 filterPriority={filterPriority}
                 sortBy={sortBy}
                 sortOrder={sortOrder}
                 onFilterChange={handleFilterChange}
                 onSortByChange={handleSortByChange}
                 onSortOrderChange={handleSortOrderChange}
                 disabled={!currentUser || isLoadingTodos}
             />


            {/* Error Display */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-2" role="alert"> {/* Added margin */}
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            {/* Todo List */}
            <TodoList
              todos={todos} isLoading={isLoadingTodos} currentUser={currentUser}
              onToggleComplete={handleToggleComplete} onEdit={openEditTodoModal}
              onDelete={handleDeleteTodo} onAddNote={openNoteModal}
              onViewDetails={openDetailModal}
            />
          </section>
        </main>
      </div>

      {/* Render Modals */}
      <TodoModal isOpen={isTodoModalOpen} onClose={closeTodoModal} editingTodo={editingTodo} formData={formData} onFormChange={handleTodoFormChange} onSubmit={handleTodoSubmit} />
      <NoteModal isOpen={isNoteModalOpen} onClose={closeNoteModal} todo={selectedTodoForNote} />
      <TodoDetailModal isOpen={isDetailModalOpen} onClose={closeDetailModal} todo={selectedTodoForDetail} />
    </>
  );
}