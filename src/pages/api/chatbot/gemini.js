import dbConnect from '../../../database/db';
import Restaurant from '../../../database/models/Resturant';

const GEMINI_API_KEY = 'AIzaSyA2A4CFEcKfkKjcoouKpauC30D3UN-hrHk';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

function isRestaurantOpen(restaurant) {
  const now = new Date();
  const currentDay = now.toLocaleString('en-US', { weekday: 'long' });
  const currentTime = now.toTimeString().slice(0, 5); // HH:MM
  const timings = (restaurant.mealTimings || []).filter(t => t.day === currentDay);
  return timings.some(t => t.startTime <= currentTime && t.endTime >= currentTime);
}

function getMostSellingDishes(openRestaurants) {
  const dishSales = {};
  openRestaurants.forEach(r => {
    const rest = r.restaurant;
    (rest.orders || []).forEach(order => {
      (order.items || []).forEach(item => {
        if (!dishSales[item.name]) {
          dishSales[item.name] = { name: item.name, restaurant: rest.name, count: 0 };
        }
        dishSales[item.name].count += item.quantity || 1;
      });
    });
  });
  return Object.values(dishSales).sort((a, b) => b.count - a.count).slice(0, 5);
}

function getTopRatedRestaurants(openRestaurants) {
  return openRestaurants.map(r => {
    const rest = r.restaurant;
    const ratings = (rest.reviews || []).map(rev => rev.rating || 0);
    const avgRating = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
    return { name: rest.name, city: rest.city, avgRating: avgRating.toFixed(2) };
  }).filter(r => r.avgRating > 0).sort((a, b) => b.avgRating - a.avgRating).slice(0, 5);
}

function getTopRatedDishes(openRestaurants) {
  const dishRatings = [];
  openRestaurants.forEach(r => {
    const rest = r.restaurant;
    (rest.menu || []).forEach(item => {
      if (item.isAvailable && item.reviews && item.reviews.length > 0) {
        const ratings = item.reviews.map(rev => rev.rating || 0);
        const avgRating = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
        dishRatings.push({ name: item.name, restaurant: rest.name, avgRating: avgRating.toFixed(2) });
      }
    });
  });
  return dishRatings.sort((a, b) => b.avgRating - a.avgRating).slice(0, 5);
}

async function fetchGeminiResponse(userMsg, context) {
  const prompt = `You are a helpful restaurant assistant. Only answer questions about the following restaurants and their menus. If the question is not about a restaurant, city, menu, dish, or food, reply: 'I can only answer questions about restaurants and their menus.'

You can also answer questions about the most selling dishes, top rated restaurants, and top rated dishes using the provided lists. When listing, always use bullet points (• ...) and line breaks.

${context}

User: ${userMsg}
Assistant:`;

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
  };

  const response = await fetch(GEMINI_API_URL + `?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0].text) {
    return data.candidates[0].content.parts[0].text.trim();
  }
  return "I'm sorry, I couldn't get a response from Gemini.";
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'No message provided' });

  await dbConnect();
  // Fetch all approved restaurants and their menus
  const restaurants = await Restaurant.find({ status: 'approved' }).lean();
  // Filter for currently open restaurants with available menu
  const openRestaurants = restaurants.filter(r => {
    const rest = r.restaurant;
    const hasMenu = (rest.menu || []).some(item => item.isAvailable);
    return isRestaurantOpen(rest) && hasMenu;
  });
  // Prepare a compact context string
  const contextLines = [];
  contextLines.push('Restaurant Data (open now):');
  contextLines.push(openRestaurants.map(r => {
    const rest = r.restaurant;
    const menu = (rest.menu || []).filter(item => item.isAvailable).map(item => `${item.name} (Rs. ${item.price})`).join(', ');
    return `${rest.name} in ${rest.city}: ${menu}`;
  }).join('\n'));

  // Add most selling dishes
  const mostSelling = getMostSellingDishes(openRestaurants);
  if (mostSelling.length) {
    contextLines.push('\nMost Selling Dishes:');
    contextLines.push(mostSelling.map(d => `• ${d.name} at ${d.restaurant} (${d.count} sold)`).join('\n'));
  }
  // Add top rated restaurants
  const topRatedRests = getTopRatedRestaurants(openRestaurants);
  if (topRatedRests.length) {
    contextLines.push('\nTop Rated Restaurants:');
    contextLines.push(topRatedRests.map(r => `• ${r.name} (${r.city}) - ${r.avgRating}★`).join('\n'));
  }
  // Add top rated dishes
  const topRatedDishes = getTopRatedDishes(openRestaurants);
  if (topRatedDishes.length) {
    contextLines.push('\nTop Rated Dishes:');
    contextLines.push(topRatedDishes.map(d => `• ${d.name} at ${d.restaurant} - ${d.avgRating}★`).join('\n'));
  }

  const context = contextLines.join('\n');

  // Call Gemini API
  let geminiReply = await fetchGeminiResponse(message, context);

  // Post-process: Ensure lists are bullet points and each bullet is on its own line
  if (/here are|restaurants|options|serve|available|most selling|top rated|best/i.test(geminiReply)) {
    // Ensure every bullet starts on a new line and is followed by a line break
    geminiReply = geminiReply.replace(/\s*•\s*/g, '\n• ');
    // Ensure each bullet is on its own line
    geminiReply = geminiReply.replace(/\n• ([^\n]+)/g, (m, p1) => `\n• ${p1}\n`);
    // Remove duplicate line breaks
    geminiReply = geminiReply.replace(/\n{2,}/g, '\n');
    // Ensure a line break before the first bullet if not present
    geminiReply = geminiReply.replace(/([^\n])\n•/g, '$1\n\n•');
    // Remove leading/trailing whitespace
    geminiReply = geminiReply.trim();
  }

  // Filter: If Gemini's reply is not about a restaurant/menu, return default message
  const isRelevant = openRestaurants.some(r => {
    const rest = r.restaurant;
    if (geminiReply.toLowerCase().includes(rest.name.toLowerCase())) return true;
    if (geminiReply.toLowerCase().includes(rest.city.toLowerCase())) return true;
    if ((rest.menu || []).some(item => geminiReply.toLowerCase().includes(item.name.toLowerCase()))) return true;
    return false;
  });
  if (!isRelevant) {
    geminiReply = 'I can only answer questions about restaurants and their menus.';
  }

  return res.status(200).json({ reply: geminiReply });
} 