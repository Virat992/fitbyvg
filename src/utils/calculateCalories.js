export const calculateDailyCalories = (physicalInfo, goals) => {
  const { gender, weight, height, age = 25, physicalActivity } = physicalInfo;
  const goal = goals[0]?.id || "maintain"; // take the first goal

  // BMR calculation (Mifflin-St Jeor)
  let bmr =
    gender === "male"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

  const activityMultiplier = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    high: 1.725,
  };

  let calories = bmr * (activityMultiplier[physicalActivity] || 1.2);

  if (goal === "lose-fat") calories -= 500;
  if (goal === "gain-muscle") calories += 500;

  return Math.round(calories);
};
