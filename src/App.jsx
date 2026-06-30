import { useEffect, useRef } from "react";
import Phaser from "phaser";
import config from "./game/config";

function App() {
  const gameRef = useRef(null);

  useEffect(() => {
    const newConfig = {
      ...config,
      parent: gameRef.current,
    };

    const game = new Phaser.Game(newConfig);

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div ref={gameRef}></div>;
}

export default App;