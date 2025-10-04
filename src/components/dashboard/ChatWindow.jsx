import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  doc,
} from "firebase/firestore";

export default function ChatWindow({ db, chatId, senderId }) {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  useEffect(() => {
    if (!chatId) return;

    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsub();
  }, [chatId, db]);

  const sendMessage = async () => {
    if (!newMsg.trim()) return;

    const msg = {
      text: newMsg,
      senderId,
      createdAt: serverTimestamp(),
    };

    await addDoc(collection(db, "chats", chatId, "messages"), msg);

    await updateDoc(doc(db, "chats", chatId), {
      lastMessage: newMsg,
      updatedAt: new Date(),
    });

    setNewMsg("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-2 rounded-lg max-w-xs ${
              m.senderId === senderId
                ? "bg-blue-500 text-white ml-auto"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t flex">
        <input
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          className="flex-1 border rounded-lg px-3 py-2"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}
