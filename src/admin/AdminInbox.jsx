import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import ChatWindow from "../components/dashboard/ChatWindow";

export default function AdminInbox({ coachId }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      // Only fetch users with role "user"
      const q = query(collection(db, "users"), where("role", "==", "user"));
      const snap = await getDocs(q);

      const allUsers = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setUsers(allUsers);
    };
    fetchUsers();
  }, []);

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-1/3 border-r">
        <h2 className="p-2 font-bold">Clients</h2>
        {users.map((u) => (
          <div
            key={u.id}
            className={`p-2 cursor-pointer hover:bg-gray-100 ${
              selectedUser?.id === u.id && "bg-gray-200"
            }`}
            onClick={() => setSelectedUser(u)}
          >
            {u.name || u.email}
          </div>
        ))}
      </div>

      {/* Chat Area */}
      <div className="flex-1">
        {selectedUser ? (
          <ChatWindow userId={selectedUser.id} coachId={coachId} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a user to chat
          </div>
        )}
      </div>
    </div>
  );
}
