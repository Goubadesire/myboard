const citations = [
   /* 1 */ { texte: "Le succès est la somme de petits efforts répétés jour après jour.", auteur: "Leo Robert" },
   /* 2 */  { texte: "La vie, c’est 10% ce qui nous arrive et 90% comment nous y réagissons.", auteur: "Charles R. Swindoll" },
   /* 3 */  { texte: "Ne rêve pas ta vie, vis tes rêves.", auteur: "Mark Twain" },
   /* 4 */  { texte: "La meilleure façon de prédire l’avenir est de le créer.", auteur: "Peter Drucker" },
   /* 5 */  { texte: "Connais-toi toi-même.", "auteur": "Socrate" },
   /* 6 */  { texte: "Le seul endroit où le succès vient avant le travail, c’est dans le dictionnaire.", auteur: "Vidal Sassoon" },
   /* 7 */  { texte: "N’attends pas. Le temps ne sera jamais juste.", auteur: "Napoleon Hill" },
   /* 8 */  { texte: "Crois en toi et tout devient possible.", auteur: "Audrey Hepburn" },
   /* 9 */  { texte: "L’éducation est l’arme la plus puissante pour changer le monde.", auteur: "Nelson Mandela" },
   /* 10 */  { texte: "Le bonheur n’est pas quelque chose de prêt à l’emploi. Il vient de tes propres actions.", auteur: "Dalaï Lama" },
   /* 11 */  { texte: "La persévérance est la clé du succès.", auteur: "Calvin Coolidge" },
   /* 12 */  { texte: "Chaque jour est une nouvelle opportunité de s’améliorer.", auteur: "Unknown" },
   /* 13 */  { texte: "Le savoir est le début de la sagesse.", auteur: "Socrate" },
   /* 14 */  { texte: "Ne cesse jamais d’apprendre, car la vie ne cesse jamais d’enseigner.", auteur: "Unknown" },
   /* 15 */  { texte: "La discipline est le pont entre les objectifs et les réalisations.", auteur: "Jim Rohn" },
   /* 16 */  { texte: "Le courage ne rugit pas toujours. Parfois, le courage est la petite voix à la fin de la journée qui dit : j’essaierai encore demain.", auteur: "Mary Anne Radmacher" },
   /* 17 */  { texte: "Le plus grand risque est de ne prendre aucun risque.", auteur: "Mark Zuckerberg" },
   /* 18 */  { texte: "La créativité, c’est l’intelligence qui s’amuse.", auteur: "Albert Einstein" },
   /* 19 */  { texte: "Le succès n’est pas la clé du bonheur. Le bonheur est la clé du succès.", auteur: "Albert Schweitzer" },
   /* 20 */  { texte: "Fais de ta vie un rêve, et d’un rêve, une réalité.", auteur: "Antoine de Saint-Exupéry" },
   /* 21 */  { texte: "Apprendre l'informatique, c'est construire le futur avec la logique du présent.", auteur: "Reine"},
   /* 22 */  { texte: "Un grain de riz n'a jamais eu raison au tribunal des poulets.", auteur: "Yasmine Kouadio"},
   /* 23 */  { texte: "La discipline est le carburant de la réussite.", auteur: "Kabore Mohamed" },
   /* 24 */  { texte: "C'est lorsqu'il veut pleuvoir que 15h ressemble à 19h.", auteur: "Yasmine Kouadio" },
   /* 25 */  { texte: "Le mortier de foutou se lave après l'utilisation.", auteur: "Yasmine Kouadio" },
   /* 26 */  { texte: "Le miroir à les meilleurs photos et vidéos du monde.", auteur: "Yasmine Kouadio" },
   /* 27 */  { texte: "Ils n'ont jamais entendu mes pleurs mais ils verront que ma force est le succès.", auteur: "Yasmine Kouadio" },
   /* 28 */  { texte: "La discipline est le moteur qui enclenche le succès.", auteur: "Kabore Mohamed" },
   /* 29 */  { texte: "C'est pas parcque tu me doit que je vais pas manger ta nourriture.", auteur: "Yasmine Kouadio" },
   /* 30 */  { texte: "Sel 25f peut gâter sauce de 30K.", auteur: "Yasmine Kouadio" },
   /* 31 */  { texte: "Sifflet 50f arrêt voiture de milliard.", auteur: "Yasmine Kouadio" },
   /* 32 */  { texte: "omo 50f lave voiture d'un million.", auteur: "Yasmine Kouadio" },
   /* 33 */  { texte: "En vrai, travailler dur n'est synonyme de liberté financière ou ma réussite sociale. La vraie liberté financiaire ou réussite sociale réside dans la stratégie ou la mainière de gérer son temps ou le fruit de son travail.", auter: "Kouao Alan"},
   /* 34 */  { texte: "Tu souscris pass nuit tu dit tu as insomnie.", auteur: "Yasmine Kouadio" },
   /* 35 */  { texte: "Si aujourd'hui est lundi c'est que demain sera mardi.", auteur: "Alice" },
   /* 36 */  { texte: "Contrairement au cerveau l'estomac vous avertit lorsqu'il est vide.", auteur: "Michael Zadi" },
   /* 37 */ 
   /* 38 */ 
  /* 39 */ 
  /* 40 */ 
]

export async function GET() {
  const randomIndex = Math.floor(Math.random() * citations.length);
  const citation = citations[randomIndex];
  return new Response(JSON.stringify(citation), { status: 200 });
}