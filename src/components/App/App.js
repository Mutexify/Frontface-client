import "../SlotList/SlotList";
import SlotList from "../SlotList/SlotList";
import "./App.css";
import AuthBar from "../Auth/AuthBar";

function App() {
  return (
    <div className="container">
      <AuthBar />
      <SlotList />
    </div>
  );
}

export default App;
