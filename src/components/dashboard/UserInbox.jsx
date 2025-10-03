// components/chat/UserInbox.jsx
import ChatWindow from "./ChatWindow";

export default function UserInbox({ db, userId, coachId, userRole }) {
  return (
    <ChatWindow
      db={db}
      userId={userId}
      coachId={coachId}
      userRole={userRole} // ✅ pass it here
    />
  );
}
