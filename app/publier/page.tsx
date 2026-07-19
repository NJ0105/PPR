'use client'

import { useState, useEffect } from 'react'
import { createClient } from '../lib/supabase-client'
import { useRouter } from 'next/navigation'

export default function Publier() {
  const [fichier, setFichier] = useState<File | null>(null)
  const [legende, setLegende] = useState('')
  const [message, setMessage] = useState('')
  const [envoi, setEnvoi] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const verifierAdmin = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/connexion')
        return
      }
      const { data: profil } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .maybeSingle()
      if (!profil?.is_admin) {
        router.push('/')
      }
    }
    verifierAdmin()
  }, [])

  const handlePublier = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fichier) {
      setMessage('Choisissez une photo ou vidéo.')
      return
    }

    setEnvoi(true)
    setMessage('')
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setMessage('Vous devez être connecté.')
      setEnvoi(false)
      return
    }

    const extension = fichier.name.split('.').pop()
    const nomFichier = `${user.id}-${Date.now()}.${extension}`

    const { error: uploadError } = await supabase.storage
      .from('publication')
      .upload(nomFichier, fichier)

    if (uploadError) {
      setMessage('Erreur upload : ' + uploadError.message)
      setEnvoi(false)
      return
    }

    const { data: urlData } = supabase.storage
      .from('publication')
      .getPublicUrl(nomFichier)

    const typeContenu = fichier.type.startsWith('video') ? 'video' : 'image'

    const { error: insertError } = await supabase.from('publications').insert({
      auteur_id: user.id,
      contenu_url: urlData.publicUrl,
      type_contenu: typeContenu,
      legende,
    })

    if (insertError) {
      setMessage('Erreur publication : ' + insertError.message)
      setEnvoi(false)
      return
    }

    router.push('/')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handlePublier} className="bg-white p-8 rounded-lg shadow-md w-96 border border-gray-300">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Nouvelle publication</h1>

        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => setFichier(e.target.files ? e.target.files[0] : null)}
          className="w-full mb-4 text-gray-900"
          required
        />

        <textarea
          placeholder="Légende (optionnel)"
          value={legende}
          onChange={(e) => setLegende(e.target.value)}
          className="w-full border border-gray-400 p-2 rounded mb-4 text-gray-900 placeholder-gray-500"
          rows={3}
        />

        <button
          type="submit"
          disabled={envoi}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-semibold disabled:bg-gray-400"
        >
          {envoi ? 'Publication en cours...' : 'Publier'}
        </button>

        {message && <p className="mt-4 text-sm text-center text-red-600 font-medium">{message}</p>}
      </form>
    </div>
  )
}