import { useParams } from "react-router-dom";
import FullBlog from "../../components/FullBlog";
import FullBlogSkeleton from "../../components/FullBlogSkeleton";
import { useBlog } from "../../hooks";
import Appbar from "../../components/Appbar";

const Blog = () => {
  const { id } = useParams();
  const { blog, loading } = useBlog({ id: id || "" });

  return (
    <div>
      <Appbar />
      {loading || !blog ? <FullBlogSkeleton /> : <FullBlog blog={blog} />}
    </div>
  );
};

export default Blog;
