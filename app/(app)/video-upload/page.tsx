"use client";
import React, { useState } from "react";
//import { useRouter } from "next/navigation";

function VideoUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  //const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file.");
      return;
    }
  
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("originalSize", file.size.toString());
  
    console.log("Form Data Entries:");
    for (const pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }
  
    try {
      const response = await fetch("/api/video-upload", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend error:", errorData);
        alert(`Error: ${errorData.error || "Unknown error occurred"}`);
        return;
      }
  
      const data = await response.json();
      console.log("Upload successful:", data);
      setPreviewUrl(data.secure_url);
      setSuccessMessage("Video uploaded successfully!");
      setFile(null); // Reset the file input
    } catch (error) {
      console.error("Error occurred during upload:", error);
      alert("An error occurred while uploading the video. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };
  

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upload Video</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">
            <span className="label-text">Title</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="textarea textarea-bordered w-full"
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text">Video File</span>
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="file-input file-input-bordered w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Upload Video"}
        </button>
      </form>
      {/* Show Success Message */}
      {successMessage && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded">
          {successMessage}
        </div>
      )}
      {/* Show Video Preview */}
      {previewUrl && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Video Preview</h2>
          <video src={previewUrl} controls className="w-full max-w-lg" />
        </div>
      )}
    </div>
  );
}

export default VideoUpload;
