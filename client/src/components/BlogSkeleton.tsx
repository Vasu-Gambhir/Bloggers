const BlogSkeleton = () => {
  return (
    <div className="p-4 border-b border-slate-200 pb-4 w-screen max-w-screen-md animate-pulse">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-8 h-8 rounded-full bg-slate-300"></div>
        <div className="flex flex-col space-y-2">
          <div className="h-3 w-32 bg-slate-300 rounded"></div>
          <div className="h-3 w-20 bg-slate-300 rounded"></div>
        </div>
      </div>
      <div className="h-5 bg-slate-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-slate-300 rounded w-full mb-1"></div>
      <div className="h-4 bg-slate-300 rounded w-5/6 mb-1"></div>
      <div className="h-3 bg-slate-300 rounded w-24 mt-4"></div>
    </div>
  );
};

export default BlogSkeleton;
