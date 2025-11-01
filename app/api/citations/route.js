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
    { texte: "Le courage ne rugit pas toujours. Parfois, le courage est la petite voix à la fin de la journée qui dit : j’essaierai encore demain.", auteur: "Mary Anne Radmacher" },
    { texte: "Le plus grand risque est de ne prendre aucun risque.", auteur: "Mark Zuckerberg" },
    { texte: "La créativité, c’est l’intelligence qui s’amuse.", auteur: "Albert Einstein" },
    { texte: "Le succès n’est pas la clé du bonheur. Le bonheur est la clé du succès.", auteur: "Albert Schweitzer" },
    { texte: "Fais de ta vie un rêve, et d’un rêve, une réalité.", auteur: "Antoine de Saint-Exupéry" },
    { texte: "Apprendre l'informatique, c'est construire le futur avec la logique du présent.", auteur: "Reine"},
    { texte: "Un grain de riz n'a jamais eu raison au tribunal des poulets.", auteur: "Yasmine Kouadio"},
    { texte: "La discipline est le carburant de la réussite.", auteur: "Kabore Mohamed" },
    { texte: "C'est lorsqu'il veut pleuvoir que 15h ressemble à 19h.", auteur: "Yasmine Kouadio" },
    { texte: "Le mortier de foutou se lave après l'utilisation.", auteur: "Yasmine Kouadio" },
    { texte: "Le miroir à les meilleurs photos et vidéos du monde.", auteur: "Yasmine Kouadio" },
    { texte: "Ils n'ont jamais entendu mes pleurs mais ils verront que ma force est le succès.", auteur: "Yasmine Kouadio" },
    { texte: "La discipline est le moteur qui enclenche le succès.", auteur: "Kabore Mohamed" },
    { texte: "C'est pas parcque tu me doit que je vais pas manger ta nourriture.", auteur: "Yasmine Kouadio" },
    { texte: "Sel 25f peut gâter sauce de 30K.", auteur: "Yasmine Kouadio" },
    { texte: "Sifflet 50f arrêt voiture de milliard.", auteur: "Yasmine Kouadio" },
    { texte: "omo 50f lave voiture d'un million.", auteur: "Yasmine Kouadio" },
    { texte: "En vrai, travailler dur n'est synonyme de liberté financière ou ma réussite sociale. La vraie liberté financiaire ou réussite sociale réside dans la stratégie ou la mainière de gérer son temps ou le fruit de son travail.", auter: "Kouao Alan"},
    { texte: "Tu souscris pass nuit tu dit tu as insomnie.", auteur: "Yasmine Kouadio" },
    { texte: "Si aujourd'hui est lundi c'est que demain sera mardi.", auteur: "Alice" },
    { texte: "Contrairement au cerveau l'estomac vous avertit lorsqu'il est vide.", auteur: "Michael Zadi" }


]

export async function GET() {
  const randomIndex = Math.floor(Math.random() * citations.length);
  const citation = citations[randomIndex];
  return new Response(JSON.stringify(citation), { status: 200 });
}