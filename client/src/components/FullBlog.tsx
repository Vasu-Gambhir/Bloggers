import { formatDate } from "../config";
import type { Blog } from "../hooks";
import Avatar from "./Avatar";

const FullBlog = ({ blog }: { blog: Blog }) => {
  return (
    <div>
      <div className="flex justify-center">
        <div className="grid grid-cols-12 px-10 w-full pt-12 max-w-screen-xl">
          <div className="col-span-8 shadow-sm p-6 mr-4 rounded-xl mb-8">
            <div className="text-3xl font-extrabold">{blog?.title}</div>
            <div className="text-slate-500 pt-2">
              {formatDate({ isoDate: blog.postedDate })}
            </div>
            <div className="pt-4">{blog?.content}</div>
          </div>
          <div className="col-span-4">
            <div className="shadow-sm p-6 rounded-xl">
              <span className="font-semibold text-lg text-slate-600">
                Author
              </span>
              <div className="flex">
                <div className="pr-4 flex flex-col justify-center">
                  <Avatar
                    authorName={blog.author.name || "Anonymous"}
                    size={"big"}
                  />
                </div>
                <div>
                  <div className="text-xl font-bold">
                    {blog?.author?.name || "Anonymous"}
                  </div>
                  <div className="pt-2 text-slate-500">
                    Random catch phrase about the author's ability to grab the
                    user's attention
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullBlog;
