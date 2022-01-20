const FoodListItem = ({ item, onDelete }) => {
  const onDeleteClick = () => onDelete(item.id);
  const { imgUrl, title, calorie, content } = item;
  return (
    <div>
      <img src={imgUrl} alt={title} />
      <div>{title}</div>
      <div>{calorie}</div>
      <div>{content}</div>
      <button onClick={onDeleteClick}>삭제</button>
    </div>
  );
};

const FoodList = ({ items, onDelete }) => {
  return (
    <ul>
      {items.map((item) => {
        return (
          <li key={item.id}>
            <FoodListItem item={item} onDelete={onDelete} />
          </li>
        );
      })}
    </ul>
  );
};

export default FoodList;
