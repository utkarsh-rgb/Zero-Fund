const path = require("path");
const fs = require("fs");

const BASE_IMAGE_PATH = "/var/www/storage/images";

/**
 * Save an uploaded file to the VPS local filesystem.
 * Files are stored at: /var/www/storage/images/{userId}/profile_pic_{userId}.<ext>
 * Returns the public URL path (e.g. /images/42/profile_pic_42.jpg)
 */
const uploadToLocal = async (buffer, originalName, mimetype, userId) => {
  const ext = path.extname(originalName);
  const filename = `profile_pic_${userId}${ext}`;
  const dir = `${BASE_IMAGE_PATH}/${userId}`;

  // Create directory if it doesn't exist
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const filePath = `${dir}/${filename}`;

  // Write the buffer to disk
  fs.writeFileSync(filePath, buffer);

  // Return the public URL path (served by express.static in server.js)
  return `/images/${userId}/${filename}`;
};

module.exports = uploadToLocal;
