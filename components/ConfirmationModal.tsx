import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="relative max-w-md w-full mx-auto bg-gray-800 p-6 sm:p-8 rounded-2xl border border-gray-700 shadow-2xl"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
        <div className="text-gray-300 mb-6">
          {children}
        </div>
        <div className="flex justify-end items-center gap-4">
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
