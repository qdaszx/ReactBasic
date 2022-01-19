import FoodList from "./components/FoodList";
import items from "./mock.json";

const App = () => {
  return (
    <>
      <FoodList items={items} />
    </>
  );
};

export default App;
