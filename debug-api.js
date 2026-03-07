import fetch from 'node-fetch';

const run = async () => {
    try {
        const response = await fetch('https://ai-fortune-teller-umber.vercel.app/api/fortune', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userInfo: { name: "Test", year: "1990", month: "1", day: "1", bloodType: "A", zodiacSign: "Aries", eto: "Rat" },
                targetDate: "2026-01-01"
            })
        });

        if (!response.ok) {
            const text = await response.text();
            console.log('Error Status:', response.status);
            console.log('Error Body:', text);
        } else {
            const data = await response.json();
            console.log('Success:', data);
        }
    } catch (e) {
        console.error('Fetch Error:', e);
    }
};

run();
