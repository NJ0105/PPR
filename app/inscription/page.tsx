'use client'

import { useState } from 'react'
import { createClient } from '../lib/supabase-client'
import { useRouter } from 'next/navigation'

export default function Inscription() {
  const [nom, setNom] = useState('')
  const [prenom, setPrenom] = useState('')
  const [pseudo, setPseudo] = useState('')
  const [dateNaissance, setDateNaissance] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const calculerAge = (naissance: string) => {
    const aujourdHui = new Date()
    const dateNaiss = new Date(naissance)
    let age = aujourdHui.getFullYear() - dateNaiss.getFullYear()
    const moisDiff = aujourdHui.getMonth() - dateNaiss.getMonth()
    if (moisDiff < 0 || (moisDiff === 0 && aujourdHui.getDate() < dateNaiss.getDate())) {
      age--
    }
    return age
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    const age = calculerAge(dateNaissance)
    if (age < 18) {
      setMessage("Vous devez avoir au moins 18 ans pour vous inscrire.")
      return
    }

    const supabase = createClient()

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setMessage('Erreur : ' + error.message)
      return
    }

    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        nom,
        prenom,
        pseudo,
        date_naissance: dateNaissance,
      })

      if (profileError) {
        setMessage('Erreur profil : ' + profileError.message)
        return
      }
    }

    router.push('/')
  }

 return (
    <div className="flex min-h-screen items-center justify-center bg-black py-10">
      <form onSubmit={handleSignUp} className="bg-black p-8 rounded-lg shadow-md w-96 border border-white">
        <h1 className="text-2xl font-bold mb-6 text-white">Créer un compte</h1>

        <input
          type="text"
          placeholder="Nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          className="w-full border border-white bg-black p-2 rounded mb-4 text-white placeholder-gray-400"
          required
        />

        <input
          type="text"
          placeholder="Prénom"
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
          className="w-full border border-white bg-black p-2 rounded mb-4 text-white placeholder-gray-400"
          required
        />

        <input
          type="text"
          placeholder="Pseudo"
          value={pseudo}
          onChange={(e) => setPseudo(e.target.value)}
          className="w-full border border-white bg-black p-2 rounded mb-4 text-white placeholder-gray-400"
          required
        />

        <label className="block text-sm text-white mb-1">Date de naissance</label>
        <input
          type="date"
          value={dateNaissance}
          onChange={(e) => setDateNaissance(e.target.value)}
          className="w-full border border-white bg-black p-2 rounded mb-4 text-white"
          required
        />

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
          S'inscrire
        </button>

        {message && <p className="mt-4 text-sm text-center text-red-500 font-medium">{message}</p>}
      </form>
    </div>
  )
}