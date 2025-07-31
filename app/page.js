"use client";
import { useEffect, useState } from "react";
import { auth, db } from "firebase.config";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function HomePage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [postContent, setPostContent] = useState("");

  const [posts, setPosts] = useState([]);

  const router = useRouter();

  // Getting Logged in User!
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } else {
        // Not logged in, redirect to login
        router.push("/login");
      }
      setLoading(false);
    });
    return () => unsubscribe(); // Cleanup
  }, []);

  // Creating Post(Tab) in FireStore Database with new collection!
  const createPost = async () => {
    if (!postContent.trim()) return toast.warn("Post content cannot be empty");
    try {
      const postRef = await addDoc(collection(db, "posts"), {
        content: postContent,
        createdBy: userData.name,
        createdByUid: auth.currentUser.uid,
        createdAt: serverTimestamp(),
        likes: [],
      });

      setPostContent(""); // Clear Input
    } catch (error) {
      console.error("Error creating post:", error.message);
    }
  };

  // Deleting the Post!
  const deletePost = async (postId) => {
    const user = auth.currentUser;
    if (!user) return alert("You must be logged in to delete post");
    try {
      const postRef = doc(db, "posts", postId);
      const postSnap = await getDoc(postRef);

      if (!postSnap.exists()) {
        return alert("Post not found");
      }
      const postData = postSnap.data();

      //  First check if the user is allowed to delete
      if (postData.createdByUid !== user.uid) {
        return toast.error("You can only delete your own posts");
      }

      // Now show confirmation only to the correct user
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this post?"
      );
      if (!confirmDelete) return;

      await deleteDoc(postRef);
      toast.success("Post deleted successfully");
    } catch (error) {
      console.error(error.message);
    }
  };

  // Getting Posts data from Firestore!
  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      // onSnapshot is a Real time listener
      const fetchedPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(fetchedPosts);
    });

    return () => unsubscribe();
  }, []);

  // Handling the like post!
  const handleLike = async (postId, currentLikes = []) => {
    const user = auth.currentUser;
    // if (!user) return alert("Please log in to like posts");

    const postRef = doc(db, "posts", postId);
    const hasLiked = currentLikes.includes(user.uid);

    const updatedLikes = hasLiked
      ? currentLikes.filter((uid) => uid !== user.uid) // remove like
      : [...currentLikes, user.uid]; // add like

    try {
      await updateDoc(postRef, {
        likes: updatedLikes,
      });
    } catch (error) {
      console.error("Failed to toggle like:", error.message);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  // JSX ------------------------------
  return (
    <main className="flex justify-center items-start min-h-screen bg-opacity-40">
      <div className="bg-white p-4 rounded-xl shadow-lg w-full max-w-xl">
        <div className="display flex justify-between">
          <h2 className="text-2xl font-semibold mb-2 text-gray-700">
            Welcome, {userData.name}!
          </h2>
          <p className="text-2xl cursor-pointer">📤</p>
        </div>
        <div className="flex mb-4">
          <Image
            src="/dave.jpg"
            alt="user"
            width={50}
            height={50}
            className="rounded-full object-cover mr-3  "
          />
          <input
            type="text"
            placeholder="What's happening?"
            className="text-gray-700 w-full px-2 outline-none"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
          />
        </div>
        <div className="flex items-end justify-end">
          <button
            className="bg-gray-700 px-4 py-1 cursor-pointer text-white rounded-md"
            onClick={createPost}
          >
            Post
          </button>
        </div>
        <div className="border-t border-gray-300 my-4"></div>

        {/* 2nd PART! */}
        <div className="mt-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-gray-100 p-4 rounded-lg mb-4 shadow"
            >
              <div className="flex justify-between items-center">
                <p className="text-gray-800 mb-2">{post.content}</p>
                <button
                  className="text-red-600 text-[18px] cursor-pointer font-semibold"
                  onClick={() => deletePost(post.id)}
                >
                  X
                </button>
              </div>
              <div className="text-sm text-gray-600 flex justify-between">
                <span>By: {post.createdBy}</span>
                <span>
                  {post.createdAt?.toDate
                    ? post.createdAt.toDate().toLocaleString()
                    : "Just now"}
                </span>
                <span>Likes: {post.likes?.length || 0}</span>
                <button
                  className={`text-sm font-semibold cursor-pointer ${
                    post.likes?.includes(auth.currentUser?.uid)
                      ? "text-blue-600"
                      : "text-gray-500"
                  }`}
                  onClick={() => handleLike(post.id, post.likes || [])}
                >
                  ❤️ Like
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
