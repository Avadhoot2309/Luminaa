/**
 * LUMINAA – Multilingual E-Book Data
 * Supporting English, Hindi, and Marathi.
 * Categorized by Age and Difficulty.
 */

export const ebookData = [
  {
    id: 'clever-crow',
    title: { en: "The Clever Crow", hi: "चतुर कौवा", mr: "हुशार कावळा" },
    author: "Aesop's Fables",
    ageCategory: "3-6",
    difficulty: "easy",
    cover: "🐦",
    color: "#4A90D9",
    languages: ["en", "hi", "mr"],
    content: {
      en: [
        "Once upon a time, there was a thirsty crow.",
        "He flew everywhere looking for water.",
        "Suddenly, he saw a pitcher with a little water at the bottom.",
        "His beak could not reach the water inside.",
        "The crow saw some pebbles nearby.",
        "He dropped the pebbles into the pitcher one by one.",
        "The water level rose to the top!",
        "The clever crow drank the water and flew away happily."
      ],
      hi: [
        "एक बार एक प्यासा कौवा था।",
        "वह पानी की तलाश में हर जगह उड़ा।",
        "अचानक, उसने एक घड़ा देखा जिसमें नीचे थोड़ा पानी था।",
        "उसकी चोंच अंदर के पानी तक नहीं पहुँच सकी।",
        "कौवे ने पास में कुछ कंकड़ देखे।",
        "उसने एक-एक करके कंकड़ घड़े में डाल दिए।",
        "पानी का स्तर ऊपर आ गया!",
        "चतुर कौवे ने पानी पिया और खुशी-खुशी उड़ गया।"
      ],
      mr: [
        "एकदा एक तहानलेला कावळा होता.",
        "तो पाण्याच्या शोधात सगळीकडे फिरला.",
        "अचानक, त्याला एक मडके दिसले ज्यामध्ये तळाला थोडे पाणी होते.",
        "त्याची चोच आतील पाण्यापर्यंत पोहोचू शकली नाही.",
        "कावळ्याला जवळच काही खडे दिसले.",
        "त्याने एक एक करून खडे मडक्यात टाकले.",
        "पाण्याची पातळी वर आली!",
        "हुशार कावळ्याने पाणी प्यायले आणि आनंदाने उडून गेला."
      ]
    },
    vocabulary: {
      "thirsty": {
        simple: "Needing to drink water.",
        dictionary: "Feeling a need to drink something; suffering from thirst."
      },
      "pitcher": {
        simple: "A large container for holding liquids.",
        dictionary: "A large jug or container with a handle and a lip, used for holding and pouring liquids."
      },
      "pebbles": {
        simple: "Small, smooth stones.",
        dictionary: "Small stones made smooth and round by the action of water or sand."
      },
      "clever": {
        simple: "Smart and quick at learning.",
        dictionary: "Quick to understand, learn, and devise ideas; intelligent."
      }
    }
  },
  {
    id: 'solar-voyage',
    title: { en: "Solar System Voyage", hi: "सौर मंडल की यात्रा", mr: "सूर्यमालेची सफर" },
    author: "Lumina Science",
    ageCategory: "7-10",
    difficulty: "medium",
    cover: "🚀",
    color: "#2E8B57",
    languages: ["en", "hi", "mr"],
    content: {
      en: [
        "Our Solar System is a vast and amazing place!",
        "At the center, we have the Sun, a massive ball of fire.",
        "Mercury is the closest planet to the Sun and very hot.",
        "Venus is bright and has thick, yellow clouds.",
        "Earth is our home, the only planet with liquid water and life.",
        "Mars is known as the Red Planet because of its dusty soil.",
        "Jupiter is the largest planet and has a Great Red Spot.",
        "Saturn is famous for its beautiful, icy rings."
      ],
      hi: [
        "हमारा सौर मंडल एक विशाल और अद्भुत स्थान है!",
        "केंद्र में, हमारे पास सूर्य है, जो आग का एक विशाल गोला है।",
        "बुध सूर्य के सबसे करीब का ग्रह है और बहुत गर्म है।",
        "शुक्र चमकीला है और इसमें घने, पीले बादल हैं।",
        "पृथ्वी हमारा घर है, एकमात्र ग्रह जहाँ तरल पानी और जीवन है।",
        "मंगल को इसकी धूल भरी मिट्टी के कारण लाल ग्रह के रूप में जाना जाता है।",
        "बृहस्पति सबसे बड़ा ग्रह है और इसमें एक 'ग्रेट रेड स्पॉट' है।",
        "शनि अपने सुंदर, बर्फीले छल्लों के लिए प्रसिद्ध है।"
      ],
      mr: [
        "आपली सूर्यमाला हे एक विस्तीर्ण आणि आश्चर्यकारक ठिकाण आहे!",
        "मध्याभागी आपला सूर्य आहे, जो आगीचा एक मोठा गोळा आहे.",
        "बुध हा सूर्याच्या सर्वात जवळचा ग्रह असून तो खूप गरम आहे.",
        "शुक्र हा तेजस्वी असून त्यात दाट पिवळे ढग आहेत.",
        "पृथ्वी हे आपले घर असून तिथे पाणी आणि जीवन आहे.",
        "मंगळ हा लाल ग्रह म्हणून ओळखला जातो.",
        "गुरु हा सर्वात मोठा ग्रह आहे आणि त्यात 'ग्रेट रेड स्पॉट' आहे.",
        "शनि त्याच्या सुंदर कड्यांसाठी प्रसिद्ध आहे."
      ]
    },
    vocabulary: {
      "vast": { simple: "Very, very big!", dictionary: "Of very great extent or quantity; immense." },
      "massive": { simple: "Extremely large and heavy.", dictionary: "Large and heavy or solid; exceptionally large." },
      "liquid": { simple: "Something that flows like water.", dictionary: "A substance that flows freely but is of constant volume, having a consistency like that of water or oil." },
      "dusty": { simple: "Covered with tiny bits of dirt or sand.", dictionary: "Covered with, full of, or resembling dust." }
    }
  },
  {
    id: 'banyan-tree-history',
    title: { en: "History of the Banyan Tree", hi: "बरगद के पेड़ का इतिहास", mr: "वटवृक्षाचा इतिहास" },
    author: "Lumina Culture",
    ageCategory: "11-15",
    difficulty: "hard",
    cover: "🌳",
    color: "#E8920C",
    languages: ["en", "hi", "mr"],
    content: {
      en: [
        "The Banyan Tree is the National Tree of India and a symbol of immortality.",
        "Its expansive canopy provides shade and shelter to countless creatures.",
        "The unique 'aerial roots' grow downwards from the branches to support the tree.",
        "In Indian culture, the Banyan tree is often called 'Vat Vruksh'.",
        "Many believe that it represents eternal life due to its long lifespan.",
        "Great sages like the Buddha often meditated under its sacred shade.",
        "The tree is home to many birds, monkeys, and squirrels.",
        "Respecting these ancient giants helps us preserve our natural heritage."
      ],
      mr: [
        "वटवृक्ष हा भारताचा राष्ट्रीय वृक्ष असून तो अमरत्वाचे प्रतीक आहे.",
        "त्याचा विस्तीर्ण पर्णसंभार अगणित जीवांना सावली आणि निवारा देतो.",
        "त्याची वैशिष्ट्यपूर्ण 'पारंब्या' फांद्यांपासून खाली वाढतात आणि झाडाला आधार देतात.",
        "भारतीय संस्कृतीत वटवृक्षाला अनेकदा 'वटवृक्ष' म्हटले जाते.",
        "अनेकांचे असे मानणे आहे की त्याच्या दीर्घ आयुष्यामुळे ते शाश्वत जीवनाचे प्रतिनिधित्व करते.",
        "बुद्धांसारख्या महान ऋषींनी बर्‍याचदा त्याच्या पवित्र सावलीत ध्यान केले.",
        "हे झाड अनेक पक्षी, माकडे आणि खारींचे घर आहे.",
        "या प्राचीन महाकाय वृक्षांचा आदर करणे आपल्याला आपला नैसर्गिक वारसा जपण्यास मदत करते."
      ],
      hi: [
        "बरगद का पेड़ भारत का राष्ट्रीय वृक्ष है और अमरता का प्रतीक है।",
        "इसकी विशाल छत्रछाया अनगिनत जीवों को छाया और आश्रय प्रदान करती है।",
        "इसकी शाखाओं से 'हवाई जड़ें' (aerial roots) नीचे की ओर बढ़ती हैं जो पेड़ को सहारा देती हैं।",
        "भारतीय संस्कृति में, बरगद के पेड़ को अक्सर 'वट वृक्ष' कहा जाता है।",
        "बहुत से लोग मानते हैं कि यह अपनी लंबी उम्र के कारण शाश्वत जीवन का प्रतिनिधित्व करता है।",
        "बुद्ध जैसे महान ऋषियों ने अक्सर इसकी पवित्र छाया में ध्यान लगाया था।",
        "यह पेड़ कई पक्षियों, बंदरों और गिलहरियों का घर है।",
        "इन प्राचीन दिग्गजों का सम्मान करना हमें अपनी प्राकृतिक विरासत को संरक्षित करने में मदद करता है।"
      ]
    },
    vocabulary: {
      "immortality": { simple: "Living forever.", dictionary: "The ability to live forever; eternal life." },
      "expansive": { simple: "Covering a wide area.", dictionary: "Covering a wide area in terms of space or scope; extensive." },
      "aerial": { simple: "Growing or existing in the air.", dictionary: "Existing, happening, or operating in the air." },
      "heritage": { simple: "Things passed down from ancestors.", dictionary: "Property that is or may be inherited; an inheritance." }
    }
  },
  {
    id: 'honeybee-life',
    title: { en: "Life of a Honeybee", hi: "एक मधुमक्खी का जीवन", mr: "मधुमाशीचे जीवन" },
    author: "Lumina Science",
    ageCategory: "7-10",
    difficulty: "medium",
    cover: "🐝",
    color: "#FFD700",
    languages: ["en", "hi", "mr"],
    content: {
      en: [
        "Meet Busy Bee, a hard-working member of the hive!",
        "Her job is to fly from flower to flower and collect nectar.",
        "She uses her long tongue like a straw to drink the sweet liquid.",
        "While she works, yellow pollen sticks to her fuzzy body.",
        "She carries the nectar back to the hive to share with her family.",
        "Inside the hive, bees turn the nectar into delicious honey!",
        "Honeybees are important because they help plants grow new fruits.",
        "Next time you see a bee, say 'Thank you' for the honey!"
      ],
      hi: [
        "मिलिए बिजी बी से, जो छत्ते की एक मेहनती सदस्य है!",
        "उसका काम एक फूल से दूसरे फूल पर उड़ना और अमृत इकट्ठा करना है।",
        "वह मीठे तरल को पीने के लिए अपनी लंबी जीभ का उपयोग स्ट्रॉ की तरह करती है।",
        "जब वह काम करती है, तो पीला पराग उसके रोएँदार शरीर पर चिपक जाता है।",
        "वह अमृत को अपने परिवार के साथ साझा करने के लिए छत्ते में वापस ले जाती है।",
        "छत्ते के अंदर, मधुमक्खियां अमृत को स्वादिष्ट शहद में बदल देती हैं!",
        "मधुमक्खियां महत्वपूर्ण हैं क्योंकि वे पौधों को नए फल उगाने में मदद करती हैं।",
        "अगली बार जब आप मधुमक्खी देखें, तो शहद के लिए उसे 'धन्यवाद' कहें!"
      ],
      mr: [
        "भेटा बिझी बीला, जी पोळ्यातील एक कष्टाळू सदस्य आहे!",
        "तिचे काम एका फुलावरून दुसऱ्या फुलावर उडणे आणि मकरंद गोळा करणे हे आहे.",
        "ती गोड द्रावण पिण्यासाठी तिची लांब जीभ स्ट्रॉसारखी वापरते.",
        "काम करताना पिवळे परागकण तिच्या केसाळ शरीराला चिकटतात.",
        "ती मकरंद आपल्या कुटुंबासोबत शेअर करण्यासाठी पोळ्यात परत नेते.",
        "पोळ्याच्या आत, मधमाश्या मकरंदाचे रूपांतर चविष्ट मधामध्ये करतात!",
        "मधमाश्या महत्त्वाच्या आहेत कारण त्या वनस्पतींना नवीन फळे वाढविण्यास मदत करतात.",
        "पुढच्या वेळी जेव्हा तुम्हाला मधमाशी दिसेल तेव्हा मधासाठी तिला 'धन्यवाद' म्हणा!"
      ]
    },
    vocabulary: {
      "hive": { simple: "A home where bees live together.", dictionary: "A place where bees live and make honey." },
      "nectar": { simple: "Sweet juice from flowers.", dictionary: "A sugary fluid secreted by flowers." },
      "pollen": { simple: "Yellow powder from flowers.", dictionary: "A fine powdery substance produced by plants." }
    }
  },
  {
    id: 'water-cycle',
    title: { en: "The Water Cycle Adventure", hi: "जल चक्र का रोमांच", mr: "जलचक्राचा प्रवास" },
    author: "Lumina Geography",
    ageCategory: "11-15",
    difficulty: "hard",
    cover: "☁️",
    color: "#3B82F6",
    languages: ["en", "hi", "mr"],
    content: {
      en: [
        "Water on Earth is always moving in a giant loop called the Water Cycle.",
        "The Sun heats up water in oceans and lakes, turning it into vapor.",
        "This process is called 'Evaporation', where water climbs into the sky.",
        "High up, the vapor cools down and forms fluffy white clouds.",
        "When clouds get heavy and full, water falls back as rain or snow.",
        "This rain flows into rivers and eventually back into the oceans.",
        "The Water Cycle has been happening for millions of years!",
        "Every drop of water we drink today was once a part of a dinosaur's era."
      ],
      hi: [
        "पृथ्वी पर पानी हमेशा एक विशाल चक्र में घूमता रहता है जिसे जल चक्र कहते हैं।",
        "सूर्य महासागरों और झीलों के पानी को गर्म करता है, जिससे वह वाष्प में बदल जाता है।",
        "इस प्रक्रिया को 'वाष्पीकरण' कहा जाता है, जहाँ पानी आकाश में चढ़ता है।",
        "ऊपर जाकर, वाष्प ठंडी हो जाती है और सफेद बादल बनाती है।",
        "जब बादल भारी और भर जाते हैं, तो पानी बारिश या बर्फ के रूप में वापस गिरता है।",
        "यह बारिश नदियों में बहती है और अंततः वापस महासागरों में चली जाती है।",
        "जल चक्र लाखों वर्षों से चल रहा है!",
        "आज हम जो पानी पीते हैं उसकी हर बूंद कभी डायनासोर के युग का हिस्सा थी।"
      ],
      mr: [
        "पृथ्वीवरील पाणी नेहमी एका अवाढव्य फेऱ्यामध्ये फिरत असते ज्याला जलचक्र म्हणतात.",
        "सूर्य महासागर आणि तलावांमधील पाणी तापवतो, त्याचे वाफेमध्ये रूपांतर करतो.",
        "या प्रक्रियेला 'बाष्पीभवन' म्हणतात, जिथे पाणी आकाशात चढते.",
        "वर गेल्यावर, वाफेचे थंड होऊन पांढरे ढग तयार होतात.",
        "जेव्हा ढग जड आणि पूर्ण भरतात, तेव्हा पाणी पाऊस किंवा बर्फाच्या स्वरूपात खाली पडते.",
        "हा पाऊस नद्यांमध्ये वाहतो आणि कालांतराने पुन्हा महासागरात जातो.",
        "जलचक्र लाखो वर्षांपासून सुरू आहे!",
        "आज आपण पितो असलेल्या पाण्याचा प्रत्येक थेंब एकेकाळी डायनासोरच्या युगाचा भाग होता."
      ]
    },
    vocabulary: {
      "vapor": { simple: "Water in the form of a gas, like steam.", dictionary: "A substance diffused or suspended in the air, especially one normally liquid or solid." },
      "evaporation": { simple: "When liquid turns into gas because of heat.", dictionary: "The process of turning from liquid into vapor." },
      "ocean": { simple: "A very large sea.", dictionary: "A very large expanse of sea, in particular each of the main areas into which the sea is divided geographically." }
    }
  },
  {
    id: 'school-day',
    title: { en: "My First Day at School", hi: "स्कूल का मेरा पहला दिन", mr: "शाळेचा माझा पहिला दिवस" },
    author: "Lumina Kids",
    ageCategory: "3-6",
    difficulty: "easy",
    cover: "🎒",
    color: "#10B981",
    languages: ["en", "hi", "mr"],
    content: {
      en: [
        "Today is a very special day! I am going to school for the first time.",
        "I put on my new uniform and carry my colorful backpack.",
        "At the gate, I say 'Bye-bye' to Mother with a big smile.",
        "My classroom is full of toys, books, and friendly faces.",
        "My teacher, Miss Anjali, says 'Welcome!' with a kind voice.",
        "I make a new friend named Rohan. We play with blocks together.",
        "We sing songs and listen to a wonderful story about a star.",
        "School is so much fun! I can't wait to go back tomorrow."
      ],
      hi: [
        "आज एक बहुत ही खास दिन है! मैं पहली बार स्कूल जा रहा हूँ।",
        "मैंने अपनी नई वर्दी पहनी और अपना रंगीन बैग उठाया।",
        "गेट पर, मैंने माँ को बड़ी मुस्कान के साथ 'बाय-बाय' कहा।",
        "मेरी क्लास खिलौनों, किताबों और प्यारे चेहरों से भरी है।",
        "मेरी टीचर, मिस अंजलि, दयालु आवाज़ में 'स्वागत है!' कहती हैं।",
        "मैंने रोहन नाम का एक नया दोस्त बनाया। हमने साथ में ब्लॉक्स के साथ खेला।",
        "हमने गाने गाए और एक तारे के बारे में एक अद्भुत कहानी सुनी।",
        "स्कूल में बहुत मज़ा आता है! मैं कल वापस जाने का इंतज़ार नहीं कर सकता।"
      ],
      mr: [
        "आज एक खूप खास दिवस आहे! मी पहिल्यांदा शाळेत जात आहे.",
        "मी माझा नवीन गणवेश घातला आणि माझी रंगीत बॅग घेतली.",
        "गेटवर, मी आईला मोठ्या हसत 'बाय-बाय' म्हटले.",
        "माझा वर्ग खेळणी, पुस्तके आणि सुंदर चेहऱ्यांनी भरलेला आहे.",
        "माझ्या शिक्षिका, मिस अंजली, मायाळू आवाजात 'स्वागत आहे!' म्हणतात.",
        "मी रोहन नावाचा एक नवीन मित्र बनवला. आम्ही एकत्र ब्लॉक्ससोबत खेळलो.",
        "आम्ही गाणी गायली आणि एका ताऱ्याबद्दलची अद्भुत गोष्ट ऐकली.",
        "शाळेत खूप मजा येते! मी उद्या परत जाण्याची वाट पाहू शकत नाही."
      ]
    },
    vocabulary: {
      "uniform": { simple: "Special clothes for school.", dictionary: "The matching clothing worn by members of an organization or school." },
      "classroom": { simple: "A room where students learn.", dictionary: "A room in a school or college where groups of students are taught." },
      "friend": { simple: "Someone you like and play with.", dictionary: "A person whom one knows and with whom one has a bond of mutual affection." }
    }
  },
  {
    id: 'little-seed',
    title: { en: "The Strong Little Seed", hi: "नन्हा सा मजबूत बीज", mr: "छोटासा मजबूत बी" },
    author: "Lumina Nature",
    ageCategory: "3-6",
    difficulty: "easy",
    cover: "🌱",
    color: "#059669",
    languages: ["en", "hi", "mr"],
    content: {
      en: [
        "A tiny seed was sleeping deep inside the dark soil.",
        "One day, the Sun said, 'Wake up, little one!'",
        "Then the soft rain pitter-pattered, 'Drink and grow!'",
        "The seed pushed upwards with all its might.",
        "Suddenly, it saw the bright, beautiful world above.",
        "It grew green leaves and a strong, thin stem.",
        "The wind danced with the little plant every day.",
        "Now, the tiny seed has become a beautiful, tall flower!"
      ],
      hi: [
        "एक नन्हा सा बीज गहरी और अंधेरी मिट्टी में सो रहा था।",
        "एक दिन, सूर्य ने कहा, 'जागो, छोटे बच्चे!'",
        "फिर धीमी बारिश ने कहा, 'पीओ और बढ़ो!'",
        "बीज ने अपनी पूरी ताकत के साथ ऊपर की ओर धक्का दिया।",
        "अचानक, उसने ऊपर की चमकीली और सुंदर दुनिया देखी।",
        "उसने हरी पत्तियाँ और एक मजबूत, पतला तना विकसित किया।",
        "हवा हर दिन छोटे पौधे के साथ नृत्य करती थी।",
        "अब, वह नन्हा बीज एक सुंदर और लंबा फूल बन गया है!"
      ],
      mr: [
        "एक छोटासा बी खोल आणि गडद मातीमध्ये झोपला होता.",
        "एका दिवशी सूर्य म्हणाला, 'जागे व्हा, चिमुकल्या!'",
        "मग मंद पाऊस बरसला, 'प्या आणि वाढा!'",
        "त्याने आपल्या पूर्ण ताकदीने वरच्या दिशेला जोर लावला.",
        "अचानक, त्याने वरचे तेजस्वी आणि सुंदर जग पाहिले.",
        "त्याने हिरवी पाने आणि एक मजबूत, पातळ देठ तयार केला.",
        "वारा दररोज छोट्या रोपट्यासोबत नाचायचा.",
        "आता, त्या छोट्या बियाचे एका सुंदर आणि उंच फुलात रूपांतर झाले आहे!"
      ]
    },
    vocabulary: {
      "seed": { simple: "Small part of a plant.", dictionary: "The unit of reproduction of a flowering plant." },
      "soil": { simple: "Dirt where plants grow.", dictionary: "The upper layer of earth in which plants grow." },
      "might": { simple: "Strength or power.", dictionary: "Great and impressive power or strength." }
    }
  },
  {
    id: 'indian-wonders',
    title: { en: "Ancient Indian Wonders", hi: "प्राचीन भारतीय चमत्कार", mr: "प्राचीन भारतीय चमत्कार" },
    author: "Lumina History",
    ageCategory: "11-15",
    difficulty: "hard",
    cover: "🏯",
    color: "#DC2626",
    languages: ["en", "hi", "mr"],
    content: {
      en: [
        "India is home to some of the most magnificent wonders of the ancient world!",
        "The Indus Valley Civilization had advanced cities with planned drainage systems.",
        "Great scholars invented the concept of 'Zero', changing math forever.",
        "The Iron Pillar of Delhi stands rust-free for over 1,600 years!",
        "Ancient universities like Nalanda attracted students from all over the globe.",
        "Ayurveda, the science of life and healing, originated thousands of years ago.",
        "India's rich silk and spice trade connected distant empires.",
        "Preserving our history helps us understand the genius of our ancestors."
      ],
      hi: [
        "भारत प्राचीन दुनिया के कुछ सबसे शानदार चमत्कारों का घर है!",
        "सिंधु घाटी सभ्यता में नियोजित जल निकासी प्रणालियों के साथ उन्नत शहर थे।",
        "महान विद्वानों ने 'शून्य' की अवधारणा का आविष्कार किया, जिसने गणित को हमेशा के लिए बदल दिया।",
        "दिल्ली का लौह स्तंभ 1,600 से अधिक वर्षों से जंग-मुक्त खड़ा है!",
        "नालंदा जैसे प्राचीन विश्वविद्यालयों ने दुनिया भर के छात्रों को आकर्षित किया।",
        "आयुर्वेद, जीवन और उपचार का विज्ञान, हजारों साल पहले उत्पन्न हुआ था।",
        "भारत के समृद्ध रेशम और मसालों के व्यापार ने दूर के साम्राज्यों को जोड़ा।",
        "अपने इतिहास को संरक्षित करना हमें अपने पूर्वजों की प्रतिभा को समझने में मदद करता है।"
      ],
      mr: [
        "भारत हे प्राचीन जगातील काही सर्वात भव्य चमत्कारांचे माहेरघर आहे!",
        "सिंधू संस्कृतीत नियोजित सांडपाणी व्यवस्थेसह प्रगत शहरे होती.",
        "थोर विद्वानांनी 'शून्य' ही संकल्पना शोधून काढली, ज्यामुळे गणितात कायमस्वरूपी बदल झाला.",
        "दिल्लीचा लोहस्तंभ १,६०० वर्षांहून अधिक काळ गंजमुक्त उभा आहे!",
        "नालंदासारख्या प्राचीन विद्यापीठांनी जगभरातील विद्यार्थ्यांना आकर्षित केले.",
        "आयुर्वेद, जीवन आणि उपचारांचे शास्त्र, हजारो वर्षांपूर्वी अस्तित्वात आले.",
        "भारताच्या समृद्ध रेशीम आणि मसाल्यांच्या व्यापाराने दूरच्या साम्राज्यांना जोडले.",
        "आपला इतिहास जतन करणे आपल्याला आपल्या पूर्वजांच्या प्रतिभेला समजून घेण्यास मदत करते."
      ]
    },
    vocabulary: {
      "civilization": { simple: "A complex human society.", dictionary: "The stage of human social development and organization." },
      "ancestors": { simple: "Relatives from long ago.", dictionary: "A person from whom one is descended." },
      "magnificent": { simple: "Beautiful and impressive.", dictionary: "Impressively beautiful, elaborate, or extravagant." }
    }
  },
  {
    id: 'lion-mouse',
    title: { en: "The Lion and the Mouse", hi: "शेर और चूहा", mr: "सिंह आणि उंदीर" },
    author: "Aesop's Fables",
    cover: "🦁",
    difficulty: "easy",
    color: "#F59E0B",
    ageCategory: "3-6",
    languages: ["en", "hi", "mr"],
    content: {
      en: [
        "A lion was sleeping in the forest.",
        "A little mouse started running up and down his back.",
        "This woke up the lion, and he was very angry.",
        "He caught the mouse in his huge paw.",
        "Please don't eat me, cried the mouse.",
        "One day I might be able to help you.",
        "The lion laughed but let the mouse go.",
        "Later, the lion was caught in a hunter's net.",
        "The mouse heard the lion's roar and came running.",
        "He chewed the ropes and set the lion free.",
        "The lion and the mouse became best friends."
      ],
      hi: [
        "एक शेर जंगल में सो रहा था।",
        "एक छोटा चूहा उसकी पीठ पर ऊपर-नीचे दौड़ने लगा।",
        "इससे शेर की नींद खुल गई और वह बहुत गुस्से में था।",
        "उसने चूहे को अपने विशाल पंजे में पकड़ लिया।",
        "कृपया मुझे मत खाओ, चूहा रोया।",
        "एक दिन मैं आपकी मदद कर पाऊँगा।",
        "शेर हँसा लेकिन उसने चूहे को जाने दिया।",
        "बाद में, शेर एक शिकारी के जाल में फंस गया।",
        "चूहे ने शेर की दहाड़ सुनी और दौड़ता हुआ आया।",
        "उसने रस्सियों को चबाया और शेर को आजाद कर दिया।",
        "शेर और चूहा पक्के दोस्त बन गए।"
      ],
      mr: [
        "एके काळी एक सिंह जंगलात झोपला होता.",
        "एक छोटा उंदीर त्याच्या पाठीवर धावू लागला.",
        "यामुळे सिंह जागा झाला आणि त्याला खूप राग आला.",
        "त्याने उंदराला आपल्या मोठ्या पंजात पकडले.",
        "कृपया मला खाऊ नका, उंदीर ओरडला.",
        "एके दिवशी मी तुम्हाला मदत करू शकेन.",
        "सिंह हसले पण त्यांनी उंदराला जाऊ दिले.",
        "नंतर, सिंह एका शिकारीच्या जाळ्यात अडकला.",
        "उंदराने सिंहाची गर्जना ऐकली आणि तो धावत आला.",
        "त्याने दोरी कुरतडली आणि सिंहाला मुक्त केले.",
        "सिंह आणि उंदीर पक्के मित्र बनले."
      ]
    },
    vocabulary: {
      "forest": { simple: "Large area with trees. 🌳", dictionary: "A large area covered chiefly with trees and undergrowth." },
      "roar": { simple: "Deep loud sound. 🦁", dictionary: "A full, deep, prolonged cry uttered by a lion." },
      "chewed": { simple: "Bitten with teeth. 🦷", dictionary: "Bite and work in the mouth with the teeth." }
    }
  },
  {
    id: 'akbar-birbal-wise',
    title: { en: "Akbar and Birbal: The Wise Choice", hi: "अकबर और बीरबल: बुद्धिमान चुनाव", mr: "अकबर आणि बीरबल: शहाणपणाची निवड" },
    author: "Indian Folk Tales",
    cover: "🤴",
    difficulty: "medium",
    color: "#EF4444",
    ageCategory: "7-10",
    languages: ["en", "hi", "mr"],
    content: {
      en: [
        "Emperor Akbar was very fond of Birbal's wit.",
        "One day, Akbar asked a difficult question.",
        "How many crows are there in our kingdom?",
        "Birbal thought for a while and gave a number.",
        "He said there are ninety-five thousand crows.",
        "Akbar asked, what if there are more?",
        "Birbal replied, then they are visiting from nearby kingdoms.",
        "And what if there are less?",
        "Then some crows have gone for a holiday to other towns.",
        "Akbar was very impressed by Birbal's wisdom."
      ],
      hi: [
        "बादशाह अकबर बीरबल की बुद्धिमानी के बहुत शौकीन थे।",
        "एक दिन, अकबर ने एक कठिन प्रश्न पूछा।",
        "हमारे राज्य में कितने कौवे हैं?",
        "बीरबल ने कुछ देर सोचा और एक संख्या बताई।",
        "उन्होंने कहा कि पंचानवे हजार कौवे हैं।",
        "अकबर ने पूछा, क्या होगा अगर वे अधिक हों?",
        "बीरबल ने जवाब दिया, फिर वे पास के राज्यों से आए हैं।",
        "और अगर कम हों तो?",
        "फिर कुछ कौवे दूसरे शहरों में छुट्टी पर गए हैं।",
        "अकबर बीरबल की बुद्धिमानी से बहुत प्रभावित हुए।"
      ],
      mr: [
        "सम्राट अकबर बिरबलच्या बुद्धिमत्तेचे खूप शौकीन होते.",
        "एके दिवशी अकबरने एक कठीण प्रश्न विचारला.",
        "आपल्या राज्यात किती कावळे आहेत?",
        "बिरबलने थोडा वेळ विचार केला आणि एक संख्या सांगितली.",
        "तो म्हणाला की पंच्याण्णव हजार कावळे आहेत.",
        "अकबरने विचारले, जर जास्त असतील तर?",
        "बिरबलने उत्तर दिले, मग ते जवळच्या राज्यांमधून आले आहेत.",
        "आणि जर कमी असतील तर?",
        "मग काही कावळे दुसऱ्या शहरात सुट्टीसाठी गेले आहेत.",
        "अकबर बिरबलच्या बुद्धिमत्तेने खूप प्रभावित झाले।"
      ]
    },
    vocabulary: {
      "emperor": { simple: "A powerful king.", dictionary: "A sovereign ruler of great power and rank." },
      "wit": { simple: "Clever humor.", dictionary: "Natural intelligence and the ability to think quickly." },
      "wisdom": { simple: "Using knowledge well.", dictionary: "The quality of having experience and good judgment." }
    }
  },
  {
    id: 'apj-kalam-story',
    title: { en: "The Missile Man: Dr. APJ Abdul Kalam", hi: "मिसाइल मैन: डॉ. एपीजे अब्दुल कलाम", mr: "मिसाईल मॅन: डॉ. एपीजे अब्दुल कलाम" },
    author: "Inspirational",
    cover: "🚀",
    difficulty: "medium",
    color: "#6366F1",
    ageCategory: "11-15",
    languages: ["en", "hi", "mr"],
    content: {
      en: [
        "Dr. APJ Abdul Kalam was the 11th President of India.",
        "He was born in a small town called Rameswaram.",
        "As a young boy, he sold newspapers to support his family.",
        "He loved science and became a great aerospace scientist.",
        "He led the projects to build India's space rockets and missiles.",
        "He was popularly known as the Missile Man of India.",
        "Kalam believed that youth have the power to change the world.",
        "He dedicated his life to teaching and motivating students.",
        "His life teaches us that hard work can achieve any dream.",
        "Even today, his words inspire millions of children across India."
      ],
      hi: [
        "डॉ. एपीजे अब्दुल कलाम भारत के 11वें राष्ट्रपति थे।",
        "उनका जन्म रामेश्वरम नामक एक छोटे से शहर में हुआ था।",
        "एक छोटे लड़के के रूप में, उन्होंने अपने परिवार का समर्थन करने के लिए अखबार बेचे।",
        "उन्हें विज्ञान से बहुत प्यार था और वे एक महान एयरोस्पेस वैज्ञानिक बने।",
        "उन्होंने भारत के अंतरिक्ष रॉकेट और मिसाइल बनाने की परियोजनाओं का नेतृत्व किया।",
        "उन्हें भारतीय मिसाइल मैन के नाम से जाना जाता था।",
        "कलाम का मानना था कि युवाओं में दुनिया बदलने की शक्ति है।",
        "उन्होंने अपना जीवन छात्रों को सिखाने और प्रेरित करने के लिए समर्पित कर दिया।",
        "उनका जीवन हमें सिखाता है कि कड़ी मेहनत किसी भी सपने को पूरा कर सकती है।"
      ],
      mr: [
        "डॉ. ए.पी.जे. अब्दुल कलाम हे भारताचे ११ वे राष्ट्रपती होते.",
        "त्यांचा जन्म रामेश्वरम नावाच्या एका लहान शहरात झाला.",
        "एक लहान मुलगा असताना, त्यांनी आपल्या कुटुंबाला मदत करण्यासाठी वर्तमानपत्रे विकली.",
        "त्यांना विज्ञानाची आवड होती आणि ते एक महान अंतराळ शास्त्रज्ञ बनले.",
        "त्यांनी भारताचे अंतराळ रॉकेट आणि क्षेपणास्त्रे तयार करण्याच्या प्रकल्पांचे नेतृत्व केले.",
        "त्यांना भारताचे 'मिसाईल मॅन' म्हणून ओळखले जाते.",
        "कलाम यांचा असा विश्वास होता की तरुणांमध्ये जग बदलण्याची शक्ती आहे.",
        "त्यांनी आपले जीवन विद्यार्थ्यांना शिकवण्यासाठी आणि प्रेरित करण्यासाठी समर्पित केले.",
        "त्यांचे जीवन आपल्याला शिकवते की कठोर परिश्रम कोणतेही स्वप्न साध्य करू शकतात।"
      ]
    },
    vocabulary: {
      "president": { simple: "Leader of a country. 🇮🇳", dictionary: "The elected head of a republican state." },
      "aerospace": { simple: "Science of rockets. 🚀", dictionary: "Branch of technology concerned with flight." },
      "motivating": { simple: "Encouraging others. 💪", dictionary: "Provide someone with a reason for doing something." }
    }
  },
  {
    id: 'ai-future',
    title: { en: "AI: The Future of Learning", hi: "एआई: सीखने का भविष्य", mr: "एआय: शिक्षणाचे भविष्य" },
    author: "Technical Insights",
    cover: "🧠",
    difficulty: "medium",
    color: "#10B981",
    ageCategory: "11-15",
    languages: ["en", "hi", "mr"],
    content: {
      en: [
        "Artificial Intelligence or AI is the intelligence shown by machines.",
        "It helps computers to think, learn, and solve problems like humans.",
        "You might see AI in voice assistants like Siri or Alexa.",
        "AI is also used to recommend videos on YouTube and Netflix.",
        "In the future, AI will help doctors catch diseases early.",
        "It can even help in creating self-driving cars.",
        "For students, AI can be a personal tutor that understands your pace.",
        "But it is important to use AI responsibly and wisely.",
        "Learning about AI today will prepare you for the jobs of tomorrow.",
        "The possibilities with AI are truly endless."
      ],
      hi: [
        "आर्टिफिशियल इंटेलिजेंस या एआई मशीनों द्वारा दिखाई गई बुद्धिमत्ता है।",
        "यह कंप्यूटर को मनुष्यों की तरह सोचने, सीखने और समस्याओं को हल करने में मदद करता है।",
        "आप सिरी या एलेक्सा जैसे वॉयस असिस्टेंट में एआई देख सकते हैं।",
        "एआई का उपयोग यूट्यूब और नेटफ्लिक्स पर वीडियो की सिफारिश करने के लिए भी किया जाता है।",
        "भविष्य में, एआई डॉक्टरों को बीमारियों का जल्दी पता लगाने में मदद करेगा।",
        "यह सेल-ड्राइविंग कार बनाने में भी मदद कर सकता है।",
        "छात्रों के लिए, एआई एक व्यक्तिगत ट्यूटर हो सकता है जो आपकी गति को समझता है।",
        "लेकिन एआई का जिम्मेदारी से और बुद्धिमानी से उपयोग करना महत्वपूर्ण है।"
      ],
      mr: [
        "आर्टिफिशियल इंटेलिजन्स किंवा एआय ही मशिनद्वारे दर्शविली जाणारी बुद्धिमत्ता आहे.",
        "हे संगणकांना मानवाप्रमाणे विचार करण्यास, शिकण्यास आणि समस्या सोडवण्यास मदत करते.",
        "तुम्ही सिरी किंवा अलेक्सा सारख्या व्हॉइस असिस्टंटमध्ये एआय पाहू शकता.",
        "यूट्यूब आणि नेटफ्लिक्सवर व्हिडिओंची शिफारस करण्यासाठी देखील एआयचा वापर केला जातो.",
        "भविष्यात, एआय डॉक्टरांना आजार लवकर ओळखण्यास मदत करेल.",
        "ते ड्रायव्हरलेस कार बनवण्यातही मदत करू शकते.",
        "विद्यार्थ्यांसाठी, एआई एक वैयक्तिक शिक्षक असू शकतो जो तुमची गती समजतो.",
        "परंतु एआय जबाबदारीने आणि शहाणपणाने वापरणे महत्त्वाचे आहे."
      ]
    },
    vocabulary: {
      "intelligence": { simple: "Ability to learn and think.", dictionary: "The ability to acquire and apply knowledge and skills." },
      "responsible": { simple: "Doing the right thing.", dictionary: "Having an obligation to do something." },
      "tutor": { simple: "A private teacher.", dictionary: "A private teacher, typically one who teaches a single student." }
    }
  }
];
