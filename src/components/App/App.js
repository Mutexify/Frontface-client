import { useCallback, useEffect, useState } from "react";
import "../SlotList/SlotList";
import SlotList from "../SlotList/SlotList";
import "./App.css";

const BaseURL = process.env.REACT_APP_BASE_URL;

function App() {
  const [slots, setSlots] = useState([]);
  const [loadingSlotsError, setLoadingSlotsError] = useState(false);
  const [eventSource, setEventSource] = useState(null);

  const fetchSlots = async () => {
    try {
      const response = await fetch(`${BaseURL}/api/slots`);
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
    <div className="container">
      {loadingSlotsError ? (
        <p>Couldn't load empty slots from server</p>
      ) : (
        <SlotList slots={slots} />
      )}
    </div>
  );
}

export default App;
