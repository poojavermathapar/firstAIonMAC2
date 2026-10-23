// Static learning content: word banks, vocabulary and stories.
const CONTENT = {
  objects: ['🍎', '🐞', '⭐', '🎈', '🐟', '🍪', '🌸', '🚗', '🐸', '🍓', '⚽', '🦋', '🐥', '🍩'],

  names: ['Mia', 'Leo', 'Ava', 'Sam', 'Zara', 'Kai', 'Noah', 'Lily', 'Omar', 'Priya', 'Ben', 'Rosa'],

  // Short picture words for Little Learners
  words1: [
    ['cat', '🐱'], ['dog', '🐶'], ['sun', '☀️'], ['hat', '🎩'], ['bus', '🚌'], ['pig', '🐷'],
    ['fish', '🐟'], ['egg', '🥚'], ['bed', '🛏️'], ['box', '📦'], ['fox', '🦊'], ['bee', '🐝'],
    ['car', '🚗'], ['cow', '🐮'], ['ant', '🐜'], ['owl', '🦉'], ['key', '🔑'], ['map', '🗺️'],
    ['moon', '🌙'], ['frog', '🐸'], ['ball', '⚽'], ['cake', '🎂'], ['duck', '🦆'], ['tree', '🌳'],
  ],

  // Longer picture words for Explorers
  words2: [
    ['apple', '🍎'], ['banana', '🍌'], ['rabbit', '🐰'], ['rocket', '🚀'], ['pizza', '🍕'],
    ['tiger', '🐯'], ['turtle', '🐢'], ['candle', '🕯️'], ['guitar', '🎸'], ['monkey', '🐵'],
    ['rainbow', '🌈'], ['pencil', '✏️'], ['camera', '📷'], ['flower', '🌸'], ['dragon', '🐉'],
    ['penguin', '🐧'], ['robot', '🤖'], ['planet', '🪐'], ['castle', '🏰'], ['octopus', '🐙'],
    ['volcano', '🌋'], ['dolphin', '🐬'], ['umbrella', '☂️'], ['elephant', '🐘'],
  ],

  sightWords: ['the', 'and', 'is', 'you', 'said', 'was', 'they', 'have', 'we', 'my', 'see', 'look',
    'come', 'here', 'play', 'can', 'like', 'went', 'what', 'where', 'there', 'little', 'down', 'jump'],

  rhymes: [
    ['cat', 'hat', 'bat', 'mat'], ['cake', 'lake', 'snake', 'bake'], ['ring', 'king', 'sing', 'wing'],
    ['frog', 'log', 'dog', 'fog'], ['moon', 'spoon', 'soon', 'noon'], ['star', 'car', 'jar', 'far'],
    ['goat', 'boat', 'coat', 'float'], ['bear', 'chair', 'hair', 'pear'], ['light', 'night', 'kite', 'bright'],
    ['bee', 'tree', 'free', 'knee'], ['bug', 'rug', 'mug', 'hug'], ['fish', 'dish', 'wish', 'swish'],
  ],

  synonyms: [
    ['happy', 'joyful'], ['big', 'enormous'], ['fast', 'rapid'], ['smart', 'intelligent'],
    ['tired', 'exhausted'], ['brave', 'courageous'], ['angry', 'furious'], ['small', 'tiny'],
    ['begin', 'commence'], ['quiet', 'silent'], ['strange', 'peculiar'], ['scared', 'terrified'],
    ['rich', 'wealthy'], ['old', 'ancient'], ['funny', 'hilarious'], ['look', 'observe'],
  ],

  antonyms: [
    ['modern', 'ancient'], ['generous', 'selfish'], ['victory', 'defeat'], ['expand', 'shrink'],
    ['rare', 'common'], ['ascend', 'descend'], ['transparent', 'opaque'], ['temporary', 'permanent'],
    ['brave', 'cowardly'], ['scarce', 'plentiful'], ['accept', 'reject'], ['humble', 'arrogant'],
  ],

  prefixes: [
    ['un-', 'unhappy', 'not'], ['re-', 'rewrite', 'again'], ['pre-', 'preview', 'before'],
    ['mis-', 'misspell', 'wrongly'], ['sub-', 'submarine', 'under'], ['bi-', 'bicycle', 'two'],
    ['tri-', 'triangle', 'three'], ['over-', 'overcook', 'too much'], ['inter-', 'international', 'between'],
    ['auto-', 'autograph', 'self'],
  ],

  // Stories by level. Each question: q = question, a = correct answer, w = wrong answers.
  stories: {
    1: [
      {
        title: 'The Red Ball', art: '🐶⚽🌳🐦',
        text: 'Max is a little dog. Max has a red ball. He runs to the park with his ball. The ball goes up a tree! A bird helps Max get it down. Max is happy.',
        questions: [
          { q: 'What color is the ball?', a: '🔴 Red', w: ['🔵 Blue', '🟢 Green', '🟡 Yellow'] },
          { q: 'Where does the ball go?', a: '🌳 Up a tree', w: ['🌊 In the pond', '🛏️ Under the bed', '📦 In a box'] },
          { q: 'Who helps Max?', a: '🐦 A bird', w: ['🐱 A cat', '🐸 A frog', '🐟 A fish'] },
        ],
      },
      {
        title: "Sam's Cake", art: '🎂🕯️🎈🎉',
        text: "It is Sam's birthday. Mom makes a big cake. The cake has six candles. Sam's friends come to play. They sing a song. Sam blows out the candles and makes a wish.",
        questions: [
          { q: 'Whose birthday is it?', a: "Sam's", w: ["Mom's", "Max's", "Mia's"] },
          { q: 'How many candles are on the cake?', a: '6', w: ['4', '10', '2'] },
          { q: 'What do the friends do?', a: '🎵 Sing a song', w: ['😴 Go to sleep', '🏊 Swim', '📖 Read a book'] },
        ],
      },
      {
        title: 'The Night Owl', art: '🌙⭐🦉🏠',
        text: "The moon comes out at night. The stars come out too. A little owl wakes up. The owl says, \"Hoo, hoo!\" The owl flies over the town. When the sun comes up, the owl goes to sleep.",
        questions: [
          { q: 'When does the moon come out?', a: '🌙 At night', w: ['☀️ In the morning', '🍽️ At lunch', '🏫 At school'] },
          { q: 'What does the owl say?', a: 'Hoo, hoo!', w: ['Woof, woof!', 'Moo, moo!', 'Quack!'] },
          { q: 'When does the owl go to sleep?', a: '☀️ When the sun comes up', w: ['🌙 When the moon comes out', '🌧️ When it rains', '🍪 After a snack'] },
        ],
      },
      {
        title: 'Zoe Plants a Seed', art: '🌱💧☀️🌻',
        text: 'Zoe puts a seed in a pot. She gives it water every day. The pot sits in the sun. One day, a green sprout pops up! It grows and grows. Now Zoe has a big yellow flower.',
        questions: [
          { q: 'What does Zoe put in the pot?', a: '🌱 A seed', w: ['🍎 An apple', '🪨 A rock', '🧸 A toy'] },
          { q: 'What does Zoe give it every day?', a: '💧 Water', w: ['🥛 Milk', '🍪 Cookies', '🧃 Juice'] },
          { q: 'What color is the flower?', a: '🟡 Yellow', w: ['🔴 Red', '🟣 Purple', '🔵 Blue'] },
        ],
      },
    ],
    2: [
      {
        title: 'The Lemonade Stand', art: '🍋🥤🎸🪁',
        text: "Priya and her brother Leo wanted to buy a new kite. They decided to sell lemonade on a hot Saturday. Priya squeezed the lemons while Leo made a bright yellow sign. At first, nobody stopped. Then Leo had an idea: he started playing his guitar. Soon a crowd gathered, and they sold every cup by noon. They had enough money for the kite, with some left over to give to the animal shelter.",
        questions: [
          { q: 'Why did Priya and Leo sell lemonade?', a: 'To buy a new kite', w: ['To buy a guitar', 'To make new friends', 'Because they were thirsty'] },
          { q: 'What did Leo do to bring in customers?', a: 'He played his guitar', w: ['He shouted loudly', 'He gave cups away', 'He painted his face'] },
          { q: 'What did they do with the extra money?', a: 'Gave it to an animal shelter', w: ['Bought more lemons', 'Bought candy', 'Saved it in a jar'] },
          { q: 'How did Priya and Leo probably feel at the end?', a: '😊 Proud and happy', w: ['😴 Bored', '😠 Angry', '😨 Scared'] },
        ],
      },
      {
        title: 'Lost in the Museum', art: '🏛️🦖🧒🪪',
        text: "On a class trip to the museum, Omar stopped to stare at a giant dinosaur skeleton. When he turned around, his class was gone! Omar's heart pounded. Then he remembered what his teacher had said: \"If you get lost, find someone wearing a museum badge.\" He spotted a woman with a blue badge near the gift shop. She used her radio, and in two minutes Omar's teacher arrived, smiling with relief.",
        questions: [
          { q: 'What was Omar looking at when he got lost?', a: 'A dinosaur skeleton', w: ['A painting', 'The gift shop', 'A movie'] },
          { q: 'What advice did Omar remember?', a: 'Find someone with a museum badge', w: ['Run to the exit', 'Call his mom', 'Wait by the dinosaur'] },
          { q: 'Where was the helper standing?', a: 'Near the gift shop', w: ['At the front door', 'In the café', 'By the dinosaur'] },
          { q: 'What is the main lesson of the story?', a: 'Stay calm and follow the plan', w: ['Never visit museums', 'Dinosaurs are scary', 'Always walk in front'] },
        ],
      },
      {
        title: 'The Garden Mystery', art: '👴🥕📷🐇',
        text: "Every morning, Grandpa found holes in his carrot patch. \"Who is eating my carrots?\" he wondered. Ana set up a camera by the garden. The next day, they watched the video together. At midnight, a family of rabbits hopped in and munched happily. Instead of being angry, Grandpa laughed. He built a small fence and planted an extra row of carrots just outside it — for the rabbits.",
        questions: [
          { q: 'What was disappearing from the garden?', a: '🥕 Carrots', w: ['🍅 Tomatoes', '🌻 Flowers', '🍓 Strawberries'] },
          { q: 'How did Ana solve the mystery?', a: 'She set up a camera', w: ['She stayed up all night', 'She asked the neighbors', 'She set a trap'] },
          { q: 'What does the word "munched" mean?', a: 'Chewed and ate', w: ['Ran away', 'Slept', 'Dug a hole'] },
          { q: 'Why did Grandpa plant carrots outside the fence?', a: 'So the rabbits had food too', w: ['He ran out of room', 'To trick Ana', 'Carrots grow better there'] },
        ],
      },
    ],
    3: [
      {
        title: 'The Bridge Builders', art: '🌊🌉📐👩‍🔧',
        text: "When the river flooded and washed away the footbridge, the village of Ellis Creek was split in two. Children on the east bank could no longer reach school. Thirteen-year-old Mara had read about suspension bridges, which hang from strong cables anchored at both ends. She sketched a design and presented it to the town council. The adults were skeptical at first, but an engineer named Mr. Okafor saw potential. Together they tested scale models and discovered that adding diagonal braces kept the deck from swaying. Six months later, a new bridge stood over the river — stronger than the old one, and named after the students who helped build it.",
        questions: [
          { q: 'What problem did the flood cause?', a: 'Children on one side could not reach school', w: ['The school was destroyed', 'The village ran out of water', 'Mr. Okafor lost his job'] },
          { q: 'In this passage, "skeptical" most nearly means…', a: 'Doubtful', w: ['Excited', 'Angry', 'Confused'] },
          { q: 'Why did they add diagonal braces?', a: 'To keep the deck from swaying', w: ['To make it look nicer', 'To save money', 'To make it longer'] },
          { q: 'Which theme fits the story best?', a: "Young people's ideas can make a real difference", w: ['Rivers are dangerous', 'Adults always know best', 'Old things are better than new'] },
        ],
      },
      {
        title: 'The Last Lighthouse Keeper', art: '🗼🌫️⛵📓',
        text: "For forty years, Elias Varga climbed the 112 steps of the Cape Morrow lighthouse every evening to light the lamp. When the coast guard announced that the light would be automated, the townspeople expected Elias to be bitter. Instead, he spent his final month writing a logbook for the technicians — detailing which winter storms arrived without warning, where the fog gathered first, and which ships' captains still waved at the tower. \"A machine can keep the light burning,\" he wrote on the final page, \"but someone should remember why it matters.\"",
        questions: [
          { q: 'Why did the townspeople expect Elias to be bitter?', a: 'His job was being replaced by a machine', w: ['He was tired of the steps', 'The lighthouse was closing forever', 'He had lost his logbook'] },
          { q: 'What did Elias write in the logbook?', a: 'Details about storms, fog and ships', w: ['A list of complaints', 'Instructions for the lamp', 'Letters to his family'] },
          { q: "What does Elias's final line suggest?", a: "Human knowledge and care can't be fully replaced", w: ['Machines are better than people', 'The light is not important', 'He wanted to stay forever'] },
          { q: "Which word best describes Elias's attitude?", a: 'Generous', w: ['Resentful', 'Careless', 'Fearful'] },
        ],
      },
      {
        title: 'Plastic Ocean', art: '🌊🐢🛍️🔬',
        text: "Every year, millions of tons of plastic enter the ocean. Large pieces can trap animals like sea turtles, which may also mistake floating bags for jellyfish, one of their favorite foods. Over time, sunlight and waves break plastic into tiny fragments called microplastics. These are now found everywhere from Arctic ice to the deepest ocean trenches. Scientists are testing solutions, including floating barriers that collect trash and enzymes that can digest certain plastics. However, most experts agree that the most effective solution is simple: use less plastic in the first place.",
        questions: [
          { q: 'Why might a sea turtle eat a plastic bag?', a: 'It looks like a jellyfish', w: ['It tastes sweet', 'It is very hungry', 'It wants to build a nest'] },
          { q: 'What are microplastics?', a: 'Tiny fragments of broken-down plastic', w: ['A new kind of fish', 'Plastic made by scientists', 'Very small plastic bags'] },
          { q: 'According to experts, what is the most effective solution?', a: 'Using less plastic', w: ['Floating barriers', 'Plastic-eating enzymes', 'Cleaning the Arctic'] },
          { q: "What is the author's main purpose?", a: 'To inform readers about plastic pollution', w: ['To tell a funny story', 'To sell a product', 'To describe sea turtles'] },
        ],
      },
    ],
  },
};
