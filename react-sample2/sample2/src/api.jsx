export async function getFoods({ order = "", nextCursor = "", limit }) {
  const query = `order=${order}&cursor=${nextCursor}&limit=${limit}`;
  const response = await fetch(`https://learn.codeit.kr/api/foods?${query}`);
  if (!response.ok) {
    throw new Error("음식을 불러오는데 실패했습니다.");
  }
  const body = await response.json();
  return body;
}
