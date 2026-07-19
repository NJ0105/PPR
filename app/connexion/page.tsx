'use client'

import { useState } from 'react'
import { createClient } from '../lib/supabase-client'
import { useRouter } from 'next/navigation'

export default function Connexion() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage('Erreur : ' + error.message)
    } else {
      router.push('/')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <form onSubmit={handleSignIn} className="bg-black p-8 rounded-lg shadow-md w-96 border border-white">
        <h1 className="text-2xl font-bold mb-6 text-white">Se connecter</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-white bg-black p-2 rounded mb-4 text-white placeholder-gray-400"
          required
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-white bg-black p-2 rounded mb-4 text-white placeholder-gray-400"
          required
        />

        <button
          type="submit"
          className="w-full bg-white text-black p-2 rounded hover:bg-gray-200 font-semibold"
        >
          Se connecter
        </button>

        {message && <p className="mt-4 text-sm text-center text-red-500 font-medium">{message}</p>}
      </form>
    </div>
  )
}