import { useState, type ChangeEvent } from "react";
import Appbar from "../../components/Appbar";
import Textarea from "../../components/Textarea";
import { useCreateBlog, useEditBlog, type BlogDataType } from "../../hooks";
import { useLocation, useParams } from "react-router-dom";

const defaultBlogData = {
  title: "",
  content: "",
};

export const Publish = () => {
  const { id } = useParams();
  const location = useLocation();
  const blogFromState = location.state?.blog;

  const isEditMode = !!id;

  const [blogData, setBlogData] = useState<BlogDataType>(
    blogFromState || defaultBlogData
  );
  const resetFields = () => setBlogData(defaultBlogData);

  const { createBlog, loading: creating } = useCreateBlog(resetFields);
  const { editBlog, loading: editing } = useEditBlog(resetFields);

  const handleSubmit = () => {
    if (isEditMode && id) {
      editBlog({
        ...blogData,
        id,
        published: true, // or use `blogFromState.published` if available
      });
    } else {
      createBlog(blogData);
    }
  };
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setBlogData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const loading = creating || editing;

  return (
    <div>
      <Appbar buttonVisible={false} />
      <div className="flex justify-center w-full pt-8">
        <div className="flex flex-col w-full max-w-screen-lg">
          <div className="w-full mb-8">
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
              placeholder="Title"
              required
              name="title"
              value={blogData.title}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          <div className="w-full">
            <Textarea
              onClick={handleSubmit}
              onChange={handleChange}
              value={blogData.content}
              disabled={loading}
              isEditMode={isEditMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
