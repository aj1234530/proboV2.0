export default function serializeObject(data: any) {
    return JSON.stringify(
      data,
      (key, value) => (value instanceof Map ? Object.fromEntries(value) : value),
      2
    );
  }
  