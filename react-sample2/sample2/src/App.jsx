import { useState } from "react";
import FoodList from "./components/FoodList";
import mockItems from "./mock.json";

const App = () => {
  const [items, setItems] = useState(mockItems);
  const [order, setOrder] = useState("createdAt");
  const [direction, setDirection] = useState(1);

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

  return (
    <>
      <div>
        <button onClick={handleNewestClick}>최신순</button>
        <button onClick={handleOldestClick}>오래된순</button>
        <button onClick={handleHighCalorieClick}>높은 칼로리순</button>
        <button onClick={handleLowCalorieClick}>낮은 칼로리순</button>
      </div>
      <FoodList items={sortedItems} onDelete={handleDeleteClick} />
    </>
  );
};

export default App;
