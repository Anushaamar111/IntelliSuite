export interface Video {
  id: string;
  title: string;
  description: string;
  publicId: string;
  originalSize: number;
  compressedSize: number;
  duration: number;
  UploadedAt: Date;
  updatedAt: Date;
  userId: string;
}