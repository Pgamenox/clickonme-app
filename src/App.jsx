import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
)

function App() {
  const [session, setSession] = useState(null)
  const [mode, setMode] = useState('signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(true)
  const [working, setWorking] = useState(false)
  const [message, setMessage] = useState('')
const [creating, setCreating] = useState(false)
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setWorking(true)
    setMessage('')

    if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        setMessage(error.message)
      } else if (!data.session) {
        setMessage(
          'Cuenta creada. Revisa tu correo para confirmar tu registro.'
        )
      } else {
        setMessage('Cuenta creada correctamente.')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setMessage(error.message)
      }
    }

    setWorking(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  if (loading) {
    return <div className="loading">Cargando ClickOnMe...</div>
  }

  if (session) {
    return (
      <main className="app">
        <header className="hero">
          <div className="logo">ClickOnMe</div>
          <div className="tagline">Tu presencia digital, en un solo lugar.</div>
        </header>

        <section className="dashboard-card">
          <div className="dashboard-badge">Tu cuenta está lista</div>

          <h1>Bienvenido a ClickOnMe</h1>

          <p className="dashboard-email">
            {session.user.email}
          </p>

          <p className="dashboard-text">
            Desde aquí podrás crear, editar y publicar tu propia tarjeta digital.
          </p>

          <button
  className="primary-button"
  type="button"
  onClick={() => setCreating(true)}
>
  Crear mi ClickOnMe
</button>
           

          <button
            className="secondary-button"
            type="button"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="app">
      <header className="hero">
        <div className="logo">ClickOnMe</div>
        <div className="tagline">Todo sobre ti. En un solo enlace.</div>
      </header>

      <section className="auth-card">
        <div className="auth-heading">
          <span className="auth-kicker">
            {mode === 'signup' ? 'Crea tu cuenta' : 'Bienvenido de nuevo'}
          </span>

          <h1>
            {mode === 'signup'
              ? 'Crea tu ClickOnMe'
              : 'Inicia sesión'}
          </h1>

          <p>
            {mode === 'signup'
              ? 'Empieza a construir tu tarjeta digital en pocos minutos.'
              : 'Entra a tu cuenta para administrar tu ClickOnMe.'}
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            type="email"
            placeholder="tu@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength="6"
            required
          />

          <button
            className="primary-button"
            type="submit"
            disabled={working}
          >
            {working
              ? 'Procesando...'
              : mode === 'signup'
              ? 'Crear mi cuenta'
              : 'Iniciar sesión'}
          </button>
        </form>

        {message && <div className="auth-message">{message}</div>}

        <div className="auth-switch">
          {mode === 'signup'
            ? '¿Ya tienes una cuenta?'
            : '¿Aún no tienes una cuenta?'}

          <button
            type="button"
            onClick={() => {
              setMode(mode === 'signup' ? 'login' : 'signup')
              setMessage('')
            }}
          >
            {mode === 'signup' ? 'Iniciar sesión' : 'Crear cuenta'}
          </button>
        </div>
      </section>
    </main>
  )
}

export default App
