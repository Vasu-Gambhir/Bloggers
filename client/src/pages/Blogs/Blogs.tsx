import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowDownZA, ArrowDownAZ } from "lucide-react";

import Appbar from "../../components/Appbar";
import BlogCard from "../../components/BlogCard";
import BlogSkeleton from "../../components/BlogSkeleton";
import { useBlogs } from "../../hooks";
import { formatDate } from "../../config";

const SORT_KEY = "sortPreference";

const Blogs = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const sortParam =
    searchParams.get("sort") || localStorage.getItem(SORT_KEY) || "newest";
  const [sort, setSort] = useState<"newest" | "oldest">(
    sortParam === "oldest" ? "oldest" : "newest"
  );

  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const [page, setPage] = useState(isNaN(pageParam) ? 1 : pageParam);

  const { loading, blogs, totalPages } = useBlogs({ sort, page });

  // Sync URL & localStorage when sort or page changes
  useEffect(() => {
    setSearchParams({ sort, page: page.toString() });
    localStorage.setItem(SORT_KEY, sort);
  }, [sort, page]);

  // Reset to page 1 when sort changes
  useEffect(() => {
    setPage(1);
  }, [sort]);

  // Scroll to top on sort or page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [sort, page]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Appbar />

      <div className="max-w-screen-lg mx-auto pt-10 px-4">
        {/* Sort Control */}
        <div className="flex justify-end items-center mb-6">
          <label className="text-sm text-slate-600 mr-2">Sort by:</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as "newest" | "oldest")}
            className="text-sm px-3 py-1 cursor-pointer border rounded-md shadow-sm bg-white text-slate-700 focus:outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
          {sort === "newest" ? (
            <ArrowDownZA className="ml-2 text-slate-500" size={18} />
          ) : (
            <ArrowDownAZ className="ml-2 text-slate-500" size={18} />
          )}
        </div>

        {/* Blog Cards */}
        {loading
          ? Array.from({ length: 5 }).map((_, idx) => (
              <BlogSkeleton key={idx} />
            ))
          : blogs.map((blog) => (
              <BlogCard
                key={blog.id}
                id={blog.id}
                title={blog.title}
                content={blog.content}
                authorId={blog.author.id || ""}
                authorName={blog.author.name || "Anonymous"}
                publishedDate={formatDate({ isoDate: blog.postedDate })}
                published={blog.published === "true"}
              />
            ))}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6 flex-wrap mb-8">
          <button
            onClick={() => setPage((prev) => prev - 1)}
            disabled={page === 1}
            className="px-3 py-1 text-sm border rounded cursor-pointer disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, idx) => {
            const pg = idx + 1;
            return (
              <button
                key={pg}
                onClick={() => setPage(pg)}
                className={`px-3 py-1 text-sm border rounded cursor-pointer ${
                  pg === page
                    ? "bg-slate-800 text-white"
                    : "bg-white text-slate-700"
                }`}
              >
                {pg}
              </button>
            );
          })}

          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={page === totalPages}
            className="px-3 py-1 text-sm border rounded cursor-pointer disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Blogs;
