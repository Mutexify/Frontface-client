import "./SlotList.css";

function SlotList({ slots }) {
  const listItems = slots.map((slot) => <div>{slot.id}</div>);

  return <div className="listContainer">{listItems}</div>;
}

export default SlotList;
