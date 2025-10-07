// src/components/dashboard/EditProfile.jsx
import { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, storage } from "../../services/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function EditProfile({ userId, onClose }) {
  const auth = getAuth();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    firstName: "",
    email: "",
    acsm: "",
    age: "",
    height: "",
    weight: "",
    gender: "",
  });
  const [profilePic, setProfilePic] = useState(null);
  const [newProfileFile, setNewProfileFile] = useState(null);
  const [saving, setSaving] = useState(false);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;

      console.log("🔍 Fetching user from Firestore:", userId);
      const docRef = doc(db, "users", userId);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        const data = snap.data();
        console.log("✅ Firestore user data:", data);

        const onboarding = data.onboarding || {};
        const physical = onboarding.physicalInfo || {};

        setUserData({
          firstName: onboarding.firstName || "",
          email: data.email || auth.currentUser?.email || "",
          acsm: onboarding.acsm || "",
          age: physical.age || "",
          height: physical.height || "",
          weight: physical.weight || "",
          gender: physical.gender || "",
        });

        if (data.profilePicUrl) setProfilePic(data.profilePicUrl);
      } else {
        console.warn("⚠️ No user document found for:", userId);
      }

      setLoading(false);
    };

    fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProfileFile(file);
      const url = URL.createObjectURL(file);
      setProfilePic(url);
    }
  };

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);

    try {
      let profilePicUrl = profilePic;

      if (newProfileFile) {
        const storageRef = ref(storage, `profilePics/${userId}`);
        await uploadBytes(storageRef, newProfileFile);
        profilePicUrl = await getDownloadURL(storageRef);
      }

      await setDoc(
        doc(db, "users", userId),
        {
          onboarding: {
            firstName: userData.firstName,
            acsm: userData.acsm,
            physicalInfo: {
              age: userData.age,
              height: userData.height,
              weight: userData.weight,
              gender: userData.gender,
            },
          },
          profilePicUrl,
        },
        { merge: true }
      );

      alert("✅ Profile updated successfully!");
      if (onClose) onClose();
    } catch (err) {
      console.error("❌ Failed to save profile:", err);
      alert("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (loading)
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
        <div className="bg-white rounded-xl p-6 text-center">Loading...</div>
      </div>
    );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-8 sm:p-10">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md relative flex flex-col max-h-[60vh] overflow-hidden">
        {/* Top Section with Logout */}
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <h2 className="text-lg sm:text-xl font-bold text-cyan-700">
            Edit Profile
          </h2>
          <button
            onClick={handleLogout}
            className="text-white bg-cyan-600 hover:bg-cyan-700 px-3 py-1.5 rounded-lg text-sm font-medium transition"
          >
            Logout
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto px-5 py-4 space-y-4">
          {/* Profile Picture */}
          <div className="flex flex-col items-center mb-4">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 mb-2">
              {profilePic ? (
                <img
                  src={profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-gray-400">
                  No Pic
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
              className="text-sm"
            />
          </div>

          {/* Fields */}
          {[
            { label: "First Name", name: "firstName", type: "text" },
            { label: "Email", name: "email", type: "email", disabled: true },
            { label: "ACSM Risk Level", name: "acsm", type: "text" },
            { label: "Age", name: "age", type: "number" },
            { label: "Height (cm)", name: "height", type: "number" },
            { label: "Weight (kg)", name: "weight", type: "number" },
            { label: "Gender", name: "gender", type: "text" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={userData[field.name]}
                onChange={handleChange}
                disabled={field.disabled}
                className={`w-full px-3 py-2 border rounded-lg ${
                  field.disabled
                    ? "bg-gray-100 cursor-not-allowed"
                    : "focus:outline-none focus:ring-2 focus:ring-cyan-500"
                }`}
              />
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="border-t px-5 py-3 flex justify-end gap-2 bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition disabled:opacity-50 text-sm sm:text-base"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
