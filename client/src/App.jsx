import { useState, useEffect } from 'react'
import './App.css'
const API = 'https://campus-verse-rest-api.onrender.com/api'
const categories = ['General', 'Placements', 'Events', 'Clubs']

function App() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('General')
  const [posts, setPosts] = useState([])
  const [user, setUser] = useState(null)
  const [mode, setMode] = useState('login')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
const [news, setNews] = useState([]);
const [newsQuery, setNewsQuery] = useState('artificial intelligence');
const [newsLoading, setNewsLoading] = useState(false);
const [newsError, setNewsError] = useState('');

  async function loadPosts() {
    try {
      const response = await fetch(`${API}/posts`, {
        credentials: 'include'
      })
      if (!response.ok) throw new Error()
      setPosts(await response.json())
      setError('')
    } catch {
      setError('Could not load posts. Is the server running?')
    } finally {
      setLoading(false)
    }
  }

  async function checkSession() {
    try {
      const response = await fetch(`${API}/me`, {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      }
    } catch {
      // User is not logged in, or server is unavailable.
    }
  }

  useEffect(() => {
    loadPosts()
    checkSession()
  }, [])

  async function handleAuth(e) {
    e.preventDefault()
    setMessage('')

    const endpoint = mode === 'signup' ? 'signup' : 'login'
    const body = mode === 'signup'
      ? { username, email, password }
      : { email, password }

    try {
      const response = await fetch(`${API}/${endpoint}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Authentication failed')

     setUser(data.user)
      setUsername('')
      setEmail('')
      setPassword('')
      setMessage(data.message)
    } catch (err) {
      setMessage(err.message || 'Could not connect to server')
    }
  }

  async function logout() {
    try {
      await fetch(`${API}/logout`, {
        method: 'POST',
        credentials: 'include'
      })
    } finally {
      setUser(null)
      setMessage('Logged out')
    }
  }

  async function createPost(e) {
    e.preventDefault()
    setMessage('')

    try {
      const response = await fetch(`${API}/posts`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, category })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Could not create post')

      setContent('')
      setMessage('Post published!')
      await loadPosts()
    } catch (err) {
      setMessage(err.message)
    }
  }
  async function handleDelete(id) {
  if (!confirm('Delete this post?')) return;

  const response = await fetch(`${API}/posts/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  });

  const data = await response.json();
  if (!response.ok) return alert(data.error);

  await loadPosts();
}

async function handleEdit(post) {
  const content = prompt('Edit your post:', post.content);
  if (content === null || !content.trim()) return;

  const response = await fetch(`${API}/posts/${post.id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, category: post.category })
  });

  const data = await response.json();
  if (!response.ok) return alert(data.error);

  await loadPosts();
}

async function loadNews() {
  setNewsLoading(true);
  setNewsError('');

  try {
    const response = await fetch(
      `http://localhost:8080/api/tech-news?q=${encodeURIComponent(newsQuery)}`
    );

    if (!response.ok) throw new Error();

    setNews(await response.json());
  } catch {
    setNewsError('Could not load tech articles.');
  } finally {
    setNewsLoading(false);
  }
}

useEffect(() => {
  loadNews();
}, []);

  return (
    <div className="app">
      <header>
        <h2>Campus Verse &#129430;</h2>


        {user ? (
          <div>
            <span>Welcome, {user.username} </span>
            <button type="button" onClick={logout}>Logout</button>
          </div>
        ) : (
          <p>Log in to participate in discussions.</p>
        )}
      </header>

      <main>
        {!user && (
          <section className="posts">
            <h2>{mode === 'signup' ? 'Create Account' : 'Login'}</h2>

            <form onSubmit={handleAuth}>
              {mode === 'signup' && (
                <input
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Username"
                  required
                />
              )}

              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="VIT email (@vit.edu)"
                required
              />

              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password (minimum 8 characters)"
                minLength={8}
                required
              />

              <button type="submit">
                {mode === 'signup' ? 'Sign Up' : 'Login'}
              </button>
            </form>

            <button
              type="button"
              onClick={() => {
                setMode(mode === 'signup' ? 'login' : 'signup')
                setMessage('')
              }}
            >
              {mode === 'signup'
                ? 'Already have an account? Login'
                : 'New here? Sign up'}
            </button>
          </section>
        )}

        {message && <p role="status">{message}</p>}

        <section className="welcome">
          <h1>What's happening on campus?</h1>
          
        </section>

        <section className="categories">
          {categories.map(item => (
            <button
              key={item}
              type="button"
              className={category === item ? 'active' : ''}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </section>

        {user && (
          <form onSubmit={createPost} className="posts">
            <h2>Share something</h2>

            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              required
            >
              {categories.map(item => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>

            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="What's on your mind?"
              required
            />

            <button type="submit">Publish Post</button>
          </form>
        )}

        <section className="posts">
          <h2>{category} Discussions</h2>

          {loading && <p>Loading posts...</p>}
          {error && <p>{error}</p>}

          {!loading && !error && posts.filter(
            post => post.category === category
          ).length === 0 && <p>No posts in this category yet.</p>}

          {!loading && !error && posts
            .filter(post => post.category === category)
            .map(post => (
             <article key={post.id}>
<h3>{post.username}</h3>

<small>
  {post.created_at
    ? new Date(post.created_at).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    : ''}
</small>

<p>{post.content}</p> 

  {user && post.user_id === user.id && (
    <>
      <button onClick={() => handleEdit(post)}>Edit</button>
      <button onClick={() => handleDelete(post.id)}>Delete</button>
    </>
  )}

  <hr />
</article>
            ))}
        </section>

<section className="posts">
  <h2> &#x1F310;  Tech Reads</h2>

  <form onSubmit={e => {
    e.preventDefault();
    loadNews();
  }}>
    <input
      value={newsQuery}
      onChange={e => setNewsQuery(e.target.value)}
      placeholder="Search tech articles..."
      required
    />
    <button type="submit">Search</button>
  </form>

  {newsLoading && <p>Loading articles...</p>}
  {newsError && <p>{newsError}</p>}

  {news.map(article => (
    <article key={article.objectID}>
      <h3>{article.title}</h3>
      <p>By {article.author || 'Unknown'}</p>
      <a href={article.url} target="_blank" rel="noreferrer">
        Read article
      </a>
      <hr />
    </article>
  ))}
</section>


      </main>
    </div>
  )
}

export default App
