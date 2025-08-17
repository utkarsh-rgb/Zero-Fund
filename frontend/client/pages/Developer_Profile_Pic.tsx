import { useState, useRef } from "react";
import axios from "axios";
import { Camera, User } from "lucide-react";

interface DeveloperProfilePicProps {
  currentPicture?: string;
  userId: string;
  onPictureUpdate: (newPictureUrl: string) => void;
}

const DeveloperProfilePic: React.FC<DeveloperProfilePicProps> = ({
  currentPicture,
  userId,
  onPictureUpdate
}) => {
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [profilePicture, setProfilePicture] = useState<string>(currentPicture || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle profile picture upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('File size must be less than 5MB');
      return;
    }

    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append('profilePicture', file);
      formData.append('userId', userId);

      const response = await axios.post(
        'http://localhost:5000/upload-profile-picture',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );

      // Update the profile picture URL in state
      const newPictureUrl = response.data.profilePictureUrl;
      setProfilePicture(newPictureUrl);
      onPictureUpdate(newPictureUrl);
      alert('Profile picture updated successfully!');
    } catch (error: any) {
      console.error('Failed to upload profile picture:', error);
      alert(error.response?.data?.message || 'Failed to upload profile picture');
    } finally {
      setUploadingImage(false);
      // Clear the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemovePicture = () => {
    setProfilePicture('');
    onPictureUpdate('');
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageError = () => {
    setProfilePicture('');
    onPictureUpdate('');
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Profile Picture</h3>
      <div className="flex items-center gap-6">
        {/* Profile Picture Display */}
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border-2 border-gray-300">
            {profilePicture ? (
              <img
                src={profilePicture}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            ) : (
              <User size={48} className="text-gray-400" />
            )}
          </div>
          
          {/* Upload button overlay */}
          <button
            onClick={handleCameraClick}
            disabled={uploadingImage}
            className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 disabled:cursor-not-allowed"
            title="Change profile picture"
          >
            <Camera size={24} className="text-white" />
          </button>
        </div>

        {/* Upload Controls */}
        <div className="flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleImageUpload}
            className="hidden"
          />
          <div className="space-y-3">
            <div className="space-y-2">
              <button
                onClick={handleCameraClick}
                disabled={uploadingImage}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 border border-blue-200"
              >
                <Camera size={16} />
                {uploadingImage ? "Uploading..." : "Change Picture"}
              </button>
              
              {profilePicture && !uploadingImage && (
                <button
                  onClick={handleRemovePicture}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors duration-200 border border-red-200"
                >
                  Remove Picture
                </button>
              )}
            </div>
            
            <div className="text-sm text-gray-600 space-y-1">
              <p>Upload a profile picture</p>
              <p className="text-xs text-gray-500">
                Supported: JPEG, PNG, WebP • Max size: 5MB
              </p>
            </div>
            
            {uploadingImage && (
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                Uploading...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperProfilePic;