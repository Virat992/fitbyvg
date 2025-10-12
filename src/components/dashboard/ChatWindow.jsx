import { useEffect, useState, useRef } from "react";
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

export default function ChatWindow({ db, chatId, senderId, onBack, user }) {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const messagesEndRef = useRef(null);
  const firstLoad = useRef(true);

  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  useEffect(() => {
    if (!chatId || !senderId) return;

    const markAsRead = async () => {
      const unread = messages.filter(
        (m) => !m.readBy?.includes(senderId) && m.senderId !== senderId
      );

      for (let m of unread) {
        const msgRef = doc(db, "chats", chatId, "messages", m.id);
        await updateDoc(msgRef, {
          readBy: [...(m.readBy || []), senderId],
        });
      }
    };

    markAsRead();
  }, [messages, chatId, senderId, db]);

  const sendMessage = async () => {
    if (!newMsg.trim()) return;

    const msg = {
      text: newMsg,
      senderId,
      createdAt: serverTimestamp(),
      readBy: [],
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
    <div className="flex flex-col h-full w-full bg-gray-50 rounded-xl overflow-hidden shadow-lg">
      {/* SCROLLABLE MESSAGES */}
      <div className="flex-1 overflow-y-auto pb-2 px-6 py-2">
        <div className="flex flex-col gap-3">
          {messages.map((m, index) => {
            const msgDate = m.createdAt?.toDate
              ? m.createdAt.toDate()
              : new Date();
            const timeString = format(msgDate, "hh:mm a");

            let showDate = index === 0;
            if (!showDate) {
              const prev = messages[index - 1].createdAt?.toDate
                ? messages[index - 1].createdAt.toDate()
                : new Date();
              showDate = msgDate.toDateString() !== prev.toDateString();
            }

            const isSender = m.senderId === senderId;

            return (
              <div key={m.id}>
                {showDate && (
                  <div className="text-center text-gray-500 text-xs my-2">
                    {getDateLabel(msgDate)}
                  </div>
                )}

                <div
                  className={`flex w-full ${
                    isSender ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`relative px-4 py-2 rounded-2xl shadow-sm ${
                      isSender
                        ? "bg-cyan-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                    style={{
                      maxWidth: "80%",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    <div className="text-sm leading-snug pr-14">{m.text}</div>

                    <span
                      className={`absolute bottom-1 px-1 right-5 text-[10px] ${
                        isSender ? "text-white/70" : "text-gray-600"
                      }`}
                    >
                      {timeString}
                    </span>

                    {isSender && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`absolute bottom-1 right-1.5 h-3.5 w-3.5 ${
                          m.readBy?.length > 0 ? "text-white" : "text-white/60"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        style={{
                          paddingRight: "1px",
                          paddingBottom: "1px",
                          paddingLeft: "0px",
                        }}
                      >
                        <path d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef}></div>
        </div>
      </div>

      {/* BOTTOM INPUT */}
      <div className="w-full flex-shrink-0 flex items-center space-x-2 px-2 py-3 bg-gray-100  rounded-b-xl">
        <input
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 bg-white rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-sm"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="w-8 h-8 flex-shrink-0 bg-cyan-600 rounded-full hover:bg-cyan-700 active:bg-cyan-800 shadow-md flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-white"
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
