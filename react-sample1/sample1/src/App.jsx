import ReviewList from "./components/ReviewList";
import mockItems from "../src/mock.json";
import { useState } from "react";

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
  const handleBestClick = () => {
    setDirection(1);
    setOrder("rating");
  };
  const handleWorstClick = () => {
    setDirection(-1);
    setOrder("rating");
  };
  const handleDelete = (id) => {
    const nextItems = items.filter((item) => item.id !== id);
    setItems(nextItems);
  };

  return (
    <div>
      <div>
        <button onClick={handleNewestClick}>최신순</button>
        <button onClick={handleOldestClick}>오래된순</button>
        <button onClick={handleBestClick}>베스트순</button>
        <button onClick={handleWorstClick}>웨스트순</button>
      </div>
      <ReviewList items={sortedItems} onDelete={handleDelete} />
    </div>
  );
};

export default App;
