import dbConnect from '../../../database/db';
import Restaurant from '../../../database/models/Resturant';
import didYouMean from 'didyoumean2';

function extractPrice(query) {
  const budgetMatch = query.match(/under\s*(\d+)|less than\s*(\d+)/i);
  return budgetMatch ? parseInt(budgetMatch[1] || budgetMatch[2]) : null;
}

function extractGreeting(query) {
  return /(hi|hello|hey)/i.test(query);
}

function extractReservationIntent(query) {
  return /(book|table|reservation)/i.test(query);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'No message provided' });

  await dbConnect();
  const userMsg = message.toLowerCase();

  // Fetch all restaurants and flatten menu/location
  const restaurants = await Restaurant.find({ status: 'accepted' }).lean();
  const allDishes = [];
  const allLocations = [];
  for (const r of restaurants) {
    if (r.restaurant && r.restaurant.menu) {
      for (const item of r.restaurant.menu) {
        if (item.isAvailable) allDishes.push(item.name.toLowerCase());
      }
    }
    if (r.restaurant && r.restaurant.city) {
      allLocations.push(r.restaurant.city.toLowerCase());
    }
  }

  // Fuzzy extract dish
  function extractDish(query) {
    const ignoreWords = ["list", "restaurant", "restaurants", "find", "show", "food", "place", "places", "menu", "eat", "want", "options", "order", "delivery", "craving", "available", "price", "under", "less", "than", "in", "at", "for", "of", "the", "a", "an", "is", "are", "can", "you", "me", "which", "what", "with", "and", "or", "to", "by", "on", "open", "currently"];
    let cleaned = query.split(' ').filter(w => !ignoreWords.includes(w)).join(' ');
    if (!cleaned.trim()) return null;
    const match = didYouMean(cleaned, allDishes, { threshold: 0.4 });
    return match;
  }

  // Fuzzy extract location
  function extractLocation(query) {
    const match = didYouMean(query, allLocations, { threshold: 0.4 });
    return match;
  }

  // 1. Greeting
  if (extractGreeting(userMsg)) {
    return res.status(200).json({ reply: 'Hello! How can I assist you today?' });
  }

  // 2. Reservation intent
  if (extractReservationIntent(userMsg)) {
    return res.status(200).json({ reply: 'Please specify the restaurant name, number of people, and time for the reservation.' });
  }

  // 3. Extract dish, price, location
  const dishName = extractDish(userMsg);
  const budget = extractPrice(userMsg);
  const locationName = extractLocation(userMsg);

  // 4. Filter restaurants by location (if any)
  let filteredRestaurants = restaurants;
  if (locationName) {
    filteredRestaurants = restaurants.filter(r => r.restaurant.city.toLowerCase() === locationName);
    if (filteredRestaurants.length === 0) {
      return res.status(200).json({ reply: `Sorry, I couldn't find any restaurants in ${locationName.charAt(0).toUpperCase() + locationName.slice(1)}.` });
    }
  }

  // 5. List restaurants in a location
  if (locationName && !dishName && !budget) {
    const restaurantNames = filteredRestaurants.map(r => r.restaurant.name).filter(Boolean);
    if (restaurantNames.length > 0) {
      return res.status(200).json({ reply: `Here are some restaurants in ${locationName.charAt(0).toUpperCase() + locationName.slice(1)}:\n` + restaurantNames.map(n => `• ${n}`).join('\n') });
    } else {
      return res.status(200).json({ reply: `Sorry, I couldn't find any restaurants in ${locationName.charAt(0).toUpperCase() + locationName.slice(1)}.` });
    }
  }

  // 6. Food options in a location (no dish, maybe budget)
  if (locationName && !dishName && budget) {
    let matches = [];
    for (const r of filteredRestaurants) {
      for (const item of r.restaurant.menu) {
        if (item.isAvailable && item.price <= budget) {
          matches.push(`${r.restaurant.name} (${item.name} - Rs. ${item.price})`);
        }
      }
    }
    if (matches.length > 0) {
      return res.status(200).json({ reply: `Here are some food options under Rs. ${budget} in ${locationName.charAt(0).toUpperCase() + locationName.slice(1)}:\n` + matches.join('\n') });
    } else {
      return res.status(200).json({ reply: `Sorry, I couldn't find any food options under Rs. ${budget} in ${locationName.charAt(0).toUpperCase() + locationName.slice(1)}.` });
    }
  }

  // 7. Dish + budget + location
  if (dishName && budget && locationName) {
    let matches = [];
    for (const r of filteredRestaurants) {
      for (const item of r.restaurant.menu) {
        if (item.isAvailable && item.name.toLowerCase() === dishName && item.price <= budget) {
          matches.push(`${r.restaurant.name} (${item.name} - Rs. ${item.price}) Location: ${r.restaurant.city}`);
        }
      }
    }
    if (matches.length > 0) {
      return res.status(200).json({ reply: `Here are some restaurants where you can get ${dishName.charAt(0).toUpperCase() + dishName.slice(1)} under Rs. ${budget} in ${locationName.charAt(0).toUpperCase() + locationName.slice(1)}:\n` + matches.join('\n') });
    } else {
      return res.status(200).json({ reply: `Sorry, I couldn't find ${dishName.charAt(0).toUpperCase() + dishName.slice(1)} under Rs. ${budget} in ${locationName.charAt(0).toUpperCase() + locationName.slice(1)}.` });
    }
  }

  // 8. Dish + location (no budget)
  if (dishName && locationName && !budget) {
    let matches = [];
    for (const r of filteredRestaurants) {
      for (const item of r.restaurant.menu) {
        if (item.isAvailable && item.name.toLowerCase() === dishName) {
          matches.push(`${r.restaurant.name} (${item.name} - Rs. ${item.price}) Location: ${r.restaurant.city}`);
        }
      }
    }
    if (matches.length > 0) {
      return res.status(200).json({ reply: `Here are some restaurants where you can get ${dishName.charAt(0).toUpperCase() + dishName.slice(1)} in ${locationName.charAt(0).toUpperCase() + locationName.slice(1)}:\n` + matches.join('\n') });
    } else {
      return res.status(200).json({ reply: `Sorry, I couldn't find ${dishName.charAt(0).toUpperCase() + dishName.slice(1)} in ${locationName.charAt(0).toUpperCase() + locationName.slice(1)}.` });
    }
  }

  // 9. Dish + budget (no location)
  if (dishName && budget && !locationName) {
    let matches = [];
    for (const r of filteredRestaurants) {
      for (const item of r.restaurant.menu) {
        if (item.isAvailable && item.name.toLowerCase() === dishName && item.price <= budget) {
          matches.push(`${r.restaurant.name} (${item.name} - Rs. ${item.price}) Location: ${r.restaurant.city}`);
        }
      }
    }
    if (matches.length > 0) {
      return res.status(200).json({ reply: `Here are some restaurants where you can get ${dishName.charAt(0).toUpperCase() + dishName.slice(1)} under Rs. ${budget}:\n` + matches.join('\n') });
    } else {
      return res.status(200).json({ reply: `Sorry, I couldn't find ${dishName.charAt(0).toUpperCase() + dishName.slice(1)} under Rs. ${budget}.` });
    }
  }

  // 10. Only dish (no budget, no location)
  if (dishName && !budget && !locationName) {
    let matches = [];
    for (const r of filteredRestaurants) {
      for (const item of r.restaurant.menu) {
        if (item.isAvailable && item.name.toLowerCase() === dishName) {
          matches.push(`${r.restaurant.name} (${item.name} - Rs. ${item.price}) Location: ${r.restaurant.city}`);
        }
      }
    }
    if (matches.length > 0) {
      return res.status(200).json({ reply: `Here are some restaurants where you can get ${dishName.charAt(0).toUpperCase() + dishName.slice(1)}:\n` + matches.join('\n') });
    } else {
      return res.status(200).json({ reply: `Sorry, I couldn't find ${dishName.charAt(0).toUpperCase() + dishName.slice(1)}.` });
    }
  }

  // 11. Only budget (no dish, no location)
  if (!dishName && budget && !locationName) {
    let matches = [];
    for (const r of filteredRestaurants) {
      for (const item of r.restaurant.menu) {
        if (item.isAvailable && item.price <= budget) {
          matches.push(`${r.restaurant.name} (${item.name} - Rs. ${item.price}) Location: ${r.restaurant.city}`);
        }
      }
    }
    if (matches.length > 0) {
      return res.status(200).json({ reply: `Here are some food options under Rs. ${budget}:\n` + matches.join('\n') });
    } else {
      return res.status(200).json({ reply: `Sorry, I couldn't find any food options under Rs. ${budget}.` });
    }
  }

  // 12. Fallback
  return res.status(200).json({ reply: "I'm sorry, I couldn't understand your request. Please try rephrasing your question." });
} 