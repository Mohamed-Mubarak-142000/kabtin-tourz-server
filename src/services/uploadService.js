const cloudinary = require('../config/cloudinary');

// Uploads a single in-memory file buffer to Cloudinary via upload_stream.
function uploadBuffer(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'kabtin-brez', resource_type: 'image', ...options },
      (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      }
    );
    stream.end(buffer);
  });
}

// Uploads multiple files (from multer memory storage) in parallel and
// returns the array of secure Cloudinary URLs.
async function uploadImages(files) {
  const results = await Promise.all(files.map((file) => uploadBuffer(file.buffer)));
  return results.map((r) => r.secure_url);
}

module.exports = { uploadBuffer, uploadImages };
