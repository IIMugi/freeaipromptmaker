import fs from 'fs';
const data = JSON.parse(fs.readFileSync('./lighthouse-home-new.json', 'utf8'));
const scores = Object.entries(data.categories).map(([key, value]) => `${key}: ${Math.round(value.score * 100)}`);
console.log(scores.join('\n'));
