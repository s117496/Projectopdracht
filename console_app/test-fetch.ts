import { fetch } from 'undici';

async function testFetch() {
    const url = "https://raw.githubusercontent.com/s117496/Projectopdracht/main/jamaican_dishes.json";
    console.log(`Fetching from ${url}...`);
    
    try {
        const response = await fetch(url);
        console.log(`Status: ${response.status}`);
        
        const text = await response.text();
        console.log("Response body:", text);
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

testFetch();
