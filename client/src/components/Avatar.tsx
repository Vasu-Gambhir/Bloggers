const Avatar = ({
  authorName,
  size = "small",
}: {
  authorName: string;
  size?: "big" | "small";
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center ${
        size === "big" ? "w-10 h-10" : "w-6 h-6"
      } overflow-hidden rounded-full bg-gray-600`}
    >
      <span
        className={`font-extralight ${
          size === "small" ? "text-xs" : "text-md"
        } text-gray-300`}
      >
        {authorName[0].toUpperCase()}
      </span>
    </div>
  );
};

export default Avatar;
