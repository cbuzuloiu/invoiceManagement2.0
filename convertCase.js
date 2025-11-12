export function toSnakCeaseObject(obj) {
  const newObj = {};
  for (const key in obj) {
    if (Object.hasOwn(obj, key)) {
      const snakeKey = key.replace(
        /[A-Z]/g,
        (letter) => `_${letter.toLowerCase()}`
      );
      newObj[snakeKey] = obj[key];
    }
  }
  return newObj;
}

export function toCamelCaseObject(obj) {
  const newObj = {};
  for (const key in obj) {
    if (Object.hasOwn(obj, key)) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) =>
        letter.toUpperCase()
      );
      newObj[camelKey] = obj[key];
    }
  }
  return newObj;
}
