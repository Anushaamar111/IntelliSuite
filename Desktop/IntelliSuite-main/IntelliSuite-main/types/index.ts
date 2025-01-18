export interface Video {
  id: number;
  title: string;
  description: string | null;
  publicId: string;
  originalSize: string;
  compressedSize: string;
  duration: number;
  UploadedAt: Date;
  updatedAt: Date;
  userId: string | null;
  url: string; 
}
