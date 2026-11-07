// Generated from the De Uno grammar library. Inline markup: **bold**, _italic_.
export type Block =
  | { k: 'p'; t: string }
  | { k: 'warn'; t: string }
  | { k: 'table'; h: string[]; r: string[][] }
  | { k: 'ex'; items: [string, string][] };
export type Topic = { id: string; lvl: number; t: string; s: string; blocks: Block[]; fx: [string, string][] };
export type PlacementItem = { lvl: number; instruction: string; prompt: string };
export type Scenario = { id: string; t: string; s: string; lvl: number; role: string };

export const LV = ['', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
export const TOPICS: Topic[] = [
 {
  "id": "articles",
  "lvl": 1,
  "t": "Gender & articles",
  "s": "el, la, un, una — and plurals",
  "blocks": [
   {
    "k": "p",
    "t": "Every noun is masculine or feminine. Most nouns ending in **-o** are masculine, most ending in **-a**, **-ción**, **-dad** are feminine."
   },
   {
    "k": "table",
    "h": [
     "",
     "Masc.",
     "Fem."
    ],
    "r": [
     [
      "the (sing.)",
      "el libro",
      "la casa"
     ],
     [
      "the (pl.)",
      "los libros",
      "las casas"
     ],
     [
      "a / some",
      "un libro / unos",
      "una casa / unas"
     ]
    ]
   },
   {
    "k": "p",
    "t": "Plurals: add **-s** after a vowel, **-es** after a consonant (_el árbol → los árboles_)."
   },
   {
    "k": "warn",
    "t": "common exceptions: _el día, el mapa, el problema, la mano, la foto_."
   },
   {
    "k": "ex",
    "items": [
     [
      "La ciudad es muy bonita.",
      "The city is very pretty."
     ],
     [
      "Tengo un problema con el coche.",
      "I have a problem with the car."
     ]
    ]
   }
  ],
  "fx": [
   [
    "The city has some very old buildings.",
    "La ciudad tiene unos edificios muy viejos."
   ],
   [
    "I need a map and a pen.",
    "Necesito un mapa y un bolígrafo."
   ]
  ]
 },
 {
  "id": "present-regular",
  "lvl": 1,
  "t": "Present tense: regular verbs",
  "s": "-ar, -er, -ir endings",
  "blocks": [
   {
    "k": "p",
    "t": "Drop the infinitive ending and add the person ending."
   },
   {
    "k": "table",
    "h": [
     "",
     "hablar",
     "comer",
     "vivir"
    ],
    "r": [
     [
      "yo",
      "hablo",
      "como",
      "vivo"
     ],
     [
      "tú",
      "hablas",
      "comes",
      "vives"
     ],
     [
      "él/ella/usted",
      "habla",
      "come",
      "vive"
     ],
     [
      "nosotros",
      "hablamos",
      "comemos",
      "vivimos"
     ],
     [
      "vosotros",
      "habláis",
      "coméis",
      "vivís"
     ],
     [
      "ellos/ustedes",
      "hablan",
      "comen",
      "viven"
     ]
    ]
   },
   {
    "k": "p",
    "t": "Subject pronouns are usually dropped: the ending already shows who."
   },
   {
    "k": "ex",
    "items": [
     [
      "Trabajo en una oficina y vivo en Madrid.",
      "I work in an office and I live in Madrid."
     ],
     [
      "¿Comes carne?",
      "Do you eat meat?"
     ]
    ]
   }
  ],
  "fx": [
   [
    "We live in a small apartment near the beach.",
    "Vivimos en un apartamento pequeño cerca de la playa."
   ],
   [
    "My sister works in a hospital.",
    "Mi hermana trabaja en un hospital."
   ]
  ]
 },
 {
  "id": "ser-estar",
  "lvl": 1,
  "t": "Ser vs. estar",
  "s": "Two verbs for \"to be\"",
  "blocks": [
   {
    "k": "p",
    "t": "**Ser** describes what something **is**: identity, origin, profession, characteristics, time. **Estar** describes **how or where** something is: location, temporary states, feelings, results."
   },
   {
    "k": "table",
    "h": [
     "",
     "ser",
     "estar"
    ],
    "r": [
     [
      "yo",
      "soy",
      "estoy"
     ],
     [
      "tú",
      "eres",
      "estás"
     ],
     [
      "él/ella",
      "es",
      "está"
     ],
     [
      "nosotros",
      "somos",
      "estamos"
     ],
     [
      "ellos",
      "son",
      "están"
     ]
    ]
   },
   {
    "k": "ex",
    "items": [
     [
      "Soy profesora y soy de Chile.",
      "I am a teacher and I am from Chile."
     ],
     [
      "Estoy cansada y estoy en casa.",
      "I am tired and I am at home."
     ]
    ]
   },
   {
    "k": "warn",
    "t": "location of events uses _ser_: _La fiesta es en mi casa._ Adjectives change meaning: _ser listo_ (clever) vs. _estar listo_ (ready)."
   }
  ],
  "fx": [
   [
    "My brother is a doctor, but today he is sick.",
    "Mi hermano es médico, pero hoy está enfermo."
   ],
   [
    "The museum is in the center and it is very big.",
    "El museo está en el centro y es muy grande."
   ]
  ]
 },
 {
  "id": "tener-hay",
  "lvl": 1,
  "t": "Tener & hay",
  "s": "Possession, age, and \"there is\"",
  "blocks": [
   {
    "k": "p",
    "t": "**Tener** (tengo, tienes, tiene, tenemos, tenéis, tienen) means to have, and is used for age and physical states: _tener hambre, sed, frío, calor, sueño, miedo, prisa_."
   },
   {
    "k": "p",
    "t": "**Hay** means \"there is / there are\" and never changes form."
   },
   {
    "k": "p",
    "t": "**Tener que + infinitive** = to have to."
   },
   {
    "k": "ex",
    "items": [
     [
      "Tengo veinticinco años y tengo hambre.",
      "I am 25 and I am hungry."
     ],
     [
      "Hay tres parques en mi barrio.",
      "There are three parks in my neighborhood."
     ],
     [
      "Tenemos que salir temprano.",
      "We have to leave early."
     ]
    ]
   },
   {
    "k": "warn",
    "t": "_hay_ uses indefinite articles (_hay un banco_); for a specific thing use _estar_ (_el banco está allí_)."
   }
  ],
  "fx": [
   [
    "There is a supermarket next to my house.",
    "Hay un supermercado al lado de mi casa."
   ],
   [
    "I am cold and I have to buy a jacket.",
    "Tengo frío y tengo que comprar una chaqueta."
   ]
  ]
 },
 {
  "id": "adjectives",
  "lvl": 1,
  "t": "Adjective agreement",
  "s": "Matching gender and number",
  "blocks": [
   {
    "k": "p",
    "t": "Adjectives match the noun and usually go **after** it."
   },
   {
    "k": "table",
    "h": [
     "",
     "Masc.",
     "Fem."
    ],
    "r": [
     [
      "-o / -a",
      "un chico alto",
      "una chica alta"
     ],
     [
      "-e / consonant",
      "un coche grande",
      "una casa grande"
     ],
     [
      "plural",
      "chicos altos",
      "chicas altas"
     ]
    ]
   },
   {
    "k": "p",
    "t": "Before the noun: _bueno → buen_, _malo → mal_, _grande → gran_ (meaning \"great\")."
   },
   {
    "k": "ex",
    "items": [
     [
      "Tengo dos gatos negros.",
      "I have two black cats."
     ],
     [
      "Es un buen restaurante.",
      "It is a good restaurant."
     ]
    ]
   }
  ],
  "fx": [
   [
    "My parents are very kind and funny.",
    "Mis padres son muy amables y divertidos."
   ],
   [
    "She lives in a white house with a big garden.",
    "Ella vive en una casa blanca con un jardín grande."
   ]
  ]
 },
 {
  "id": "questions",
  "lvl": 1,
  "t": "Asking questions",
  "s": "¿Qué? ¿Dónde? ¿Cuándo? …",
  "blocks": [
   {
    "k": "p",
    "t": "Questions open with **¿** and close with **?**. Question words always carry an accent."
   },
   {
    "k": "table",
    "h": [
     "Word",
     "Meaning"
    ],
    "r": [
     [
      "¿qué?",
      "what?"
     ],
     [
      "¿quién(es)?",
      "who?"
     ],
     [
      "¿dónde? / ¿adónde?",
      "where? / to where?"
     ],
     [
      "¿cuándo?",
      "when?"
     ],
     [
      "¿cómo?",
      "how?"
     ],
     [
      "¿por qué?",
      "why? (answer: porque)"
     ],
     [
      "¿cuánto/a/os/as?",
      "how much / how many?"
     ],
     [
      "¿cuál(es)?",
      "which?"
     ]
    ]
   },
   {
    "k": "ex",
    "items": [
     [
      "¿Dónde vives?",
      "Where do you live?"
     ],
     [
      "¿Cuántos hermanos tienes?",
      "How many siblings do you have?"
     ]
    ]
   }
  ],
  "fx": [
   [
    "Where do you work and when do you finish?",
    "¿Dónde trabajas y cuándo terminas?"
   ],
   [
    "Why are you learning Spanish?",
    "¿Por qué aprendes español?"
   ]
  ]
 },
 {
  "id": "gustar",
  "lvl": 1,
  "t": "Gustar & similar verbs",
  "s": "\"It pleases me\"",
  "blocks": [
   {
    "k": "p",
    "t": "**Gustar** agrees with the thing liked, not the person. The person is an indirect object pronoun."
   },
   {
    "k": "table",
    "h": [
     "",
     "singular / verb",
     "plural"
    ],
    "r": [
     [
      "me",
      "me gusta el café",
      "me gustan los libros"
     ],
     [
      "te",
      "te gusta",
      "te gustan"
     ],
     [
      "le",
      "le gusta",
      "le gustan"
     ],
     [
      "nos",
      "nos gusta",
      "nos gustan"
     ],
     [
      "les",
      "les gusta",
      "les gustan"
     ]
    ]
   },
   {
    "k": "p",
    "t": "Same pattern: _encantar, interesar, molestar, doler, faltar_."
   },
   {
    "k": "ex",
    "items": [
     [
      "Me encanta bailar.",
      "I love dancing."
     ],
     [
      "A mi madre le duelen los pies.",
      "My mother's feet hurt."
     ]
    ]
   },
   {
    "k": "warn",
    "t": "use the article: _Me gusta **el** chocolate_, not _Me gusta chocolate_."
   }
  ],
  "fx": [
   [
    "We love Mexican food, but we don't like spicy sauces.",
    "Nos encanta la comida mexicana, pero no nos gustan las salsas picantes."
   ],
   [
    "My head hurts and the noise bothers me.",
    "Me duele la cabeza y me molesta el ruido."
   ]
  ]
 },
 {
  "id": "present-irregular",
  "lvl": 1,
  "t": "Present: key irregulars",
  "s": "ir, hacer, poner, salir, decir…",
  "blocks": [
   {
    "k": "p",
    "t": "Many common verbs are irregular, often only in the _yo_ form."
   },
   {
    "k": "table",
    "h": [
     "Verb",
     "yo",
     "tú",
     "él",
     "nosotros"
    ],
    "r": [
     [
      "ir",
      "voy",
      "vas",
      "va",
      "vamos"
     ],
     [
      "hacer",
      "hago",
      "haces",
      "hace",
      "hacemos"
     ],
     [
      "poner",
      "pongo",
      "pones",
      "pone",
      "ponemos"
     ],
     [
      "salir",
      "salgo",
      "sales",
      "sale",
      "salimos"
     ],
     [
      "decir",
      "digo",
      "dices",
      "dice",
      "decimos"
     ],
     [
      "conocer",
      "conozco",
      "conoces",
      "conoce",
      "conocemos"
     ],
     [
      "saber",
      "sé",
      "sabes",
      "sabe",
      "sabemos"
     ]
    ]
   },
   {
    "k": "ex",
    "items": [
     [
      "Los sábados salgo con mis amigos.",
      "On Saturdays I go out with my friends."
     ],
     [
      "No sé dónde está.",
      "I don't know where it is."
     ]
    ]
   }
  ],
  "fx": [
   [
    "I go to the gym every morning and I do yoga.",
    "Voy al gimnasio todas las mañanas y hago yoga."
   ],
   [
    "I know your sister, but I don't know where she lives.",
    "Conozco a tu hermana, pero no sé dónde vive."
   ]
  ]
 },
 {
  "id": "stem-changing",
  "lvl": 1,
  "t": "Stem-changing verbs",
  "s": "e→ie, o→ue, e→i",
  "blocks": [
   {
    "k": "p",
    "t": "The stem vowel changes in every form except _nosotros_ and _vosotros_."
   },
   {
    "k": "table",
    "h": [
     "Change",
     "Example",
     "Forms"
    ],
    "r": [
     [
      "e → ie",
      "querer",
      "quiero, quieres, quiere, queremos, quieren"
     ],
     [
      "o → ue",
      "poder",
      "puedo, puedes, puede, podemos, pueden"
     ],
     [
      "e → i",
      "pedir",
      "pido, pides, pide, pedimos, piden"
     ],
     [
      "u → ue",
      "jugar",
      "juego, juegas, juega, jugamos, juegan"
     ]
    ]
   },
   {
    "k": "p",
    "t": "Others: _pensar, empezar, preferir, dormir, volver, encontrar, servir, repetir_."
   },
   {
    "k": "ex",
    "items": [
     [
      "¿Puedes ayudarme?",
      "Can you help me?"
     ],
     [
      "Siempre pido la sopa.",
      "I always order the soup."
     ]
    ]
   }
  ],
  "fx": [
   [
    "The movie starts at eight, but I prefer to go later.",
    "La película empieza a las ocho, pero prefiero ir más tarde."
   ],
   [
    "My children sleep a lot on weekends.",
    "Mis hijos duermen mucho los fines de semana."
   ]
  ]
 },
 {
  "id": "reflexive",
  "lvl": 2,
  "t": "Reflexive verbs",
  "s": "levantarse, ducharse, llamarse",
  "blocks": [
   {
    "k": "p",
    "t": "The pronoun matches the subject: **me, te, se, nos, os, se**. It goes before a conjugated verb or attached to an infinitive."
   },
   {
    "k": "table",
    "h": [
     "",
     "levantarse"
    ],
    "r": [
     [
      "yo",
      "me levanto"
     ],
     [
      "tú",
      "te levantas"
     ],
     [
      "él/ella",
      "se levanta"
     ],
     [
      "nosotros",
      "nos levantamos"
     ],
     [
      "ellos",
      "se levantan"
     ]
    ]
   },
   {
    "k": "ex",
    "items": [
     [
      "Me ducho antes de desayunar.",
      "I shower before having breakfast."
     ],
     [
      "Voy a acostarme temprano.",
      "I'm going to go to bed early."
     ]
    ]
   },
   {
    "k": "warn",
    "t": "some verbs change meaning: _ir_ (go) vs. _irse_ (leave), _dormir_ vs. _dormirse_ (fall asleep)."
   }
  ],
  "fx": [
   [
    "I get up at seven and I get dressed quickly.",
    "Me levanto a las siete y me visto rápidamente."
   ],
   [
    "We always have fun at your parties.",
    "Siempre nos divertimos en tus fiestas."
   ]
  ]
 },
 {
  "id": "ir-a",
  "lvl": 2,
  "t": "Near future: ir a + infinitive",
  "s": "Plans and intentions",
  "blocks": [
   {
    "k": "p",
    "t": "Conjugate **ir** + **a** + infinitive to talk about plans."
   },
   {
    "k": "table",
    "h": [
     "",
     ""
    ],
    "r": [
     [
      "yo",
      "voy a viajar"
     ],
     [
      "tú",
      "vas a viajar"
     ],
     [
      "él",
      "va a viajar"
     ],
     [
      "nosotros",
      "vamos a viajar"
     ],
     [
      "ellos",
      "van a viajar"
     ]
    ]
   },
   {
    "k": "ex",
    "items": [
     [
      "Este verano voy a aprender a nadar.",
      "This summer I'm going to learn to swim."
     ],
     [
      "¿Qué vais a hacer esta noche?",
      "What are you all going to do tonight?"
     ]
    ]
   }
  ],
  "fx": [
   [
    "Tomorrow we are going to visit my grandparents.",
    "Mañana vamos a visitar a mis abuelos."
   ],
   [
    "It's going to rain this afternoon.",
    "Va a llover esta tarde."
   ]
  ]
 },
 {
  "id": "preterite-regular",
  "lvl": 2,
  "t": "Preterite: regular verbs",
  "s": "Completed past actions",
  "blocks": [
   {
    "k": "p",
    "t": "Use the preterite for finished actions at a specific time: _ayer, el lunes, en 2019, hace dos años_."
   },
   {
    "k": "table",
    "h": [
     "",
     "hablar",
     "comer / vivir"
    ],
    "r": [
     [
      "yo",
      "hablé",
      "comí / viví"
     ],
     [
      "tú",
      "hablaste",
      "comiste / viviste"
     ],
     [
      "él/ella",
      "habló",
      "comió / vivió"
     ],
     [
      "nosotros",
      "hablamos",
      "comimos / vivimos"
     ],
     [
      "vosotros",
      "hablasteis",
      "comisteis / vivisteis"
     ],
     [
      "ellos",
      "hablaron",
      "comieron / vivieron"
     ]
    ]
   },
   {
    "k": "warn",
    "t": "spelling changes in _yo_: _llegué, busqué, empecé_."
   },
   {
    "k": "ex",
    "items": [
     [
      "Ayer llamé a mi madre.",
      "Yesterday I called my mother."
     ],
     [
      "Vivieron en Lima tres años.",
      "They lived in Lima for three years."
     ]
    ]
   }
  ],
  "fx": [
   [
    "Last night I cooked dinner and watched a movie.",
    "Anoche cociné la cena y vi una película."
   ],
   [
    "We arrived at the airport at ten.",
    "Llegamos al aeropuerto a las diez."
   ]
  ]
 },
 {
  "id": "preterite-irregular",
  "lvl": 2,
  "t": "Preterite: irregular verbs",
  "s": "fui, tuve, hice, estuve…",
  "blocks": [
   {
    "k": "p",
    "t": "Irregular preterites have no accents."
   },
   {
    "k": "table",
    "h": [
     "Verb",
     "yo",
     "él",
     "ellos"
    ],
    "r": [
     [
      "ser / ir",
      "fui",
      "fue",
      "fueron"
     ],
     [
      "tener",
      "tuve",
      "tuvo",
      "tuvieron"
     ],
     [
      "estar",
      "estuve",
      "estuvo",
      "estuvieron"
     ],
     [
      "hacer",
      "hice",
      "hizo",
      "hicieron"
     ],
     [
      "poder",
      "pude",
      "pudo",
      "pudieron"
     ],
     [
      "poner",
      "puse",
      "puso",
      "pusieron"
     ],
     [
      "querer",
      "quise",
      "quiso",
      "quisieron"
     ],
     [
      "venir",
      "vine",
      "vino",
      "vinieron"
     ],
     [
      "decir",
      "dije",
      "dijo",
      "dijeron"
     ],
     [
      "dar",
      "di",
      "dio",
      "dieron"
     ]
    ]
   },
   {
    "k": "ex",
    "items": [
     [
      "El año pasado fuimos a Colombia.",
      "Last year we went to Colombia."
     ],
     [
      "No pude dormir.",
      "I couldn't sleep."
     ]
    ]
   }
  ],
  "fx": [
   [
    "Last weekend I went to the beach and had a great time.",
    "El fin de semana pasado fui a la playa y lo pasé muy bien."
   ],
   [
    "She told me the truth yesterday.",
    "Ella me dijo la verdad ayer."
   ]
  ]
 },
 {
  "id": "imperfect",
  "lvl": 2,
  "t": "Imperfect tense",
  "s": "Habits, descriptions in the past",
  "blocks": [
   {
    "k": "p",
    "t": "Use it for habits (_used to_), background descriptions, age and time in the past, and ongoing actions."
   },
   {
    "k": "table",
    "h": [
     "",
     "-ar",
     "-er / -ir"
    ],
    "r": [
     [
      "yo",
      "hablaba",
      "comía"
     ],
     [
      "tú",
      "hablabas",
      "comías"
     ],
     [
      "él",
      "hablaba",
      "comía"
     ],
     [
      "nosotros",
      "hablábamos",
      "comíamos"
     ],
     [
      "ellos",
      "hablaban",
      "comían"
     ]
    ]
   },
   {
    "k": "p",
    "t": "Only three irregulars: _ser (era), ir (iba), ver (veía)_."
   },
   {
    "k": "ex",
    "items": [
     [
      "Cuando era niño, vivía en el campo.",
      "When I was a child, I lived in the countryside."
     ],
     [
      "Hacía sol y la gente paseaba.",
      "It was sunny and people were strolling."
     ]
    ]
   }
  ],
  "fx": [
   [
    "When I was young, I played football every afternoon.",
    "Cuando era joven, jugaba al fútbol todas las tardes."
   ],
   [
    "My grandmother always made bread on Sundays.",
    "Mi abuela siempre hacía pan los domingos."
   ]
  ]
 },
 {
  "id": "pret-vs-imp",
  "lvl": 2,
  "t": "Preterite vs. imperfect",
  "s": "Telling a story in the past",
  "blocks": [
   {
    "k": "p",
    "t": "The **imperfect** sets the scene; the **preterite** moves the story forward."
   },
   {
    "k": "table",
    "h": [
     "Imperfect",
     "Preterite"
    ],
    "r": [
     [
      "background, description",
      "single completed event"
     ],
     [
      "repeated habit",
      "specific number of times"
     ],
     [
      "ongoing action (was doing)",
      "action that interrupts"
     ],
     [
      "siempre, cada día, mientras",
      "ayer, de repente, una vez"
     ]
    ]
   },
   {
    "k": "ex",
    "items": [
     [
      "Estaba en la ducha cuando sonó el teléfono.",
      "I was in the shower when the phone rang."
     ],
     [
      "Llovía mucho, así que nos quedamos en casa.",
      "It was raining a lot, so we stayed home."
     ]
    ]
   }
  ],
  "fx": [
   [
    "I was reading when my friend arrived.",
    "Estaba leyendo cuando llegó mi amigo."
   ],
   [
    "It was late and we were tired, so we took a taxi.",
    "Era tarde y estábamos cansados, así que tomamos un taxi."
   ]
  ]
 },
 {
  "id": "direct-object",
  "lvl": 2,
  "t": "Direct object pronouns",
  "s": "lo, la, los, las",
  "blocks": [
   {
    "k": "p",
    "t": "Replace the thing or person receiving the action: **me, te, lo/la, nos, os, los/las**. They go before the conjugated verb, or attached to an infinitive / gerund / affirmative command."
   },
   {
    "k": "ex",
    "items": [
     [
      "¿Tienes las llaves? — Sí, las tengo.",
      "Do you have the keys? — Yes, I have them."
     ],
     [
      "Voy a llamarte mañana. / Te voy a llamar mañana.",
      "I'm going to call you tomorrow."
     ]
    ]
   },
   {
    "k": "warn",
    "t": "personal _a_ before people as direct objects: _Veo **a** María._"
   }
  ],
  "fx": [
   [
    "I bought the tickets and I have them in my bag.",
    "Compré las entradas y las tengo en mi bolso."
   ],
   [
    "I don't know him, but I want to meet him.",
    "No lo conozco, pero quiero conocerlo."
   ]
  ]
 },
 {
  "id": "indirect-object",
  "lvl": 2,
  "t": "Indirect & double pronouns",
  "s": "le, les → se lo",
  "blocks": [
   {
    "k": "p",
    "t": "Indirect objects say to/for whom: **me, te, le, nos, os, les**. With both pronouns, indirect comes first, and _le/les_ become **se** before _lo/la/los/las_."
   },
   {
    "k": "ex",
    "items": [
     [
      "Le escribí una carta a mi abuela.",
      "I wrote a letter to my grandmother."
     ],
     [
      "¿Le diste el libro? — Sí, se lo di.",
      "Did you give him the book? — Yes, I gave it to him."
     ],
     [
      "Dímelo.",
      "Tell it to me."
     ]
    ]
   }
  ],
  "fx": [
   [
    "I sent the photos to my parents yesterday.",
    "Les mandé las fotos a mis padres ayer."
   ],
   [
    "Can you lend me your car? I'll give it back to you tomorrow.",
    "¿Me puedes prestar tu coche? Te lo devuelvo mañana."
   ]
  ]
 },
 {
  "id": "por-para",
  "lvl": 2,
  "t": "Por vs. para",
  "s": "Cause and route vs. purpose and goal",
  "blocks": [
   {
    "k": "table",
    "h": [
     "por",
     "para"
    ],
    "r": [
     [
      "cause, reason: _por la lluvia_",
      "purpose: _para aprender_"
     ],
     [
      "through, around: _por el parque_",
      "destination: _para Madrid_"
     ],
     [
      "duration: _por dos horas_",
      "deadline: _para el lunes_"
     ],
     [
      "exchange: _diez euros por el libro_",
      "recipient: _para ti_"
     ],
     [
      "means: _por teléfono_",
      "opinion: _para mí_"
     ]
    ]
   },
   {
    "k": "ex",
    "items": [
     [
      "Gracias por tu ayuda.",
      "Thanks for your help."
     ],
     [
      "Estudio español para viajar por Sudamérica.",
      "I study Spanish in order to travel around South America."
     ]
    ]
   }
  ],
  "fx": [
   [
    "This gift is for you, thanks for everything.",
    "Este regalo es para ti, gracias por todo."
   ],
   [
    "We walked through the old town for two hours.",
    "Caminamos por el casco antiguo durante dos horas."
   ]
  ]
 },
 {
  "id": "comparatives",
  "lvl": 2,
  "t": "Comparatives & superlatives",
  "s": "más… que, tan… como, el más…",
  "blocks": [
   {
    "k": "table",
    "h": [
     "Pattern",
     "Example"
    ],
    "r": [
     [
      "más / menos + adj + que",
      "Ana es más alta que Luis."
     ],
     [
      "tan + adj + como",
      "Es tan caro como el otro."
     ],
     [
      "tanto/a/os/as + noun + como",
      "Tengo tantos libros como tú."
     ],
     [
      "el/la más + adj + de",
      "Es el río más largo del mundo."
     ]
    ]
   },
   {
    "k": "p",
    "t": "Irregular: _mejor, peor, mayor, menor_."
   },
   {
    "k": "ex",
    "items": [
     [
      "Esta película es mejor que la primera.",
      "This movie is better than the first one."
     ]
    ]
   }
  ],
  "fx": [
   [
    "My city is smaller than Madrid, but it is just as beautiful.",
    "Mi ciudad es más pequeña que Madrid, pero es tan bonita como ella."
   ],
   [
    "This is the best restaurant in the neighborhood.",
    "Este es el mejor restaurante del barrio."
   ]
  ]
 },
 {
  "id": "present-progressive",
  "lvl": 2,
  "t": "Present progressive",
  "s": "estar + gerundio",
  "blocks": [
   {
    "k": "p",
    "t": "For actions happening right now: **estar + -ando / -iendo**."
   },
   {
    "k": "table",
    "h": [
     "Infinitive",
     "Gerund"
    ],
    "r": [
     [
      "hablar",
      "hablando"
     ],
     [
      "comer",
      "comiendo"
     ],
     [
      "leer",
      "leyendo"
     ],
     [
      "dormir",
      "durmiendo"
     ],
     [
      "pedir",
      "pidiendo"
     ]
    ]
   },
   {
    "k": "ex",
    "items": [
     [
      "¿Qué estás haciendo? — Estoy cocinando.",
      "What are you doing? — I'm cooking."
     ]
    ]
   },
   {
    "k": "warn",
    "t": "Spanish does not use it for the future: _Mañana salgo_, not _estoy saliendo mañana_."
   }
  ],
  "fx": [
   [
    "Right now my kids are sleeping and I am reading.",
    "Ahora mismo mis hijos están durmiendo y yo estoy leyendo."
   ],
   [
    "What are you watching on TV?",
    "¿Qué estás viendo en la tele?"
   ]
  ]
 },
 {
  "id": "present-perfect",
  "lvl": 3,
  "t": "Present perfect",
  "s": "he hablado, has comido",
  "blocks": [
   {
    "k": "p",
    "t": "**haber** (he, has, ha, hemos, habéis, han) + participle (-ado / -ido). Used for experiences and the recent past linked to now: _hoy, esta semana, ya, todavía no, nunca_."
   },
   {
    "k": "p",
    "t": "Irregular participles: _hecho, dicho, visto, escrito, puesto, vuelto, abierto, roto, muerto_."
   },
   {
    "k": "ex",
    "items": [
     [
      "¿Has estado alguna vez en México?",
      "Have you ever been to Mexico?"
     ],
     [
      "Esta mañana he desayunado fuera.",
      "This morning I had breakfast out."
     ]
    ]
   },
   {
    "k": "warn",
    "t": "much of Latin America prefers the preterite for the recent past: _Hoy desayuné fuera._"
   }
  ],
  "fx": [
   [
    "I have never tried Peruvian food.",
    "Nunca he probado la comida peruana."
   ],
   [
    "Have you already written the email?",
    "¿Ya has escrito el correo?"
   ]
  ]
 },
 {
  "id": "future",
  "lvl": 3,
  "t": "Simple future",
  "s": "hablaré, comeré, iré",
  "blocks": [
   {
    "k": "p",
    "t": "Add endings to the full infinitive: **-é, -ás, -á, -emos, -éis, -án**. It also expresses probability now: _¿Qué hora será?_ (I wonder what time it is.)"
   },
   {
    "k": "table",
    "h": [
     "Irregular stem",
     "yo"
    ],
    "r": [
     [
      "tener",
      "tendré"
     ],
     [
      "poder",
      "podré"
     ],
     [
      "salir",
      "saldré"
     ],
     [
      "hacer",
      "haré"
     ],
     [
      "decir",
      "diré"
     ],
     [
      "venir",
      "vendré"
     ],
     [
      "saber",
      "sabré"
     ],
     [
      "querer",
      "querré"
     ]
    ]
   },
   {
    "k": "ex",
    "items": [
     [
      "El año que viene viviremos en Barcelona.",
      "Next year we will live in Barcelona."
     ]
    ]
   }
  ],
  "fx": [
   [
    "One day I will speak Spanish perfectly.",
    "Algún día hablaré español perfectamente."
   ],
   [
    "We will have more time next month.",
    "Tendremos más tiempo el mes que viene."
   ]
  ]
 },
 {
  "id": "conditional",
  "lvl": 3,
  "t": "Conditional",
  "s": "hablaría — would",
  "blocks": [
   {
    "k": "p",
    "t": "Infinitive + **-ía, -ías, -ía, -íamos, -íais, -ían**. Same irregular stems as the future (_tendría, podría, haría_). Used for polite requests, advice and hypotheticals."
   },
   {
    "k": "ex",
    "items": [
     [
      "¿Podrías cerrar la ventana?",
      "Could you close the window?"
     ],
     [
      "Yo en tu lugar hablaría con ella.",
      "If I were you, I would talk to her."
     ]
    ]
   }
  ],
  "fx": [
   [
    "I would like a table for two, please.",
    "Me gustaría una mesa para dos, por favor."
   ],
   [
    "In your place, I would buy the cheaper one.",
    "Yo en tu lugar compraría el más barato."
   ]
  ]
 },
 {
  "id": "imperative",
  "lvl": 3,
  "t": "Commands (imperative)",
  "s": "habla, no hables, hable usted",
  "blocks": [
   {
    "k": "table",
    "h": [
     "",
     "Affirmative",
     "Negative"
    ],
    "r": [
     [
      "tú",
      "habla / come",
      "no hables / no comas"
     ],
     [
      "usted",
      "hable / coma",
      "no hable / no coma"
     ],
     [
      "vosotros",
      "hablad / comed",
      "no habléis / no comáis"
     ],
     [
      "ustedes",
      "hablen / coman",
      "no hablen / no coman"
     ]
    ]
   },
   {
    "k": "p",
    "t": "Irregular _tú_: _di, haz, ve, pon, sal, sé, ten, ven_. Pronouns attach to affirmative commands (_dímelo_) and go before negative ones (_no me lo digas_)."
   }
  ],
  "fx": [
   [
    "Close the door and sit down, please.",
    "Cierra la puerta y siéntate, por favor."
   ],
   [
    "Don't tell him anything yet.",
    "No le digas nada todavía."
   ]
  ]
 },
 {
  "id": "subj-present",
  "lvl": 3,
  "t": "Present subjunctive: forms",
  "s": "hable, coma, viva",
  "blocks": [
   {
    "k": "p",
    "t": "Take the _yo_ present, drop _-o_, and switch vowels: -ar → **-e**, -er/-ir → **-a**."
   },
   {
    "k": "table",
    "h": [
     "",
     "hablar",
     "tener (tengo)"
    ],
    "r": [
     [
      "yo",
      "hable",
      "tenga"
     ],
     [
      "tú",
      "hables",
      "tengas"
     ],
     [
      "él",
      "hable",
      "tenga"
     ],
     [
      "nosotros",
      "hablemos",
      "tengamos"
     ],
     [
      "ellos",
      "hablen",
      "tengan"
     ]
    ]
   },
   {
    "k": "p",
    "t": "Irregular: _ser → sea, ir → vaya, estar → esté, saber → sepa, haber → haya, dar → dé_."
   }
  ],
  "fx": [
   [
    "I hope that you have a good trip.",
    "Espero que tengas un buen viaje."
   ],
   [
    "My boss wants me to finish the report today.",
    "Mi jefe quiere que termine el informe hoy."
   ]
  ]
 },
 {
  "id": "subj-uses",
  "lvl": 3,
  "t": "Subjunctive: wishes, emotion, doubt",
  "s": "quiero que, me alegro de que, no creo que",
  "blocks": [
   {
    "k": "p",
    "t": "When the main clause expresses **wish, emotion, doubt or judgment** and the subject changes, the second verb goes into the subjunctive."
   },
   {
    "k": "table",
    "h": [
     "Trigger",
     "Example"
    ],
    "r": [
     [
      "wish: querer que, esperar que",
      "Quiero que vengas."
     ],
     [
      "emotion: me alegra que, siento que",
      "Me alegra que estés aquí."
     ],
     [
      "doubt: no creo que, dudo que",
      "No creo que llueva."
     ],
     [
      "judgment: es importante que",
      "Es importante que duermas."
     ],
     [
      "ojalá",
      "Ojalá gane mi equipo."
     ]
    ]
   },
   {
    "k": "warn",
    "t": "_creo que_ (affirmative) takes the indicative: _Creo que **llueve**._"
   }
  ],
  "fx": [
   [
    "I don't think that the store is open now.",
    "No creo que la tienda esté abierta ahora."
   ],
   [
    "I'm glad that you can come to my party.",
    "Me alegra que puedas venir a mi fiesta."
   ]
  ]
 },
 {
  "id": "relative",
  "lvl": 3,
  "t": "Relative pronouns",
  "s": "que, quien, donde, lo que",
  "blocks": [
   {
    "k": "table",
    "h": [
     "Pronoun",
     "Use"
    ],
    "r": [
     [
      "que",
      "most cases (people and things)"
     ],
     [
      "quien(es)",
      "people, after a preposition: _la chica con quien hablé_"
     ],
     [
      "donde",
      "places"
     ],
     [
      "lo que",
      "\"what\" = the thing that"
     ],
     [
      "el/la que, el cual",
      "after prepositions, formal"
     ]
    ]
   },
   {
    "k": "ex",
    "items": [
     [
      "El libro que me prestaste es genial.",
      "The book you lent me is great."
     ],
     [
      "No entiendo lo que dices.",
      "I don't understand what you're saying."
     ]
    ]
   }
  ],
  "fx": [
   [
    "This is the restaurant where we met.",
    "Este es el restaurante donde nos conocimos."
   ],
   [
    "What I need is a long holiday.",
    "Lo que necesito es unas largas vacaciones."
   ]
  ]
 },
 {
  "id": "subj-adverbial",
  "lvl": 4,
  "t": "Subjunctive after conjunctions",
  "s": "cuando, para que, antes de que, aunque",
  "blocks": [
   {
    "k": "p",
    "t": "**Cuando, hasta que, en cuanto, tan pronto como** take the subjunctive when referring to the **future**. **Para que, antes de que, sin que, a menos que, con tal de que** always take it."
   },
   {
    "k": "ex",
    "items": [
     [
      "Cuando llegue, te llamo.",
      "When I arrive, I'll call you."
     ],
     [
      "Te lo explico para que lo entiendas.",
      "I'll explain it so that you understand."
     ],
     [
      "Aunque llueva, saldremos.",
      "Even if it rains, we'll go out."
     ]
    ]
   }
  ],
  "fx": [
   [
    "As soon as I finish work, I will go to the gym.",
    "En cuanto termine el trabajo, iré al gimnasio."
   ],
   [
    "I will lend you the book so that you can read it on the train.",
    "Te prestaré el libro para que puedas leerlo en el tren."
   ]
  ]
 },
 {
  "id": "subj-relative",
  "lvl": 4,
  "t": "Subjunctive in relative clauses",
  "s": "Busco a alguien que sepa…",
  "blocks": [
   {
    "k": "p",
    "t": "When the antecedent is unknown, hypothetical or nonexistent, the relative clause takes the subjunctive."
   },
   {
    "k": "ex",
    "items": [
     [
      "Busco un piso que tenga terraza.",
      "I'm looking for a flat that has a terrace (any flat)."
     ],
     [
      "No hay nadie que lo sepa.",
      "There is nobody who knows it."
     ]
    ]
   },
   {
    "k": "p",
    "t": "Compare: _Tengo un piso que **tiene** terraza_ (a known flat)."
   }
  ],
  "fx": [
   [
    "I need a person who speaks Spanish and English.",
    "Necesito una persona que hable español e inglés."
   ],
   [
    "Is there anyone here who can help me?",
    "¿Hay alguien aquí que pueda ayudarme?"
   ]
  ]
 },
 {
  "id": "subj-imperfect",
  "lvl": 4,
  "t": "Imperfect subjunctive",
  "s": "hablara, comiera, fuera",
  "blocks": [
   {
    "k": "p",
    "t": "Take the _ellos_ preterite, drop _-ron_, add **-ra, -ras, -ra, -ramos, -rais, -ran**."
   },
   {
    "k": "table",
    "h": [
     "Preterite",
     "Imp. subj."
    ],
    "r": [
     [
      "hablaron",
      "hablara"
     ],
     [
      "tuvieron",
      "tuviera"
     ],
     [
      "fueron",
      "fuera"
     ],
     [
      "pudieron",
      "pudiera"
     ],
     [
      "dijeron",
      "dijera"
     ]
    ]
   },
   {
    "k": "p",
    "t": "Used after a past trigger: _Quería que **vinieras**._ Also with _ojalá_ for unlikely wishes, and in polite requests: _Quisiera un café._"
   }
  ],
  "fx": [
   [
    "My parents wanted me to study medicine.",
    "Mis padres querían que estudiara medicina."
   ],
   [
    "I wish I had more free time.",
    "Ojalá tuviera más tiempo libre."
   ]
  ]
 },
 {
  "id": "si-clauses",
  "lvl": 4,
  "t": "Conditional sentences (si…)",
  "s": "Real, unlikely and impossible",
  "blocks": [
   {
    "k": "table",
    "h": [
     "Type",
     "si-clause",
     "result"
    ],
    "r": [
     [
      "real",
      "si + present",
      "present / future / command"
     ],
     [
      "unlikely now",
      "si + imperfect subj.",
      "conditional"
     ],
     [
      "impossible past",
      "si + pluperfect subj.",
      "conditional perfect"
     ]
    ]
   },
   {
    "k": "ex",
    "items": [
     [
      "Si tengo tiempo, te ayudo.",
      "If I have time, I'll help you."
     ],
     [
      "Si tuviera dinero, viajaría más.",
      "If I had money, I would travel more."
     ],
     [
      "Si hubiera sabido, habría venido.",
      "If I had known, I would have come."
     ]
    ]
   },
   {
    "k": "warn",
    "t": "never use the conditional after _si_: _Si **tuviera**_, not _si tendría_."
   }
  ],
  "fx": [
   [
    "If I won the lottery, I would buy a house by the sea.",
    "Si ganara la lotería, compraría una casa junto al mar."
   ],
   [
    "If it rains tomorrow, we will stay at home.",
    "Si llueve mañana, nos quedaremos en casa."
   ]
  ]
 },
 {
  "id": "pluperfect",
  "lvl": 4,
  "t": "Pluperfect",
  "s": "había hecho — had done",
  "blocks": [
   {
    "k": "p",
    "t": "**haber** in the imperfect (había, habías, había, habíamos, habíais, habían) + participle. An action before another past action."
   },
   {
    "k": "ex",
    "items": [
     [
      "Cuando llegué, la película ya había empezado.",
      "When I arrived, the movie had already started."
     ],
     [
      "Nunca había visto algo así.",
      "I had never seen anything like it."
     ]
    ]
   }
  ],
  "fx": [
   [
    "When we arrived at the station, the train had already left.",
    "Cuando llegamos a la estación, el tren ya se había ido."
   ],
   [
    "She told me that she had lost her passport.",
    "Me dijo que había perdido su pasaporte."
   ]
  ]
 },
 {
  "id": "passive-se",
  "lvl": 4,
  "t": "Passive & impersonal se",
  "s": "Se habla español, se venden pisos",
  "blocks": [
   {
    "k": "p",
    "t": "**se** + 3rd person verb removes the doer. The verb agrees with the thing: _se vende casa / se venden casas_. Impersonal _se_ = \"people / one\": _Aquí se vive bien._"
   },
   {
    "k": "p",
    "t": "Accidental **se**: _Se me olvidó la llave_ (I forgot the key — it \"got forgotten on me\")."
   },
   {
    "k": "ex",
    "items": [
     [
      "En este restaurante se come muy bien.",
      "You eat very well in this restaurant."
     ],
     [
      "Se me rompieron las gafas.",
      "My glasses broke (on me)."
     ]
    ]
   }
  ],
  "fx": [
   [
    "In this shop they sell second-hand books.",
    "En esta tienda se venden libros de segunda mano."
   ],
   [
    "I forgot my phone at home.",
    "Se me olvidó el móvil en casa."
   ]
  ]
 },
 {
  "id": "perfect-compound",
  "lvl": 5,
  "t": "Future & conditional perfect",
  "s": "habré hecho, habría hecho",
  "blocks": [
   {
    "k": "p",
    "t": "**habré** + participle: will have done (or a guess about the past: _Habrá perdido el tren_ — he must have missed the train). **habría** + participle: would have done."
   },
   {
    "k": "ex",
    "items": [
     [
      "Para junio habré terminado la tesis.",
      "By June I will have finished the thesis."
     ],
     [
      "Yo no lo habría dicho así.",
      "I wouldn't have said it like that."
     ]
    ]
   }
  ],
  "fx": [
   [
    "By the time you arrive, we will have eaten.",
    "Para cuando llegues, ya habremos comido."
   ],
   [
    "I would have called you, but I didn't have signal.",
    "Te habría llamado, pero no tenía cobertura."
   ]
  ]
 },
 {
  "id": "reported",
  "lvl": 5,
  "t": "Reported speech",
  "s": "Dijo que…, me pidió que…",
  "blocks": [
   {
    "k": "table",
    "h": [
     "Direct",
     "Reported (past)"
    ],
    "r": [
     [
      "present: \"Estoy cansado\"",
      "imperfect: dijo que estaba cansado"
     ],
     [
      "preterite: \"Fui\"",
      "pluperfect: dijo que había ido"
     ],
     [
      "future: \"Iré\"",
      "conditional: dijo que iría"
     ],
     [
      "command: \"Ven\"",
      "imp. subj.: me pidió que fuera"
     ]
    ]
   },
   {
    "k": "p",
    "t": "Also shift words: _hoy → ese día, mañana → al día siguiente, aquí → allí_."
   }
  ],
  "fx": [
   [
    "She told me that she would call me the next day.",
    "Me dijo que me llamaría al día siguiente."
   ],
   [
    "He asked us to wait for him at the station.",
    "Nos pidió que lo esperáramos en la estación."
   ]
  ]
 },
 {
  "id": "connectors",
  "lvl": 5,
  "t": "Advanced connectors",
  "s": "sin embargo, por lo tanto, a pesar de que",
  "blocks": [
   {
    "k": "table",
    "h": [
     "Function",
     "Connectors"
    ],
    "r": [
     [
      "contrast",
      "sin embargo, no obstante, en cambio, a pesar de (que)"
     ],
     [
      "cause",
      "ya que, puesto que, dado que, debido a"
     ],
     [
      "consequence",
      "por lo tanto, así que, de modo que, por consiguiente"
     ],
     [
      "addition",
      "además, asimismo, encima"
     ],
     [
      "concession",
      "aunque, si bien, aun así"
     ]
    ]
   },
   {
    "k": "warn",
    "t": "_a pesar de que_ + indicative states a fact; + subjunctive concedes a possibility."
   }
  ],
  "fx": [
   [
    "Although it was expensive, the trip was worth it.",
    "Aunque fue caro, el viaje valió la pena."
   ],
   [
    "Since you have already finished, you can leave.",
    "Ya que has terminado, puedes irte."
   ]
  ]
 }
];
export const TOPIC: Record<string, Topic> = Object.fromEntries(TOPICS.map((t) => [t.id, t]));
export const PLACEMENT: PlacementItem[] = [
 {
  "lvl": 1,
  "instruction": "Translate into Spanish",
  "prompt": "My name is Ana, I am from Mexico and I live in a small apartment."
 },
 {
  "lvl": 1,
  "instruction": "Answer in a full sentence",
  "prompt": "¿Qué te gusta hacer los fines de semana?"
 },
 {
  "lvl": 2,
  "instruction": "Translate into Spanish",
  "prompt": "Yesterday I went to the market and bought some fruit for my mother."
 },
 {
  "lvl": 2,
  "instruction": "Answer in a full sentence",
  "prompt": "¿Qué hacías cuando eras niño o niña?"
 },
 {
  "lvl": 3,
  "instruction": "Translate into Spanish",
  "prompt": "I hope that you have a great weekend, and I will call you on Monday."
 },
 {
  "lvl": 3,
  "instruction": "Answer in one or two sentences",
  "prompt": "¿Qué has hecho esta semana que te haya gustado?"
 },
 {
  "lvl": 4,
  "instruction": "Answer in one or two sentences",
  "prompt": "¿Qué harías si pudieras vivir en cualquier país del mundo?"
 },
 {
  "lvl": 4,
  "instruction": "Translate into Spanish",
  "prompt": "I was looking for someone who could help me, but nobody had time."
 },
 {
  "lvl": 5,
  "instruction": "Translate into Spanish",
  "prompt": "Had it not been for her advice, we would never have finished the project on time."
 },
 {
  "lvl": 5,
  "instruction": "Give your opinion in two sentences",
  "prompt": "¿Debería prohibirse el uso del móvil en los colegios? ¿Por qué?"
 }
];
export const SCENARIOS: Scenario[] = [
 {
  "id": "cafe",
  "t": "En la cafetería",
  "s": "Order breakfast in Madrid",
  "lvl": 1,
  "role": "a friendly waiter at a busy café in Madrid"
 },
 {
  "id": "friend",
  "t": "Nueva amiga",
  "s": "Get to know someone at a party",
  "lvl": 1,
  "role": "Lucía, a cheerful 28-year-old from Valencia you just met at a party"
 },
 {
  "id": "market",
  "t": "En el mercado",
  "s": "Buy fruit and haggle a bit",
  "lvl": 2,
  "role": "Don Ramón, a chatty fruit seller at a market in Oaxaca, Mexico"
 },
 {
  "id": "hotel",
  "t": "Recepción del hotel",
  "s": "Check in and fix a problem",
  "lvl": 2,
  "role": "a hotel receptionist in Buenos Aires; the guest's reservation has a small mistake"
 },
 {
  "id": "doctor",
  "t": "En el médico",
  "s": "Describe how you feel",
  "lvl": 3,
  "role": "a calm doctor in Bogotá asking about the patient's symptoms"
 },
 {
  "id": "flat",
  "t": "Alquilar un piso",
  "s": "Ask about a flat to rent",
  "lvl": 3,
  "role": "a landlord in Barcelona showing a flat to a possible tenant"
 },
 {
  "id": "job",
  "t": "Entrevista de trabajo",
  "s": "Interview for a job you want",
  "lvl": 4,
  "role": "an HR manager at a tech company in Santiago de Chile interviewing a candidate"
 },
 {
  "id": "debate",
  "t": "Un debate",
  "s": "Defend an opinion with a friend",
  "lvl": 5,
  "role": "Diego, a friend who enjoys arguing the opposite side on topics like remote work, tourism or social media"
 }
];
