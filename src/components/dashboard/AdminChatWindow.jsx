import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom"; // <-- import this
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

export default function AdminChatWindow({
  db,
  chatId,
  senderId,
  user,
  onBack,
}) {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const messagesEndRef = useRef(null);
  const firstLoad = useRef(true);
  const navigate = useNavigate(); // <-- initialize navigate

  // Scroll to bottom when messages update
  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false;
      return; // skip scroll on initial load
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  // Mark messages as read
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

  // Send message
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
    <div className="flex flex-col flex-1 min-h-0 bg-gray-50">
      {/* TOP FIXED USER INFO WITH BACK */}
      <div className="sticky top-0 bg-white border-b px-6 py-3 flex items-center justify-between z-10">
        {/* Left: Back Text */}
        <div
          className="text-cyan-600 font-semibold cursor-pointer"
          onClick={onBack} // <-- go back one step
        >
          Back
        </div>

        {/* Right: User Info */}
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="font-semibold text-gray-800">
              {user?.onboarding?.firstName || "Unknown User"}
            </p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
          <img
            src={
              user?.photoURL ||
              `https://ui-avatars.com/api/?name=${
                user?.onboarding?.firstName || "User"
              }`
            }
            alt="profile"
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>
      </div>

      {/* SCROLLABLE MESSAGES AREA */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-[20px]">
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

            return (
              <div key={m.id}>
                {showDate && (
                  <div className="text-center text-gray-500 text-xs my-2">
                    {getDateLabel(msgDate)}
                  </div>
                )}
                <div
                  className={`p-2 rounded-lg max-w-[80%] break-words ${
                    m.senderId === senderId
                      ? "bg-cyan-500 text-white ml-auto"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  <div className="flex justify-between items-end">
                    <span>{m.text}</span>
                    <span className="text-[10px] text-gray-700 ml-2">
                      {timeString}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef}></div>
        </div>
      </div>

      {/* BOTTOM FIXED INPUT */}
      <div className="sticky bottom-0 bg-white flex items-center space-x-2 px-5 py-2 shadow-sm z-10">
        <input
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 bg-gray-100 rounded-full px-4 py-4 text-sm focus:outline-none focus:ring focus:ring-cyan-300"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="p-2 bg-cyan-600 rounded-full hover:bg-cyan-700 active:bg-cyan-800"
        >
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
