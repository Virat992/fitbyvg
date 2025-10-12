// src/components/chat/UserInbox.jsx
import { useEffect, useState } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import ChatWindow from "./ChatWindow";

export default function UserInbox({ db, userId, coachId }) {
  const [chatId, setChatId] = useState(null);

  useEffect(() => {
    if (!userId || !coachId) return;

    const chatDocId = `${userId}_${coachId}`;
    const chatRef = doc(db, "chats", chatDocId);
    const userRef = doc(db, "users", userId);

    const ensureChat = async () => {
      const chatSnap = await getDoc(chatRef);

      if (!chatSnap.exists()) {
        // Fetch user profile
        const userSnap = await getDoc(userRef);
        let userName = "Unknown";
        let userEmail = "";

        if (userSnap.exists()) {
          const data = userSnap.data();
          userName = data?.onboarding?.firstName || "Unknown";
          userEmail = data?.email || "";
        }

        await setDoc(chatRef, {
          participants: [userId, coachId],
          userEmail,
          userName,
          lastMessage: "",
          updatedAt: new Date(),
        });
      }

      setChatId(chatDocId);
    };

    ensureChat();
  }, [userId, coachId, db]);

  if (!chatId)
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Loading chat...
      </div>
    );

  return (
    // ✅ Remove any padding — full screen chat
    <div className="w-full h-full pb-0 m-0">
      <ChatWindow db={db} chatId={chatId} senderId={userId} />
    </div>
  );
}
