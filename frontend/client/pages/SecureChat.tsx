import React from "react";

const SecureChat = () => {
  const role = localStorage.getItem("role"); // entrepreneur | developer

  const roleText =
    role === "entrepreneur"
      ? "Chat for Entrepreneurs & Developers"
      : role === "developer"
      ? "Chat for Developers & Entrepreneurs"
      : "Chat Feature";

  const roleEmoji =
    role === "entrepreneur"
      ? "🚀"
      : role === "developer"
      ? "💻"
      : "💬";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-10 text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-skyblue/10 text-4xl">
          {roleEmoji}
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Working on it
        </h1>

        {/* Role based text */}
        <p className="text-base sm:text-lg font-semibold text-skyblue mb-3">
          {roleText}
        </p>

        {/* Description */}
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          This feature is currently under development.
          <br className="hidden sm:block" />
          It will be updated very soon.
        </p>

        {/* Badge */}
        <div className="mt-6">
          <span className="inline-block rounded-full bg-skyblue/10 px-4 py-1.5 text-sm font-medium text-skyblue">
            Coming Soon
          </span>
        </div>
      </div>
    </div>
  );
};

export default SecureChat;
