// Copyright © 2023 Navarrotech

export function pluralize(count: number, word: string) {
  return count === 1 ? word : word + 's'
}