import { useEffect, useState } from "react";
import { db, auth } from "../services/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import ChatWindow from "../components/dashboard/ChatWindow";

export default function AdminInbox({ coachId }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [role, setRole] = useState(null);

  const [currentUser] = useAuthState(auth);

  // Fetch current logged-in user role
  useEffect(() => {
    const fetchRole = async () => {
      if (!currentUser) return;
      try {
        const snap = await getDoc(doc(db, "users", currentUser.uid));
        if (snap.exists()) {
          setRole(snap.data().role || "user"); // default "user" if not found
        }
      } catch (err) {
        console.error("Failed to fetch role:", err);
      }
    };
    fetchRole();
  }, [currentUser]);

  // Fetch all users for coach
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snap = await getDocs(collection(db, "users"));
        const allUsers = snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
        setUsers(allUsers.filter((u) => u.role === "user")); // only clients
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
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
            key={u.email}
            className={`p-2 cursor-pointer hover:bg-gray-100 ${
              selectedUser?.email === u.email ? "bg-gray-200" : ""
            }`}
            onClick={() => setSelectedUser(u)}
          >
            {u.onboarding?.firstName || "Unnamed"} — {u.email}
          </div>
        ))}
      </div>

      {/* Chat Area */}
      <div className="flex-1">
        {selectedUser && role ? (
          <ChatWindow
            userId={selectedUser.uid}
            coachId={coachId}
            userName={selectedUser.onboarding?.firstName || "Unnamed"}
            userEmail={selectedUser.email}
            loggedInUserRole={role}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            {role ? "Select a user to chat" : "Loading role..."}
          </div>
        )}
      </div>
    </div>
  );
}
