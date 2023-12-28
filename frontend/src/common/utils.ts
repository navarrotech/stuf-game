// Copyright © 2023 Navarrotech

export function pluralize(count: number, word: string) {
  return count === 1 ? word : word + 's'
}

const m = 0x80000000, a = 1103515245, c = 12345;

export function seededRandom(seed: number) {
  seed = seed & (m - 1);
  return function() {
      seed = (a * seed + c) % m;
      return seed / (m - 1);
  };
}

export function seededShuffle<T = any>(array: T[], seed: number): T[] {
  const random = seededRandom(seed)

  let currentIndex = array.length, 
      temporaryValue, 
      randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {

      // Pick a remaining element...
      randomIndex = Math.floor(random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
  }

  return array;
}

export function objectToBase64(obj: object) {
  // Convert the object to a JSON string
  const jsonString = JSON.stringify(obj);

  // Encode the JSON string to Base64
  const base64String = btoa(
    unescape(
      encodeURIComponent(jsonString)
    )
  );

  return base64String;
}