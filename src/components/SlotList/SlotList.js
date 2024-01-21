import { useCallback, useEffect, useState } from "react";
import "./SlotList.css";

import { useSelector } from "react-redux";

function LockButton({ slotData }) {
  const BaseURL = process.env.REACT_APP_BASE_URL;
  const oppositeLockAction = !slotData.blocked;

  const handleClick = async () => {
    const response = await fetch(`${BaseURL}/api/slots/${slotData.id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PATCH",
      credentials: "include",
      body: JSON.stringify({ blocked: oppositeLockAction }),
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

const BaseURL = process.env.REACT_APP_BASE_URL;

function SlotListContainer() {
  const [slots, setSlots] = useState([]);
  const [loadingSlotsError, setLoadingSlotsError] = useState(false);
  const [eventSource, setEventSource] = useState(null);

  const fetchSlots = async () => {
    try {
      const response = await fetch(`${BaseURL}/api/slots`, {
        credentials: "include",
      });
      const data = await response.json();
      setSlots(data);
    } catch (error) {
      console.log(error);
      setLoadingSlotsError(true);
    }
  };

  const updateSlotState = useCallback(
    (e) => {
      console.log(`received event: ${e.data}`);
      const data = JSON.parse(e.data);
      const slotData = data.slotData;

      const index = slots.findIndex((slot) => slot.id === slotData.id);
      if (index === -1) {
        console.error(`Couldn't find slot with id ${slotData.id}`);
        console.log(slots);
        return;
      }
      const newSlots = slots.map((slot, i) => {
        if (i === index) {
          slot.blocked = slotData.blocked;
        }
        return slot;
      });
      console.log(`updating slot with id ${slotData.id}`);
      console.log(`slots after update:`, slots);
      setSlots(newSlots);
    },
    [slots]
  );

  useEffect(() => {
    if (eventSource) return;
    fetchSlots();
    setEventSource(new EventSource(`${BaseURL}/api/sse/events`));
    return () => {
      eventSource?.close();
    };
  }, [eventSource]);

  useEffect(() => {
    if (!eventSource) return;
    eventSource.onmessage = updateSlotState;
    return () => {
      eventSource.onmessage = null;
    };
  }, [eventSource, updateSlotState]);

  return (
    <div className="listContainer">
      {loadingSlotsError ? (
        <div>Couldn't load slots</div>
      ) : (
        slots.map((slot) => <SlotListElement key={slot.id} slotData={slot} />)
      )}
    </div>
  );
}

function SlotAuthContainer() {
  const user = useSelector((state) => state.auth.user);
  return user ? <SlotListContainer /> : <></>;
}

export default SlotAuthContainer;
