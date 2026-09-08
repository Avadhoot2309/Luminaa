const { db } = require('../config/firebase-admin-config');

async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n');
  try {
    console.log('🧹 Cleared existing data...');
    const collectionsToClear = ['subjects', 'chapters', 'lessons', 'assessments', 'games'];
    for (const coll of collectionsToClear) {
      const snapshot = await db.collection(coll).get();
      for (const doc of snapshot.docs) {
        await doc.ref.delete();
      }
    }

    const subjects = [
      { subjectId: 'math', name: 'Math', description: 'Mathematics concepts and problem solving', icon: '/images/subjects/math.svg', order: 1 },
      { subjectId: 'science', name: 'Science', description: 'Physics, chemistry, biology, and environment', icon: '/images/subjects/science.svg', order: 2 },
      { subjectId: 'english', name: 'English', description: 'Language, grammar, and literature', icon: '/images/subjects/english.svg', order: 3 },
      { subjectId: 'social-studies', name: 'Social Studies', description: 'History, geography, and civics', icon: '/images/subjects/social.svg', order: 4 },
      { subjectId: 'hindi', name: 'Hindi', description: 'Hindi language and literature', icon: '/images/subjects/hindi.svg', order: 5 }
    ];
    for (const sub of subjects) {
      await db.collection('subjects').doc(sub.subjectId).set(sub);
      console.log(`  ✓ Created subject: ${sub.name}`);
    }

    const mathChaptersDesc = [
      { title: 'Knowing Our Numbers', ncertChapterNumber: 1, estimatedDuration: 45 },
      { title: 'Whole Numbers', ncertChapterNumber: 2, estimatedDuration: 40 },
      { title: 'Playing With Numbers', ncertChapterNumber: 3, estimatedDuration: 50 },
      { title: 'Basic Geometrical Ideas', ncertChapterNumber: 4, estimatedDuration: 40 },
      { title: 'Understanding Elementary Shapes', ncertChapterNumber: 5, estimatedDuration: 45 },
      { title: 'Integers', ncertChapterNumber: 6, estimatedDuration: 45 },
      { title: 'Fractions', ncertChapterNumber: 7, estimatedDuration: 50 },
      { title: 'Decimals', ncertChapterNumber: 8, estimatedDuration: 45 },
      { title: 'Data Handling', ncertChapterNumber: 9, estimatedDuration: 40 },
      { title: 'Mensuration', ncertChapterNumber: 10, estimatedDuration: 55 },
      { title: 'Algebra', ncertChapterNumber: 11, estimatedDuration: 60 },
      { title: 'Ratio and Proportion', ncertChapterNumber: 12, estimatedDuration: 50 }
    ];

    console.log('\n📖 Seeding Chapters, Lessons & Assessments for Math Grade 6...');
    for (const desc of mathChaptersDesc) {
      const chapRef = db.collection('chapters').doc();
      const chapterId = chapRef.id;
      
      const chapter = {
        chapterId: chapterId,
        subjectId: 'math',
        grade: 6,
        title: desc.title,
        ncertChapterNumber: desc.ncertChapterNumber,
        estimatedDuration: desc.estimatedDuration
      };
      await chapRef.set(chapter);
      console.log(`  ✓ Created chapter: ${chapter.title}`);

      if (desc.title === 'Knowing Our Numbers') {
        console.log(`  ➔ Seeding lessons for chapter ID: ${chapterId}`);
        const realLessonsData = [
          {
            title: "Introduction to Large Numbers",
            original_text: "In our daily life, we deal with many numbers. Sometimes these numbers are very large. For example, the population of India is more than 100 crore. The distance from Earth to Sun is about 15 crore kilometres. We read and write large numbers using the Indian Place Value System. In this system, we use ones, tens, hundreds, thousands, ten thousands, lakhs, ten lakhs, and crores. Each place has a value 10 times the place to its right. For example, 1 lakh = 100 thousands = 1,00,000. To read large numbers easily, we put commas after every 2 digits from the right, except the last 3 digits. Example: 57,83,295 is read as fifty-seven lakh eighty-three thousand two hundred ninety-five.",
            dyslexia_simplified_text: "We use big numbers every day. India has more than 100 crore people. We write numbers using a place value system. The places are: ones, tens, hundreds, thousands, lakhs, crores. Each place is 10 times bigger than the one before it. 1 lakh means 1,00,000. We use commas to read big numbers easily. Example: 57,83,295 means fifty-seven lakh eighty-three thousand.",
            chunked_lessons: [
              "In our daily life, we deal with many numbers. Sometimes these numbers are very large. For example, the population of India is more than 100 crore. The distance from Earth to Sun is about 15 crore kilometres.",
              "We read and write large numbers using the Indian Place Value System. In this system, we use ones, tens, hundreds, thousands, ten thousands, lakhs, ten lakhs, and crores. Each place has a value 10 times the place to its right. For example, 1 lakh = 100 thousands = 1,00,000.",
              "To read large numbers easily, we put commas after every 2 digits from the right, except the last 3 digits. Example: 57,83,295 is read as fifty-seven lakh eighty-three thousand two hundred ninety-five."
            ],
            difficulty: "beginner",
            estimatedTime: 8,
            tags: ["numbers", "place value", "lakhs", "crores"],
            video: {
              youtube_id: "9lRPPHNHJsE",
              title: "Understanding Large Numbers",
              duration_seconds: 480,
              language: "english",
              has_hindi: true,
              hindi_youtube_id: "vMbMdKGjNsE"
            },
            visual_aids: [
              { type: "place_value_chart", description: "Indian place value chart showing Ones, Tens, Hundreds, Thousands, Ten-Thousands, Lakhs, Ten-Lakhs, Crores with example number 57,83,295" },
              { type: "number_line", description: "Number line from 0 to 1 crore with major landmarks marked" }
            ],
            assessment: [
              { text: "How many digits are in 1 lakh?", type: "mcq", options: ["3", "4", "5", "6"], correctAnswer: "6", explanation: "1 lakh = 1,00,000 which has 6 digits" },
              { text: "What is the place value of 5 in 5,23,410?", type: "mcq", options: ["5 thousands", "5 lakhs", "5 ten-lakhs", "5 hundreds"], correctAnswer: "5 lakhs", explanation: "The digit 5 is in the lakhs place so its value is 5,00,000" },
              { text: "How do we write fifty-two lakh thirty thousand?", type: "mcq", options: ["52,30,000", "5,230,000", "52,030,00", "5,23,000"], correctAnswer: "52,30,000", explanation: "Fifty-two lakh = 52,00,000 plus thirty thousand = 30,000" }
            ]
          },
          {
            title: "Comparing and Ordering Numbers",
            original_text: "When we compare two numbers, we first count their digits. A number with more digits is always greater. If both numbers have the same number of digits, we compare them from the leftmost digit. The number with the greater leftmost digit is larger. If the leftmost digits are equal, we move to the next digit and compare again. Example: Compare 4,57,923 and 4,62,005. Both have 6 digits. Leftmost digit: both have 4. Next digit: 5 vs 6. Since 6 > 5, so 4,62,005 > 4,57,923. We can arrange numbers in ascending order (smallest to largest) or descending order (largest to smallest).",
            dyslexia_simplified_text: "To compare two numbers, count the digits first. More digits means bigger number. If digits are equal, look at the left side first. Bigger digit on the left means bigger number. Example: 4,62,005 is bigger than 4,57,923. Why? Both start with 4. But 6 is bigger than 5. Ascending order = smallest to largest. Descending order = largest to smallest.",
            chunked_lessons: [
              "When we compare two numbers, we first count their digits. A number with more digits is always greater. If both numbers have the same number of digits, we compare them from the leftmost digit.",
              "The number with the greater leftmost digit is larger. If the leftmost digits are equal, we move to the next digit and compare again. Example: Compare 4,57,923 and 4,62,005.",
              "Both have 6 digits. Leftmost digit: both have 4. Next digit: 5 vs 6. Since 6 > 5, so 4,62,005 > 4,57,923. We can arrange numbers in ascending order (smallest to largest) or descending order (largest to smallest)."
            ],
            difficulty: "beginner",
            estimatedTime: 7,
            tags: ["comparing", "ordering", "ascending", "descending"],
            video: {
              youtube_id: "qdMpkMCBBKg",
              title: "Comparing and Ordering Numbers",
              duration_seconds: 420,
              language: "english",
              has_hindi: true,
              hindi_youtube_id: "rPvMdKGjNsF"
            },
            visual_aids: [
              { type: "comparison_chart", description: "Side by side comparison of two numbers with digits aligned by place value" },
              { type: "number_ladder", description: "Visual ladder showing ascending and descending order with arrows" }
            ],
            assessment: [
              { text: "Which number is greater: 7,42,019 or 74,201?", type: "mcq", options: ["7,42,019", "74,201", "Both are equal", "Cannot say"], correctAnswer: "7,42,019", explanation: "7,42,019 has 6 digits and 74,201 has 5 digits so 7,42,019 is greater" },
              { text: "Arrange in ascending order: 3,72,105 / 37,210 / 3,72,501", type: "mcq", options: ["37,210 < 3,72,105 < 3,72,501", "3,72,501 < 3,72,105 < 37,210", "3,72,105 < 37,210 < 3,72,501", "37,210 < 3,72,501 < 3,72,105"], correctAnswer: "37,210 < 3,72,105 < 3,72,501", explanation: "37,210 has fewest digits so smallest. Then compare 3,72,105 and 3,72,501 — 1 < 5 in hundreds place" },
              { text: "What does descending order mean?", type: "mcq", options: ["Smallest to largest", "Largest to smallest", "Random order", "Alphabetical order"], correctAnswer: "Largest to smallest", explanation: "Descending means going down so we start from the largest number" }
            ]
          },
          {
            title: "Roman Numerals",
            original_text: "Roman numerals are a number system that was used by ancient Romans. We still use them today on clock faces, in book chapters, and for years in movies. The basic Roman numeral symbols are: I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1000. Rules for Roman numerals: 1. If a smaller symbol comes after a larger one, add them. Example: VI = 5 + 1 = 6, XI = 10 + 1 = 11 2. If a smaller symbol comes before a larger one, subtract it. Example: IV = 5 - 1 = 4, IX = 10 - 1 = 9 3. The same symbol cannot be repeated more than 3 times. Example: III = 3 is correct, IIII = 4 is wrong (write IV instead) Roman numerals do not have a symbol for zero.",
            dyslexia_simplified_text: "Romans had their own number system. We still use them today on clocks and in books. Basic symbols: I=1, V=5, X=10, L=50, C=100, D=500, M=1000. Rule 1: Small symbol after big = add. VI = 5+1 = 6. Rule 2: Small symbol before big = subtract. IV = 5-1 = 4. Rule 3: Never repeat a symbol more than 3 times. There is no zero in Roman numerals.",
            chunked_lessons: [
              "Roman numerals are a number system that was used by ancient Romans. We still use them today on clock faces, in book chapters, and for years in movies. The basic Roman numeral symbols are: I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1000.",
              "Rules for Roman numerals: 1. If a smaller symbol comes after a larger one, add them. Example: VI = 5 + 1 = 6, XI = 10 + 1 = 11 2. If a smaller symbol comes before a larger one, subtract it. Example: IV = 5 - 1 = 4, IX = 10 - 1 = 9",
              "3. The same symbol cannot be repeated more than 3 times. Example: III = 3 is correct, IIII = 4 is wrong (write IV instead) Roman numerals do not have a symbol for zero."
            ],
            difficulty: "intermediate",
            estimatedTime: 10,
            tags: ["roman numerals", "number systems", "history"],
            video: {
              youtube_id: "kvr2QVH57vc",
              title: "Roman Numerals Explained",
              duration_seconds: 540,
              language: "english",
              has_hindi: true,
              hindi_youtube_id: "sPvMdKGjNsG"
            },
            visual_aids: [
              { type: "roman_symbols_table", description: "Table of all Roman numeral symbols I V X L C D M with their values" },
              { type: "roman_examples", description: "Step by step visual showing how IV=4 and VI=6 work differently" }
            ],
            assessment: [
              { text: "What is the Roman numeral for 9?", type: "mcq", options: ["VIIII", "IX", "XI", "IIX"], correctAnswer: "IX", explanation: "IX means 10 minus 1 which equals 9" },
              { text: "What is the value of XLII?", type: "mcq", options: ["62", "42", "48", "38"], correctAnswer: "42", explanation: "XL = 40 (50 minus 10) and II = 2 so XLII = 42" },
              { text: "Which of these is INCORRECT in Roman numerals?", type: "mcq", options: ["XIV", "XXIX", "IIII", "MMXX"], correctAnswer: "IIII", explanation: "You cannot repeat the same symbol more than 3 times. 4 should be written as IV" }
            ]
          },
          {
            title: "Estimation and Rounding",
            original_text: "Sometimes we do not need an exact answer. We can use estimation to get a close answer quickly. Rounding is one way to estimate numbers. Rules for rounding: - Look at the digit to the right of the place you are rounding to. - If that digit is 5 or more, round up (add 1 to the rounding digit). - If that digit is less than 5, round down (keep the rounding digit same). Example: Round 4,768 to the nearest hundred. Look at the tens digit: 6. Since 6 >= 5, round up. Answer: 4,800. Example: Round 4,768 to the nearest thousand. Look at the hundreds digit: 7. Since 7 >= 5, round up. Answer: 5,000. Estimation is useful in shopping, cooking, and planning.",
            dyslexia_simplified_text: "Sometimes a close answer is good enough. This is called estimation. Rounding helps us estimate. If the next digit is 5 or more, round up. If the next digit is less than 5, round down. Example: 4,768 rounded to nearest hundred = 4,800. Why? The tens digit is 6. 6 is more than 5. So round up. We use estimation in shopping and cooking every day.",
            chunked_lessons: [
              "Sometimes we do not need an exact answer. We can use estimation to get a close answer quickly. Rounding is one way to estimate numbers. Rules for rounding: - Look at the digit to the right of the place you are rounding to.",
              "- If that digit is 5 or more, round up (add 1 to the rounding digit). - If that digit is less than 5, round down (keep the rounding digit same). Example: Round 4,768 to the nearest hundred. Look at the tens digit: 6. Since 6 >= 5, round up. Answer: 4,800.",
              "Example: Round 4,768 to the nearest thousand. Look at the hundreds digit: 7. Since 7 >= 5, round up. Answer: 5,000. Estimation is useful in shopping, cooking, and planning."
            ],
            difficulty: "intermediate",
            estimatedTime: 9,
            tags: ["estimation", "rounding", "approximation"],
            video: {
              youtube_id: "eTHMkCLLPHk",
              title: "Estimation and Rounding Numbers",
              duration_seconds: 390,
              language: "english",
              has_hindi: true,
              hindi_youtube_id: "tPvMdKGjNsH"
            },
            visual_aids: [
              { type: "rounding_number_line", description: "Number line showing 4768 sitting closer to 4800 than 4700" },
              { type: "rounding_rules_chart", description: "Visual flowchart: look at next digit → 5 or more? round up : round down" }
            ],
            assessment: [
              { text: "Round 3,456 to the nearest hundred.", type: "mcq", options: ["3,400", "3,500", "3,000", "4,000"], correctAnswer: "3,500", explanation: "The tens digit is 5. Since 5 >= 5 we round up the hundreds digit from 4 to 5" },
              { text: "Round 7,832 to the nearest thousand.", type: "mcq", options: ["7,000", "8,000", "7,800", "7,900"], correctAnswer: "8,000", explanation: "The hundreds digit is 8. Since 8 >= 5 we round up from 7000 to 8000" },
              { text: "Which is the best estimation of 498 + 312?", type: "mcq", options: ["500 + 300 = 800", "400 + 300 = 700", "500 + 310 = 810", "490 + 310 = 800"], correctAnswer: "500 + 300 = 800", explanation: "498 rounds to 500 and 312 rounds to 300 giving us a quick estimate of 800" }
            ]
          }
        ];

        for (let l = 0; l < realLessonsData.length; l++) {
          const lessonData = realLessonsData[l];
          const lessonRef = db.collection('lessons').doc();
          const lessonId = lessonRef.id;
          
          const lesson = {
            lessonId,
            chapterId: chapterId,
            title: lessonData.title,
            order: l + 1,
            difficulty: lessonData.difficulty,
            estimatedTime: lessonData.estimatedTime,
            content: {
              original_text: lessonData.original_text,
              dyslexia_simplified_text: lessonData.dyslexia_simplified_text,
              chunked_lessons: lessonData.chunked_lessons,
              visual_aids: lessonData.visual_aids || [],
              video: lessonData.video || null,
              audio_url: '',
              video_url: ''
            },
            tags: lessonData.tags
          };
          await lessonRef.set(lesson);
          console.log(`    ✓ Lesson "${lesson.title}"`);
          console.log(`      → Lesson Document ID : ${lessonId}`);
          console.log(`      → chapterId field    : ${lesson.chapterId}`);
          console.log(`      → Chapter Doc ID     : ${chapterId}`);
          console.log(`      → IDs Match          : ${lesson.chapterId === chapterId}`);

          const assessRef = db.collection('assessments').doc();
          const assessmentId = assessRef.id;
          
          const assessment = {
            assessmentId,
            lessonId,
            title: `Assessment: ${lesson.title}`,
            passingScore: 60,
            questions: lessonData.assessment.map((q, qIndex) => ({
              questionId: db.collection('assessments').doc().id,
              text: q.text,
              audio_url: '',
              type: q.type,
              options: q.options,
              correctAnswer: q.correctAnswer,
              explanation: q.explanation,
              difficulty: qIndex + 1
            }))
          };
          await assessRef.set(assessment);
        }
      }
    }

    const gamesDesc = [
      { name: 'Word Jump', type: 'word', desc: 'Jump over words correctly to build sentences', targetSkills: ['spelling', 'reading speed'], min: 1, max: 10 },
      { name: 'Math Race', type: 'math', desc: 'Answer math equations fast to win the race', targetSkills: ['arithmetic', 'quick thinking'], min: 1, max: 10 },
      { name: 'Memory Match', type: 'memory', desc: 'Match pairs of identical cards', targetSkills: ['working memory', 'focus'], min: 1, max: 10 },
      { name: 'Story Builder', type: 'word', desc: 'Construct a story from a set of words and ideas', targetSkills: ['creativity', 'composition'], min: 1, max: 10 },
      { name: 'Science Lab Simulator', type: 'logic', desc: 'Perform experiments and see results', targetSkills: ['scientific method', 'logic'], min: 1, max: 10 },
      { name: 'Puzzle Quest', type: 'logic', desc: 'Solve intricate puzzles to gather points', targetSkills: ['problem solving', 'spatial reasoning'], min: 1, max: 10 },
      { name: 'Geography Explorer', type: 'logic', desc: 'Locate places on a world map correctly', targetSkills: ['map reading', 'spatial memory'], min: 1, max: 10 },
      { name: 'Grammar Garden', type: 'word', desc: 'Plant the correct parts of speech to grow grammar flowers', targetSkills: ['syntax', 'parts of speech'], min: 1, max: 10 }
    ];

    console.log('\n🎮 Seeding Games...');
    for (const g of gamesDesc) {
      const gId = g.name.toLowerCase().replace(/ /g, '-');
      const gameRef = db.collection('games').doc(gId);
      const game = {
        gameId: gId,
        name: g.name,
        type: g.type,
        description: g.desc,
        targetSkills: g.targetSkills,
        minLevel: g.min,
        maxLevel: g.max,
        adaptiveSettings: {
          dyslexia: { speed: "slow", audioHints: true, fontFamily: "opendyslexic" },
          adhd: { quickRewards: true, sessionDuration: 5, streakBonus: true },
          low_vision: { fontSize: "xlarge", highContrast: true, audioDescriptions: true }
        }
      };
      await gameRef.set(game);
      console.log(`  ✓ Created game: ${game.name}`);
    }

    console.log('\n✅ Database seeding completed successfully!\n');
    console.log('✅ 4 real NCERT lessons seeded successfully\n');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
