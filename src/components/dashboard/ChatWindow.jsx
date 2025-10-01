import { useState, useEffect, useRef } from "react";
import { db } from "../../services/firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  setDoc,
} from "firebase/firestore";

export default function ChatWindow({ userId, coachId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    const q = query(
      collection(db, "chats", userId, "messages"),
      orderBy("timestamp", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    });
    return () => unsub();
  }, [userId]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const msg = {
      senderId: coachId || userId, // 👈 if coachId is present, use it, else user
      text: input.trim(),
      timestamp: serverTimestamp(),
    };
    await addDoc(collection(db, "chats", userId, "messages"), msg);

    await setDoc(
      doc(db, "chats", userId),
      {
        participants: [userId, coachId],
        lastUpdated: serverTimestamp(),
      },
      { merge: true }
    );
    setInput("");
  };

  return (
    <div className="flex flex-col h-full border rounded-lg">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((m) => {
          const isCoach = m.senderId === coachId;
          return (
            <div
              key={m.id}
              className={`mb-2 flex justify-${
                m.senderId === coachId ? "end" : "start"
              }`}
            >
              <span
                className={`inline-block px-3 py-2 rounded-lg ${
                  m.senderId === coachId
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {m.text}
              </span>
            </div>
          );
        })}

        <div ref={endRef}></div>
      </div>

      {/* Input */}
      <div className="flex border-t p-2">
        <input
          className="flex-1 border rounded px-2 mr-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-3 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
