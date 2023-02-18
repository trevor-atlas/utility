const visitWeight = 100;
const ageWeight = 10;

export const getFrecencyCalc =
  (currentTime = Date.now()) =>
  <T extends { lastUpdated: number; useCount: number }>(history: T): number => {
    // Set the weights for the different factors that contribute to the frecency score
    const age = (currentTime - history.lastUpdated) / (1000 * 60 * 60 * 24);

    // default visit count and typed count to -1 if they are undefined, null or 0
    const visitCount = history.useCount ?? -1;

    if (visitCount <= 0) {
      return 0;
    }

    // Calculate the frecency score using the weights and age
    return visitCount * visitWeight - age * ageWeight;
  };
