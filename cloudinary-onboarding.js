/* eslint-disable @typescript-eslint/no-require-imports */
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function run() {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    console.error(
      "Missing Cloudinary credentials. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env.local."
    );
    process.exit(1);
  }

  try {
    const sampleUrl = "https://res.cloudinary.com/demo/image/upload/sample.jpg";
    console.log("Uploading image to Cloudinary...");
    const uploadResult = await cloudinary.uploader.upload(sampleUrl, {
      public_id: "onboarding_sample",
      overwrite: true,
    });

    console.log("Upload Successful!");
    console.log("Secure URL:", uploadResult.secure_url);
    console.log("Public ID:", uploadResult.public_id);

    console.log("\nFetching image metadata...");
    const details = await cloudinary.api.resource(uploadResult.public_id);
    console.log("Width:", details.width);
    console.log("Height:", details.height);
    console.log("Format:", details.format);
    console.log("File Size (bytes):", details.bytes);

    const transformedUrl = cloudinary.url(uploadResult.public_id, {
      secure: true,
      fetch_format: "auto",
      quality: "auto",
    });

    console.log("\nDone! Optimized image URL:");
    console.log(transformedUrl);
  } catch (error) {
    console.error("Error running Cloudinary onboarding:", error);
    process.exit(1);
  }
}

run();
