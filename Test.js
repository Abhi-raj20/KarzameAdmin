function lastNCharacters(str, n) {
  if (n >= str.length) {
    return str;
  } else {
    return str.slice(n);
  }
}

console.log(lastNCharacters("Hello, world!", 5)); // "world!"
console.log(lastNCharacters("JavaScript", 4)); // "ript"
console.log(lastNCharacters("OpenAI GPT-3", 2)); // "-3"
