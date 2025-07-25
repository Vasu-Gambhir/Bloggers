const FullBlogSkeleton = () => {
  return (
    <div className="animate-pulse px-10 pt-12 max-w-screen-xl mx-auto">
      <div className="grid grid-cols-12 gap-6">
        {/* Main blog section */}
        <div className="col-span-8 space-y-6">
          <div className="h-10 bg-slate-300 rounded w-3/4"></div>
          <div className="h-4 bg-slate-300 rounded w-1/4"></div>

          {/* Simulated long blog content */}
          <div className="space-y-3">
            {Array.from({ length: 10 }).map((_, idx) => (
              <div
                key={idx}
                className={`h-4 rounded bg-slate-300 ${
                  idx % 3 === 0 ? "w-5/6" : idx % 4 === 0 ? "w-4/6" : "w-full"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Author sidebar */}
        <div className="col-span-4 space-y-4">
          <div className="h-5 w-24 bg-slate-300 rounded"></div>
          <div className="flex space-x-4">
            <div className="w-14 h-14 bg-slate-300 rounded-full"></div>
            <div className="space-y-2 flex flex-col justify-center">
              <div className="h-4 w-32 bg-slate-300 rounded"></div>
              <div className="h-3 w-48 bg-slate-300 rounded"></div>
            </div>
          </div>

          {/* Fake bio */}
          <div className="space-y-2 pt-4">
            <div className="h-3 bg-slate-300 w-full rounded"></div>
            <div className="h-3 bg-slate-300 w-5/6 rounded"></div>
            <div className="h-3 bg-slate-300 w-4/6 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullBlogSkeleton;
