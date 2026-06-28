import React from 'react';
import { useState, useEffect } from 'react';

function Todo() {

    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [darkMode, setDarkMode] = useState(false);

    const saveData = (data) => {
        localStorage.setItem("tasks", JSON.stringify(data));
    };

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);

        if (newMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        localStorage.setItem('darkMode', newMode);
    };

    useEffect(() => {
        const isDark = localStorage.getItem('darkMode') === 'true';
        setDarkMode(isDark);

        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        if (localStorage.getItem("tasks")) {
            setTodos(JSON.parse(localStorage.getItem("tasks")));
        }
    }, []);

    const addTodo = () => {
        if (!newTodo || !newTodo.trim()) return;

        if (isEditing) {
            const updatedTodos = todos.map((todo) =>
                todo.id === editId ? { ...todo, todo: newTodo.trim() } : todo
            );
            setTodos(updatedTodos);
            saveData(updatedTodos);
            setIsEditing(false);
            setEditId(null);
        } else {
            const data = [...todos, { todo: newTodo.trim(), id: Date.now() }];
            setTodos(data);
            saveData(data);
        }

        setNewTodo("");
    };

    const editTodo = (id) => {
        const taskToEdit = todos.find(todo => todo.id === id);
        if (taskToEdit) {
            setNewTodo(taskToEdit.todo);
            setIsEditing(true);
            setEditId(id);
        }
    };

    const delData = (id) => {
        const data = todos.filter(todo => todo.id !== id);
        setTodos(data);
        saveData(data);
        if (isEditing && editId === id) {
            setIsEditing(false);
            setNewTodo("");
            setEditId(null);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        addTodo();
    };

    return (
        <>
            <div className={`${darkMode ? 'dark bg-gray-950' : 'bg-gray-50'} min-h-screen pt-12 transition-colors duration-500`}>

                <div className="max-w-4xl mx-auto px-6 py-10 bg-white/40 dark:bg-gray-900/40 backdrop-blur-lg rounded-3xl shadow-[rgba(0,0,0,0.2)_0px_30px_60px_-12px] border border-white/30 dark:border-white/10 transition-all duration-500 hover:scale-[1.01]">

                    <div className="flex justify-end mb-4">
                        <button
                            type="button"
                            onClick={toggleDarkMode}
                            className="bg-gradient-to-r from-gray-200 to-gray-400 dark:from-gray-700 dark:to-gray-800 text-black dark:text-white px-5 py-2 rounded-full shadow-md transform hover:-translate-y-0.5 transition duration-300 ease-in-out font-medium"
                        >
                            {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
                        </button>
                    </div>

                    <h1 className="text-5xl font-extrabold text-center text-black dark:text-white mb-10 drop-shadow-lg tracking-tight">
                        📝 My Todo List
                    </h1>

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label className="block text-black dark:text-white text-base font-semibold mb-2">
                                Enter Task:
                            </label>
                            <input
                                type="text"
                                value={newTodo}
                                onChange={(e) => setNewTodo(e.target.value)}
                                className="w-full px-6 py-4 rounded-xl text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 bg-white/80 dark:bg-gray-800/80 border border-gray-300 dark:border-gray-700 shadow-md focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition"
                            />
                        </div>

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={addTodo}
                                className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-[0_4px_12px_rgba(90,150,255,0.4)] hover:shadow-[0_6px_20px_rgba(90,150,255,0.6)] transform hover:-translate-y-1 transition duration-300 ease-in-out"
                            >
                                {isEditing ? '✏️ Update Task' : '➕ Save Task'}
                            </button>
                        </div>
                    </form>

                    <hr className="my-10 border-gray-300 dark:border-gray-700" />

                    <div className="overflow-x-auto rounded-xl shadow-2xl">
                        <table className="min-w-full bg-white/20 dark:bg-gray-800/20 border border-gray-200 dark:border-gray-700 backdrop-blur-md rounded-xl text-black dark:text-white">
                            <thead>
                                <tr className="bg-gradient-to-r from-indigo-700 to-cyan-600 dark:from-gray-800 dark:to-gray-700 text-white">
                                    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Task</th>
                                    <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider">Delete</th>
                                    <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider">Edit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {todos.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="text-center py-6 text-black dark:text-white font-medium">
                                            🚫 No tasks added yet.
                                        </td>
                                    </tr>
                                ) : (
                                    todos.map((tod) => (
                                        <tr key={tod.id} className="hover:bg-white/10 dark:hover:bg-gray-700/30 transition border-b border-gray-200 dark:border-gray-700">
                                            <td className="px-6 py-4 text-sm">{tod.id}</td>
                                            <td className="px-6 py-4 text-sm">{tod.todo}</td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => delData(tod.id)}
                                                    className="bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white px-5 py-2 rounded-full shadow-[0_4px_12px_rgba(255,0,60,0.3)] hover:shadow-[0_6px_20px_rgba(255,0,60,0.5)] transform hover:-translate-y-1 transition duration-300 ease-in-out"
                                                >
                                                    🗑️ Delete
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => editTodo(tod.id)}
                                                    className="bg-gradient-to-br from-blue-500 via-indigo-600 to-indigo-700 text-white px-5 py-2 rounded-full shadow-[0_4px_12px_rgba(0,90,255,0.3)] hover:shadow-[0_6px_20px_rgba(0,90,255,0.5)] transform hover:-translate-y-1 transition duration-300 ease-in-out"
                                                >
                                                    ✏️ Edit
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Todo;