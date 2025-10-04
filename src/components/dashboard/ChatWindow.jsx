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
import { format, isToday, isYesterday } from "date-fns";

export default function ChatWindow({ db, chatId, senderId }) {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  // Fetch messages
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

  // Mark messages as read by current user
  useEffect(() => {
    if (!chatId || !senderId) return;

    const markAsRead = async () => {
      const unreadMessages = messages.filter(
        (m) => !m.readBy?.includes(senderId) && m.senderId !== senderId
      );

      for (let m of unreadMessages) {
        const msgRef = doc(db, "chats", chatId, "messages", m.id);
        await updateDoc(msgRef, {
          readBy: [...(m.readBy || []), senderId],
        });
      }
    };

    markAsRead();
  }, [messages, chatId, senderId, db]);

  // Send message
  const sendMessage = async () => {
    if (!newMsg.trim()) return;

    const msg = {
      text: newMsg,
      senderId,
      createdAt: serverTimestamp(),
      readBy: [], // Initialize readBy for new messages
    };

    await addDoc(collection(db, "chats", chatId, "messages"), msg);

    await updateDoc(doc(db, "chats", chatId), {
      lastMessage: newMsg,
      updatedAt: new Date(),
    });

    setNewMsg("");
  };

  const getDateLabel = (date) => {
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMM dd, yyyy");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((m, index) => {
          const msgDate = m.createdAt?.toDate
            ? m.createdAt.toDate()
            : new Date();
          const timeString = format(msgDate, "hh:mm a");

          // Date separator
          let showDate = false;
          if (index === 0) showDate = true;
          else {
            const prevMsgDate = messages[index - 1].createdAt?.toDate
              ? messages[index - 1].createdAt.toDate()
              : new Date();
            if (msgDate.toDateString() !== prevMsgDate.toDateString())
              showDate = true;
          }

          return (
            <div key={m.id}>
              {showDate && (
                <div className="text-center text-gray-500 text-xs my-2">
                  {getDateLabel(msgDate)}
                </div>
              )}

              {/* Message bubble */}
              <div
                className={`p-2 rounded-lg max-w-xs break-words ${
                  m.senderId === senderId
                    ? "bg-cyan-500 text-white ml-auto"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <div className="flex justify-between items-end">
                  <span>{m.text}</span>
                  <div className="flex items-end ml-2">
                    <span className="text-[10px] text-gray-600 flex-shrink-0">
                      {timeString}
                    </span>
                    {m.senderId === senderId && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-3 w-3 ml-1 ${
                          m.readBy?.length > 0 ? "text-black" : "text-white-400"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input - WhatsApp style */}
      <div className="p-3 border-t flex items-center space-x-2 flex-shrink-0">
        <input
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring focus:ring-cyan-300"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="p-2 bg-cyan-600 rounded-full flex items-center justify-center hover:bg-cyan-700"
        >
          {/* Send icon SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
