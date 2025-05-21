import React, { useState, useEffect } from "react";
import { HelpCircle, XCircle, Send } from "lucide-react";

interface EditableQuestionProps {
  value: string;
  isEditing: boolean;
  onEditCancel: () => void;
  onSend: (newVal: string) => void;
}

const EditableQuestion: React.FC<EditableQuestionProps> = ({
  value,
  isEditing,
  onEditCancel,
  onSend: onSave,
}) => {
  const [tempValue, setTempValue] = useState(value);

  useEffect(() => {
    setTempValue(value); // reset on external change
  }, [value]);

  return (
    <div className="mb-4">
      <div className="flex items-center gap-1 font-medium mb-2">
        <HelpCircle className="h-4 w-4 text-blue-500" />
        <span>Question</span>
      </div>

      {isEditing ? (
        <>
          <textarea
            className="w-full rounded-md border border-gray-300 bg-white p-2 text-xs text-gray-800 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            rows={3}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
          />
          <div className="mt-2 flex justify-end gap-2">
            <button
              onClick={onEditCancel}
              className="flex items-center gap-1 rounded-md px-3 py-1 text-xs text-gray-500 hover:text-red-500 dark:hover:text-red-400"
            >
              Cancel
              <XCircle className="h-4 w-4" />
            </button>
            <button
              onClick={() => onSave(tempValue)}
              className="flex items-center gap-1 rounded-md bg-blue-500 px-3 py-1 text-xs text-white hover:bg-blue-600"
            >
              Send
              <Send className="h-4 w-4" />
            </button>
          </div>
        </>
      ) : (
        <div className="rounded-md bg-gray-100 dark:bg-gray-800 p-3 max-h-40 overflow-y-auto">
          <p className="text-xs leading-snug break-words">{value}</p>
        </div>
      )}
    </div>
  );
};

export default EditableQuestion;
