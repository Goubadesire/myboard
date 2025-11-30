const messagesNoel = [
  { id: 1, texte: "Joyeux Noël à tous les étudiants ! 🎄", auteur: "Gouba désiré" },
  { id: 2, texte: "Passez de belles fêtes et de bonnes révisions ! 🎁", auteur: "Gouba désiré" },
  { id: 3, texte: "Que la magie de Noël remplisse vos cœurs de joie et vos cours de bonheur ! ✨", auteur: "Gouba désiré" },
  { id: 4, texte: "Noël n’est pas seulement un jour, c’est un état d’esprit de partage et d’amour.", auteur: "Gouba désiré" },
  { id: 5, texte: "La meilleure façon de répandre la joie de Noël est de la partager avec les autres.", auteur: "Charles Dickens" },
  { id: 6, texte: "Que la lumière de Noël illumine vos études et vos projets ! 🌟", auteur: "Gouba désiré" },
  { id: 7, texte: "Le bonheur de Noël est contagieux, laissez-le inspirer vos journées.", auteur: "Gouba désiré" },
  { id: 8, texte: "Les cadeaux de Noël ne sont pas sous le sapin, mais dans les moments partagés.", auteur: "Gouba désiré" },
  { id: 9, texte: "Noël est la saison pour ouvrir nos cœurs et apprendre avec amour.", auteur: "Gouba désiré" },
  { id: 10, texte: "Que cette période festive vous apporte la réussite et de belles notes ! 📚🎄", auteur: "Gouba désiré" },
  { id: 11, texte: "Même en révisant, n’oubliez pas de profiter des chocolats et des rires de Noël ! 🍫", auteur: "Gouba désiré" },
  { id: 12, texte: "Un peu de magie de Noël peut transformer une journée chargée en un moment merveilleux.", auteur: "Gouba désiré" },
  { id: 13, texte: "Le meilleur cadeau de noel est le sourire des êtres aimés.", auteur: "M'bra" },
  { id: 14, texte: "C'est quand tu entend ho ho ho de père de noel que tu a cadeau .", auteur: "Sankara yasser" },
];


export async function GET() {
  const randomIndex = Math.floor(Math.random() * messagesNoel.length);
  const message = messagesNoel[randomIndex];
  return new Response(JSON.stringify(message), { status: 200 });
}
