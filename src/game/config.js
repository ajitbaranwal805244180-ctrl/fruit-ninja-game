import Phaser from "phaser";
import MainScene from "./MainScene";

const config = {
  type: Phaser.AUTO,

  scale: {
    mode: Phaser.Scale.FIT,   // safe mobile fit
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 600,
  },

  backgroundColor: "#000000",
  scene: [MainScene],
};

export default config;