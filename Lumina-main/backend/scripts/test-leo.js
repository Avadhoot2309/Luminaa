const axios = require('axios');

async function testLeo() {
    console.log('Testing Leo Backend Connection...');
    try {
        const response = await axios.post('http://localhost:5001/api/leo-assist', {
            user_input: 'Hello Leo, how are you?',
            student_profile: { name: 'Test Student' },
            behavior_state: { is_idle: false }
        });
        console.log('Response Status:', response.status);
        console.log('Leo Response:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('Error connecting to Leo:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error(error.message);
        }
    }
}

testLeo();
