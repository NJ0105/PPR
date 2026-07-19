export default function MentionsLegales() {
  return (
    <div className="min-h-screen bg-black text-gray-200 px-6 py-10">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-white">Mentions légales</h1>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">Éditeur du site</h2>
          <p>PPR est un site édité à titre personnel, à but non commercial, par un particulier.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">Hébergement</h2>
          <p>Le site est hébergé par Vercel Inc. La base de données et le stockage des fichiers sont assurés par Supabase.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">Contact</h2>
          <p>Pour toute question concernant ce site, vous pouvez contacter l'administrateur via l'adresse email associée au compte administrateur.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">Responsabilité</h2>
          <p>L'administrateur s'efforce d'assurer l'exactitude des informations diffusées sur ce site, mais ne peut garantir l'absence d'erreurs.</p>
        </section>
      </div>
    </div>
  )
}