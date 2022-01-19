import ReviewList from "./components/ReviewList";
import items from "../src/mock.json";

const App = () => {
  return (
    <div>
      <ReviewList items={items} />
    </div>
  );
};

export default App;
