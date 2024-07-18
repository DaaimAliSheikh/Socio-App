export default function splitStringToWords(input: string): string[] {
    // Use a regular expression to match words and ignore whitespace characters
    const words = input.match(/\S+/g);
    // If no words are found, return an empty array
    return words ? words : [];
  }