import dbConnect from "@/database/db";
import Resturant from "@/database/models/Resturant";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  await dbConnect();

  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Verify JWT Token
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const restaurant = await Resturant.findById(decoded.id);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Extract restaurant data
    const { mealType, mealTimings } = restaurant.restaurant || {};

    if (req.method === "GET") {
      // console.log("mealType:", mealType); // Debugging

      // Ensure mealType is an array
      const mealTypesArray = Array.isArray(mealType) ? mealType : [];

      // Ensure mealTimings is an array
      const mealTimingsArray = Array.isArray(mealTimings) ? mealTimings : [];

      // Map meal types to their respective meal timings
      const mealTimingsByType = mealTypesArray.reduce((acc, type) => {
        acc[type] = mealTimingsArray.filter(
          (timing) => timing.mealType === type
        );
        return acc;
      }, {});

      return res.status(200).json({
        message: "Success",
        mealTimingsByType: Object.keys(mealTimingsByType).length
          ? mealTimingsByType
          : {},
      });
    }

    if (req.method === "POST") {
      const { timings } = req.body;

      if (!Array.isArray(timings) || timings.length === 0) {
        return res.status(400).json({ message: "Timings data is required" });
      }

      function convertTimeToMinutes(time) {
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes; // Convert time to minutes
      }

      for (const timing of timings) {
        let { mealType, day, startTime, endTime } = timing;

        if (
          ![mealType, day, startTime, endTime].every(
            (field) => field && field !== ""
          )
        ) {
          return res
            .status(400)
            .json({ message: "All fields are required for each timing entry" });
        }

        startTime = convertTimeToMinutes(startTime.trim());
        endTime = convertTimeToMinutes(endTime.trim());

        if (startTime >= endTime) {
          return res
            .status(400)
            .json({ message: "Start time must be before end time" });
        }
      }

      // Ensure mealTimings exists before modifying
      if (!Array.isArray(restaurant.restaurant.mealTimings)) {
        restaurant.restaurant.mealTimings = [];
      }

      timings.forEach(({ mealType, day, startTime, endTime }) => {
        // Check if a timing for the same mealType and day exists
        const existingTiming = restaurant.restaurant.mealTimings.find(
          (timing) => timing.mealType === mealType && timing.day === day
        );

        if (existingTiming) {
          // Update existing timing
          existingTiming.startTime = startTime;
          existingTiming.endTime = endTime;
        } else {
          // Add new timing
          restaurant.restaurant.mealTimings.push({
            mealType,
            day,
            startTime,
            endTime,
          });
        }
      });

      await restaurant.save();

      return res.status(200).json({ message: "Timings saved successfully" });
    }

    return res.status(405).json({ message: "Method Not Allowed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
}
