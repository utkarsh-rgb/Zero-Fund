import { Globe, Upload, Save, Loader2 } from "lucide-react";
import { UserData } from "./types";

interface DeveloperHeaderProps {
  user: UserData;
  setUser: (user: UserData) => void;
  handleSave: () => void;
  isSaving: boolean;
  isUploading: boolean;
  isImageLoading: boolean;
  setIsImageLoading: (loading: boolean) => void;
  handleProfilePicUpload: (file: File) => void;
}

export default function DeveloperHeader({
  user,
  setUser,
  handleSave,
  isSaving,
  isUploading,
  isImageLoading,
  setIsImageLoading,
  handleProfilePicUpload,
}: DeveloperHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Cover Photo */}
      <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600"></div>

      {/* Profile Info */}
      <div className="px-6 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-5 -mt-16 mb-4">
          {/* Profile Picture */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-lg relative">
              {(isUploading || isImageLoading) && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}

              {user?.profile_pic ? (
                <img
                  src={user.profile_pic}
                  alt="Profile"
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    isImageLoading ? "opacity-0" : "opacity-100"
                  }`}
                  onLoad={() => setIsImageLoading(false)}
                  onError={() => setIsImageLoading(false)}
                  onLoadStart={() => setIsImageLoading(true)}
                />
              ) : (
                <div className="w-full h-full bg-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold text-4xl">
                    {user?.fullName?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            <label
              htmlFor="uploadProfile"
              className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-50 shadow-lg"
            >
              <Upload className="w-5 h-5 text-gray-600" />
              <input
                type="file"
                id="uploadProfile"
                hidden
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleProfilePicUpload(e.target.files[0]);
                  }
                }}
              />
            </label>
          </div>

          {/* Name and Location */}
          <div className="flex-1 mt-4 sm:mt-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <input
                  type="text"
                  value={user.fullName || ""}
                  onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                  className="text-2xl font-bold text-gray-900 border-b-2 border-transparent hover:border-blue-600 focus:border-blue-600 focus:outline-none mb-1 bg-transparent"
                />
                <div className="flex items-center text-gray-600 mt-1">
                  <Globe className="w-4 h-4 mr-1" />
                  <input
                    type="text"
                    value={user.location || ""}
                    onChange={(e) => setUser({ ...user, location: e.target.value })}
                    placeholder="Add location"
                    className="border-b border-transparent hover:border-gray-300 focus:border-blue-600 focus:outline-none bg-transparent"
                  />
                </div>
              </div>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full mt-4 sm:mt-0 transition-all ${
                  isSaving
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white`}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save profile</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-4">
          <textarea
            value={user.bio || ""}
            onChange={(e) => setUser({ ...user, bio: e.target.value })}
            rows={3}
            placeholder="Add a bio to tell people about yourself..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>
      </div>
    </div>
  );
}
