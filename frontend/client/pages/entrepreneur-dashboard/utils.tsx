import { CheckCircle, Clock, Eye, AlertCircle, Shield, Users } from "lucide-react";
import { Milestone } from "./types";

export const capitalizeWords = (str: string): string =>
  str
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");

export const getStatusColor = (status: string): string => {
  switch (status) {
    case "Published":
    case "Active":
    case "Completed":
      return "bg-green-100 text-green-800";
    case "Draft":
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    case "In Review":
    case "Reviewed":
      return "bg-blue-100 text-blue-800";
    case "Closed":
    case "Terminated":
      return "bg-red-100 text-red-800";
    case "On Hold":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "Published":
    case "Active":
    case "Completed":
      return <CheckCircle className="w-4 h-4" />;
    case "Draft":
    case "Pending":
      return <Clock className="w-4 h-4" />;
    case "In Review":
    case "Reviewed":
      return <Eye className="w-4 h-4" />;
    default:
      return <AlertCircle className="w-4 h-4" />;
  }
};

export const getVisibilityIcon = (visibility: string) => {
  switch (visibility) {
    case "NDA Required":
      return <Shield className="w-4 h-4 text-orange-600" />;
    case "Invite Only":
      return <Users className="w-4 h-4 text-blue-600" />;
    default:
      return <Eye className="w-4 h-4 text-green-600" />;
  }
};

export const calculateProgress = (milestones: Milestone[] | null): number => {
  if (!milestones || milestones.length === 0) return 0;
  const completed = milestones.filter((m) => m.completed).length;
  return Math.round((completed / milestones.length) * 100);
};
