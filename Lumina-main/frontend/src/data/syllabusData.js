/**
 * LUMINAA – Complete NCERT Syllabus Data
 * Grade: 1 | Age: 6–7
 * Subjects: EVS, Mathematics, English, Hindi
 * Structure: subject → chapter → lesson → { story, video, activities, quiz }
 *
 * Activity Types:
 *   tap      – Bubble-pop choice (choose correct answer)
 *   count    – Tap items to count (count-based tap game)
 *   voice    – Repeat-after-me (speech recognition)
 *   match    – Word-to-image card matching
 *   camera   – Show N fingers to camera
 *   draw     – Trace a letter/number (future)
 *
 * All YouTube URLs use nocookie embed format.
 * Story chunks are designed to be ≤ 12 words each (ADHD-safe).
 */

export const syllabusData = {
  grade: "1",
  ageGroup: "6-7",
  subjects: [

    // ══════════════════════════════════════════════
    // 1. ENVIRONMENTAL STUDIES (EVS)
    // ══════════════════════════════════════════════
    {
      id: "evs",
      name: "Environmental Studies",
      icon: "🌿",
      color: "#2E8B57",
      gradient: ["#1a472a", "#2E8B57"],
      chapters: [

        {
          id: "evs-ch1",
          chapterNumber: 1,
          title: "My Family",
          ncertRef: "NCERT EVS Class 1, Chapter 1",
          lessons: [
            {
              id: "evs-ch1-l1",
              title: "Family Members 👨‍👩‍👧",
              duration: "10 mins",
              difficulty: "easy",
              illustration: "/assets/visuals/family.png",
              story: {
                text: "Families are like a warm hug! Some families are small. Some families are big and noisy! In a small family, we have Mother and Father. In a big family, we also have Grandparents, Uncles, and Cousins. Everyone in a family loves and helps each other!",
                chunks: [
                  "Families are like a warm hug! 🤗",
                  "Some families are small, and some are big.",
                  "In a small family, we have Mother and Father.",
                  "In a big family, we also have Grandparents.",
                  "Uncles, Aunts, and Cousins are family too!",
                  "Everyone in a family loves and helps each other! ❤️"
                ],
                keywords: ["family", "mother", "father", "grandparents"],
                funFact: "Did you know? The biggest recorded family had 39 children! 😲",
                visualHints: { "mother": "👩", "father": "👨", "grandparents": "👴👵", "cousins": "👧👦", "family": "👨‍👩‍👧‍👦" }
              },
              video: {
                title: "All About Families – for Kids",
                url: "https://www.youtube-nocookie.com/embed/FHaObkHEkHQ",
                duration: "3:12"
              },
              activities: [
                {
                  id: "act1",
                  type: "tap",
                  question: "Who is part of YOUR family?",
                  options: ["👨‍👩‍👧 Family", "🚗 Car", "🌳 Tree", "🏠 House"],
                  answer: "👨‍👩‍👧 Family",
                  feedback: { correct: "Yes! People are family!", wrong: "Hmm, that's not a person!" }
                },
                {
                  id: "act2",
                  type: "match",
                  pairs: [
                    { word: "Mother", image: "👩", matchId: "m1" },
                    { word: "Father", image: "👨", matchId: "m2" },
                    { word: "Baby", image: "👶", matchId: "m3" },
                    { word: "Grandma", image: "👵", matchId: "m4" }
                  ]
                },
                {
                  id: "act3",
                  type: "voice",
                  phrase: "Family",
                  question: "Can you say 'Family'? 🎤",
                  keywords: ["family", "famil"]
                }
              ],
              quiz: [
                {
                  id: "q1",
                  question: "Do family members help each other?",
                  options: ["Yes, always! ✅", "No ❌", "Only on Sundays", "Never"],
                  answer: "Yes, always! ✅",
                  explanation: "Helping is what makes a family strong and happy!"
                },
                {
                  id: "q2",
                  question: "Who are cousins?",
                  options: ["Children of Uncles/Aunts", "Neighbours", "Teachers", "Strangers"],
                  answer: "Children of Uncles/Aunts",
                  explanation: "Your uncle's or aunt's children are called cousins!"
                }
              ]
            },

            {
              id: "evs-ch1-l2",
              title: "Helping at Home 🏠",
              duration: "8 mins",
              difficulty: "easy",
              story: {
                text: "We can be little superheroes at home! Helping Mother set the table makes her smile. Watering plants with Father is so much fun! When we tidy our toys, home stays clean. Working together makes our home a happy place!",
                chunks: [
                  "We can be little superheroes at home! 🦸",
                  "Helping Mother set the table makes her smile.",
                  "Watering plants with Father is so much fun!",
                  "When we tidy our toys, home stays clean.",
                  "Working together makes home a happy place! 🏠"
                ],
                keywords: ["help", "home", "mother", "father"],
                visualHints: { "table": "🍽️", "plants": "🌱", "toys": "🧸", "home": "🏠" }
              },
              video: {
                title: "Helping at Home – Kids Song",
                url: "https://www.youtube-nocookie.com/embed/3BMAW6eYRAA",
                duration: "2:45"
              },
              activities: [
                {
                  id: "act1",
                  type: "tap",
                  question: "Which one is HELPING at home?",
                  options: ["🌱 Watering Plants", "📺 Watching TV all day", "🍬 Eating Sweets only", "💤 Sleeping"],
                  answer: "🌱 Watering Plants",
                  feedback: { correct: "Super helper! 🦸", wrong: "Try again! Think about what helps others." }
                },
                {
                  id: "act2",
                  type: "voice",
                  phrase: "I can help",
                  question: "Say 'I can help!' 💪",
                  keywords: ["help", "can", "i can"]
                }
              ],
              quiz: [
                {
                  id: "q1",
                  question: "What happens when everyone helps at home?",
                  options: ["Home becomes happy! 😊", "Home gets dirty", "Everyone gets tired", "Nothing changes"],
                  answer: "Home becomes happy! 😊",
                  explanation: "When we all help, home becomes a wonderful place!"
                }
              ]
            },

            {
              id: "evs-ch1-l3",
              title: "Fun with Cousins 🎈",
              duration: "8 mins",
              difficulty: "easy",
              story: {
                text: "Cousins are your very first friends! When we visit Grandparents' house, magic happens. We play cricket and hide-and-seek. We share snacks and tell silly jokes. Grandma tells us wonderful stories at night. Those are the best memories ever!",
                chunks: [
                  "Cousins are your very first friends! 🤝",
                  "At Grandparents' house, magic happens!",
                  "We play cricket and hide-and-seek together.",
                  "We share snacks and tell silly jokes. 😄",
                  "Grandma tells us wonderful stories at night.",
                  "Those are the best memories ever! 🌟"
                ],
                keywords: ["cousins", "grandparents", "play", "share"],
                visualHints: { "cousins": "👧👦", "grandparents": "👴👵", "games": "🎮", "stories": "📖" }
              },
              video: {
                title: "Family Reunion – Kids Learn",
                url: "https://www.youtube-nocookie.com/embed/FHaObkHEkHQ",
                duration: "3:00"
              },
              activities: [
                {
                  id: "act1",
                  type: "tap",
                  question: "What should we do with cousins?",
                  options: ["Share and play! 🎉", "Fight over toys 😠", "Ignore them 😶", "Run away 🏃"],
                  answer: "Share and play! 🎉"
                },
                {
                  id: "act2",
                  type: "match",
                  pairs: [
                    { word: "Play", image: "⚽", matchId: "p1" },
                    { word: "Share", image: "🍎", matchId: "p2" },
                    { word: "Story", image: "📖", matchId: "p3" },
                    { word: "Sleep", image: "😴", matchId: "p4" }
                  ]
                }
              ],
              quiz: [
                {
                  id: "q1",
                  question: "Should we share toys with cousins?",
                  options: ["Yes! Sharing is caring 💕", "No, never!", "Only broken toys", "Only if they ask 10 times"],
                  answer: "Yes! Sharing is caring 💕",
                  explanation: "Sharing makes everyone happy and creates great memories!"
                }
              ]
            }
          ]
        },

        {
          id: "evs-ch2",
          chapterNumber: 2,
          title: "My Amazing Body",
          ncertRef: "NCERT EVS Class 1, Chapter 2",
          lessons: [
            {
              id: "evs-ch2-l1",
              title: "Body Parts 🦵",
              duration: "10 mins",
              difficulty: "easy",
              illustration: "/assets/visuals/body.png",
              story: {
                text: "Our body is the most amazing machine ever! We have two eyes that see colours and shapes. Two ears hear music and voices. Our nose smells flowers and yummy food. Hands help us draw and hug. Legs help us run and dance!",
                chunks: [
                  "Our body is the most amazing machine! 🤖",
                  "Two eyes see colours, shapes, and faces.",
                  "Two ears hear music and kind words.",
                  "Our nose smells flowers and yummy food. 🌸",
                  "Hands help us draw, write, and hug.",
                  "Legs help us run, jump, and dance! 💃"
                ],
                keywords: ["eyes", "ears", "nose", "hands", "legs"],
                visualHints: { "eyes": "👀", "ears": "👂", "nose": "👃", "hands": "👐", "legs": "🦵" }
              },
              video: {
                title: "Body Parts for Kids",
                url: "https://www.youtube-nocookie.com/embed/SUt8q0EKbms",
                duration: "3:30"
              },
              activities: [
                {
                  id: "act1",
                  type: "tap",
                  question: "What do we use to SEE? 👁️",
                  options: ["👀 Eyes", "👂 Ears", "👃 Nose", "👄 Mouth"],
                  answer: "👀 Eyes"
                },
                {
                  id: "act2",
                  type: "voice",
                  phrase: "Eyes, ears, nose",
                  question: "Say 'Eyes, ears, nose'! 🎤",
                  keywords: ["eyes", "ears", "nose"]
                },
                {
                  id: "act3",
                  type: "match",
                  pairs: [
                    { word: "See", image: "👀", matchId: "b1" },
                    { word: "Hear", image: "👂", matchId: "b2" },
                    { word: "Smell", image: "👃", matchId: "b3" },
                    { word: "Touch", image: "✋", matchId: "b4" }
                  ]
                }
              ],
              quiz: [
                { id: "q1", question: "How many hands do we have?", options: ["Two ✌️", "One", "Three", "Four"], answer: "Two ✌️", explanation: "Two hands to clap, draw, and do amazing things!" },
                { id: "q2", question: "Which part helps us HEAR?", options: ["Ears 👂", "Eyes 👀", "Nose 👃", "Legs 🦵"], answer: "Ears 👂", explanation: "Ears help us hear sounds, music, and voices!" }
              ]
            },

            {
              id: "evs-ch2-l2",
              title: "Keeping Clean 🧼",
              duration: "8 mins",
              difficulty: "easy",
              story: {
                text: "Clean hands keep germs away! We wash hands before eating and after playing. We brush our teeth every morning and night. We take a bath to feel fresh. Clean clothes make us feel good. Being clean is being healthy!",
                chunks: [
                  "Clean hands keep nasty germs away! 🦠",
                  "Wash hands before eating and after playing.",
                  "Brush teeth every morning and every night. 🦷",
                  "A bath makes us feel fresh and lovely.",
                  "Clean clothes make us feel great! 👕",
                  "Being clean means being healthy! 💪"
                ],
                keywords: ["clean", "wash", "brush", "bath"],
                visualHints: { "wash": "🧼", "brush": "🪥", "bath": "🛁", "clean": "✨" }
              },
              video: {
                title: "Good Habits – Staying Clean",
                url: "https://www.youtube-nocookie.com/embed/l6XGE-Xuq3M",
                duration: "3:15"
              },
              activities: [
                {
                  id: "act1",
                  type: "tap",
                  question: "When do we WASH our hands?",
                  options: ["Before eating 🍽️", "Never 😬", "While sleeping 😴", "While watching TV"],
                  answer: "Before eating 🍽️"
                },
                {
                  id: "act2",
                  type: "voice",
                  phrase: "I wash my hands",
                  question: "Say 'I wash my hands'! 🧼",
                  keywords: ["wash", "hands", "clean"]
                }
              ],
              quiz: [
                { id: "q1", question: "How many times do we brush our teeth each day?", options: ["Twice 🦷🦷", "Never", "Once a week", "Ten times"], answer: "Twice 🦷🦷", explanation: "Morning and night — brush twice for healthy teeth!" }
              ]
            }
          ]
        },

        {
          id: "evs-ch3",
          chapterNumber: 3,
          title: "The Plant World",
          ncertRef: "NCERT EVS Class 1, Chapter 4",
          lessons: [
            {
              id: "evs-ch3-l1",
              title: "Parts of a Plant 🌱",
              duration: "10 mins",
              difficulty: "easy",
              illustration: "/assets/visuals/plants.png",
              story: {
                text: "Plants are our green best friends! Every plant has roots that drink water from the soil. The stem holds the plant tall like a pillar. Green leaves make food using sunlight. Beautiful flowers attract butterflies. Fruits grow from flowers and have seeds inside!",
                chunks: [
                  "Plants are our green best friends! 🌿",
                  "Roots drink water from deep in the soil.",
                  "The stem holds the plant up tall. 🏗️",
                  "Leaves make food using the sun's light. ☀️",
                  "Flowers attract butterflies and bees. 🦋",
                  "Fruits grow from flowers and have seeds! 🍎"
                ],
                keywords: ["roots", "stem", "leaves", "flowers", "fruits"],
                visualHints: { "roots": "🌱", "stem": "🪵", "leaves": "🍃", "flowers": "🌸", "fruits": "🍎" }
              },
              video: {
                title: "Parts of a Plant – Kids",
                url: "https://www.youtube-nocookie.com/embed/p3St51F4kE8",
                duration: "4:00"
              },
              activities: [
                {
                  id: "act1",
                  type: "tap",
                  question: "Which part is UNDERGROUND? 🌍",
                  options: ["🌱 Roots", "🍃 Leaves", "🌸 Flowers", "🍎 Fruits"],
                  answer: "🌱 Roots"
                },
                {
                  id: "act2",
                  type: "match",
                  pairs: [
                    { word: "Roots", image: "🌱", matchId: "pl1" },
                    { word: "Leaves", image: "🍃", matchId: "pl2" },
                    { word: "Flower", image: "🌸", matchId: "pl3" },
                    { word: "Fruit", image: "🍎", matchId: "pl4" }
                  ]
                },
                {
                  id: "act3",
                  type: "voice",
                  phrase: "Roots, stem, leaves",
                  question: "Can you say 'Roots, stem, leaves'? 🌿",
                  keywords: ["roots", "stem", "leaves"]
                }
              ],
              quiz: [
                { id: "q1", question: "Where do roots grow?", options: ["Under the ground 🌍", "On branches", "Inside flowers", "In the sky"], answer: "Under the ground 🌍", explanation: "Roots grow underground and drink water from the soil!" },
                { id: "q2", question: "What do leaves do?", options: ["Make food using sunlight ☀️", "Drink water", "Attract birds", "Hold the plant"], answer: "Make food using sunlight ☀️", explanation: "Leaves use sunlight to make food for the plant — that's photosynthesis!" }
              ]
            },

            {
              id: "evs-ch3-l2",
              title: "Trees are our Friends 🌳",
              duration: "8 mins",
              difficulty: "easy",
              story: {
                text: "Trees are wonderful gifts of nature! Trees give us fresh air to breathe. They give us shade on hot sunny days. Mangoes, apples, and bananas grow on trees. Birds build their homes in tree branches. We must never cut trees — we must plant more!",
                chunks: [
                  "Trees are wonderful gifts of nature! 🌳",
                  "Trees give us fresh air to breathe. 🌬️",
                  "They give us cool shade on hot days. 🌞",
                  "Mangoes, apples, and bananas grow on trees.",
                  "Birds build their nests in branches. 🐦",
                  "Let's plant trees and never cut them! 🌱"
                ],
                keywords: ["trees", "air", "shade", "birds", "plant"],
                visualHints: { "tree": "🌳", "air": "🌬️", "shade": "☂️", "birds": "🐦", "fruits": "🥭" }
              },
              video: {
                title: "Why are Trees Important?",
                url: "https://www.youtube-nocookie.com/embed/6x8IuJlcXTk",
                duration: "3:45"
              },
              activities: [
                {
                  id: "act1",
                  type: "tap",
                  question: "What do trees give us? 🌳",
                  options: ["Fresh Air 🌬️", "Plastic bags", "Rain clouds ☁️", "Electricity"],
                  answer: "Fresh Air 🌬️"
                },
                {
                  id: "act2",
                  type: "voice",
                  phrase: "Trees give us air",
                  question: "Say 'Trees give us air'! 🎤",
                  keywords: ["trees", "air", "give"]
                }
              ],
              quiz: [
                { id: "q1", question: "What should we do to save trees?", options: ["Plant more trees! 🌱", "Cut them all", "Ignore them", "Burn them"], answer: "Plant more trees! 🌱", explanation: "Planting trees helps our planet and gives animals their homes!" }
              ]
            }
          ]
        },

        {
          id: "evs-ch4",
          chapterNumber: 4,
          title: "Animal Friends",
          ncertRef: "NCERT EVS Class 1, Chapter 5",
          lessons: [
            {
              id: "evs-ch4-l1",
              title: "Pets and Wild Animals 🐾",
              duration: "10 mins",
              difficulty: "easy",
              illustration: "/assets/visuals/animals.png",
              story: {
                text: "Animals are everywhere! Dogs, cats, and rabbits live with us as pets. They love us and we love them. Lions, elephants, and tigers live in jungles and forests. They are wild and free. We must protect all animals — they are our planet's treasure!",
                chunks: [
                  "Animals are all around us! 🐾",
                  "Dogs, cats, and rabbits are our pets.",
                  "Pets love us and we take care of them. ❤️",
                  "Lions, elephants, and tigers live in jungles.",
                  "They are wild animals — free and strong! 🦁",
                  "We must protect all animals. They are precious! 🌍"
                ],
                keywords: ["pets", "wild", "animals", "jungle"],
                visualHints: { "pets": "🐕🐈", "wild": "🦁🐘", "jungle": "🌴", "protect": "🛡️" }
              },
              video: {
                title: "Pets vs Wild Animals – Kids Learn",
                url: "https://www.youtube-nocookie.com/embed/KQt3jVyME-k",
                duration: "4:00"
              },
              activities: [
                {
                  id: "act1",
                  type: "tap",
                  question: "Which one is a WILD animal? 🌿",
                  options: ["Lion 🦁", "Cat 🐱", "Dog 🐶", "Rabbit 🐰"],
                  answer: "Lion 🦁"
                },
                {
                  id: "act2",
                  type: "match",
                  pairs: [
                    { word: "Pet", image: "🐕", matchId: "an1" },
                    { word: "Wild", image: "🦁", matchId: "an2" },
                    { word: "Jungle", image: "🌴", matchId: "an3" },
                    { word: "Home", image: "🏠", matchId: "an4" }
                  ]
                },
                {
                  id: "act3",
                  type: "voice",
                  phrase: "Wild animals",
                  question: "Can you say 'Wild animals'? 🦁",
                  keywords: ["wild", "animals"]
                }
              ],
              quiz: [
                { id: "q1", question: "Where does an elephant live?", options: ["Jungle/Forest 🌿", "Our house", "A park", "A shop"], answer: "Jungle/Forest 🌿", explanation: "Elephants are wild animals that live in forests and grasslands!" },
                { id: "q2", question: "What is a pet?", options: ["Animal that lives with us 🏠", "Wild animal", "Insect", "A toy"], answer: "Animal that lives with us 🏠", explanation: "Pets live with people and we take care of them!" }
              ]
            },

            {
              id: "evs-ch4-l2",
              title: "What do Animals Eat? 🌾",
              duration: "8 mins",
              difficulty: "easy",
              story: {
                text: "Different animals eat different foods! Cows and horses eat grass and plants. We call them herbivores. Lions and wolves eat other animals. They are called carnivores. Bears eat both plants and animals — they are omnivores. Humans are omnivores too!",
                chunks: [
                  "Different animals eat different foods! 🍽️",
                  "Cows and horses eat grass and plants. 🌾",
                  "We call plant-eaters herbivores.",
                  "Lions and wolves hunt and eat animals. 🦁",
                  "They are called carnivores.",
                  "Bears eat both! They are omnivores. 🐻",
                  "Humans are omnivores too! 😊"
                ],
                keywords: ["herbivore", "carnivore", "omnivore", "eat"],
                visualHints: { "grass": "🌾", "herbivore": "🐄", "carnivore": "🦁", "omnivore": "🐻" }
              },
              video: {
                title: "What do Animals Eat?",
                url: "https://www.youtube-nocookie.com/embed/0pHXXP-xlG8",
                duration: "3:30"
              },
              activities: [
                {
                  id: "act1",
                  type: "tap",
                  question: "What does a cow eat? 🐄",
                  options: ["Grass 🌾", "Meat 🥩", "Fish 🐟", "Cake 🎂"],
                  answer: "Grass 🌾"
                },
                {
                  id: "act2",
                  type: "voice",
                  phrase: "Herbivore eats plants",
                  question: "Say 'Herbivore eats plants'! 🌿",
                  keywords: ["herbivore", "plants", "eats"]
                }
              ],
              quiz: [
                { id: "q1", question: "A lion is a...?", options: ["Carnivore 🥩", "Herbivore 🌿", "Omnivore", "None"], answer: "Carnivore 🥩", explanation: "Lions eat only meat so they are carnivores!" }
              ]
            }
          ]
        },

        {
          id: "evs-ch5",
          chapterNumber: 5,
          title: "Healthy Food",
          ncertRef: "NCERT EVS Class 1, Chapter 6",
          lessons: [
            {
              id: "evs-ch5-l1",
              title: "Fruits and Vegetables 🥗",
              duration: "10 mins",
              difficulty: "easy",
              story: {
                text: "Healthy food is our superpower! Fruits like apples, bananas, and oranges give us energy and vitamins. Vegetables like carrots, spinach, and tomatoes make us strong. Eating a rainbow of coloured food keeps our body healthy. Say no to too many chips and sweets!",
                chunks: [
                  "Healthy food is our superpower! 💪",
                  "Apples, bananas, oranges — fruits give us energy!",
                  "Carrots and spinach make us big and strong. 🥕",
                  "Eat a rainbow of colours every day! 🌈",
                  "Too many chips and sweets are not good. 🚫",
                  "Healthy food = a healthy, happy you! 😊"
                ],
                keywords: ["fruits", "vegetables", "healthy", "energy"],
                visualHints: { "fruits": "🍎🍌🍊", "vegetables": "🥕🌿🍅", "healthy": "💪", "rainbow": "🌈" }
              },
              video: {
                title: "Healthy Food for Kids",
                url: "https://www.youtube-nocookie.com/embed/slKV2AiUOFk",
                duration: "3:45"
              },
              activities: [
                {
                  id: "act1",
                  type: "tap",
                  question: "Which one is a FRUIT? 🍎",
                  options: ["Apple 🍎", "Potato 🥔", "Onion 🧅", "Ginger"],
                  answer: "Apple 🍎"
                },
                {
                  id: "act2",
                  type: "match",
                  pairs: [
                    { word: "Fruit", image: "🍎", matchId: "fd1" },
                    { word: "Vegetable", image: "🥕", matchId: "fd2" },
                    { word: "Energy", image: "⚡", matchId: "fd3" },
                    { word: "Strong", image: "💪", matchId: "fd4" }
                  ]
                },
                {
                  id: "act3",
                  type: "voice",
                  phrase: "Eat healthy food",
                  question: "Say 'Eat healthy food'! 🎤",
                  keywords: ["healthy", "food", "eat"]
                }
              ],
              quiz: [
                { id: "q1", question: "Does healthy food make us strong?", options: ["Yes! 💪", "No", "Maybe", "Only for adults"], answer: "Yes! 💪", explanation: "Healthy food helps our body grow, gives energy, and keeps us fit!" },
                { id: "q2", question: "Which is NOT a vegetable?", options: ["Banana 🍌", "Carrot 🥕", "Spinach 🌿", "Tomato 🍅"], answer: "Banana 🍌", explanation: "Banana is a fruit! Fruits are sweet and have seeds inside." }
              ]
            }
          ]
        },

        {
          id: "evs-ch6",
          chapterNumber: 6,
          title: "Water",
          ncertRef: "NCERT EVS Class 1, Chapter 7",
          lessons: [
            {
              id: "evs-ch6-l1",
              title: "Water is Life 💧",
              duration: "10 mins",
              difficulty: "easy",
              story: {
                text: "Water is the most precious thing on Earth! We drink water to stay alive. Plants need water to grow. Animals drink water from rivers and ponds. We use water for bathing, cooking, and cleaning. We must never waste water — save every drop!",
                chunks: [
                  "Water is the most precious thing on Earth! 💧",
                  "We drink water to stay alive and healthy.",
                  "Plants need water to grow tall. 🌿",
                  "Animals drink from rivers and ponds. 🦋",
                  "We use water for cooking and cleaning. 🍳",
                  "Save every drop — never waste water! 🌍"
                ],
                keywords: ["water", "drink", "save", "precious"],
                visualHints: { "water": "💧", "drink": "🥤", "plants": "🌿", "river": "🏞️" }
              },
              video: {
                title: "Why is Water Important?",
                url: "https://www.youtube-nocookie.com/embed/31F0laJjyy8",
                duration: "3:30"
              },
              activities: [
                {
                  id: "act1",
                  type: "tap",
                  question: "What should we do with water? 💧",
                  options: ["Save it! 💧", "Waste it 🚿", "Throw it away", "Colour it"],
                  answer: "Save it! 💧"
                },
                {
                  id: "act2",
                  type: "voice",
                  phrase: "Save water",
                  question: "Say 'Save water'! 💧",
                  keywords: ["save", "water"]
                }
              ],
              quiz: [
                { id: "q1", question: "Why do we need water?", options: ["To stay alive! 💧", "To play games", "To make noise", "To stay dirty"], answer: "To stay alive! 💧", explanation: "Without water, nothing can survive. Water is life!" }
              ]
            }
          ]
        }
      ]
    },

    // ══════════════════════════════════════════════
    // 2. MATHEMATICS
    // ══════════════════════════════════════════════
    {
      id: "math",
      name: "Mathematics",
      icon: "🔢",
      color: "#4A90D9",
      gradient: ["#1a3a6e", "#4A90D9"],
      chapters: [

        {
          id: "math-ch1",
          chapterNumber: 1,
          title: "Numbers 1 to 10",
          ncertRef: "NCERT Maths Class 1, Chapter 1",
          lessons: [
            {
              id: "math-ch1-l1",
              title: "Counting 1 to 5 🖐️",
              duration: "10 mins",
              difficulty: "easy",
              illustration: "/assets/visuals/numbers.png",
              story: {
                text: "Counting is like magic! Hold up your hand and look at your fingers. One, two, three, four, five! One finger — one apple. Two fingers — two stars. We use numbers every day. Counting helps us know how many!",
                chunks: [
                  "Counting is like magic! ✨",
                  "Hold up your hand — look at your fingers!",
                  "One, two, three, four, five! 🖐️",
                  "One finger means one apple. 🍎",
                  "Two fingers means two stars. ⭐⭐",
                  "We use numbers every single day! 🔢"
                ],
                keywords: ["one", "two", "three", "four", "five", "count"],
                visualHints: { "one": "1️⃣", "two": "2️⃣", "three": "3️⃣", "four": "4️⃣", "five": "5️⃣" }
              },
              video: {
                title: "Counting 1 to 5 for Kids",
                url: "https://www.youtube-nocookie.com/embed/D0Ajq682yrA",
                duration: "3:15"
              },
              activities: [
                {
                  id: "act1",
                  type: "count",
                  question: "Tap all 3 apples to count! 🍎",
                  count: 3,
                  emoji: "🍎"
                },
                {
                  id: "act2",
                  type: "camera",
                  question: "Show me 2 fingers! ✌️",
                  expectedCount: 2
                },
                {
                  id: "act3",
                  type: "tap",
                  question: "How many fingers on ONE hand? 🖐️",
                  options: ["5", "2", "3", "10"],
                  answer: "5"
                }
              ],
              quiz: [
                { id: "q1", question: "What comes AFTER two?", options: ["Three 3️⃣", "One 1️⃣", "Four 4️⃣", "Five 5️⃣"], answer: "Three 3️⃣", explanation: "1, 2, 3! Three always comes after two!" },
                { id: "q2", question: "How many eyes do you have?", options: ["Two 2️⃣", "One", "Three", "Four"], answer: "Two 2️⃣", explanation: "You have exactly 2 eyes — right and left!" }
              ]
            },

            {
              id: "math-ch1-l2",
              title: "Counting 6 to 10 🤲",
              duration: "10 mins",
              difficulty: "easy",
              illustration: "/assets/visuals/numbers.png",
              story: {
                text: "We already know 1 to 5! Now let's go further. Six, seven, eight, nine, TEN! Ten fingers on two hands. Ten toes on two feet. Ten is a special number — it has a 1 and a 0 together. You are a brilliant counter!",
                chunks: [
                  "We already know 1 to 5! Great job! 🌟",
                  "Now let's count further together.",
                  "Six, seven, eight, nine, TEN! 🙌",
                  "Ten fingers on two hands. 🤲",
                  "Ten toes on two feet. 🦶🦶",
                  "Ten is a very special number! 🎉"
                ],
                keywords: ["six", "seven", "eight", "nine", "ten"],
                visualHints: { "6": "6️⃣", "7": "7️⃣", "8": "8️⃣", "9": "9️⃣", "10": "🔟" }
              },
              video: {
                title: "Counting 6 to 10 – Kids Song",
                url: "https://www.youtube-nocookie.com/embed/D0Ajq682yrA",
                duration: "3:00"
              },
              activities: [
                {
                  id: "act1",
                  type: "count",
                  question: "Tap all 7 stars! ⭐",
                  count: 7,
                  emoji: "⭐"
                },
                {
                  id: "act2",
                  type: "camera",
                  question: "Show me 5 fingers! 🖐️",
                  expectedCount: 5
                },
                {
                  id: "act3",
                  type: "tap",
                  question: "What comes after NINE?",
                  options: ["Ten 🔟", "Eight", "Eleven", "Six"],
                  answer: "Ten 🔟"
                }
              ],
              quiz: [
                { id: "q1", question: "How many fingers do you have in total?", options: ["Ten 🔟", "Five", "Eight", "Twelve"], answer: "Ten 🔟", explanation: "5 fingers on left hand + 5 on right hand = 10 fingers!" },
                { id: "q2", question: "Which number comes before 8?", options: ["Seven 7️⃣", "Nine", "Six", "Ten"], answer: "Seven 7️⃣", explanation: "6, 7, 8 — seven comes just before eight!" }
              ]
            }
          ]
        },

        {
          id: "math-ch2",
          chapterNumber: 2,
          title: "Shapes Around Us",
          ncertRef: "NCERT Maths Class 1, Chapter 3",
          lessons: [
            {
              id: "math-ch2-l1",
              title: "Basic Shapes 🔷",
              duration: "10 mins",
              difficulty: "easy",
              story: {
                text: "Shapes are everywhere! A ball is round — that's a circle. A book is like a rectangle. A sandwich cut in half makes a triangle! Windows are squares. Look around you — what shapes can you find? The whole world is made of shapes!",
                chunks: [
                  "Shapes are hiding everywhere! 🔍",
                  "A ball is round — that is a circle! ⚽",
                  "A book looks like a rectangle. 📚",
                  "A sandwich cut makes a triangle. 🥪",
                  "Windows are often squares! 🪟",
                  "The whole world is made of shapes! 🌍"
                ],
                keywords: ["circle", "square", "triangle", "rectangle"],
                visualHints: { "circle": "⭕", "square": "⬛", "triangle": "🔺", "rectangle": "▬" }
              },
              video: {
                title: "Shapes for Kids – Circle, Square, Triangle",
                url: "https://www.youtube-nocookie.com/embed/OEbRDtCAFdU",
                duration: "3:30"
              },
              activities: [
                {
                  id: "act1",
                  type: "tap",
                  question: "What shape is a ball? ⚽",
                  options: ["Circle ⭕", "Square ⬛", "Triangle 🔺", "Rectangle"],
                  answer: "Circle ⭕"
                },
                {
                  id: "act2",
                  type: "match",
                  pairs: [
                    { word: "Circle", image: "⭕", matchId: "sh1" },
                    { word: "Square", image: "⬛", matchId: "sh2" },
                    { word: "Triangle", image: "🔺", matchId: "sh3" },
                    { word: "Star", image: "⭐", matchId: "sh4" }
                  ]
                },
                {
                  id: "act3",
                  type: "voice",
                  phrase: "Circle square triangle",
                  question: "Say 'Circle, square, triangle'! 🎤",
                  keywords: ["circle", "square", "triangle"]
                }
              ],
              quiz: [
                { id: "q1", question: "How many sides does a triangle have?", options: ["3", "4", "2", "5"], answer: "3", explanation: "Tri means 3! A triangle always has exactly 3 sides!" },
                { id: "q2", question: "A square has how many equal sides?", options: ["4 equal sides", "3", "2", "None"], answer: "4 equal sides", explanation: "A square has 4 sides all the same length!" }
              ]
            }
          ]
        },

        {
          id: "math-ch3",
          chapterNumber: 3,
          title: "Addition",
          ncertRef: "NCERT Maths Class 1, Chapter 4",
          lessons: [
            {
              id: "math-ch3-l1",
              title: "Adding Numbers 1 to 5 ➕",
              duration: "12 mins",
              difficulty: "medium",
              story: {
                text: "Addition is putting things together! If you have 2 apples and get 2 more, you have 4 apples! We use the plus (+) sign for addition. 1 + 1 = 2. 2 + 3 = 5. Adding makes numbers bigger. It is like inviting more friends to your party!",
                chunks: [
                  "Addition is putting things together! ➕",
                  "2 apples plus 2 more = 4 apples! 🍎🍎🍎🍎",
                  "We use the + sign for addition.",
                  "One plus one equals two. 1 + 1 = 2 ✌️",
                  "Two plus three equals five. 2 + 3 = 5 🖐️",
                  "Adding makes numbers grow bigger! 🌱"
                ],
                keywords: ["add", "plus", "equals", "total"],
                visualHints: { "+": "➕", "=": "🟰", "apples": "🍎", "together": "🤝" }
              },
              video: {
                title: "Addition for Kids – Beginners",
                url: "https://www.youtube-nocookie.com/embed/vR4pVGNisZA",
                duration: "4:00"
              },
              activities: [
                {
                  id: "act1",
                  type: "tap",
                  question: "What is 1 + 1? 🍎 + 🍎 = ?",
                  options: ["2 ✌️", "3", "1", "4"],
                  answer: "2 ✌️"
                },
                {
                  id: "act2",
                  type: "count",
                  question: "Tap to count 2 + 3 apples! 🍎",
                  count: 5,
                  emoji: "🍎"
                },
                {
                  id: "act3",
                  type: "tap",
                  question: "What is 2 + 2? 🌟🌟 + 🌟🌟 = ?",
                  options: ["4 🌟", "2", "5", "3"],
                  answer: "4 🌟"
                }
              ],
              quiz: [
                { id: "q1", question: "What is 3 + 1?", options: ["4", "3", "5", "2"], answer: "4", explanation: "3 + 1 = 4. Count on — three, FOUR!" },
                { id: "q2", question: "Which sign do we use for adding?", options: ["Plus sign ➕", "Minus sign ➖", "Star ⭐", "Equals 🟰"], answer: "Plus sign ➕", explanation: "The + (plus) sign means we are adding numbers together!" }
              ]
            }
          ]
        },

        {
          id: "math-ch4",
          chapterNumber: 4,
          title: "Subtraction",
          ncertRef: "NCERT Maths Class 1, Chapter 5",
          lessons: [
            {
              id: "math-ch4-l1",
              title: "Taking Away ➖",
              duration: "12 mins",
              difficulty: "medium",
              story: {
                text: "Subtraction is taking things away! If you have 5 mangoes and eat 2, how many are left? 5 minus 2 = 3 mangoes! We use the minus (-) sign. Subtraction makes numbers smaller. It is the opposite of addition!",
                chunks: [
                  "Subtraction is taking things away! ➖",
                  "You have 5 mangoes and eat 2... 🥭🥭",
                  "How many mangoes are left? 🤔",
                  "5 minus 2 equals 3! 5 - 2 = 3",
                  "We use the – (minus) sign.",
                  "Subtraction makes numbers smaller. ⬇️"
                ],
                keywords: ["subtract", "minus", "take away", "left"],
                visualHints: { "-": "➖", "less": "⬇️", "mangoes": "🥭", "left": "👈" }
              },
              video: {
                title: "Subtraction for Kids",
                url: "https://www.youtube-nocookie.com/embed/pwQKugrFmJQ",
                duration: "3:45"
              },
              activities: [
                {
                  id: "act1",
                  type: "tap",
                  question: "5 - 2 = ? 🍎🍎🍎🍎🍎 take away 🍎🍎",
                  options: ["3", "4", "2", "7"],
                  answer: "3"
                },
                {
                  id: "act2",
                  type: "tap",
                  question: "4 - 1 = ?",
                  options: ["3", "5", "2", "4"],
                  answer: "3"
                }
              ],
              quiz: [
                { id: "q1", question: "What is 5 - 3?", options: ["2", "1", "3", "4"], answer: "2", explanation: "5 - 3 = 2. Count back from 5: four, THREE... wait — five, four, THREE = 2 steps!" },
                { id: "q2", question: "Which sign means subtraction?", options: ["Minus sign ➖", "Plus sign ➕", "Star ⭐", "Arrow ➡️"], answer: "Minus sign ➖", explanation: "The – (minus) sign means we are taking away!" }
              ]
            }
          ]
        },

        {
          id: "math-ch5",
          chapterNumber: 5,
          title: "Measurement",
          ncertRef: "NCERT Maths Class 1, Chapter 6",
          lessons: [
            {
              id: "math-ch5-l1",
              title: "Big, Small, Tall, Short 📏",
              duration: "8 mins",
              difficulty: "easy",
              story: {
                text: "Measurement helps us compare things! A giraffe is tall. A cat is short. An elephant is heavy. A feather is light. A river is long. A pencil is short. We measure things to understand the world around us. Can you find something tall near you?",
                chunks: [
                  "Measurement helps us compare things! 📏",
                  "A giraffe is TALL. A cat is SHORT. 🦒🐱",
                  "An elephant is HEAVY. A feather is LIGHT. 🐘🪶",
                  "A river is LONG. A pencil is SHORT. 🏞️✏️",
                  "We measure to understand our world.",
                  "Can you find something tall near you? 🔍"
                ],
                keywords: ["tall", "short", "heavy", "light", "long"],
                visualHints: { "tall": "🦒", "short": "🐱", "heavy": "🐘", "light": "🪶", "long": "🏞️" }
              },
              video: {
                title: "Big and Small, Tall and Short",
                url: "https://www.youtube-nocookie.com/embed/JjKhSyUVFBI",
                duration: "3:00"
              },
              activities: [
                {
                  id: "act1",
                  type: "tap",
                  question: "Which animal is the TALLEST? 🦒",
                  options: ["Giraffe 🦒", "Cat 🐱", "Mouse 🐭", "Rabbit 🐰"],
                  answer: "Giraffe 🦒"
                },
                {
                  id: "act2",
                  type: "match",
                  pairs: [
                    { word: "Tall", image: "🦒", matchId: "ms1" },
                    { word: "Short", image: "🐱", matchId: "ms2" },
                    { word: "Heavy", image: "🐘", matchId: "ms3" },
                    { word: "Light", image: "🪶", matchId: "ms4" }
                  ]
                }
              ],
              quiz: [
                { id: "q1", question: "Which is HEAVIER?", options: ["Elephant 🐘", "Feather 🪶", "Ant 🐜", "Leaf 🍃"], answer: "Elephant 🐘", explanation: "Elephants weigh thousands of kilograms! They are very heavy!" }
              ]
            }
          ]
        }
      ]
    },

    // ══════════════════════════════════════════════
    // 3. ENGLISH – MARIGOLD
    // ══════════════════════════════════════════════
    {
      id: "english",
      name: "English – Marigold",
      icon: "📚",
      color: "#E8920C",
      gradient: ["#6b3a00", "#E8920C"],
      chapters: [

        {
          id: "eng-ch1",
          chapterNumber: 1,
          title: "The Alphabet",
          ncertRef: "NCERT English Marigold Class 1, Unit 1",
          lessons: [
            {
              id: "eng-ch1-l1",
              title: "A, B, C … Learning the Alphabet 🔤",
              duration: "12 mins",
              difficulty: "easy",
              illustration: "/assets/visuals/abc.png",
              story: {
                text: "The alphabet is the beginning of all stories! There are 26 letters in English. A is for Apple. B is for Ball. C is for Cat. Every letter has a sound. When we put sounds together, we make words. Words make sentences. Sentences tell stories. Everything starts with A, B, C!",
                chunks: [
                  "The alphabet is where all stories begin! 📖",
                  "There are 26 letters in English.",
                  "A is for Apple 🍎 B is for Ball ⚽",
                  "C is for Cat 🐱 D is for Dog 🐶",
                  "Every letter makes a special sound.",
                  "Sounds make words, words make stories! ✨"
                ],
                keywords: ["alphabet", "letters", "sounds", "words"],
                visualHints: { "A": "🍎", "B": "⚽", "C": "🐱", "D": "🐶", "E": "🐘" }
              },
              video: {
                title: "ABC Song – Alphabet for Kids",
                url: "https://www.youtube-nocookie.com/embed/bNg-ZQligKQ",
                duration: "3:00"
              },
              activities: [
                {
                  id: "act1",
                  type: "tap",
                  question: "A is for...? 🍎",
                  options: ["Apple 🍎", "Ball ⚽", "Cat 🐱", "Dog 🐶"],
                  answer: "Apple 🍎"
                },
                {
                  id: "act2",
                  type: "match",
                  pairs: [
                    { word: "A", image: "🍎", matchId: "al1" },
                    { word: "B", image: "⚽", matchId: "al2" },
                    { word: "C", image: "🐱", matchId: "al3" },
                    { word: "D", image: "🐶", matchId: "al4" }
                  ]
                },
                {
                  id: "act3",
                  type: "voice",
                  phrase: "A B C D E",
                  question: "Say 'A, B, C, D, E'! 🔤",
                  keywords: ["a", "b", "c", "d", "e", "abc"]
                }
              ],
              quiz: [
                { id: "q1", question: "How many letters are in the English alphabet?", options: ["26", "24", "28", "20"], answer: "26", explanation: "The English alphabet has exactly 26 letters from A to Z!" },
                { id: "q2", question: "B is for...?", options: ["Ball ⚽", "Apple 🍎", "Cat 🐱", "Elephant 🐘"], answer: "Ball ⚽", explanation: "B is for Ball! B makes the 'buh' sound." }
              ]
            },

            {
              id: "eng-ch1-l2",
              title: "Vowels: A E I O U 🔊",
              duration: "10 mins",
              difficulty: "easy",
              illustration: "/assets/visuals/abc.png",
              story: {
                text: "Five letters are extra special — they are called VOWELS! They are A, E, I, O, and U. Almost every word has a vowel in it! Apple has A. Egg has E. Ink has I. Orange has O. Umbrella has U. Vowels are like the heart of every word!",
                chunks: [
                  "Five letters are extra special — Vowels! ❤️",
                  "They are A, E, I, O, and U!",
                  "Apple has A 🍎 Egg has E 🥚",
                  "Ink has I 🖊️ Orange has O 🍊",
                  "Umbrella has U ☂️",
                  "Vowels are the heart of every word! 💖"
                ],
                keywords: ["vowels", "a", "e", "i", "o", "u"],
                visualHints: { "A": "🍎", "E": "🥚", "I": "🖊️", "O": "🍊", "U": "☂️" }
              },
              video: {
                title: "Vowels A E I O U – Kids Learn",
                url: "https://www.youtube-nocookie.com/embed/RUSCz41aDug",
                duration: "3:15"
              },
              activities: [
                {
                  id: "act1",
                  type: "tap",
                  question: "Which one is a VOWEL? 🔤",
                  options: ["A 🍎", "B", "C", "D"],
                  answer: "A 🍎"
                },
                {
                  id: "act2",
                  type: "voice",
                  phrase: "A E I O U",
                  question: "Say all vowels: A, E, I, O, U! 🎤",
                  keywords: ["a", "e", "i", "o", "u", "aeiou"]
                }
              ],
              quiz: [
                { id: "q1", question: "How many vowels are there?", options: ["5", "6", "4", "26"], answer: "5", explanation: "There are 5 vowels: A, E, I, O, U — easy to remember!" }
              ]
            }
          ]
        },

        {
          id: "eng-ch2",
          chapterNumber: 2,
          title: "Simple Words",
          ncertRef: "NCERT English Marigold Class 1, Unit 2",
          lessons: [
            {
              id: "eng-ch2-l1",
              title: "3-Letter Words: CVC 🐱",
              duration: "10 mins",
              difficulty: "easy",
              story: {
                text: "Let's read our first real words! C-A-T spells Cat! D-O-G spells Dog! B-A-G spells Bag! These are three-letter words — one sound at a time. First comes a consonant, then a vowel, then a consonant. Sound it out slowly and the word appears like magic!",
                chunks: [
                  "Let's read our very first real words! 📖",
                  "C-A-T spells CAT! 🐱",
                  "D-O-G spells DOG! 🐶",
                  "B-A-G spells BAG! 👜",
                  "Say each sound slowly — then blend them!",
                  "Reading is like word magic! ✨"
                ],
                keywords: ["cat", "dog", "bag", "hat", "sun"],
                visualHints: { "cat": "🐱", "dog": "🐶", "bag": "👜", "hat": "🎩", "sun": "☀️" }
              },
              video: {
                title: "3-Letter CVC Words for Kids",
                url: "https://www.youtube-nocookie.com/embed/uVeEAFy1z68",
                duration: "4:00"
              },
              activities: [
                {
                  id: "act1",
                  type: "match",
                  pairs: [
                    { word: "CAT", image: "🐱", matchId: "wd1" },
                    { word: "DOG", image: "🐶", matchId: "wd2" },
                    { word: "SUN", image: "☀️", matchId: "wd3" },
                    { word: "HAT", image: "🎩", matchId: "wd4" }
                  ]
                },
                {
                  id: "act2",
                  type: "voice",
                  phrase: "Cat dog bag",
                  question: "Say 'Cat, dog, bag'! 🎤",
                  keywords: ["cat", "dog", "bag"]
                }
              ],
              quiz: [
                { id: "q1", question: "Which picture matches CAT?", options: ["🐱 Meow!", "🐶 Woof!", "☀️ Sun", "🎩 Hat"], answer: "🐱 Meow!", explanation: "C-A-T spells Cat! It says meow!" }
              ]
            }
          ]
        },

        {
          id: "eng-ch3",
          chapterNumber: 3,
          title: "Colours & Shapes",
          ncertRef: "NCERT English Marigold Class 1, Unit 3",
          lessons: [
            {
              id: "eng-ch3-l1",
              title: "Colours of the Rainbow 🌈",
              duration: "10 mins",
              difficulty: "easy",
              story: {
                text: "Colours make our world beautiful! Red is the colour of apples and roses. Yellow is the colour of the sun. Blue is the colour of the sky and ocean. Green is the colour of leaves and grass. Orange, purple, and pink make rainbows magical!",
                chunks: [
                  "Colours make our world so beautiful! 🌈",
                  "RED is for apples and roses. 🍎🌹",
                  "YELLOW is for the bright sun. ☀️",
                  "BLUE is for sky and the ocean. 🌊",
                  "GREEN is for leaves and fresh grass. 🌿",
                  "Every colour is special and lovely! 💖"
                ],
                keywords: ["red", "yellow", "blue", "green", "orange", "purple"],
                visualHints: { "red": "🔴", "yellow": "🟡", "blue": "🔵", "green": "🟢", "orange": "🟠", "purple": "🟣" }
              },
              video: {
                title: "Colours for Kids – Learn Colours",
                url: "https://www.youtube-nocookie.com/embed/SLZcWGQQsmg",
                duration: "3:30"
              },
              activities: [
                {
                  id: "act1",
                  type: "tap",
                  question: "What colour is the sky? ☁️",
                  options: ["Blue 🔵", "Red 🔴", "Green 🟢", "Yellow 🟡"],
                  answer: "Blue 🔵"
                },
                {
                  id: "act2",
                  type: "match",
                  pairs: [
                    { word: "Red", image: "🍎", matchId: "cl1" },
                    { word: "Yellow", image: "☀️", matchId: "cl2" },
                    { word: "Green", image: "🌿", matchId: "cl3" },
                    { word: "Blue", image: "🌊", matchId: "cl4" }
                  ]
                },
                {
                  id: "act3",
                  type: "voice",
                  phrase: "Red yellow blue green",
                  question: "Say 'Red, yellow, blue, green'! 🎤",
                  keywords: ["red", "yellow", "blue", "green"]
                }
              ],
              quiz: [
                { id: "q1", question: "What colour is a banana?", options: ["Yellow 🟡", "Red 🔴", "Blue 🔵", "Purple 🟣"], answer: "Yellow 🟡", explanation: "Ripe bananas are yellow — and yummy too!" }
              ]
            }
          ]
        }
      ]
    },

    // ══════════════════════════════════════════════
    // 4. HINDI – RIMJHIM
    // ══════════════════════════════════════════════
    {
      id: "hindi",
      name: "Hindi – Rimjhim",
      icon: "🇮🇳",
      color: "#E63946",
      gradient: ["#6b0000", "#E63946"],
      chapters: [

        {
          id: "hindi-ch1",
          chapterNumber: 1,
          title: "Hindi Vowels – स्वर",
          ncertRef: "NCERT Hindi Rimjhim Class 1, Chapter 1",
          lessons: [
            {
              id: "hindi-ch1-l1",
              title: "अ, आ, इ, ई – Vowels 🔤",
              duration: "12 mins",
              difficulty: "easy",
              illustration: "/assets/visuals/hindi.png",
              story: {
                text: "Hindi has its own special letters called the Devanagari script. Our vowels in Hindi are called Swar. अ is the first vowel — like in अनार (Pomegranate)! आ is like in आम (Mango)! इ is like in इमली (Tamarind). ई is like in ईख (Sugarcane). Learning these opens a whole new world!",
                chunks: [
                  "Hindi letters are called Devanagari! ✨",
                  "Hindi vowels are called Swar (स्वर).",
                  "अ is the first — like in अनार! 🍎",
                  "आ is like in आम (Mango)! 🥭",
                  "इ is like in इमली (Tamarind).",
                  "ई is like in ईख (Sugarcane). 🌾"
                ],
                keywords: ["अ", "आ", "इ", "ई", "swar", "hindi"],
                visualHints: { "अ": "अनार 🍎", "आ": "आम 🥭", "इ": "इमली", "ई": "ईख 🌾" }
              },
              video: {
                title: "Hindi Swar – अ आ इ ई for Kids",
                url: "https://www.youtube-nocookie.com/embed/TM83zp1AkUM",
                duration: "4:00"
              },
              activities: [
                {
                  id: "act1",
                  type: "tap",
                  question: "अ is for...? 🍎",
                  options: ["अनार 🍎", "आम 🥭", "ईख 🌾", "उल्लू 🦉"],
                  answer: "अनार 🍎"
                },
                {
                  id: "act2",
                  type: "match",
                  pairs: [
                    { word: "अ", image: "🍎", matchId: "hn1" },
                    { word: "आ", image: "🥭", matchId: "hn2" },
                    { word: "इ", image: "🌿", matchId: "hn3" },
                    { word: "ई", image: "🌾", matchId: "hn4" }
                  ]
                },
                {
                  id: "act3",
                  type: "voice",
                  phrase: "अ आ इ ई",
                  question: "Say अ, आ, इ, ई! 🎤",
                  keywords: ["a", "aa", "i", "ee", "अ", "आ"]
                }
              ],
              quiz: [
                { id: "q1", question: "आम (Mango) starts with which vowel?", options: ["आ", "अ", "इ", "ई"], answer: "आ", explanation: "आम starts with आ — the second Hindi vowel!" }
              ]
            }
          ]
        },

        {
          id: "hindi-ch2",
          chapterNumber: 2,
          title: "Hindi Consonants – व्यंजन",
          ncertRef: "NCERT Hindi Rimjhim Class 1, Chapter 2",
          lessons: [
            {
              id: "hindi-ch2-l1",
              title: "क, ख, ग, घ – First Consonants 🔤",
              duration: "12 mins",
              difficulty: "easy",
              illustration: "/assets/visuals/hindi.png",
              story: {
                text: "Hindi consonants are called Vyanjan! क is like K — कमल (Lotus). ख is like Kh — खरगोश (Rabbit)! ग is like G — गाय (Cow). घ is like Gh — घर (Home). Each letter has a special shape and a special sound. Practice each one with love!",
                chunks: [
                  "Hindi consonants are called Vyanjan! 📖",
                  "क is like K — कमल (Lotus Flower) 🌸",
                  "ख is like Kh — खरगोश (Rabbit) 🐰",
                  "ग is like G — गाय (Cow) 🐄",
                  "घ is like Gh — घर (Home) 🏠",
                  "Practice each letter with love! ❤️"
                ],
                keywords: ["क", "ख", "ग", "घ", "vyanjan"],
                visualHints: { "क": "🌸", "ख": "🐰", "ग": "🐄", "घ": "🏠" }
              },
              video: {
                title: "Hindi Vyanjan क ख ग घ for Kids",
                url: "https://www.youtube-nocookie.com/embed/h4hJyaMhjdg",
                duration: "4:30"
              },
              activities: [
                {
                  id: "act1",
                  type: "tap",
                  question: "घर (Home) starts with which letter?",
                  options: ["घ 🏠", "क 🌸", "ग 🐄", "ख 🐰"],
                  answer: "घ 🏠"
                },
                {
                  id: "act2",
                  type: "match",
                  pairs: [
                    { word: "क", image: "🌸", matchId: "hc1" },
                    { word: "ख", image: "🐰", matchId: "hc2" },
                    { word: "ग", image: "🐄", matchId: "hc3" },
                    { word: "घ", image: "🏠", matchId: "hc4" }
                  ]
                }
              ],
              quiz: [
                { id: "q1", question: "गाय (Cow) starts with?", options: ["ग 🐄", "क", "ख", "घ"], answer: "ग 🐄", explanation: "ग makes the 'G' sound — like in Gaay (Cow)!" }
              ]
            }
          ]
        }
      ]
    },

    // ══════════════════════════════════════════════
    // 5. GENERAL KNOWLEDGE
    // ══════════════════════════════════════════════
    {
      id: "gk",
      name: "General Knowledge",
      icon: "🌍",
      color: "#9333EA",
      gradient: ["#3b0764", "#9333EA"],
      chapters: [

        {
          id: "gk-ch1",
          chapterNumber: 1,
          title: "Our Country India",
          lessons: [
            {
              id: "gk-ch1-l1",
              title: "India – Our Wonderful Country 🇮🇳",
              duration: "10 mins",
              difficulty: "easy",
              illustration: "/assets/visuals/india.png",
              story: {
                text: "We live in a beautiful country called India! India is a very large country with many states. Our capital city is New Delhi. Our national flag has three colours — saffron, white, and green — with a blue Ashoka Chakra in the middle. Our national bird is the Peacock. India is amazing!",
                chunks: [
                  "We live in beautiful India! 🇮🇳",
                  "India is a very large and diverse country.",
                  "Our capital city is New Delhi. 🏛️",
                  "Our flag has saffron, white, and green. 🔶⬜🟢",
                  "The blue Ashoka Chakra is in the middle.",
                  "Our national bird is the Peacock! 🦚"
                ],
                keywords: ["india", "new delhi", "flag", "peacock"],
                visualHints: { "india": "🇮🇳", "delhi": "🏛️", "flag": "🚩", "peacock": "🦚" }
              },
              video: {
                title: "India for Kids – Our Country",
                url: "https://www.youtube-nocookie.com/embed/6J6UpxMxG_8",
                duration: "4:00"
              },
              activities: [
                {
                  id: "act1",
                  type: "tap",
                  question: "What is the capital of India? 🏛️",
                  options: ["New Delhi 🏛️", "Mumbai", "Chennai", "Kolkata"],
                  answer: "New Delhi 🏛️"
                },
                {
                  id: "act2",
                  type: "tap",
                  question: "What is India's national bird? 🦚",
                  options: ["Peacock 🦚", "Eagle 🦅", "Parrot 🦜", "Sparrow 🐦"],
                  answer: "Peacock 🦚"
                },
                {
                  id: "act3",
                  type: "voice",
                  phrase: "I love India",
                  question: "Say 'I love India'! 🎤🇮🇳",
                  keywords: ["india", "love", "i love india"]
                }
              ],
              quiz: [
                { id: "q1", question: "How many colours are in the Indian flag?", options: ["3", "2", "4", "5"], answer: "3", explanation: "Saffron, White, and Green — 3 colours + Ashoka Chakra!" },
                { id: "q2", question: "India's national bird is...?", options: ["Peacock 🦚", "Crow", "Pigeon", "Owl 🦉"], answer: "Peacock 🦚", explanation: "The beautiful Peacock is India's national bird!" }
              ]
            }
          ]
        },

        {
          id: "gk-ch2",
          chapterNumber: 2,
          title: "Days, Months & Seasons",
          lessons: [
            {
              id: "gk-ch2-l1",
              title: "Days of the Week 📅",
              duration: "8 mins",
              difficulty: "easy",
              illustration: "/assets/visuals/calendar.png",
              story: {
                text: "Every week has seven days! Monday starts the school week. Tuesday, Wednesday, Thursday, and Friday are school days. Saturday and Sunday are the weekend — fun days! There are 7 days in a week and 52 weeks in a year. Time never stops — it keeps going forward!",
                chunks: [
                  "Every week has seven days! 📅",
                  "Monday starts the school week. 📚",
                  "Tuesday, Wednesday, Thursday, Friday — school days!",
                  "Saturday and Sunday are the weekend! 🎉",
                  "7 days in a week. 52 weeks in a year.",
                  "Time never stops — keep going! ⏰"
                ],
                keywords: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
                visualHints: { "monday": "📚", "friday": "🎊", "weekend": "🎉", "week": "📅" }
              },
              video: {
                title: "Days of the Week Song for Kids",
                url: "https://www.youtube-nocookie.com/embed/mXMofxtDPUQ",
                duration: "2:45"
              },
              activities: [
                {
                  id: "act1",
                  type: "tap",
                  question: "Which day comes AFTER Friday? 🎉",
                  options: ["Saturday 🎉", "Sunday", "Monday", "Thursday"],
                  answer: "Saturday 🎉"
                },
                {
                  id: "act2",
                  type: "voice",
                  phrase: "Monday Tuesday Wednesday",
                  question: "Say 'Monday, Tuesday, Wednesday'! 🎤",
                  keywords: ["monday", "tuesday", "wednesday"]
                }
              ],
              quiz: [
                { id: "q1", question: "How many days are in a week?", options: ["7", "5", "10", "6"], answer: "7", explanation: "7 days: Mon, Tue, Wed, Thu, Fri, Sat, Sun!" }
              ]
            },

            {
              id: "gk-ch2-l2",
              title: "Seasons of India 🌦️",
              duration: "10 mins",
              difficulty: "easy",
              illustration: "/assets/visuals/seasons.png",
              story: {
                text: "India has six wonderful seasons! Summer is hot — we eat mangoes and drink cold water. Monsoon brings rain and rainbows — plants grow tall! Autumn has falling leaves. Winter is cold — we wear sweaters. Spring brings colourful flowers. Each season has its own magic!",
                chunks: [
                  "India has six wonderful seasons! 🌦️",
                  "Summer is hot — mango time! ☀️🥭",
                  "Monsoon brings beautiful rain and rainbows. 🌈",
                  "Autumn has leaves falling gently. 🍂",
                  "Winter is cold — time for sweaters! 🧥",
                  "Spring brings colourful flowers! 🌸"
                ],
                keywords: ["summer", "monsoon", "winter", "spring", "seasons"],
                visualHints: { "summer": "☀️", "monsoon": "🌧️", "winter": "❄️", "spring": "🌸", "autumn": "🍂" }
              },
              video: {
                title: "Seasons for Kids – India",
                url: "https://www.youtube-nocookie.com/embed/C_Sc5ZjdfFI",
                duration: "3:30"
              },
              activities: [
                {
                  id: "act1",
                  type: "tap",
                  question: "Which season brings RAIN? 🌧️",
                  options: ["Monsoon 🌧️", "Summer ☀️", "Winter ❄️", "Spring 🌸"],
                  answer: "Monsoon 🌧️"
                },
                {
                  id: "act2",
                  type: "match",
                  pairs: [
                    { word: "Summer", image: "☀️", matchId: "ss1" },
                    { word: "Rain", image: "🌧️", matchId: "ss2" },
                    { word: "Winter", image: "❄️", matchId: "ss3" },
                    { word: "Spring", image: "🌸", matchId: "ss4" }
                  ]
                }
              ],
              quiz: [
                { id: "q1", question: "Which season is the hottest?", options: ["Summer ☀️", "Winter ❄️", "Monsoon 🌧️", "Spring 🌸"], answer: "Summer ☀️", explanation: "Summer is the hottest season — stay hydrated!" }
              ]
            }
          ]
        }
      ]
    },

    // ══════════════════════════════════════════════
    // 6. ART & CREATIVITY
    // ══════════════════════════════════════════════
    {
      id: "art",
      name: "Art & Creativity",
      icon: "🎨",
      color: "#FF7EC7",
      gradient: ["#6b0039", "#FF7EC7"],
      chapters: [
        {
          id: "art-ch1",
          chapterNumber: 1,
          title: "Colours & Drawing",
          lessons: [
            {
              id: "art-ch1-l1",
              title: "Primary Colours 🎨",
              duration: "10 mins",
              difficulty: "easy",
              illustration: "/assets/visuals/colours.png",
              story: {
                text: "Three colours are the parents of all other colours — they are called Primary Colours! Red, Blue, and Yellow are the primary colours. Mix red and blue and you get PURPLE! Mix blue and yellow and you get GREEN! Mix red and yellow and you get ORANGE! Isn't colour mixing the best kind of magic?",
                chunks: [
                  "Three colours are parents of all colours! 🎨",
                  "Red, Blue, and Yellow are PRIMARY colours.",
                  "Red + Blue = Purple! 🟣",
                  "Blue + Yellow = Green! 🟢",
                  "Red + Yellow = Orange! 🟠",
                  "Colour mixing is the best magic! ✨"
                ],
                keywords: ["red", "blue", "yellow", "primary", "mix"],
                visualHints: { "red": "🔴", "blue": "🔵", "yellow": "🟡", "purple": "🟣", "green": "🟢", "orange": "🟠" }
              },
              video: {
                title: "Primary Colours for Kids",
                url: "https://www.youtube-nocookie.com/embed/SLZcWGQQsmg",
                duration: "3:00"
              },
              activities: [
                {
                  id: "act1",
                  type: "tap",
                  question: "Red + Blue = ? 🎨",
                  options: ["Purple 🟣", "Green 🟢", "Orange 🟠", "Pink 🩷"],
                  answer: "Purple 🟣"
                },
                {
                  id: "act2",
                  type: "tap",
                  question: "Which is NOT a primary colour?",
                  options: ["Green 🟢", "Red 🔴", "Blue 🔵", "Yellow 🟡"],
                  answer: "Green 🟢"
                },
                {
                  id: "act3",
                  type: "voice",
                  phrase: "Red blue yellow",
                  question: "Say 'Red, Blue, Yellow'! 🎨",
                  keywords: ["red", "blue", "yellow"]
                }
              ],
              quiz: [
                { id: "q1", question: "What are the 3 primary colours?", options: ["Red, Blue, Yellow 🎨", "Red, Green, Purple", "Pink, Orange, White", "Black, Blue, Gold"], answer: "Red, Blue, Yellow 🎨", explanation: "Red, Blue, and Yellow are the 3 primary colours — they make all other colours!" },
                { id: "q2", question: "Blue + Yellow makes...?", options: ["Green 🟢", "Orange 🟠", "Purple 🟣", "Pink 🩷"], answer: "Green 🟢", explanation: "Blue + Yellow = Green! Try it with paint or play-doh!" }
              ]
            }
          ]
        }
      ]
    }

  ]
};

// ══════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ══════════════════════════════════════════════════════════

/**
 * Get a flat list of all lessons across all subjects
 */
export const getAllLessons = () => {
  const lessons = [];
  syllabusData.subjects.forEach(subject => {
    subject.chapters.forEach(chapter => {
      chapter.lessons.forEach(lesson => {
        lessons.push({
          ...lesson,
          subjectId: subject.id,
          subjectName: subject.name,
          subjectColor: subject.color,
          subjectIcon: subject.icon,
          chapterId: chapter.id,
          chapterTitle: chapter.title
        });
      });
    });
  });
  return lessons;
};

/**
 * Get a specific lesson by ID
 */
export const getLessonById = (lessonId) => {
  for (const subject of syllabusData.subjects) {
    for (const chapter of subject.chapters) {
      for (const lesson of chapter.lessons) {
        if (lesson.id === lessonId) {
          return { lesson, subject, chapter };
        }
      }
    }
  }
  return null;
};

/**
 * Get all lessons for a subject
 */
export const getLessonsBySubject = (subjectId) => {
  const subject = syllabusData.subjects.find(s => s.id === subjectId);
  if (!subject) return [];
  const lessons = [];
  subject.chapters.forEach(ch => ch.lessons.forEach(l => lessons.push({ ...l, chapter: ch })));
  return lessons;
};

/**
 * Get next lesson after a given lesson
 */
export const getNextLesson = (currentLessonId) => {
  const all = getAllLessons();
  const idx = all.findIndex(l => l.id === currentLessonId);
  return idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;
};

export default syllabusData;