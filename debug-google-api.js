import fetch from 'node-fetch';

const run = async () => {
    const key = "AIzaSyD783cbqsGPwfPjrdaULNs8l1xwyQdqi_Y";
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();
        if (data.models && data.models.length > 0) {
            // Find first gemini model
            const m = data.models.find(x => x.name.includes("gemini"));
            console.log("SELECTED_MODEL: " + (m ? m.name : data.models[0].name));
        } else {
            console.log("No models found.");
        }
    } catch (e) {
        console.error("Error:", e);
    }
};

run();
