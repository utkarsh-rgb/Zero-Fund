import { Send, CheckCircle, XCircle, Clock } from "lucide-react";

export function StatusBadge({
  status,
}: {
  status: "Submitted" | "Accepted" | "Rejected" | "Under Review";
}) {
  const colors = {
    Submitted: "bg-blue-100 text-blue-800",
    Accepted: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800",
    "Under Review": "bg-yellow-100 text-yellow-800",
  };

  const icons = {
    Submitted: <Send className="w-3 h-3" />,
    Accepted: <CheckCircle className="w-3 h-3" />,
    Rejected: <XCircle className="w-3 h-3" />,
    "Under Review": <Clock className="w-3 h-3" />,
  };

  return (
    <span
      className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full ${colors[status]}`}
    >
      {icons[status]}
      <span>{status}</span>
    </span>
  );
}

export function StageBadge({ stage }: { stage: "Idea" | "MVP" | "Beta" }) {
  const colors = {
    Idea: "bg-purple-100 text-purple-800",
    MVP: "bg-blue-100 text-blue-800",
    Beta: "bg-green-100 text-green-800",
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[stage]}`}>
      {stage}
    </span>
  );
}
