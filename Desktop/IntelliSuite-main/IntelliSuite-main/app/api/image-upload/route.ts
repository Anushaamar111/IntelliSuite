import { NextRequest, NextResponse } from "next/server";
// Import Next.js server-related modules to handle requests and responses.

import { v2 as cloudinary } from "cloudinary";
// Import Cloudinary's version 2 API for managing media uploads.

import { auth } from "@clerk/nextjs/server";
// Import Clerk's server-side authentication helper to verify the user.

import dotenv from "dotenv";

dotenv.config();

// Configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, // Cloudinary cloud name from environment variables.
  api_key: process.env.CLOUDINARY_API_KEY, // Cloudinary API key from environment variables.
  api_secret: process.env.CLOUDINARY_API_SECRET, // Cloudinary API secret for secure API calls.
});

interface CloudinaryUploadResult {
  public_id: string; // The unique identifier assigned by Cloudinary to the uploaded asset.
  [key: string]: unknown; // Allow additional properties returned by Cloudinary to be captured.
}

// Handle the POST request for uploading an image.
export async function POST(request: NextRequest) {
  const { userId } = await auth();
  // Get the authenticated user ID using Clerk's authentication method.

  if (!userId) {
    // If no user is authenticated, return a 401 Unauthorized response.
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    // Parse the incoming request to extract form data (expected to include a file).

    const file = formData.get("file") as File | null;
    // Get the "file" field from the form data and cast it to a `File` object if available.

    if (!file) {
      // If the "file" field is missing, return a 400 Bad Request response.
      return NextResponse.json({ error: "File not found" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    // Convert the file to an ArrayBuffer for processing.

    const buffer = Buffer.from(bytes);
    // Create a Node.js buffer from the ArrayBuffer for compatibility with Cloudinary's uploader.

    const result = await new Promise<CloudinaryUploadResult>(
      // Use a Promise to handle Cloudinary's upload stream.
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "next-cloudinary-uploads" },
          // Specify the folder in the Cloudinary account where the file should be uploaded.
          (error, result) => {
            if (error) reject(error);
            // Reject the Promise if there's an error during the upload.
            else resolve(result as CloudinaryUploadResult);
            // Resolve the Promise with the upload result if successful.
          }
        );
        uploadStream.end(buffer);
        // End the stream and pass the file buffer to the upload process.
      }
    );

    // Respond with the public ID of the uploaded file on successful upload.
    return NextResponse.json(
      {
        publicId: result.public_id,
        // Include the unique Cloudinary identifier for the uploaded file in the response.
      },
      {
        status: 200, // Set the response status to 200 OK.
      }
    );
  } catch (error) {
    // Catch any errors during the process.
    console.log("Upload image failed", error);
    // Log the error for debugging purposes.

    // Return a 500 Internal Server Error response with an error message.
    return NextResponse.json({ error: "Upload image failed" }, { status: 500 });
  }
}
