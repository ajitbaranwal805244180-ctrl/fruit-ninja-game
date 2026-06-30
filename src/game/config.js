import Phaser from "phaser";
import MainScene from "./MainScene";

const config = {
  type: Phaser.AUTO,

  parent: "root",

  // 📱 RESPONSIVE FULL SCREEN (MOST IMPORTANT FIX)
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },

  // 🎮 safe dynamic size
  width: window.innerWidth,
  height: window.innerHeight,

  backgroundColor: "#000000",

  scene: [MainScene],
};

export default config;