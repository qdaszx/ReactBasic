import { useEffect, useState } from "react";
import { getFoods } from "./api";
import FoodList from "./components/FoodList";

const LIMIT = 10;

const App = () => {
  const [items, setItems] = useState([]);
  const [order, setOrder] = useState("createdAt");
  const [nextCursor, setNextCursor] = useState(null);
  const [direction, setDirection] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingError, setLoadingError] = useState(null);

  const sortedItems = items.sort((a, b) => direction * (b[order] - a[order]));

  const handleNewestClick = () => {
    setDirection(1);
    setOrder("createdAt");
  };
  const handleOldestClick = () => {
    setDirection(-1);
    setOrder("createdAt");
  };
  const handleHighCalorieClick = () => {
    setDirection(1);
    setOrder("calorie");
  };
  const handleLowCalorieClick = () => {
    setDirection(-1);
    setOrder("calorie");
  };

  const handleDeleteClick = (id) => {
    const filteredItems = items.filter((item) => item.id !== id);
    setItems(filteredItems);
  };

  const handleLoad = async (options) => {
    let result;
    try {
      setIsLoading(true);
      setLoadingError(null);
      result = await getFoods(options);
    } catch (error) {
      setLoadingError(error);
      return;
    } finally {
      setIsLoading(false);
    }
    const { foods, paging } = result;
    if (nextCursor) {
      setItems((prevItems) => [...prevItems, ...foods]);
    } else {
      setItems(foods);
    }
    setNextCursor(paging.nextCursor);
  };

  const handleLoadMore = () => {
    handleLoad({ order, nextCursor, limit: LIMIT });
  };

  useEffect(() => {
    handleLoad({ order, limit: LIMIT });
  }, [order]);

  return (
    <>
      <div>
        <button onClick={handleNewestClick}>최신순</button>
        <button onClick={handleOldestClick}>오래된순</button>
        <button onClick={handleHighCalorieClick}>높은 칼로리순</button>
        <button onClick={handleLowCalorieClick}>낮은 칼로리순</button>
      </div>
      <FoodList items={sortedItems} onDelete={handleDeleteClick} />
      {nextCursor && (
        <button disabled={isLoading} onClick={handleLoadMore}>
          더 보기
        </button>
      )}
      {loadingError?.message && <span>{loadingError.message}</span>}
    </>
  );
};

export default App;
