export default function Confidentialite() {
  return (
    <div className="min-h-screen bg-black text-gray-200 px-6 py-10">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-white">Politique de confidentialité</h1>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">Données collectées</h2>
          <p>Lors de votre inscription, nous collectons : nom, prénom, pseudo, date de naissance et adresse email. Ces informations sont nécessaires pour créer et sécuriser votre compte.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">Utilisation des données</h2>
          <p>Vos données servent uniquement à faire fonctionner le site (connexion, affichage de votre pseudo sur vos commentaires). Elles ne sont ni vendues, ni partagées avec des tiers à des fins commerciales.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">Âge minimum</h2>
          <p>L'inscription est réservée aux personnes majeures (18 ans et plus).</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">Vos droits</h2>
          <p>Vous pouvez demander la suppression de votre compte et de vos données à tout moment en contactant l'administrateur du site.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">Sécurité</h2>
          <p>Les mots de passe sont chiffrés et jamais stockés en clair. L'accès aux données est protégé par des règles de sécurité strictes.</p>
        </section>
      </div>
    </div>
  )
}