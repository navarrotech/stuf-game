// Copyright © 2023 Navarrotech

const awokenAt = Date.now();
let lastEventReceived = Date.now();

// Restart every 24 hours
const alive_time = 1000 * 60 * 60 * 24;
const hours_4_ago = 1000 * 60 * 60 * 4;

export function updateLastEventReceived(){
    lastEventReceived = Date.now();
}

// Once per minute...
setInterval(() => {
    const isPast24Hours = Date.now() - awokenAt > alive_time;
    const isLastEventReceived4HoursAgo = Date.now() - lastEventReceived > hours_4_ago;
    if (isPast24Hours && isLastEventReceived4HoursAgo) {
        console.log("Restarting for health...");
        process.exit(0);
    }
}, 1000 * 60);