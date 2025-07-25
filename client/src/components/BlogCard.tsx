import { Link, useNavigate } from "react-router-dom";
import Avatar from "./Avatar";
import { Pencil, Trash2 } from "lucide-react"; // Using lucide-react icons
import ConfirmDeleteModal from "./ConfirmDeleteModal"; // You'll create this
import { useState } from "react";
import { useAuth } from "../context/authContext";

interface BlogCardProps {
  id: string;
  authorName: string;
  authorId: string;
  title: string;
  content: string;
  publishedDate: string;
  published: boolean;
}

const BlogCard = ({
  id,
  authorName,
  authorId,
  title,
  content,
  publishedDate,
  published,
}: BlogCardProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="relative p-6 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition duration-300 w-full max-w-screen-lg mx-auto mb-6">
      <Link to={`/blogs/${id}`} className="block group">
        <div className="flex items-center space-x-3">
          <Avatar authorName={authorName} />
          <div className="text-sm text-slate-600 font-medium">{authorName}</div>
          <Circle />
          <div className="text-xs text-slate-400">{publishedDate}</div>
        </div>

        <h2 className="text-xl font-bold text-slate-800 mt-3 group-hover:underline">
          {title}
        </h2>

        <p className="text-sm text-slate-600 mt-1 line-clamp-3">
          {content.slice(0, 150)}...
        </p>

        <div className="text-xs text-slate-400 mt-3">{`${Math.ceil(
          content.length / 100
        )} min read`}</div>
      </Link>

      {authorId === user?.id && (
        <div className="absolute top-4 right-4 flex space-x-3">
          <Pencil
            size={20}
            className="text-blue-600 cursor-pointer hover:text-blue-800 transition"
            onClick={() =>
              navigate(`/publish/${id}`, {
                state: { blog: { id, title, content, published } },
              })
            }
          />
          <Trash2
            size={20}
            className="text-red-600 cursor-pointer hover:text-red-800 transition"
            onClick={() => setModalOpen(true)}
          />
        </div>
      )}

      {modalOpen && (
        <ConfirmDeleteModal id={id} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
};

const Circle = () => (
  <div className="h-1.5 w-1.5 rounded-full bg-slate-400 mx-2" />
);

export default BlogCard;
