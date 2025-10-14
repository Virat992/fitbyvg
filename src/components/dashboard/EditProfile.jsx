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

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;

      const docRef = doc(db, "users", userId);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        const data = snap.data();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4 md:p-8">
      <div
        className="
        bg-white rounded-2xl shadow-2xl 
        w-full max-w-md md:max-w-2xl  /* ✅ widened for tablet */
        relative flex flex-col 
        max-h-[85vh] overflow-hidden
      "
      >
        {/* Header */}
        <div
          className="
          flex justify-between items-center 
          px-4 md:px-8 py-3 md:py-5 
          border-b bg-gradient-to-r from-cyan-700 to-cyan-500 text-white
        "
        >
          <h2 className="text-lg md:text-2xl font-semibold tracking-wide">
            Edit Profile
          </h2>
          <button
            onClick={handleLogout}
            className="bg-white text-cyan-700 hover:bg-cyan-100 px-3 md:px-5 py-1.5 md:py-2.5 rounded-lg text-sm md:text-base font-medium transition"
          >
            Logout
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 md:px-10 py-4 md:py-8 space-y-5">
          {/* Profile Header */}
          <div className="flex flex-col items-center text-center border-b pb-6 md:pb-8">
            <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-cyan-500 shadow-lg">
              {profilePic ? (
                <img
                  src={profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No Pic
                </div>
              )}
            </div>

            <button
              onClick={() => document.querySelector("#profilePicInput").click()}
              className="mt-3 md:mt-4 px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition"
            >
              Change Photo
            </button>
            <input
              id="profilePicInput"
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
              className="hidden"
            />

            <h3 className="mt-4 text-lg md:text-xl font-semibold text-gray-800">
              {userData.firstName || "Your Name"}
            </h3>
            <p className="text-gray-500 text-sm md:text-base">
              {userData.email}
            </p>
          </div>

          {/* Profile Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mt-6 md:mt-8">
            {[
              { label: "First Name", name: "firstName", type: "text" },
              { label: "Email", name: "email", type: "email", disabled: true },
              { label: "ACSM Risk Level", name: "acsm", type: "text" },
              { label: "Age", name: "age", type: "number" },
              { label: "Height (cm)", name: "height", type: "number" },
              { label: "Weight (kg)", name: "weight", type: "number" },
              { label: "Gender", name: "gender", type: "text" },
            ].map((field) => (
              <div key={field.name} className="md:col-span-1">
                <label className="block text-sm md:text-base font-medium text-gray-700 mb-1">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={userData[field.name]}
                  onChange={handleChange}
                  disabled={field.disabled}
                  className={`w-full px-4 py-2 md:py-3 border rounded-lg text-sm md:text-base ${
                    field.disabled
                      ? "bg-gray-100 cursor-not-allowed"
                      : "focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-5 md:px-10 py-3 md:py-5 flex justify-end gap-2 md:gap-4 bg-white">
          <button
            onClick={onClose}
            className="px-4 md:px-5 py-2 md:py-2.5 bg-gray-300 rounded-lg hover:bg-gray-400 transition text-sm md:text-base"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 md:px-6 py-2 md:py-2.5 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition disabled:opacity-50 text-sm md:text-base"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
