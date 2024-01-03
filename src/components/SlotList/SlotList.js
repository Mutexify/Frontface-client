import { BaseURL } from "../../constants";
import "./SlotList.css";

function SlotListElement({ slot }) {
  const handleClick = async () => {
    const response = await fetch(`${BaseURL}/api/slots/${slot.id}`, {
      method: "PATCH",
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <div className="listElement">
      {slot.id}
      <div
        style={{
          display: "flex",
          marginTop: "10px",
        }}
      >
        <div>{`State: ${slot.blocked ? "blocked" : "not blocked"}`}</div>
        <button
          onClick={handleClick}
          disabled={slot.blocked}
          className="listElementButton"
        >
          Block
        </button>
      </div>
    </div>
  );
}

function SlotListContainer({ slots }) {
  const listItems = slots.map((slot) => <SlotListElement slot={slot} />);

  return <div className="listContainer">{listItems}</div>;
}

export default SlotListContainer;
