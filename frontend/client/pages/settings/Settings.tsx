import { useState, useEffect } from "react";
import axiosLocal from "../../api/axiosLocal";
import { Code } from "lucide-react";
import LoadingScreen from "./LoadingScreen";
import EntrepreneurProfile from "./EntrepreneurProfile";
import DeveloperProfile from "./DeveloperProfile";
import { UserData } from "./types";

export default function Settings() {
  const [user, setUser] = useState<UserData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);

  const userDataString = localStorage.getItem("userData");
  const userData = userDataString ? JSON.parse(userDataString) : {};
  const userType = userData.userType;
  const jwt_token = localStorage.getItem("jwt_token");
  // Choose ID dynamically based on userType
  const id =
    userType === "user"
      ? userData.user_id || userData.id
      : userData.entrepreneur_id || userData.id;

  // Fetch user data dynamically based on type
  useEffect(() => {
    if (!id || !userType) return;

    const fetchUserData = async () => {
      try {
        const endpoint =
          userType === "developer" ? `/developer/${id}` : `/entrepreneur/${id}`;

        const res = await axiosLocal.get(endpoint, {
          headers: { Authorization: `Bearer ${jwt_token}` },
        });
        console.log(res.data);
        setUser({
          ...res.data,
          skills: res.data.skills || [],
          socialLinks: res.data.socialLinks || [],
          projects: res.data.projects || [],
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [id, userType, jwt_token]);

  // Save changes dynamically based on userType
  const handleSave = async () => {
    if (!id ) return;
    
    setIsSaving(true);

    // Use setTimeout to allow React to re-render and show "Saving..." state
    setTimeout(async () => {
      try {
        const endpoint =
          userType === "developer" ? `/developer/${id}` : `/entrepreneur/${id}`;

        await axiosLocal.put(endpoint, user, {
          headers: { Authorization: `Bearer ${jwt_token}` },
        });

        console.log(user);
        alert("Profile updated successfully!");
      } catch (error) {
        console.error("Error updating user:", error);
        alert("Failed to update profile.");
      } finally {
        setIsSaving(false);
      }
    }, 100);
  };

  // Handle profile picture upload (Developer only)
  const handleProfilePicUpload = async (file: File) => {
    const tempUrl = URL.createObjectURL(file);
    setUser({ ...user!, profile_pic: tempUrl });
    setIsUploading(true);

    const formData = new FormData();
    formData.append("profile_pic", file);

    try {
      const token = localStorage.getItem("jwt_token");
      const res = await axiosLocal.post(`/developer/${id}/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": undefined,
        },
      });
      setUser({
        ...user!,
        profile_pic: res.data.profile_pic,
      });
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  if (!user) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {userType === "entrepreneur" ? (
          <EntrepreneurProfile
            user={user}
            setUser={setUser}
            handleSave={handleSave}
            isSaving={isSaving}
          />
        ) : (
          <DeveloperProfile
            user={user}
            setUser={setUser}
            handleSave={handleSave}
            isSaving={isSaving}
            isUploading={isUploading}
            isImageLoading={isImageLoading}
            setIsImageLoading={setIsImageLoading}
            handleProfilePicUpload={handleProfilePicUpload}
          />
        )}
      </div>
    </div>
  );
}
