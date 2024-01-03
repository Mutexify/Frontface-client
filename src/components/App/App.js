import { useEffect, useState } from "react";
import "../SlotList/SlotList";
import SlotList from "../SlotList/SlotList";
import "./App.css";

const BaseURL = "http://localhost:3000";

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
