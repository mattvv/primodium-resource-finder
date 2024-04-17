import { Information } from "./components/information";
import { Leaderboard } from "./components/leaderboard";
import { ModeToggle } from "./components/mode-toggle";

function App() {
  return (
    <div className="w-full max-w-screen-xl m-auto p-2 xl:p-10 flex flex-col items-end gap-2">
      <ModeToggle />
      <div className="grid grid-cols-5 w-full gap-2">
        <div className="col-span-5 xl:col-span-5">
          <Leaderboard />
        </div>
      </div>
    </div>
  );
}

export default App;
