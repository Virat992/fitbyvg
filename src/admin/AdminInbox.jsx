import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  addDoc,
} from "firebase/firestore";
import AdminChatWindow from "../components/dashboard/AdminChatWindow";

export default function AdminInbox({ db, coachId }) {
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [activeTab, setActiveTab] = useState("users"); // mobile only
  const [unreadChats, setUnreadChats] = useState([]);

  // Fetch chats
  useEffect(() => {
    if (!coachId) return;

    const q = query(
      collection(db, "chats"),
      where("participants", "array-contains", coachId)
    );

    const unsub = onSnapshot(q, async (snapshot) => {
      const chatsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChats(chatsList);

      // Detect unread messages
      const unread = [];
      for (let chat of chatsList) {
        const msgQuery = query(collection(db, "chats", chat.id, "messages"));
        const msgSnapshot = await getDocs(msgQuery);
        const hasUnread = msgSnapshot.docs.some((m) => {
          const data = m.data();
          return (
            data.senderId !== coachId && !(data.readBy || []).includes(coachId)
          );
        });
        if (hasUnread) unread.push(chat.id);
      }

      setUnreadChats(unread);
    });

    return () => unsub();
  }, [coachId, db]);

  // Fetch users
  useEffect(() => {
    const q = query(collection(db, "users"));
    const unsub = onSnapshot(q, (snapshot) => {
      const userList = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((u) => u.role !== "coach");
      setUsers(userList);
    });

    return () => unsub();
  }, [db]);

  const startChatWithUser = async (user) => {
    const existing = chats.find((c) => c.participants.includes(user.id));
    if (existing) {
      setSelectedChat(existing);
      return;
    }

    const newChat = {
      participants: [coachId, user.id],
      userName: user.onboarding?.firstName || "Unknown",
      userEmail: user.email,
      lastMessage: "",
      updatedAt: new Date(),
    };

    const docRef = await addDoc(collection(db, "chats"), newChat);
    setSelectedChat({ id: docRef.id, ...newChat });
  };

  const isMobile = window.innerWidth < 768;

  return (
    <div className="flex flex-col h-full">
      {/* Mobile Tabs */}
      {isMobile && !selectedChat && (
        <div className="flex border-b">
          <button
            className={`flex-1 p-3 font-medium ${
              activeTab === "users" ? "border-b-2 border-cyan-600" : ""
            }`}
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>
          <button
            className={`flex-1 p-3 font-medium ${
              activeTab === "chats" ? "border-b-2 border-cyan-600" : ""
            }`}
            onClick={() => setActiveTab("chats")}
          >
            Open Chats
          </button>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar: Users & Chats */}
        {(!selectedChat || !isMobile) && (
          <div className="w-full md:w-1/3 border-r overflow-y-auto flex flex-col">
            {/* Users list */}
            <div
              className={`overflow-y-auto ${
                activeTab === "users" || !isMobile ? "block" : "hidden"
              }`}
            >
              <h3 className="p-2 font-medium text-gray-700 border-b hidden md:block">
                Users
              </h3>
              {users.map((user) => (
                <div
                  key={user.id}
                  onClick={() => startChatWithUser(user)}
                  className="p-3 cursor-pointer hover:bg-gray-100"
                >
                  <p className="font-medium">{user.onboarding?.firstName}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              ))}
            </div>

            {/* Chats list */}
            <div
              className={`flex-1 overflow-y-auto ${
                activeTab === "chats" || !isMobile ? "block" : "hidden"
              }`}
            >
              <h3 className="p-2 font-medium text-gray-700 border-b hidden md:block">
                Open Chats
              </h3>
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`p-3 cursor-pointer hover:bg-gray-100 ${
                    selectedChat?.id === chat.id
                      ? "bg-gray-200"
                      : unreadChats.includes(chat.id)
                      ? "bg-yellow-100 font-semibold"
                      : ""
                  }`}
                >
                  <p className="font-medium">{chat.userName || "Unknown"}</p>
                  <p className="text-sm text-gray-500">
                    {chat.userEmail || ""}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {chat.lastMessage || "No messages yet"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat Window */}
        {selectedChat && (
          <div className="flex-1 flex flex-col h-full bg-white">
            <div className="flex-1 flex flex-col overflow-hidden">
              <AdminChatWindow
                db={db}
                chatId={selectedChat.id}
                senderId={coachId}
                user={users.find(
                  (u) =>
                    selectedChat.participants.includes(u.id) && u.id !== coachId
                )}
                onBack={() => setSelectedChat(null)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
