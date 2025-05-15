import { useState, useEffect, useCallback } from "react";

export default function BlogCarousel({ blogs = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const featuredBlogs = blogs.slice(0, 3);

  const goToNext = useCallback(() => {
    if (isAnimating || featuredBlogs.length <= 1) return;

    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredBlogs.length);

    setTimeout(() => {
      setIsAnimating(false);
    }, 400);
  }, [isAnimating, featuredBlogs.length]);

  const goToPrev = useCallback(() => {
    if (isAnimating || featuredBlogs.length <= 1) return;

    setIsAnimating(true);
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + featuredBlogs.length) % featuredBlogs.length
    );

    setTimeout(() => {
      setIsAnimating(false);
    }, 400); 
  }, [isAnimating, featuredBlogs.length]);

  useEffect(() => {
    if (featuredBlogs.length <= 1) return;

    const interval = setInterval(() => {
      goToNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [goToNext, featuredBlogs.length]);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      goToNext();
    }

    if (touchStart - touchEnd < -75) {
      goToPrev();
    }
  };

  if (blogs.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-50">
        <p className="text-gray-500">Loading blogs...</p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden mb-16">
      <div
        className="relative overflow-hidden h-96 md:h-screen max-h-[600px] w-full"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex h-full transition-transform duration-400 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {featuredBlogs.map((blog, index) => (
            <div
              key={blog._id || index}
              className="w-full h-full flex-shrink-0 relative"
              style={{
                backgroundImage: `url(${
                  blog.blog_image_url || "/placeholder-image.jpg"
                })`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 text-white z-10">
                <div className="max-w-3xl">
                  <div className="uppercase text-sm font-semibold mb-2 tracking-wider text-purple-300">
                    {blog.category_name || "Featured"}
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold mb-4">
                    {blog.title || "Untitled Blog Post"}
                  </h2>
                  <p className="text-base md:text-lg mb-6 line-clamp-2 text-gray-100">
                    {blog.content || "No content available"}
                  </p>
                  <div className="flex items-center space-x-2 text-sm">
                    <span>
                      {blog.createdAt
                        ? new Date(blog.createdAt).toLocaleDateString()
                        : "Recent post"}
                    </span>
                    <span>•</span>
                    <span>{blog.author || "Anonymous"}</span>

                    <button className="ml-4 bg-purple-600 text-white py-2 px-6 rounded-md hover:bg-purple-700 transition-colors">
                      Read More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {featuredBlogs.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex justify-center space-x-3 z-10">
          {featuredBlogs.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                if (!isAnimating) {
                  setIsAnimating(true);
                  setCurrentIndex(i);
                  setTimeout(() => setIsAnimating(false), 400);
                }
              }}
              className={`h-3 rounded-full transition-all ${
                i === currentIndex
                  ? "bg-white w-8"
                  : "bg-white bg-opacity-60 w-3"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
