import fetch from 'node-fetch';

const run = async () => {
    const url = 'https://ai-fortune-teller-umber.vercel.app/api/fortune';
    const payload = {
        userInfo: { name: "TestUser", year: "1990", month: "1", day: "1", bloodType: "A", zodiacSign: "Aries", eto: "Rat" },
        targetDate: "2026-01-01"
    };

    console.log("Request 1...");
    const r1 = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const d1 = await r1.json();

    console.log("Request 2...");
    const r2 = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const d2 = await r2.json();

    console.log("--- Result 1 ---");
    console.log(JSON.stringify(d1, null, 2));
    console.log("--- Result 2 ---");
    console.log(JSON.stringify(d2, null, 2));

    if (JSON.stringify(d1) === JSON.stringify(d2)) {
        console.log("\n✅ SUCCESS: Responses are IDENTICAL.");
    } else {
        console.log("\n⚠️ WARNING: Responses are DIFFERENT.");
        // Check if they are at least similar?
    }
};

run();
