"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { baseURL } from "../../utils/api";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/");
      return;
    }

    setUser(JSON.parse(userData));
    fetchBlogs(token);
  }, [router]);

  const fetchBlogs = async (token) => {
    try {
      const response = await fetch(`${baseURL}/api/blogs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.push("/");
          return;
        }
        throw new Error("Failed to fetch blogs");
      }

      const data = await response.json();
      setBlogs(data);
    } catch (err) {
      setError(err.message || "An error occurred while fetching blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow px-4 py-3 flex justify-between items-center">
        <div className="font-bold text-xl text-purple-600">BLOG DASHBOARD</div>
        <div className="flex items-center space-x-4">
          {user && <div className="text-gray-700">Welcome, {user.name}</div>}
          <button
            onClick={handleLogout}
            className="bg-gray-200 text-gray-800 px-4 py-1 rounded-md text-sm font-medium hover:bg-gray-300"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="flex-grow p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Blogs</h1>
          <p className="text-gray-600">Here are all your blog posts</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        )}

        {!loading && blogs.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            <p>You don't have any blog posts yet.</p>
          </div>
        )}

        {!loading && blogs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative h-48">
                  <Image
                    src={blog.blog_image_url}
                    alt={blog.title}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      e.target.src = "/placeholder-image.jpg";
                      e.target.onerror = null;
                    }}
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-purple-600 font-medium">
                      {blog.category_name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {blog.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-gray-50 border-t border-gray-200 py-4 px-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Blog System. All rights reserved.
      </footer>
    </div>
  );
}
