const citations = [
    { texte: "Le succès est la somme de petits efforts répétés jour après jour.", auteur: "Leo Robert" },
    { texte: "La vie, c’est 10% ce qui nous arrive et 90% comment nous y réagissons.", auteur: "Charles R. Swindoll" },
    { texte: "Ne rêve pas ta vie, vis tes rêves.", auteur: "Mark Twain" },
    { texte: "La meilleure façon de prédire l’avenir est de le créer.", auteur: "Peter Drucker" },
    { texte: "Connais-toi toi-même.", "auteur": "Socrate" },
    { texte: "Le seul endroit où le succès vient avant le travail, c’est dans le dictionnaire.", auteur: "Vidal Sassoon" },
    { texte: "N’attends pas. Le temps ne sera jamais juste.", auteur: "Napoleon Hill" },
    { texte: "Crois en toi et tout devient possible.", auteur: "Audrey Hepburn" },
    { texte: "L’éducation est l’arme la plus puissante pour changer le monde.", auteur: "Nelson Mandela" },
    { texte: "Le bonheur n’est pas quelque chose de prêt à l’emploi. Il vient de tes propres actions.", auteur: "Dalaï Lama" },
    { texte: "La persévérance est la clé du succès.", auteur: "Calvin Coolidge" },
    { texte: "Chaque jour est une nouvelle opportunité de s’améliorer.", auteur: "Unknown" },
    { texte: "Le savoir est le début de la sagesse.", auteur: "Socrate" },
    { texte: "Ne cesse jamais d’apprendre, car la vie ne cesse jamais d’enseigner.", auteur: "Unknown" },
    { texte: "La discipline est le pont entre les objectifs et les réalisations.", auteur: "Jim Rohn" },

]

export async function GET() {
  const randomIndex = Math.floor(Math.random() * citations.length);
  const citation = citations[randomIndex];
  return new Response(JSON.stringify(citation), { status: 200 });
}