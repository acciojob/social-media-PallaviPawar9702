
import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useParams
} from "react-router-dom";
import "./../styles/App.css";

const users = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  { id: 3, name: "Alex Johnson" }
];

const initialPosts = [
  {
    id: 1,
    title: "Welcome to GenZ!",
    content: "Welcome everyone to our social media platform.",
    userId: 1,
    reactions: {
      thumbsUp: 0,
      hooray: 0,
      heart: 0,
      rocket: 0
    }
  },
  {
    id: 2,
    title: "Learning React",
    content: "React makes building interfaces easier.",
    userId: 2,
    reactions: {
      thumbsUp: 0,
      hooray: 0,
      heart: 0,
      rocket: 0
    }
  },
  {
    id: 3,
    title: "Hello World",
    content: "Excited to share my thoughts!",
    userId: 3,
    reactions: {
      thumbsUp: 0,
      hooray: 0,
      heart: 0,
      rocket: 0
    }
  }
];

// Display all posts
function PostList({ posts, addReaction }) {
  return (
    <section className="posts-list">
      <h2>Recent Posts</h2>

      {posts.map((post) => (
        <article key={post.id} className="post-card">
          <h3>{post.title}</h3>

          <p>{post.content}</p>

          <p className="author">
            By: {users.find((u) => u.id === post.userId)?.name}
          </p>

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

            <button onClick={() => {}}>
              👀 0
            </button>
          </div>

          <Link className="button" to={`/posts/${post.id}`}>
            View Post
          </Link>
        </article>
      ))}
    </section>
  );
}

// Home page
function Home({ posts, setPosts, addReaction }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");

  const addPost = (e) => {
    e.preventDefault();

    if (!title.trim() || !author || !content.trim()) {
      return;
    }

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

    setPosts((prevPosts) => [newPost, ...prevPosts]);

    setTitle("");
    setAuthor("");
    setContent("");
  };

  return (
    <>
      <h1>GenZ</h1>

      <nav className="tabs">
        <Link to="/">Posts</Link>
        <Link to="/users">Users</Link>
        <Link to="/notifications">Notifications</Link>
        <a href="#create-post">Create Post</a>
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
            placeholder="Enter post content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />

          <button type="submit" className="button">
            Add Post
          </button>
        </form>
      </section>

      <PostList posts={posts} addReaction={addReaction} />
    </>
  );
}

// Users page
function UsersPage() {
  return (
    <div>
      <h1>Users</h1>

      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <Link to={`/users/${user.id}`}>
              {user.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Individual user's posts
function UserPosts({ posts, addReaction }) {
  const { userId } = useParams();

  const user = users.find(
    (u) => u.id === Number(userId)
  );

  const filteredPosts = posts.filter(
    (post) => post.userId === Number(userId)
  );

  return (
    <div>
      <h1>{user?.name}'s Posts</h1>

      <PostList
        posts={filteredPosts}
        addReaction={addReaction}
      />
    </div>
  );
}

// Notifications page
function Notifications() {
  const [notifications, setNotifications] = useState([]);

  const refreshNotifications = () => {
    setNotifications([
      { id: 1, message: "New post added successfully!" },
      { id: 2, message: "Welcome to GenZ!" },
      { id: 3, message: "Check out the latest posts!" }
    ]);
  };

  return (
    <div>
      <h1>Notifications</h1>

      <button
        className="button"
        onClick={refreshNotifications}
      >
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
}

// Post details and edit page
function PostDetails({ posts, setPosts }) {
  const { postId } = useParams();

  const post = posts.find(
    (p) => p.id === Number(postId)
  );

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  if (!post) {
    return <h2>Post not found</h2>;
  }

  const handleEdit = () => {
    setEditTitle(post.title);
    setEditContent(post.content);
    setIsEditing(true);
  };

  const savePost = (e) => {
    e.preventDefault();

    setPosts((prevPosts) =>
      prevPosts.map((p) =>
        p.id === Number(postId)
          ? {
              ...p,
              title: editTitle,
              content: editContent
            }
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
            type="text"
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
            onClick={handleEdit}
          >
            Edit
          </button>
        </>
      )}
    </div>
  );
}

// Main application
function AppContent() {
  const [posts, setPosts] = useState(initialPosts);

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

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            <Home
              posts={posts}
              setPosts={setPosts}
              addReaction={addReaction}
            />
          }
        />

        <Route
          path="/users"
          element={<UsersPage />}
        />

        <Route
          path="/users/:userId"
          element={
            <UserPosts
              posts={posts}
              addReaction={addReaction}
            />
          }
        />

        <Route
          path="/notifications"
          element={<Notifications />}
        />

        <Route
          path="/posts/:postId"
          element={
            <PostDetails
              posts={posts}
              setPosts={setPosts}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
