import { UserData } from "./types";

interface VisionPitchProps {
  user: UserData;
  setUser: (user: UserData) => void;
}

export default function VisionPitch({ user, setUser }: VisionPitchProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Vision / Pitch</h3>

      <textarea
        rows={4}
        placeholder="Briefly describe your startup vision or problem you are solving..."
        value={user.vision || ""}
        onChange={(e) => setUser({ ...user, vision: e.target.value })}
        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
      />
    </div>
  );
}
