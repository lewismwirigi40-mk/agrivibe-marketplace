// ============================================
// AGRIVIBE AI ASSISTANT - COMPLETE KNOWLEDGE BASE
// ============================================

const { Op } = require('sequelize');
const UnansweredQuestion = require('../models/UnansweredQuestion.cjs');

// Static Knowledge Base (fallback)
const knowledgeBase = {
    // Greetings
    'hello': '🌾 Hello! Welcome to AgriVibe AI Assistant. How can I help you today?',
    'hi': '👋 Hi there! Welcome to AgriVibe. What would you like to know about?',
    'help': 'I can help you with:\n• Orders and deliveries\n• Payments and refunds\n• Produce information\n• About AgriVibe\n• Becoming a vendor\n• FAQ\nJust ask!',
    'how are you': 'I\'m doing great, thank you for asking! How can I assist you today? 😊',
    'who are you': 'I\'m AgriVibe AI, your virtual assistant. I\'m here to help you with anything related to AgriVibe Marketplace!',

    // About
    'about': '🌾 AgriVibe is Africa\'s largest campus-based agricultural marketplace connecting farmers, vendors, and customers. Our mission is to promote healthy eating and support local farmers.',
    
    // Orders
    'order status': '📦 To check your order status:\n1. Go to "My Orders" in your dashboard\n2. Click on the specific order\n3. You\'ll see the current status\n\nYou\'ll also receive email and SMS updates!',
    'track order': '📍 You can track your order in the "My Orders" section. You\'ll receive real-time updates on delivery status.',
    'cancel order': '❌ You can cancel an order within 30 minutes of placing it. Go to "My Orders" → Select Order → Cancel.',
    'refund': '💰 Refunds are processed within 3-5 business days. Contact support for assistance.',
    'return': '🔄 Items can be returned within 7 days of delivery. Product must be unused and in original packaging.',

    // Delivery
    'delivery fee': '🚚 Delivery fees vary by location. Orders above KES 1,000 get FREE delivery. Standard delivery: KES 50-200.',
    'delivery code': '🔑 You\'ll receive a 6-digit delivery code via SMS/Email after placing an order. Give this code to your driver only when you receive your items.',
    'free delivery': '✅ Orders above KES 1,000 qualify for FREE delivery!',

    // Payment
    'payment methods': '💳 We accept:\n1. M-Pesa\n2. Credit/Debit Cards\n3. Wallet Balance\n\nAll payments are secure and encrypted.',
    'mpesa': '📱 To pay with M-Pesa:\n1. Select M-Pesa at checkout\n2. Enter your phone number\n3. Receive prompt on your phone\n4. Enter your PIN\n5. Payment confirmed instantly!',
    'wallet': '👛 You can add funds to your AgriVibe Wallet and use them for faster checkout.',

    // Fruits
    'mango': '🥭 MANGOES (Embe)\n\nBenefits:\n• High in vitamin C and A\n• Rich in antioxidants\n• Supports immune system\n• Promotes eye health\n• Good for digestion\n\nUses: Fresh, juiced, in smoothies, or in desserts.\n\nStorage: Ripen at room temperature, refrigerate for 3-5 days.',
    'banana': '🍌 BANANAS (Ndizi)\n\nBenefits:\n• Rich in potassium and vitamin B6\n• Good source of energy\n• Supports heart health\n• Aids digestion\n• Helps with muscle recovery',
    'avocado': '🥑 AVOCADOS (Parachichi)\n\nBenefits:\n• Rich in healthy fats\n• High in fiber\n• Supports heart health\n• Good for skin and hair\n• Contains vitamins E and K',
    'orange': '🍊 ORANGES (Chungwa)\n\nBenefits:\n• Rich in vitamin C\n• Supports immune system\n• Good for heart health\n• Promotes skin health\n• High in antioxidants',
    'pineapple': '🍍 PINEAPPLES (Nanasi)\n\nBenefits:\n• Rich in vitamin C and manganese\n• Contains bromelain (digestive enzyme)\n• Supports immune system\n• Anti-inflammatory properties',
    'watermelon': '🍉 WATERMELON (Tikiti Maji)\n\nBenefits:\n• High in water content (hydrating)\n• Rich in lycopene\n• Good for heart health\n• Supports immune system\n• Low in calories',
    'lemon': '🍋 LEMONS (Ndimu)\n\nBenefits:\n• Excellent source of vitamin C\n• Supports immune system\n• Aids digestion\n• Good for skin health\n• Alkalizes the body',
    'lime': '🍋 LIMES (Dimu)\n\nBenefits:\n• Rich in vitamin C\n• Supports immune system\n• Aids digestion\n• Good for skin health\n• Antioxidant properties',
    'passion_fruit': '🟡 PASSION FRUIT (Pasheni)\n\nBenefits:\n• Rich in vitamins A and C\n• High in fiber\n• Supports immune system\n• Good for digestion\n• Contains antioxidants',
    'papaya': '🥰 PAPAYA (Papai)\n\nBenefits:\n• Rich in vitamin C and A\n• Contains papain (digestive enzyme)\n• Supports digestion\n• Promotes skin health\n• Anti-inflammatory properties',
    'grape': '🍇 GRAPES (Zabibu)\n\nBenefits:\n• Rich in antioxidants\n• Supports heart health\n• Good for brain health\n• Contains vitamin C\n• Anti-inflammatory properties',
    'guava': '🟢 GUAVA (Mapera)\n\nBenefits:\n• Extremely high in vitamin C\n• Rich in fiber\n• Supports immune system\n• Good for digestion\n• Contains antioxidants',
    'peach': '🍑 PEACHES (Pichi)\n\nBenefits:\n• Rich in vitamins A and C\n• High in fiber\n• Supports heart health\n• Good for skin health\n• Contains antioxidants',
    'pear': '🍐 PEARS (Pea)\n\nBenefits:\n• Rich in fiber\n• Contains vitamin C and K\n• Supports heart health\n• Good for digestion\n• Low in calories',
    'plum': '🍑 PLUMS (Plamu)\n\nBenefits:\n• Rich in vitamins C and K\n• High in fiber\n• Supports digestion\n• Contains antioxidants\n• Good for bone health',
    'strawberry': '🍓 STRAWBERRIES (Stroberi)\n\nBenefits:\n• Rich in vitamin C\n• High in antioxidants\n• Supports heart health\n• Good for skin health\n• Anti-inflammatory properties',
    'blueberry': '🫐 BLUEBERRIES\n\nBenefits:\n• Rich in antioxidants\n• Supports brain health\n• Good for heart health\n• Anti-inflammatory properties\n• Contains vitamin C',
    'date': '🌴 DATES (Tende)\n\nBenefits:\n• Rich in fiber and potassium\n• Good source of energy\n• Supports digestion\n• High in antioxidants\n• Contains iron and calcium',
    'coconut': '🥥 COCONUT (Nazi)\n\nBenefits:\n• Rich in healthy fats\n• Good for heart health\n• Supports immune system\n• Contains fiber\n• Good for skin and hair',
    'jackfruit': '🍈 JACKFRUIT (Fenesi)\n\nBenefits:\n• Rich in vitamins A and C\n• High in fiber\n• Supports immune system\n• Good for digestion\n• Contains antioxidants',
    'tamarind': '🟤 TAMARIND (Ukwaju)\n\nBenefits:\n• Rich in vitamin C\n• Supports digestion\n• Anti-inflammatory properties\n• Contains antioxidants\n• Good for heart health',
    'dragon_fruit': '🐉 DRAGON FRUIT (Tunda la Joka)\n\nBenefits:\n• Rich in vitamin C\n• High in antioxidants\n• Supports immune system\n• Good for digestion\n• Low in calories',
    'kiwi': '🥝 KIWI\n\nBenefits:\n• Extremely high in vitamin C\n• Rich in fiber\n• Supports immune system\n• Good for digestion\n• Contains antioxidants',
    'pomegranate': '🍎 POMEGRANATE (Komamanga)\n\nBenefits:\n• Rich in antioxidants\n• Supports heart health\n• Anti-inflammatory properties\n• Good for digestion\n• Contains vitamin C',
    'mulberry': '🫐 MULBERRIES (Mforo)\n\nBenefits:\n• Rich in vitamins C and K\n• High in antioxidants\n• Supports immune system\n• Good for heart health\n• Contains fiber',

    // Vegetables
    'tomato': '🍅 TOMATOES (Nyanya)\n\nBenefits:\n• Rich in lycopene (powerful antioxidant)\n• High in vitamin C and potassium\n• Supports heart health\n• Promotes skin health\n• May reduce cancer risk\n\nUses: Fresh in salads, cooked in sauces, or made into juice.\n\nStorage: Keep at room temperature for 3-5 days.',
    'onion': '🧅 ONIONS (Kitunguu)\n\nBenefits:\n• Rich in antioxidants\n• Contains prebiotics for gut health\n• Supports heart health\n• Anti-inflammatory properties\n• Boosts immune system\n\nUses: Base for cooking, fresh in salads, or caramelized.\n\nStorage: Store in cool, dry place for 1-2 months.',
    'cabbage': '🥬 CABBAGE (Sukuma)\n\nBenefits:\n• High in vitamin C and K\n• Contains cancer-fighting compounds\n• Good for digestion\n• Supports heart health\n• Low in calories\n\nUses: Coleslaw, stir-fry, soups, or fermented.\n\nStorage: Store in refrigerator for 1-2 weeks.',
    'carrot': '🥕 CARROTS (Karoti)\n\nBenefits:\n• Excellent source of beta-carotene (vitamin A)\n• Promotes eye health\n• Supports immune system\n• Good for skin health\n• High in fiber for digestion\n\nUses: Fresh, juiced, cooked, or in salads.\n\nStorage: Refrigerate for 2-3 weeks.',
    'spinach': '🌿 SPINACH (Mboga ya Kijani)\n\nBenefits:\n• Excellent source of iron and folate\n• Rich in vitamins A, C, and K\n• Supports bone health\n• Boosts immune system\n• Promotes healthy skin and hair\n\nUses: Fresh in salads, cooked as a side dish, or blended in smoothies.\n\nStorage: Refrigerate for 3-5 days.',
    'kale': '🥬 KALE (Sukuma Wiki)\n\nBenefits:\n• Rich in vitamins A, C, and K\n• High in calcium and iron\n• Contains antioxidants that fight inflammation\n• Supports heart health\n• Helps with digestion\n\nUses: Can be sautéed, added to soups, or made into smoothies.\n\nStorage: Store in refrigerator for up to 5 days.',
    'lettuce': '🥬 LETTUCE (Saladi)\n\nBenefits:\n• Low in calories\n• Contains vitamins A and K\n• Good for hydration\n• Supports digestion\n• Contains antioxidants\n\nUses: Fresh in salads or sandwiches.\n\nStorage: Refrigerate for 3-5 days.',
    'broccoli': '🥦 BROCCOLI (Brokoli)\n\nBenefits:\n• Rich in vitamins C and K\n• High in fiber\n• Contains cancer-fighting compounds\n• Supports immune system\n• Good for bone health\n\nUses: Steamed, roasted, or in stir-fries.\n\nStorage: Refrigerate for 3-5 days.',
    'cauliflower': '🥦 CAULIFLOWER (Koliflawa)\n\nBenefits:\n• Rich in vitamins C and K\n• High in fiber\n• Contains antioxidants\n• Supports digestion\n• Low in calories\n\nUses: Steamed, roasted, or in stir-fries.',
    'eggplant': '🍆 EGGPLANT (Biringani)\n\nBenefits:\n• Rich in fiber\n• Contains antioxidants\n• Supports heart health\n• Good for digestion\n• Low in calories\n\nUses: Grilled, roasted, or in stews.',
    'okra': '🫑 OKRA (Bamia)\n\nBenefits:\n• Rich in fiber\n• High in vitamins C and K\n• Supports digestion\n• Good for blood sugar control\n• Contains antioxidants\n\nUses: In stews, soups, or fried.',
    'pumpkin': '🎃 PUMPKIN (Maboga)\n\nBenefits:\n• Rich in vitamin A\n• High in fiber\n• Supports eye health\n• Good for immune system\n• Contains antioxidants\n\nUses: Cooked in stews, roasted, or in soups.',
    'cucumber': '🥒 CUCUMBERS (Tango)\n\nBenefits:\n• High in water content\n• Low in calories\n• Supports hydration\n• Good for skin health\n• Contains vitamin K\n\nUses: Fresh in salads, sandwiches, or as a snack.',
    'green_beans': '🫛 GREEN BEANS (Maharagwe ya kijani)\n\nBenefits:\n• Rich in fiber\n• Contains vitamins C and K\n• Supports heart health\n• Good for digestion\n• Low in calories\n\nUses: Steamed, stir-fried, or in salads.',
    'bell_pepper': '🫑 BELL PEPPERS (Pilipili hoho)\n\nBenefits:\n• Rich in vitamins A and C\n• High in antioxidants\n• Supports immune system\n• Good for eye health\n• Contains fiber\n\nUses: Fresh in salads, stir-fries, or roasted.',
    'chilli': '🌶️ CHILLIES (Pilipili)\n\nBenefits:\n• Rich in vitamin C\n• Contains capsaicin (pain relief)\n• Boosts metabolism\n• Supports digestion\n• Anti-inflammatory properties\n\nUses: In cooking, as a spice, or in sauces.',
    'garlic': '🧄 GARLIC (Kitunguu Saumu)\n\nBenefits:\n• Natural antibiotic properties\n• Boosts immune system\n• Supports heart health\n• Reduces blood pressure\n• Contains cancer-fighting compounds\n\nUses: Flavoring in cooking, raw in dressings, or roasted.\n\nStorage: Keep in cool, dark place for several weeks.',
    'ginger': '🫚 GINGER (Tangawizi)\n\nBenefits:\n• Relieves nausea and motion sickness\n• Anti-inflammatory properties\n• Supports digestion\n• Boosts immune system\n• May help with pain relief\n\nUses: Tea, cooking, smoothies, or grated fresh.\n\nStorage: Refrigerate for up to 3 weeks or freeze.',
    'celery': '🌿 CELERY (Figili)\n\nBenefits:\n• Low in calories\n• Contains vitamins A and K\n• Supports digestion\n• Good for hydration\n• Contains antioxidants\n\nUses: Fresh in salads, soups, or as a snack.',
    'beetroot': '🟣 BEETROOT (Beti)\n\nBenefits:\n• Rich in antioxidants\n• Contains iron and folate\n• Supports heart health\n• Good for blood pressure\n• Supports digestion\n\nUses: Roasted, juiced, or in salads.',
    'radish': '🔴 RADISH (Figiri)\n\nBenefits:\n• Rich in vitamin C\n• Supports digestion\n• Contains antioxidants\n• Low in calories\n• Good for skin health\n\nUses: Fresh in salads or as a garnish.',
    'zucchini': '🥒 ZUCCHINI (Kibwela)\n\nBenefits:\n• Low in calories\n• Contains vitamins A and C\n• Supports digestion\n• Good for hydration\n• Contains fiber\n\nUses: Grilled, roasted, or in stir-fries.',
    'leek': '🌿 LEEKS (Vitunguu vya kijani)\n\nBenefits:\n• Rich in vitamins A and K\n• Contains antioxidants\n• Supports heart health\n• Good for digestion\n• Contains fiber\n\nUses: In soups, stews, or stir-fries.',
    'spring_onions': '🌿 SPRING ONIONS (Vitunguu vya kijani)\n\nBenefits:\n• Rich in vitamins A and C\n• Contains antioxidants\n• Supports immune system\n• Good for digestion\n• Contains fiber\n\nUses: Fresh in salads, as a garnish, or in cooking.',

    // Vendor
    'become a vendor': '🤝 To become a vendor:\n1. Click "Become a Vendor"\n2. Fill in your details\n3. Submit for review\n4. Wait for admin approval\n\nOnce approved, you can start selling!',
    'vendor commission': '💰 The commission rate is 10% per sale. This covers platform fees, payment processing, and marketing.',
    
    // FAQ
    'faq': '❓ Common questions:\n• How do I place an order?\n• What payment methods do you accept?\n• How does delivery work?\n• How do I become a vendor?\n\nVisit our FAQ page for more!',
    
    // Contact
    'contact': '📞 You can reach us at:\n• Email: support@agrivibe.com\n• Phone: +254 700 000 000\n• WhatsApp: +254 700 000 000\n\nHours: Monday-Friday, 8 AM - 8 PM',
};

// Closing responses
const closingResponses = {
    'ok': '✅ Great! I\'m glad I could help. Feel free to come back if you have more questions. Have a wonderful day! 🌾',
    'thanks': 'You\'re welcome! 😊 Come back anytime. Happy shopping at AgriVibe! 🛒',
    'thank you': 'You\'re welcome! 😊 Come back anytime. Happy shopping at AgriVibe! 🛒',
    'bye': '👋 Goodbye! We\'re always here when you need us. Have a great day!',
    'goodbye': '👋 Goodbye! We\'re always here when you need us. Have a great day!',
    'that\'s all': 'Perfect! ✅ Come back anytime if you need more help. Enjoy your day!',
    'that is all': 'Perfect! ✅ Come back anytime if you need more help. Enjoy your day!',
    'done': '✅ Great! Feel free to come back if you have more questions. Have a wonderful day! 🌾',
    'all good': 'Awesome! ✅ I\'m glad I could help. Come back anytime!',
    'okay': '✅ Great! I\'m glad I could help. Feel free to come back if you have more questions. Have a wonderful day! 🌾',
};

// ============================================
// DYNAMIC MATCHING ENGINE
// ============================================

async function findAnswer(message) {
    const lowerMsg = message.toLowerCase().trim();
    
    // 1. Check closing responses first
    for (const [key, response] of Object.entries(closingResponses)) {
        if (lowerMsg.includes(key) || key.includes(lowerMsg)) {
            return response;
        }
    }
    
    // 2. Check database for answered questions (DYNAMIC!)
    try {
        const answered = await UnansweredQuestion.findOne({
            where: {
                question: { [Op.iLike]: `%${lowerMsg}%` },
                status: 'answered'
            },
            order: [['answered_at', 'DESC']]
        });
        if (answered) {
            return answered.answer;
        }
    } catch (error) {
        console.error('Database query error:', error);
    }
    
    // 3. Check static knowledge base
    for (const [key, response] of Object.entries(knowledgeBase)) {
        if (lowerMsg.includes(key) || key.includes(lowerMsg)) {
            return response;
        }
    }
    
    // 4. No match found
return "🤖 I'm still learning! I don't have an answer for that yet. I've noted your question and my team will review it. In the meantime, I can help with:\n• Orders and deliveries\n• Payments and refunds\n• Produce information\n• About AgriVibe\n• Becoming a vendor\n\nTry asking differently or check our FAQ section! 🌾";
}

// ============================================
// CONTROLLER FUNCTIONS
// ============================================

// Chat endpoint
exports.chat = async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }
        
        const response = await findAnswer(message);
        
        res.json({
            message: response,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'Failed to process message' });
    }
};

// Get suggestions
exports.getSuggestions = async (req, res) => {
    try {
        const suggestions = [
            'Tell me about fresh vegetables',
            'What are the benefits of fruits?',
            'How do I check my order status?',
            'How can I become a vendor?',
            'What payment methods do you accept?',
            'What is your return policy?',
            'Tell me about honey benefits',
            'How long does delivery take?',
            'Contact AgriVibe support'
        ];
        
        res.json({ suggestions });
    } catch (error) {
        console.error('Get suggestions error:', error);
        res.status(500).json({ error: 'Failed to get suggestions' });
    }
};

// Get produce categories
exports.getProduceCategories = async (req, res) => {
    try {
        const categories = {
            fruits: ['Apples', 'Bananas', 'Mangoes', 'Oranges', 'Pineapples', 'Avocados', 'Watermelons', 'Lemons', 'Limes', 'Passion Fruits', 'Papaya', 'Grapes', 'Guavas', 'Peaches', 'Pears', 'Plums', 'Strawberries', 'Blueberries', 'Dates', 'Coconut', 'Jackfruit', 'Tamarind', 'Dragon Fruit', 'Kiwi', 'Pomegranate', 'Mulberries'],
            vegetables: ['Tomatoes', 'Onions', 'Cabbage', 'Carrots', 'Spinach', 'Kale', 'Lettuce', 'Broccoli', 'Cauliflower', 'Eggplant', 'Okra', 'Pumpkin', 'Cucumbers', 'Green Beans', 'Bell Peppers', 'Chillies', 'Garlic', 'Ginger', 'Celery', 'Beetroot', 'Radish', 'Zucchini', 'Leeks', 'Spring Onions'],
            cereals: ['Maize', 'Wheat', 'Rice', 'Sorghum', 'Millet'],
            legumes: ['Beans', 'Green Grams', 'Cowpeas', 'Chickpeas', 'Lentils', 'Soybeans', 'Garden Peas'],
            nuts: ['Groundnuts', 'Cashews', 'Almonds', 'Macadamia'],
            livestock: ['Milk', 'Eggs', 'Chicken', 'Fish', 'Tilapia'],
            herbs: ['Coriander', 'Rosemary'],
            bee_products: ['Honey', 'Beeswax'],
            seeds: ['Pumpkin Seeds', 'Sesame'],
            mushrooms: ['Mushrooms']
        };
        
        res.json({ categories });
    } catch (error) {
        console.error('Get produce categories error:', error);
        res.status(500).json({ error: 'Failed to get produce categories' });
    }
};

// ============================================
// UNANSWERED QUESTIONS CRUD
// ============================================

// Save unanswered question
exports.saveUnansweredQuestion = async (req, res) => {
    try {
        const { question } = req.body;
        
        if (!question) {
            return res.status(400).json({ error: 'Question is required' });
        }

        // Check if question already exists
        const existing = await UnansweredQuestion.findOne({
            where: { 
                question: question,
                status: ['pending', 'answered']
            }
        });

        if (existing) {
            return res.json({
                success: true,
                message: 'Question already exists',
                question: existing
            });
        }

        const record = await UnansweredQuestion.create({
            question,
            asked_by: req.user?.id || null,
            status: 'pending'
        });

        console.log(`📝 Unanswered question saved: ${question}`);

        res.json({
            success: true,
            message: 'Question saved for admin review',
            question: record
        });
        
    } catch (error) {
        console.error('Save unanswered question error:', error);
        res.status(500).json({ error: 'Failed to save question' });
    }
};

// Get all unanswered questions (Admin only)
exports.getUnansweredQuestions = async (req, res) => {
    try {
        const questions = await UnansweredQuestion.findAll({
            order: [['asked_at', 'DESC']]
        });
        
        res.json({ questions });
    } catch (error) {
        console.error('Get unanswered questions error:', error);
        res.status(500).json({ error: 'Failed to fetch questions' });
    }
};

// Answer a question (Admin only)
exports.answerQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const { answer } = req.body;
        
        if (!answer) {
            return res.status(400).json({ error: 'Answer is required' });
        }

        const question = await UnansweredQuestion.findByPk(id);
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }

        question.answer = answer;
        question.status = 'answered';
        question.answered_by = req.user.id;
        question.answered_at = new Date();
        await question.save();

        res.json({
            success: true,
            message: 'Question answered successfully',
            question
        });
        
    } catch (error) {
        console.error('Answer question error:', error);
        res.status(500).json({ error: 'Failed to answer question' });
    }
};