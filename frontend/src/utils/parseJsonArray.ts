
export default function parseJsonArray(str: string | undefined) {
  if (!str)
    return [];
  try {
    const jsonArray = JSON.parse(str);
    if (Array.isArray(jsonArray) && jsonArray.length > 0) {
      return jsonArray;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error parsing JSON:', (error as any)?.message);
    return [];
  }
}
