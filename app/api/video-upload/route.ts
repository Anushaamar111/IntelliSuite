import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const CLOUDINARY_FOLDER = "next-video-uploads";
const CLOUDINARY_TRANSFORMATION = [{ quality: "auto", fetch_format: "mp4" }];

interface CloudinaryUploadResult {
  public_id: string;
  bytes: number;
  duration?: number;
  secure_url: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const originalSize = formData.get("originalSize") as string;

    // Validate required fields
    if (!file || !title || !description || !originalSize) {
      return NextResponse.json(
        { error: "Missing required fields: file, title, description, or original size." },
        { status: 400 }
      );
    }

    // Convert file to buffer for upload
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Cloudinary
    const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "video",
          folder: CLOUDINARY_FOLDER,
          transformation: CLOUDINARY_TRANSFORMATION,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result as CloudinaryUploadResult);
          }
        }
      );
      uploadStream.end(buffer);
    });

    if (!result || !result.public_id) {
      throw new Error("Cloudinary upload failed: missing public_id.");
    }

    // Save metadata to database
    const video = await prisma.video.create({
      data: {
        title,
        description,
        publicId: result.public_id,
        originalSize,
        compressedSize: String(result.bytes),
        duration: result.duration || 0,
        userId,

      },
    });

    return NextResponse.json(video);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Upload video failed:", error.message, error.stack);

    // Handle specific Prisma errors
    if (error.name === "PrismaClientKnownRequestError") {
      return NextResponse.json(
        { error: "Database operation failed: " + error.message },
        { status: 500 }
      );
    }

    // General error response
    return NextResponse.json({ error: "Upload video failed" }, { status: 500 });
  } finally {
    // Ensure Prisma client disconnects to prevent connection pool issues
    await prisma.$disconnect();
  }
}
