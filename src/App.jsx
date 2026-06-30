import { useEffect } from "react";
import game from "./main";

export default function App() {
  useEffect(() => {
    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }} />
  );
}