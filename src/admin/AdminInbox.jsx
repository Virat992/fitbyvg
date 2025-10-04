import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import ChatWindow from "../components/dashboard/ChatWindow";

export default function AdminInbox({ db, coachId }) {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    if (!coachId) return;

    const q = query(
      collection(db, "chats"),
      where("participants", "array-contains", coachId)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const chatsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChats(chatsList);
    });

    return () => unsub();
  }, [coachId, db]);

  return (
    <div className="flex h-full">
      {/* Left sidebar */}
      <div className="w-1/3 border-r overflow-y-auto">
        {chats.map((chat) => {
          const otherUser = chat.participants.find((id) => id !== coachId);
          return (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`p-3 cursor-pointer hover:bg-gray-100 ${
                selectedChat?.id === chat.id ? "bg-gray-200" : ""
              }`}
            >
              <p className="font-medium">{chat.userName || "Unknown User"}</p>
              <p className="text-sm text-gray-500">{chat.userEmail || ""}</p>
              <p className="text-xs text-gray-400 truncate">
                {chat.lastMessage || "No messages yet"}
              </p>
            </div>
          );
        })}
      </div>

      {/* Chat Window */}
      <div className="flex-1">
        {selectedChat ? (
          <ChatWindow db={db} chatId={selectedChat.id} senderId={coachId} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Select a user to chat
          </div>
        )}
      </div>
    </div>
  );
}
