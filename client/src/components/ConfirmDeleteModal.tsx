import { useDeleteBlog } from "../hooks";

const ConfirmDeleteModal = ({
  id,
  onClose,
}: {
  id: string;
  onClose: () => void;
}) => {
  const { deleteBlog, loading } = useDeleteBlog(onClose);

  return (
    <>
      {/* Blurry overlay */}
      <div
        className="fixed inset-0 backdrop-blur-sm bg-black/10 z-40"
        onClick={onClose}
      />

      {/* Modal container */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
          className="bg-white p-6 rounded-xl shadow-lg w-80"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-lg font-semibold mb-4">
            Are you sure you want to delete this blog?
          </h3>
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-md text-sm cursor-pointer"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={() => deleteBlog(id)}
              className="px-4 py-2 bg-red-600 text-white rounded-md text-sm cursor-pointer"
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmDeleteModal;
