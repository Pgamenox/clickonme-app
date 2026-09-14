import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
)

function App() {
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProfiles() {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('id', { ascending: true })

      if (error) {
        console.error(error)
      } else {
        setProfiles(data || [])
      }

      setLoading(false)
    }

    loadProfiles()
  }, [])

  if (loading) {
    return <div className="loading">Cargando ClickOnMe...</div>
  }

  return (
    <main className="app">
      <header className="hero">
        <div className="logo">ClickOnMe</div>
        <div className="tagline">Tu contacto, en un solo clic.</div>
      </header>

      <div className="profiles">
        {profiles.map((profile) => (
          <article className="profile-card" key={profile.id}>
            <div className="avatar">
              {profile.name ? profile.name.charAt(0).toUpperCase() : 'C'}
            </div>

            <div className="profile-info">
              <h2>{profile.name}</h2>
              <div className="role">{profile.role}</div>
              <p>{profile.description}</p>
            </div>

            <div className="arrow">›</div>
          </article>
        ))}
      </div>
    </main>
  )
}

export default App
