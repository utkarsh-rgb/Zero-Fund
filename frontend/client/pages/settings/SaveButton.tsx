interface SaveButtonProps {
  handleSave: () => void;
  isSaving: boolean;
}

export default function SaveButton({ handleSave, isSaving }: SaveButtonProps) {
  return (
    <div className="flex justify-end">
      <button
        onClick={handleSave}
        disabled={isSaving}
        className={`px-6 py-2 rounded-full text-white transition ${
          isSaving ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isSaving ? "Saving..." : "Save Profile"}
      </button>
    </div>
  );
}
