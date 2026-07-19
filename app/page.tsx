'use client'

import { useEffect, useState } from 'react'
import { createClient } from './lib/supabase-client'
import Link from 'next/link'

type Commentaire = {
  id: string
  contenu: string
  utilisateur_id: string
  pseudo: string
}

type Publication = {
  id: string
  contenu_url: string
  type_contenu: string
  legende: string
  created_at: string
  likes_count: number
  a_like: boolean
  commentaires: Commentaire[]
  nouveauCommentaire: string
}

export default function Accueil() {
  const [publications, setPublications] = useState<Publication[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [estAdmin, setEstAdmin] = useState(false)
  const [chargement, setChargement] = useState(true)

  useEffect(() => {
    chargerPublications()
  }, [])

  const chargerPublications = async () => {
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    setUserId(user ? user.id : null)
    if (user) {
      const { data: profil } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .maybeSingle()
      setEstAdmin(profil?.is_admin || false)
    }

    const { data: pubs, error } = await supabase
      .from('publications')
      .select('*')
      .order('created_at', { ascending: false })

    if (error || !pubs) {
      setChargement(false)
      return
    }

    const pubsCompletes = await Promise.all(
      pubs.map(async (pub) => {
        const { count } = await supabase
          .from('likes')
          .select('*', { count: 'exact', head: true })
          .eq('publication_id', pub.id)

        let aLike = false
        if (user) {
          const { data: monLike } = await supabase
            .from('likes')
            .select('id')
            .eq('publication_id', pub.id)
            .eq('utilisateur_id', user.id)
            .maybeSingle()
          aLike = !!monLike
        }

        const { data: commentairesData } = await supabase
          .from('commentaires')
          .select('id, contenu, utilisateur_id')
          .eq('publication_id', pub.id)
          .order('created_at', { ascending: true })

        const commentaires: Commentaire[] = []
        if (commentairesData) {
          for (const c of commentairesData) {
            const { data: profil } = await supabase
              .from('profiles')
              .select('pseudo')
              .eq('id', c.utilisateur_id)
              .maybeSingle()
            commentaires.push({ ...c, pseudo: profil?.pseudo || 'Utilisateur' })
          }
        }

        return {
          ...pub,
          likes_count: count || 0,
          a_like: aLike,
          commentaires,
          nouveauCommentaire: '',
        }
      })
    )

    setPublications(pubsCompletes)
    setChargement(false)
  }

  const toggleLike = async (publicationId: string, aDejaLike: boolean) => {
    if (!userId) return
    const supabase = createClient()

    if (aDejaLike) {
      await supabase
        .from('likes')
        .delete()
        .eq('publication_id', publicationId)
        .eq('utilisateur_id', userId)
    } else {
      await supabase
        .from('likes')
        .insert({ publication_id: publicationId, utilisateur_id: userId })
    }

    chargerPublications()
  }

  const supprimerPublication = async (publicationId: string) => {
    const confirmation = window.confirm('Supprimer définitivement cette publication ?')
    if (!confirmation) return

    const supabase = createClient()
    await supabase.from('publications').delete().eq('id', publicationId)
    chargerPublications()
  }

  const changerTexteCommentaire = (publicationId: string, texte: string) => {
    setPublications((prev) =>
      prev.map((p) => (p.id === publicationId ? { ...p, nouveauCommentaire: texte } : p))
    )
  }

  const envoyerCommentaire = async (publicationId: string, texte: string) => {
    if (!userId || !texte.trim()) return
    const supabase = createClient()

    await supabase.from('commentaires').insert({
      publication_id: publicationId,
      utilisateur_id: userId,
      contenu: texte.trim(),
    })

    chargerPublications()
  }

  if (chargement) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-pulse text-yellow-500 font-medium">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <header className="bg-black border-b border-yellow-600/30 sticky top-0 z-10">
        <div className="max-w-xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-yellow-500 tracking-tight">PPR🍑</h1>
          {!userId ? (
            <div className="flex gap-4 text-sm">
              <Link href="/connexion" className="text-gray-300 font-medium hover:text-yellow-500">
                Connexion
              </Link>
              <Link href="/inscription" className="bg-yellow-500 text-black px-4 py-1.5 rounded-full font-semibold hover:bg-yellow-400">
                S'inscrire
              </Link>
            </div>
          ) : (
            <Link href="/publier" className="bg-yellow-500 text-black px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-yellow-400">
              + Publier
            </Link>
          )}
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-6">
        {publications.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500">Aucune publication pour le moment.</p>
          </div>
        )}

        <div className="space-y-6">
          {publications.map((pub) => (
            <article key={pub.id} className="relative bg-neutral-900 rounded-2xl shadow-sm border border-yellow-600/20 overflow-hidden">
              {pub.type_contenu === 'video' ? (
                <video src={pub.contenu_url} controls className="w-full bg-black" />
              ) : (
                <img src={pub.contenu_url} alt={pub.legende} className="w-full object-cover" />
              )}

              {estAdmin && (
                <button
                  onClick={() => supprimerPublication(pub.id)}
                  className="absolute top-2 right-2 bg-black/60 text-red-400 text-xs px-3 py-1 rounded-full hover:bg-black/80"
                >
                  Supprimer
                </button>
              )}

              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <button
                    onClick={() => toggleLike(pub.id, pub.a_like)}
                    disabled={!userId}
                    className={`text-2xl transition-transform active:scale-90 ${
                      pub.a_like ? 'text-yellow-500' : 'text-gray-600 hover:text-gray-400'
                    }`}
                  >
                    ♥
                  </button>
                  <span className="text-sm text-gray-400 font-medium">{pub.likes_count} j'aime</span>
                </div>

                {pub.legende && (
                  <p className="text-gray-100 mb-3 text-[15px] leading-snug">{pub.legende}</p>
                )}

                {pub.commentaires.length > 0 && (
                  <div className="border-t border-yellow-600/20 pt-3 space-y-1.5 mb-1">
                    {pub.commentaires.map((c) => (
                      <p key={c.id} className="text-sm text-gray-300 leading-snug">
                        <span className="font-semibold text-yellow-500">{c.pseudo}</span>{' '}
                        {c.contenu}
                      </p>
                    ))}
                  </div>
                )}

                {userId && (
                  <div className="flex gap-2 mt-3 items-center">
                    <input
                      type="text"
                      placeholder="Ajouter un commentaire..."
                      value={pub.nouveauCommentaire}
                      onChange={(e) => changerTexteCommentaire(pub.id, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          envoyerCommentaire(pub.id, pub.nouveauCommentaire)
                        }
                      }}
                      className="flex-1 border-none bg-transparent text-sm text-gray-100 placeholder-gray-600 focus:outline-none"
                    />
                    <button
                      onClick={() => envoyerCommentaire(pub.id, pub.nouveauCommentaire)}
                      className="text-yellow-500 font-semibold text-sm hover:text-yellow-400"
                    >
                      Envoyer
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}