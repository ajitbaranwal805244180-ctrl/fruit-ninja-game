import Phaser from "phaser";
import MainScene from "./MainScene";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "#000000",
  parent: "game",
  scene: [MainScene],
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
};

export default config;