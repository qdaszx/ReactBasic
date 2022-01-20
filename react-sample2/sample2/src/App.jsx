import { useState } from "react";
import FoodList from "./components/FoodList";
import mockItems from "./mock.json";

const App = () => {
  const [items, setItems] = useState(mockItems);
  const [order, setOrder] = useState("createdAt");
  const sortedItems = items.sort((a, b) => b[order] - a[order]);

  const handleNewestClick = () => {
    setOrder("createdAt");
  };
  const handleCalorieClick = () => {
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
        <button onClick={handleCalorieClick}>칼로리순</button>
      </div>
      <FoodList items={sortedItems} onDelete={handleDeleteClick} />
    </>
  );
};

export default App;
