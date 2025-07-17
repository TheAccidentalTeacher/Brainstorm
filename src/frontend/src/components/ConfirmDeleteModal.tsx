import { useState } from 'react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemType: 'note' | 'task' | 'project' | 'file';
  itemName: string;
  loading?: boolean;
}

export default function ConfirmDeleteModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  itemType, 
  itemName,
  loading = false 
}: ConfirmDeleteModalProps) {
  const [confirmText, setConfirmText] = useState('');
  const requiredText = `delete ${itemType}`;
  const isConfirmed = confirmText.toLowerCase() === requiredText;

  const handleConfirm = () => {
    if (isConfirmed) {
      onConfirm();
    }
  };

  const handleClose = () => {
    setConfirmText('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-full border-2 border-red-200">
        <div className="text-center mb-4">
          <div className="text-6xl mb-2">⚠️</div>
          <h3 className="text-xl font-bold text-red-600 mb-2">
            ARE YOU ABSOLUTELY SURE?
          </h3>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800 font-medium mb-2">
            You are about to permanently delete:
          </p>
          <p className="text-red-900 font-bold bg-red-100 p-2 rounded border-l-4 border-red-500">
            "{itemName}"
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <p className="text-yellow-800 text-sm">
            <strong>⚠️ WARNING:</strong> This action is <strong>IRREVERSIBLE</strong>. 
            Your {itemType} will be permanently deleted from the cloud database. 
            There is no undo, no recovery, no "oops I didn't mean to" - it's gone forever!
          </p>
        </div>

        <div className="mb-4">
          <p className="text-gray-700 text-sm mb-2">
            If you're really sure you want to delete this {itemType}, type{' '}
            <code className="bg-gray-100 px-1 py-0.5 rounded text-red-600 font-mono font-bold">
              {requiredText}
            </code>{' '}
            below:
          </p>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={`Type "${requiredText}" to confirm...`}
            className={`w-full border-2 rounded-lg px-3 py-2 focus:outline-none font-mono ${
              confirmText && !isConfirmed 
                ? 'border-red-300 bg-red-50' 
                : isConfirmed 
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-300'
            }`}
            disabled={loading}
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={handleClose}
            disabled={loading}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
          >
            Cancel (Smart Choice!)
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isConfirmed || loading}
            className={`px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${
              isConfirmed 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Deleting...
              </>
            ) : (
              `Yes, Delete ${itemType.charAt(0).toUpperCase() + itemType.slice(1)} Forever`
            )}
          </button>
        </div>

        <div className="mt-4 text-center text-xs text-gray-500">
          💡 Tip: You can also press Escape to cancel
        </div>
      </div>
    </div>
  );
}

// Hook for keyboard shortcuts
export function useConfirmDeleteModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<{
    id: string;
    name: string;
    type: 'note' | 'task' | 'project' | 'file';
    callback: () => void;
  } | null>(null);

  const showDeleteConfirm = (
    id: string, 
    name: string, 
    type: 'note' | 'task' | 'project' | 'file', 
    callback: () => void
  ) => {
    setPendingDelete({ id, name, type, callback });
    setIsOpen(true);
  };

  const handleConfirm = () => {
    if (pendingDelete) {
      pendingDelete.callback();
      setPendingDelete(null);
      setIsOpen(false);
    }
  };

  const handleClose = () => {
    setPendingDelete(null);
    setIsOpen(false);
  };

  return {
    isOpen,
    pendingDelete,
    showDeleteConfirm,
    handleConfirm,
    handleClose,
  };
}
