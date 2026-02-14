import Messages from "../Messages"; // adjust path as needed

export default function MessagesTab() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy mb-2">Messages</h1>
        <p className="text-gray-600">
          Communicate with developers about your projects
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-96 flex flex-col">
        <Messages />
      </div>
    </div>
  );
}
