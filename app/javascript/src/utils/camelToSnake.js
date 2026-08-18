const camelToSnake = obj =>
  Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`),
      value,
    ])
  );

export default camelToSnake;
