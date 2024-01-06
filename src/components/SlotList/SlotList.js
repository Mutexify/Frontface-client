import "./SlotList.css";

function LockButton({ slotData }) {
  const BaseURL = process.env.REACT_APP_BASE_URL;
  const oppositeLockAction = !slotData.blocked;

  const handleClick = async () => {
    const response = await fetch(`${BaseURL}/api/slots/${slotData.id}`, {
      method: "PATCH",
      body: { id: slotData.id, blocked: oppositeLockAction },
    });
    const data = await response.json();
    console.log(data);
  };
  return (
    <button onClick={handleClick} className="listElementButton">
      {oppositeLockAction ? "Lock" : "Unlock"}
    </button>
  );
}

function SlotListElement({ slotData }) {
  return (
    <div className="listElement">
      {slotData.id}
      <div
        style={{
          display: "flex",
          marginTop: "10px",
        }}
      >
        <div>{`State: ${slotData.blocked ? "blocked" : "not blocked"}`}</div>
        <LockButton slotData={slotData} />
      </div>
    </div>
  );
}

function SlotListContainer({ slots }) {
  const listItems = slots.map((slot) => (
    <SlotListElement key={slot.id} slotData={slot} />
  ));

  return <div className="listContainer">{listItems}</div>;
}

export default SlotListContainer;
