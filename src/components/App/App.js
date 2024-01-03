import { useEffect, useState } from "react";
import "../../constants";
import "../SlotList/SlotList";
import SlotList from "../SlotList/SlotList";
import { BaseURL } from "./../../constants";
import "./App.css";

function App() {
  const [slots, setSlots] = useState([]);

  const fetchSlots = async () => {
    const response = await fetch(`${BaseURL}/api/slots`);
    const data = await response.json();
    console.log(`fetched slots: ${JSON.stringify(data)}`);
    setSlots(data);
  };

  const updateSlotState = (data) => {
    console.log(data);
  };

  useEffect(() => {
    fetchSlots();
    const eventSource = new EventSource(`${BaseURL}/api/sse/events`);
    eventSource.onmessage = (e) => updateSlotState(e.data);
    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="container">
      <SlotList slots={slots} />
    </div>
  );
}

export default App;
