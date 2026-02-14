import { X } from "lucide-react";
import { Idea } from "./types";

interface AttachmentPreviewModalProps {
  isOpen: boolean;
  idea: Idea | null;
  onClose: () => void;
}

export default function AttachmentPreviewModal({
  isOpen,
  idea,
  onClose,
}: AttachmentPreviewModalProps) {
  if (!isOpen || !idea) return null;

  const files: any[] = idea.attachments?.flat() ?? [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-xl p-6 relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold mb-4">
          Attachments — {idea.title}
        </h2>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          {files.length === 0 ? (
            <p className="text-gray-500 text-center">No attachments available</p>
          ) : (
            files.map((file: any, index: number) => (
              <div
                key={index}
                className="border rounded-lg p-4 flex items-center justify-between gap-4"
              >
                {/* File Info */}
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {file.type} • {file.size}
                  </p>
                </div>

                {/* Image thumbnail */}
                {file.type?.includes("image") && (
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 text-sm bg-skyblue text-white rounded hover:bg-navy transition"
                  >
                    Preview
                  </a>
                  <a
                    href={file.url}
                    download
                    className="px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition"
                  >
                    Download
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
