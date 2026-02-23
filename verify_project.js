const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
let token = '';
let userId = '';
let foodId = '';

const runVerification = async () => {
    try {
        console.log('--- STARTING VERIFICATION ---');

        // 1. REGISTER
        console.log('\n1. Testing Registration...');
        const randomUser = `user_${Date.now()}`;
        try {
            const regRes = await axios.post(`${API_URL}/auth/register`, {
                username: randomUser,
                email: `${randomUser}@example.com`,
                password: 'password123'
            });
            console.log('✅ Registered:', regRes.data.username);
            token = regRes.data.token;
            userId = regRes.data._id;
        } catch (e) {
            console.log('Registration skipped or failed (User might exist), trying login...');
        }

        // 2. LOGIN
        if (!token) {
            console.log('\n2. Testing Login...');
            const loginRes = await axios.post(`${API_URL}/auth/login`, {
                email: `${randomUser}@example.com`,
                password: 'password123'
            });
            console.log('✅ Logged in. Token received.');
            token = loginRes.data.token;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };

        // 3. CREATE CUSTOM FOOD
        console.log('\n3. Testing Create Food...');
        const foodRes = await axios.post(`${API_URL}/foods`, {
            name: 'Test Burger',
            calories: 500,
            protein: 20,
            carbs: 40,
            fat: 25,
            servingSize: { amount: 1, unit: 'burger' }
        }, config);
        console.log('✅ Food Created:', foodRes.data.name);
        foodId = foodRes.data._id;

        // 4. ADD DAILY LOG
        console.log('\n4. Testing Add Log Entry...');
        const logRes = await axios.post(`${API_URL}/logs`, {
            date: new Date().toISOString().split('T')[0],
            foodId: foodId,
            quantity: 1,
            mealType: 'lunch'
        }, config);
        console.log('✅ Log Entry Added. Total Calories:', logRes.data.totals.calories);

        // 5. TEST STATS
        console.log('\n5. Testing Weekly Stats...');
        const statsRes = await axios.get(`${API_URL}/stats/weekly`, config);
        console.log('✅ Weekly Stats Retrieved. Count:', statsRes.data.length);

        console.log('\n--- VERIFICATION COMPLETE: SUCCESS ---');

    } catch (error) {
        console.error('❌ Verification Failed:', error.response ? error.response.data : error.message);
    }
};

runVerification();
