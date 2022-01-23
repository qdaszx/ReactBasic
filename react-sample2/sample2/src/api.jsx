export async function getFoods({ order = "", nextCursor = "", limit }) {
  const query = `order=${order}&cursor=${nextCursor}&limit=${limit}`;
  const response = await fetch(`https://learn.codeit.kr/api/foods?${query}`);
  const body = await response.json();
  return body;
}
