import { createContext, useContext, useState } from "react";

interface BlogContextType {
  blogCache: Record<string, any>;
  setBlogInCache: (id: string, blog: any) => void;
  removeBlogFromCache: (id: string) => void;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const BlogProvider = ({ children }: { children: React.ReactNode }) => {
  const [blogCache, setBlogCache] = useState<Record<string, any>>({});

  const setBlogInCache = (id: string, blog: any) => {
    setBlogCache((prev) => ({ ...prev, [id]: blog }));
  };

  const removeBlogFromCache = (id: string) => {
    setBlogCache((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  return (
    <BlogContext.Provider
      value={{ blogCache, setBlogInCache, removeBlogFromCache }}
    >
      {children}
    </BlogContext.Provider>
  );
};

export const useBlogContext = () => {
  const context = useContext(BlogContext);
  if (!context)
    throw new Error("useBlogContext must be used within a BlogProvider");
  return context;
};
