import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosLocal from "../api/axiosLocal";

export default function MessagesPage() {
  const navigate = useNavigate();
  const [contracts, setContracts] = useState([]);

  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  useEffect(() => {
    if (!userData?.id) return;

    axiosLocal
      .get(`/messages/chat-list/${userData.id}`)
      .then((res) => {
        setContracts(res.data.contracts);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleRedirect = (contractId: number) => {
    if (userData.userType === "entrepreneur") {
      navigate(`/entrepreneur-dashboard/message/${contractId}`);
    } else {
      navigate(`/developer-dashboard/chat/${contractId}`);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Your Chats</h1>

      {contracts.length === 0 ? (
        <p className="text-gray-500">No active chats yet.</p>
      ) : (
        <div className="space-y-4">
          {contracts.map((contract: any) => (
            <div
              key={contract.id}
              onClick={() => handleRedirect(contract.id)}
              className="p-4 border rounded-lg shadow-sm hover:shadow-md cursor-pointer transition"
            >
              <h2 className="font-semibold">
                Contract #{contract.id}
              </h2>

              <p className="text-sm text-gray-600">
                {contract.project_title}
              </p>

              <p className="text-sm text-blue-600 mt-1">
                {userData.userType === "entrepreneur"
                  ? `Developer: ${contract.developer_name}`
                  : `Entrepreneur: ${contract.entrepreneur_name}`}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
