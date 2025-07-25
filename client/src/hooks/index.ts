import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { base_url } from "../config";
import { useNavigate } from "react-router-dom";
import { useBlogContext } from "../context/blogContext";

export interface Blog {
  title: string;
  content: string;
  author: { name: string; id: string };
  id: string;
  postedDate: string;
  published: string;
}

export interface BlogDataType {
  title: string;
  content: string;
}

export interface EditBlog {
  id: string;
  title: string;
  content: string;
  published: boolean;
}

export const useBlog = ({ id }: { id: string }) => {
  const { blogCache, setBlogInCache } = useBlogContext();

  const [blog, setBlog] = useState(blogCache[id] || null);
  const [loading, setLoading] = useState(!blogCache[id]);

  useEffect(() => {
    if (!id || blogCache[id]) return;

    setLoading(true);
    axios
      .get(`${base_url}/blogs/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        const fetchedBlog = res.data.blogById;
        setBlogInCache(id, fetchedBlog);
        setBlog(fetchedBlog);
      })
      .catch(() => {
        toast.error("Failed to fetch blog");
      })
      .finally(() => setLoading(false));
  }, [id]);

  return { blog, loading };
};

// hooks/useBlogs.ts

export const useBlogs = ({
  sort,
  page = 1,
}: {
  sort: "newest" | "oldest";
  page?: number;
}) => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${base_url}/blogs`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
        params: {
          sort,
          page,
          limit: 5,
        },
      });

      if (response.status !== 200) {
        toast.error("Error In fetching blogs");
        return;
      }

      setBlogs(response.data.blogs);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.log(error);
      toast.error("Error while fetching all blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [sort, page]);

  return { loading, blogs, totalPages };
};

export const useCreateBlog = (resetFields: () => void) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const createBlog = async (blogData: BlogDataType) => {
    if (!blogData.title || !blogData.content) {
      toast.warn("Title and content both are required");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${base_url}/blogs`, blogData, {
        headers: {
          Authorization: localStorage.getItem("token") || "",
        },
      });

      toast.success("Blog posted successfully!");
      resetFields();
      navigate(`/blogs/${response.data.id}`);
    } catch (error) {
      console.error(error);
      toast.error("Error in posting new Blog");
    } finally {
      setLoading(false);
    }
  };
  return { createBlog, loading };
};

export const useDeleteBlog = (onClose: () => void) => {
  const { removeBlogFromCache } = useBlogContext();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const deleteBlog = async (id: string) => {
    try {
      setLoading(true);
      const res = await axios.delete(`${base_url}/blogs/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token") || "",
        },
      });
      toast.success(res.data.message);
      onClose();
      removeBlogFromCache(id);
      navigate(0); // Reload current page
    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data?.message || "Error deleting blog");
    } finally {
      setLoading(false);
    }
  };

  return { deleteBlog, loading };
};

export const useEditBlog = (onSuccess: () => void) => {
  const { setBlogInCache } = useBlogContext();

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const editBlog = async (data: EditBlog) => {
    try {
      setLoading(true);
      const res = await axios.put(`${base_url}/blogs`, data, {
        headers: {
          Authorization: localStorage.getItem("token") || "",
        },
      });
      if (res.status !== 200) {
      }
      toast.success(res.data.message || "Blog updated!");
      onSuccess();
      setBlogInCache(data.id, res.data.blogToBeUpdated);
      navigate(`/blogs/${data.id}`);
    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return { editBlog, loading };
};
