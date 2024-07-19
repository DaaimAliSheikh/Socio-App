export default function splitStringToWords(
  sample: string,
  substring: string
): string[] {
  const index = sample.indexOf(substring);

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
