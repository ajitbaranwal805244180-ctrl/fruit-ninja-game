import { useEffect } from "react";
import Phaser from "phaser";
import config from "./game/config";

function App() {
  useEffect(() => {
    const game = new Phaser.Game(config);

<<<<<<< HEAD
    return () => {
      game.destroy(true);
    };
  }, []);

  return <div id="game"></div>;
=======
    return () => game.destroy(true);
  }, []);

  return (
    <div>
      <div id="game"></div>

      {/* NAME INPUT */}
      <input
        id="nameInput"
        placeholder="Enter Name"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          padding: "10px",
          fontSize: "18px",
          zIndex: 9999,
        }}
      />
    </div>
  );
>>>>>>> 23a0a81 (final fix)
}

export default App;