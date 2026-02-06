import { UserData } from "./types";
import DeveloperHeader from "./DeveloperHeader";
import DeveloperContactInfo from "./DeveloperContactInfo";
import SkillsSection from "./SkillsSection";
import ProjectsSection from "./ProjectsSection";
import SocialLinksSection from "./SocialLinksSection";

interface DeveloperProfileProps {
  user: UserData;
  setUser: (user: UserData) => void;
  handleSave: () => void;
  isSaving: boolean;
  isUploading: boolean;
  isImageLoading: boolean;
  setIsImageLoading: (loading: boolean) => void;
  handleProfilePicUpload: (file: File) => void;
}

export default function DeveloperProfile({
  user,
  setUser,
  handleSave,
  isSaving,
  isUploading,
  isImageLoading,
  setIsImageLoading,
  handleProfilePicUpload,
}: DeveloperProfileProps) {
  return (
    <div className="space-y-4">
      <DeveloperHeader
        user={user}
        setUser={setUser}
        handleSave={handleSave}
        isSaving={isSaving}
        isUploading={isUploading}
        isImageLoading={isImageLoading}
        setIsImageLoading={setIsImageLoading}
        handleProfilePicUpload={handleProfilePicUpload}
      />
      <DeveloperContactInfo user={user} setUser={setUser} />
      <SkillsSection user={user} setUser={setUser} />
      <ProjectsSection user={user} setUser={setUser} />
      <SocialLinksSection user={user} setUser={setUser} />
    </div>
  );
}
