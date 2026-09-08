const Groq = require('groq-sdk');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

async function testGroq() {
    console.log('Testing Groq SDK directly...');
    console.log('API Key:', process.env.GROQ_API_KEY ? 'Present' : 'Missing');
    
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: 'Say hello!' }],
            model: 'llama-3.3-70b-versatile',
        });
        console.log('Success!');
        console.log('Groq result:', chatCompletion.choices[0].message.content);
    } catch (error) {
        console.error('Groq test failed:');
        console.error(error.message);
    }
}

testGroq();
