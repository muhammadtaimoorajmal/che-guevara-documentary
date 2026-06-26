// ============================================================
// QUOTES DATA — CHE GUEVARA: PATRIA O MUERTE
// ============================================================
const cheQuotes = [
  {
    id: "patria-o-muerte",
    quote: "Patria o muerte. Venceremos.",
    translation: "Homeland or death. We will triumph.",
    context: "UN General Assembly Address, New York",
    year: 1964,
    category: "famous",
    audioText: "Patria o muerte. Venceremos."
  },
  {
    id: "shoot-coward",
    quote: "Shoot, coward, you are only going to kill a man.",
    translation: "Dispara, cobarde, solo vas a matar a un hombre.",
    context: "Final words before execution, La Higuera, Bolivia",
    year: 1967,
    category: "famous",
    audioText: "Shoot, coward, you are only going to kill a man."
  },
  {
    id: "hasta-la-victoria",
    quote: "Hasta la victoria siempre.",
    translation: "Until victory, always.",
    context: "Farewell letter to Fidel Castro",
    year: 1965,
    category: "famous",
    audioText: "Hasta la victoria siempre."
  },
  {
    id: "revolutionary-love",
    quote: "The true revolutionary is guided by great feelings of love. It is impossible to think of a genuine revolutionary lacking this quality.",
    translation: "El verdadero revolucionario está guiado por grandes sentimientos de amor.",
    context: "Message to the Tricontinental, 1967",
    year: 1967,
    category: "ideology",
    audioText: "The true revolutionary is guided by great feelings of love."
  },
  {
    id: "be-cruel",
    quote: "Be cruel — but be just. Do not be cruel out of passion, but be cruel because the situation demands it.",
    translation: "Sé cruel — pero sé justo.",
    context: "Letter to his children",
    year: 1965,
    category: "ideology",
    audioText: "Be cruel but be just. Do not be cruel out of passion, but be cruel because the situation demands it."
  },
  {
    id: "apple-revolution",
    quote: "The revolution is not an apple that falls when it is ripe. You have to make it fall.",
    translation: "La revolución no es una manzana que cae cuando está madura. Hay que hacerla caer.",
    context: "Speech in Havana, 1960",
    year: 1960,
    category: "ideology",
    audioText: "The revolution is not an apple that falls when it is ripe. You have to make it fall."
  },
  {
    id: "words-weapons",
    quote: "Words that do not match deeds are unimportant.",
    translation: "Las palabras que no concuerdan con los hechos no son importantes.",
    context: "Speech in Algiers, 1964",
    year: 1964,
    category: "ideology",
    audioText: "Words that do not match deeds are unimportant."
  },
  {
    id: "quiver-with-indignation",
    quote: "If you tremble with indignation at every injustice, then you are a comrade of mine.",
    translation: "Si tiemblas de indignación ante toda injusticia, entonces eres un camarada mío.",
    context: "Message to the Tricontinental",
    year: 1967,
    category: "famous",
    audioText: "If you tremble with indignation at every injustice, then you are a comrade of mine."
  },
  {
    id: "many-vietnams",
    quote: "Create two, three, many Vietnams — that is the watchword.",
    translation: "Crear dos, tres, muchos Vietnam — esa es la consigna.",
    context: "Message to the Tricontinental, 1967",
    year: 1967,
    category: "ideology",
    audioText: "Create two, three, many Vietnams — that is the watchword."
  },
  {
    id: "youth-must-march",
    quote: "Youth must refrain from ungrateful abstention and take to the vanguard of all the struggles the people face.",
    translation: "La juventud debe abstenerse de la ingrata abstención y marchar a la vanguardia.",
    context: "Speech to Cuban Youth, 1960",
    year: 1960,
    category: "ideology",
    audioText: "Youth must refrain from ungrateful abstention and take to the vanguard of all the struggles the people face."
  },
  {
    id: "doctor-to-soldier",
    quote: "I became a doctor to heal the sick. Now I see that it is not individuals who are sick — it is the entire system.",
    translation: "Me convertí en médico para curar enfermos. Ahora veo que no son los individuos los que están enfermos — es el sistema entero.",
    context: "Letter to his father, 1960",
    year: 1960,
    category: "personal",
    audioText: "I became a doctor to heal the sick. Now I see that it is not individuals who are sick — it is the entire system."
  },
  {
    id: "face-of-che",
    quote: "Every person has the truth in his heart. No matter how complicated his circumstances, no matter how others look at him from the outside, he can know the truth of his own heart.",
    translation: "Cada persona tiene la verdad en su corazón.",
    context: "Personal diary, 1961",
    year: 1961,
    category: "personal",
    audioText: "Every person has the truth in his heart. No matter how complicated his circumstances, he can know the truth of his own heart."
  },
  {
    id: "struggle-continues",
    quote: "Wherever death may surprise us, let it be welcome, provided that this, our battle cry, may have reached some receptive ear.",
    translation: "Dondequiera que nos sorprenda la muerte, bienvenida sea.",
    context: "Message to the Tricontinental",
    year: 1967,
    category: "famous",
    audioText: "Wherever death may surprise us, let it be welcome, provided that this, our battle cry, may have reached some receptive ear."
  },
  {
    id: "silence-criminal",
    quote: "Silence is argument carried out by other means.",
    translation: "El silencio es argumento llevado a cabo por otros medios.",
    context: "Diary of a Combatant",
    year: 1966,
    category: "ideology",
    audioText: "Silence is argument carried out by other means."
  },
  {
    id: "live-before-dying",
    quote: "I don't care if I fall as long as someone else picks up my gun and keeps on shooting.",
    translation: "No me importa caer si alguien más recoge mi arma y sigue disparando.",
    context: "Letter to Fidel Castro",
    year: 1965,
    category: "personal",
    audioText: "I don't care if I fall as long as someone else picks up my gun and keeps on shooting."
  },
  {
    id: "justice-love",
    quote: "We cannot be sure of having something to live for unless we are willing to die for it.",
    translation: "No podemos estar seguros de tener algo por lo que vivir a menos que estemos dispuestos a morir por ello.",
    context: "Address to Cuban militias, 1960",
    year: 1960,
    category: "ideology",
    audioText: "We cannot be sure of having something to live for unless we are willing to die for it."
  },
  {
    id: "empire-end",
    quote: "The United States is the great enemy of mankind! Against those hyenas there is no option but extermination.",
    translation: "Los Estados Unidos es el gran enemigo de la humanidad.",
    context: "Speech at the OAS, 1961",
    year: 1961,
    category: "historical",
    audioText: "The United States is the great enemy of mankind! Against those hyenas there is no option but extermination."
  },
  {
    id: "motorcycle-transformation",
    quote: "The person who wrote these notes died the day he set foot back on Argentine soil. He who reorganizes and polishes them — he, is me. I am not me any more. At least I'm not the same me I was.",
    translation: "La persona que escribió estas notas murió el día que pisó suelo argentino de vuelta.",
    context: "Prologue to The Motorcycle Diaries",
    year: 1952,
    category: "personal",
    audioText: "The person who wrote these notes died the day he set foot back on Argentine soil. He who reorganizes and polishes them is me. I am not me any more."
  },
  {
    id: "leper-colony",
    quote: "At the end of the road I was someone different, someone who had seen the world from below — and would never forget it.",
    translation: "Al final del camino era alguien diferente, alguien que había visto el mundo desde abajo.",
    context: "The Motorcycle Diaries, San Pablo leper colony",
    year: 1952,
    category: "personal",
    audioText: "At the end of the road I was someone different, someone who had seen the world from below — and would never forget it."
  },
  {
    id: "guerrilla-warfare",
    quote: "Guerrilla warfare is a war of the fish in the sea. When the sea supports the fish, the army cannot drain the ocean.",
    translation: "La guerra de guerrillas es una guerra de los peces en el mar.",
    context: "Guerrilla Warfare, 1960",
    year: 1960,
    category: "historical",
    audioText: "Guerrilla warfare is a war of the fish in the sea. When the sea supports the fish, the army cannot drain the ocean."
  }
];
