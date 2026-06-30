import Phaser from "phaser";
import MainScene from "./MainScene";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "game",
  backgroundColor: "#000000",
  scene: MainScene,
};

export default config;