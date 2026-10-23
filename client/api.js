const API_URL = 'http://localhost:8080'

export async function getPosts() {
  const response = await fetch(`${API_URL}/posts`)

  if (!response.ok) {
    throw new Error('Failed to fetch posts')
  }

  return response.json()
}