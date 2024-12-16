import React, { useState, useEffect } from 'react';
import { User, Edit, Trash2, Plus, Save, X } from 'lucide-react';

export interface UserType {
    id: number;
    username: string;
    password?: string;
    message?: string;
}
export const backendUrl = 'http://localhost:8080';
const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<UserType[]>([]);
    const [editingUser, setEditingUser] = useState<UserType | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newUser, setNewUser] = useState({
        username: '',
        password: ''
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/user/all`);
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
            alert('Failed to fetch users');
        }
    };

    const handleAddUser = async () => {
        if (!newUser.username.trim() || !newUser.password.trim()) {
            alert('Please enter both username and password');
            return;
        }

        try {
            const response = await fetch(`${backendUrl}/api/user/new`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: newUser.username,
                    password: newUser.password,
                    message: ''
                }),
            });

            const addedUser = await response.json();
            setUsers([...users, addedUser]);

            // Reset modal and input
            setNewUser({ username: '', password: '' });
            setIsAddModalOpen(false);
        } catch (error) {
            console.error('Error adding user:', error);
            alert('Failed to add user');
        }
    };

    const handleDeleteUser = async (id: number) => {
        try {
            await fetch(`https://api.example.com/users/${id}`, {
                method: 'DELETE',
            });

            setUsers(users.filter(user => user.id !== id));
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user');
        }
    };

    const renderAddUserModal = () => {
        if (!isAddModalOpen) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                    <h2 className="text-xl font-bold mb-4">Add New User</h2>
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Username"
                            value={newUser.username}
                            onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                            className="w-full p-2 border rounded"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={newUser.password}
                            onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                            className="w-full p-2 border rounded"
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddUser}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Add User
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center">User Management</h1>

            {/* Add User Button */}
            <div className="mb-6 text-right">
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition flex items-center justify-center"
                >
                    <Plus className="mr-2" /> Add User
                </button>
            </div>

            {/* User List */}
            <div className="flex flex-col gap-4">
                {users.map((user) => (
                    <div
                        key={user.id}
                        className="bg-white w-[500px] shadow-md rounded-lg p-4 flex items-center justify-between"
                    >
                        <div className="flex items-center">
                            <User className="w-12 h-12 rounded-full mr-4 bg-blue-200 p-2" />
                            <span className="font-medium">{user.username}</span>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                className="text-red-500 hover:bg-red-100 p-1 rounded"
                                onClick={() => handleDeleteUser(user.id)}
                            >
                                <Trash2 />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add User Modal */}
            {renderAddUserModal()}
        </div>
    );
};

export default UserManagement;