
import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from "react-router-dom";
import "./../styles/App.css";

const initialUsers = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  { id: 3, name: "Alex Johnson" }
];

const initialPosts = [
  {
    id: 1,
    title: "Welcome to GenZ!",
    content: "This is my first post. Welcome everyone!",
    userId: 1,
    reactions: { thumbsUp: 0, hooray: 0, heart: 0, rocket: 0 }
  },
  {
    id: 2,
    title: "Learning React",
    content: "React makes building user interfaces easier.",
    userId: 2,
    reactions: { thumbsUp: 0, hooray: 0, heart: 0, rocket: 0 }
  },
  {
    id: 3,
    title: "Hello World",
    content: "Excited to share my thoughts here!",
    userId: 3,
    reactions: { thumbsUp: 0, hooray: 0, heart: 0, rocket: 0 }
  }
];

const AppContent = () => {
  const [users] = useState(initialUsers);
  const [posts, setPosts] = useState(initialPosts);
  const [notifications, setNotifications] = useState([]);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");

  const [activeTab, setActiveTab] = useState("Posts");

  const navigate = useNavigate();

  const addPost = (e) => {
    e.preventDefault();

    if (!title.trim() || !author || !content.trim()) return;

    const newPost = {
      id: Date.now(),
      title,
      content,
      userId: Number(author),
      reactions: {
        thumbsUp: 0,
        hooray: 0,
        heart: 0,
        rocket: 0
      }
    };

    setPosts([newPost, ...posts]);

    setTitle("");
    setAuthor("");
    setContent("");
  };

  const addReaction = (postId, reaction) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              reactions: {
                ...post.reactions,
                [reaction]: post.reactions[reaction] + 1
              }
            }
          : post
      )
    );
  };

  const refreshNotifications = () => {
    setNotifications([
      { id: 1, message: "Welcome to GenZ! Start sharing your thoughts." },
      { id: 2, message: "A new post has been added to the community." },
      { id: 3, message: "Check out the latest posts from your users." }
    ]);
  };

  const PostList = ({ displayedPosts }) => (
    <section className="posts-list">
      <h2>Recent Posts</h2>

      {displayedPosts.map((post) => {
        const user = users.find((u) => u.id === post.userId);

        return (
          <article key={post.id} className="post-card">
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <p className="author">By: {user?.name}</p>

            <div className="reactions">
              <button onClick={() => addReaction(post.id, "thumbsUp")}>
                👍 {post.reactions.thumbsUp}
              </button>

              <button onClick={() => addReaction(post.id, "hooray")}>
                🎉 {post.reactions.hooray}
              </button>

              <button onClick={() => addReaction(post.id, "heart")}>
                ❤️ {post.reactions.heart}
              </button>

              <button onClick={() => addReaction(post.id, "rocket")}>
                🚀 {post.reactions.rocket}
              </button>

              <button disabled>👀 0</button>
            </div>

            <Link className="button" to={`/posts/${post.id}`}>
              View Post
            </Link>
          </article>
        );
      })}
    </section>
  );

  const Home = () => (
    <>
      <h1>GenZ</h1>

      <nav className="tabs">
        <Link to="/" onClick={() => setActiveTab("Posts")}>Posts</Link>
        <Link to="/users" onClick={() => setActiveTab("Users")}>Users</Link>
        <Link to="/notifications" onClick={() => setActiveTab("Notifications")}>Notifications</Link>
        <a href="#create-post" onClick={() => setActiveTab("Create Post")}>Create Post</a>
      </nav>

      <section className="create-post" id="create-post">
        <h2>Create a Post</h2>

        <form onSubmit={addPost}>
          <input
            type="text"
            id="postTitle"
            placeholder="Enter post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <select
            id="postAuthor"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          >
            <option value="">Select Author</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>

          <textarea
            id="postContent"
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />

          <button type="submit" className="button">
            Add Post
          </button>
        </form>
      </section>

      <PostList displayedPosts={posts} />
    </>
  );

  const Users = () => (
    <div className="users-page">
      <h1>Users</h1>

      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <Link to={`/users/${user.id}`}>{user.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );

  const UserPosts = () => {
    const { userId } = useParams();
    const user = users.find((u) => u.id === Number(userId));
    const userPosts = posts.filter(
      (post) => post.userId === Number(userId)
    );

    return (
      <div>
        <h1>{user?.name}'s Posts</h1>
        <PostList displayedPosts={userPosts} />
      </div>
    );
  };

  const Notifications = () => (
    <div className="notifications-page">
      <h1>Notifications</h1>

      <button className="button" onClick={refreshNotifications}>
        Refresh Notifications
      </button>

      <section className="notificationsList">
        {notifications.map((notification) => (
          <div key={notification.id}>
            {notification.message}
          </div>
        ))}
      </section>
    </div>
  );

  const PostDetails = () => {
    const { postId } = useParams();
    const post = posts.find((p) => p.id === Number(postId));

    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(post?.title || "");
    const [editContent, setEditContent] = useState(post?.content || "");

    if (!post) {
      return <h2>Post not found</h2>;
    }

    const savePost = (e) => {
      e.preventDefault();

      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.id === post.id
            ? { ...p, title: editTitle, content: editContent }
            : p
        )
      );

      setIsEditing(false);
    };

    return (
      <div className="post">
        {isEditing ? (
          <form onSubmit={savePost}>
            <input
              id="postTitle"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              required
            />

            <textarea
              id="postContent"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              required
            />

            <button type="submit" className="button">
              Save Changes
            </button>
          </form>
        ) : (
          <>
            <h2>{post.title}</h2>
            <p>{post.content}</p>

            <button
              className="button"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:userId" element={<UserPosts />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/posts/:postId" element={<PostDetails />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
