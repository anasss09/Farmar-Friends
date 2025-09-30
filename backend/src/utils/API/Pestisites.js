function recommendPesticide(crop, temp, humidity) {
    let pests = [];
    
    // Input validation
    if (typeof crop !== 'string' || typeof temp !== 'number' || typeof humidity !== 'number') {
        return [{ name: "Invalid input parameters", threat_level: "Low", probability: 0.1 }];
    }
    
    const c = crop.toLowerCase();

    // 🌿 Cotton
    if (c === "cotton") {
        if (temp >= 20 && temp <= 28 && humidity > 60) {
            pests.push({ name: "Bollworm", threat_level: "High", probability: 0.8 });
        }
        if (temp > 30 && humidity < 50) {
            pests.push({ name: "Whitefly", threat_level: "Medium", probability: 0.55 });
        }
        if (temp >= 25 && humidity > 65) {
            pests.push({ name: "Aphids", threat_level: "Medium", probability: 0.6 });
        }
    }

    // 🌾 Rice
    if (c === "rice") {
        if (temp >= 25 && humidity > 70) {
            pests.push({ name: "Stem Borer", threat_level: "High", probability: 0.75 });
        }
        if (temp >= 28 && humidity > 80) {
            pests.push({ name: "Brown Plant Hopper", threat_level: "High", probability: 0.7 });
        }
    }

    // 🌽 Maize
    if (c === "maize") {
        if (temp >= 22 && temp <= 30 && humidity > 60) {
            pests.push({ name: "Fall Armyworm", threat_level: "High", probability: 0.78 });
        }
        if (temp > 30 && humidity < 50) {
            pests.push({ name: "Stem Borer", threat_level: "Medium", probability: 0.55 });
        }
    }

    // 🌾 Wheat
    if (c === "wheat") {
        if (temp >= 15 && temp <= 22 && humidity > 65) {
            pests.push({ name: "Aphids", threat_level: "Medium", probability: 0.6 });
        }
        if (temp > 25 && humidity < 50) {
            pests.push({ name: "Armyworm", threat_level: "High", probability: 0.7 });
        }
    }

    // 🍬 Sugarcane
    if (c === "sugarcane") {
        if (temp >= 25 && humidity > 70) {
            pests.push({ name: "Early Shoot Borer", threat_level: "High", probability: 0.8 });
        }
        if (temp > 30 && humidity > 75) {
            pests.push({ name: "Pyrilla", threat_level: "Medium", probability: 0.65 });
        }
    }

    // 🍅 Tomato
    if (c === "tomato") {
        if (temp >= 20 && temp <= 28 && humidity > 60) {
            pests.push({ name: "Fruit Borer", threat_level: "High", probability: 0.75 });
        }
        if (temp > 28 && humidity < 50) {
            pests.push({ name: "Whitefly", threat_level: "Medium", probability: 0.6 });
        }
    }

    // 🥔 Potato
    if (c === "potato") {
        if (temp >= 18 && temp <= 25 && humidity > 70) {
            pests.push({ name: "Potato Tuber Moth", threat_level: "High", probability: 0.77 });
        }
        if (temp < 15 && humidity > 80) {
            pests.push({ name: "Late Blight (fungus)", threat_level: "High", probability: 0.85 });
        }
    }

    // 🌱 Pulses
    if (["chickpea", "gram", "chana"].includes(c)) {
        if (temp >= 20 && temp <= 28 && humidity > 60) {
            pests.push({ name: "Helicoverpa (Pod Borer)", threat_level: "High", probability: 0.8 });
        }
        if (temp > 30 && humidity < 50) {
            pests.push({ name: "Aphids", threat_level: "Medium", probability: 0.55 });
        }
    }

    if (["pigeonpea", "arhar", "tur"].includes(c)) {
        if (temp >= 22 && temp <= 30 && humidity > 65) {
            pests.push({ name: "Pod Fly", threat_level: "High", probability: 0.75 });
        }
        if (temp > 28 && humidity < 55) {
            pests.push({ name: "Maruca Pod Borer", threat_level: "Medium", probability: 0.6 });
        }
    }

    if (["lentil", "masoor"].includes(c)) {
        if (temp >= 18 && temp <= 25 && humidity > 65) {
            pests.push({ name: "Aphids", threat_level: "High", probability: 0.7 });
        }
        if (temp > 28 && humidity < 50) {
            pests.push({ name: "Pod Borer", threat_level: "Medium", probability: 0.55 });
        }
    }

    if (["mung", "mungbean", "green gram"].includes(c)) {
        if (temp >= 24 && temp <= 32 && humidity > 65) {
            pests.push({ name: "Whitefly", threat_level: "High", probability: 0.72 });
        }
        if (temp > 30 && humidity > 70) {
            pests.push({ name: "Thrips", threat_level: "Medium", probability: 0.6 });
        }
    }

    if (["urd", "urad", "black gram"].includes(c)) {
        if (temp >= 24 && temp <= 32 && humidity > 65) {
            pests.push({ name: "Leaf Hopper", threat_level: "High", probability: 0.7 });
        }
        if (temp > 30 && humidity < 55) {
            pests.push({ name: "Pod Borer", threat_level: "Medium", probability: 0.58 });
        }
    }

    if (["cowpea", "lobia"].includes(c)) {
        if (temp >= 25 && temp <= 32 && humidity > 60) {
            pests.push({ name: "Aphids", threat_level: "High", probability: 0.75 });
        }
        if (temp > 30 && humidity > 70) {
            pests.push({ name: "Pod Sucking Bugs", threat_level: "Medium", probability: 0.65 });
        }
    }

    // Fallback
    if (pests.length === 0) {
        pests.push({ name: "No major pest detected", threat_level: "Low", probability: 0.2 });
    }

    return pests;
}

export default recommendPesticide;