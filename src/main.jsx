import Phaser from "phaser";
import MainScene from "./game/MainScene.js";
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,

  parent: "root", // 👈 THIS IS STEP 2 (IMPORTANT)

  scene: [MainScene],
};

new Phaser.Game(config);