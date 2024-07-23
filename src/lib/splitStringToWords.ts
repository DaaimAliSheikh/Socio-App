export default function splitStringToWords(
  sample: string,
  substring: string
): string[] {
  const lowerSubString = substring.toLowerCase();
  const lowerSample = sample.toLowerCase();
  const index = lowerSample.indexOf(lowerSubString);

  if (index === -1) {
    // If substring is not found, return whole sample string and empty strings
    return [sample, "", ""];
  } else {
    // If substring is found
    const before = sample.substring(0, index);
    const after = sample.substring(index + substring.length);

    return [before, substring, after];
  }
}
