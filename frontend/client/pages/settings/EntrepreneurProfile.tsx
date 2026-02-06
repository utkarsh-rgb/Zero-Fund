import { Globe, Mail } from "lucide-react";
import { UserData } from "./types";
import ProfileHeader from "./ProfileHeader";
import CompanyInfo from "./CompanyInfo";
import VisionPitch from "./VisionPitch";
import ContactInfo from "./ContactInfo";
import SaveButton from "./SaveButton";

interface EntrepreneurProfileProps {
  user: UserData;
  setUser: (user: UserData) => void;
  handleSave: () => void;
  isSaving: boolean;
}

export default function EntrepreneurProfile({
  user,
  setUser,
  handleSave,
  isSaving,
}: EntrepreneurProfileProps) {
  return (
    <div className="space-y-4">
      <ProfileHeader user={user} setUser={setUser} />
      <CompanyInfo user={user} setUser={setUser} />
      <VisionPitch user={user} setUser={setUser} />
      <ContactInfo user={user} setUser={setUser} />
      <SaveButton handleSave={handleSave} isSaving={isSaving} />
    </div>
  );
}
