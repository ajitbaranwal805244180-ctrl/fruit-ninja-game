import Phaser from "phaser";
import config from "./game/config";

// 🎮 SAFE GAME START (VITE + REACT friendly)
window.addEventListener("load", () => {
  if (!window.game) {
    window.game = new Phaser.Game(config);
  }
});