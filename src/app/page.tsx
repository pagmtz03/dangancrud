import DanganronpaCharacterManager from './components/CharacterCrud'

/**
 * Página principal que renderiza el componente de gestión de personajes
 * Implementa Server Component para optimización de rendimiento
 */
export default function HomePage() {
  return (
    <main className="min-h-screen">
      <DanganronpaCharacterManager />
    </main>
  )
}