import React, {useEffect, useState} from 'react';
import {User, Edit, Save, X, LogOut} from 'lucide-react';
import {useLocation} from "react-router-dom";
import {backendUrl, UserType} from "./Admin.tsx";

const ESP32_SERVER='http://localhost:8180';

const UserProfile: React.FC = () => {
    const [user, setUser] = useState<UserType>();
    const location = useLocation();
    const pathname = location.pathname;

    useEffect(() => {
        const paths = pathname.split('/');
        const userId = parseInt(paths[paths.length - 1]);
        checkIsLogin(userId)
        fetchUser(userId);
    }, [location]);

    const checkIsLogin=(currentUserId:number)=>{
        const userId:string = localStorage.getItem('userId');
        if(!userId || parseInt(userId)!=currentUserId){
            window.location.href=`/login`
        }
    }

    const fetchUser = async (userId: number) => {
        try {
            const response = await fetch(`${backendUrl}/api/user/${userId}`);
            const data: UserType = await response.json();
            setUser(data);
        } catch (err) {
            console.log(err);
        }
    }

    const setMessage=async (message:string, userId: number) => {
        try{
            const response = await fetch(`${ESP32_SERVER}/message/${userId}`, {
                method: 'POST',
                body: JSON.stringify({
                    message: message,
                })
            });
            const data = await response.json();
            console.log(data);
        }catch(err){
            console.log(err);
        }
    }

    const [isEditing, setIsEditing] = useState(false);
    const [editedMessage, setEditedMessage] = useState(user?.message ?? "");

    const handleUpdateMessage = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/user/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: editedMessage
                })
            });

            if (response.ok) {
                setUser(prevUser => ({
                    ...prevUser,
                    message: editedMessage
                }));
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Error updating message:', error);
            alert('Failed to update message');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('userId');
        window.location.href = '/login';
        setMessage(" ", -1)
    };

    return (
        <div className="container mx-auto p-6 max-w-md">
            <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center mb-6">
                        <User className="w-12 h-12 rounded-full mr-4 bg-blue-200 p-2"/>
                        <div>
                            <h2 className="text-xl font-bold">{user?.username}</h2>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-red-500 hover:bg-red-100 p-2 rounded flex items-center"
                    >
                        <LogOut className="mr-2"/> Logout
                    </button>
                </div>
                <div className="mb-4">
                    {isEditing ? (
                        <div className="flex items-center">
                            <input
                                type="text"
                                value={editedMessage}
                                onChange={(e) => setEditedMessage(e.target.value)}
                                className="flex-grow mr-2 p-2 border rounded"
                            />
                            <div className="flex space-x-2">
                                <button
                                    onClick={handleUpdateMessage}
                                    className="text-green-500 hover:bg-green-100 p-2 rounded"
                                >
                                    <Save/>
                                </button>
                                <button
                                    onClick={() => {
                                        setEditedMessage(user?.message ?? "");
                                        setIsEditing(false);
                                    }}
                                    className="text-red-500 hover:bg-red-100 p-2 rounded"
                                >
                                    <X/>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between">
                            <p className="text-gray-700">{user?.message ?? "No message yet"}</p>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="text-blue-500 hover:bg-blue-100 p-2 rounded"
                            >
                                <Edit/>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;