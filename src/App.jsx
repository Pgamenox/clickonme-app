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
    return <div>Cargando ClickOnMe...</div>
  }

  return (
    <main>
      <h1>ClickOnMe</h1>
      <p>Tu contacto, en un solo clic.</p>

      {profiles.map((profile) => (
        <section key={profile.id}>
          <h2>{profile.name}</h2>
          <p>{profile.role}</p>
          <p>{profile.description}</p>
        </section>
      ))}
    </main>
  )
}

export default App
