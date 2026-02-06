import { MessageCircle } from "lucide-react";

export default function MessagesTab() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy mb-2">Messages</h1>
        <p className="text-gray-600">
          Communicate with founders and manage your collaborations
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-96 flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Messages Yet</h3>
          <p className="text-gray-500">
            Start applying to projects to begin conversations with founders
          </p>
        </div>
      </div>
    </div>
  );
}
