// components/chat/ChatWindow.jsx
import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

export default function ChatWindow({ db, userId, coachId, userRole }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const chatId = `${userId}_${coachId}`;

  // Listen for messages
  useEffect(() => {
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("timestamp")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, [chatId, db]);

  const handleSend = async () => {
    if (!text.trim()) return;
    await addDoc(collection(db, "chats", chatId, "messages"), {
      senderId: userRole === "coach" ? coachId : userId,
      senderRole: userRole,
      text,
      timestamp: serverTimestamp(),
    });
    setText("");
  };

  return (
    <div className="flex flex-col h-full border rounded">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((m) => (
          <div
            key={m.id}
            className={m.senderRole === "user" ? "text-right" : "text-left"}
          >
            <span
              className={`inline-block p-2 rounded ${
                m.senderRole === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {m.text}
            </span>
          </div>
        ))}
      </div>
      <div className="flex p-2 border-t">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border rounded p-2 mr-2"
          placeholder="Type a message"
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
