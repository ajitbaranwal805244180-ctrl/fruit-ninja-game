<<<<<<< HEAD
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
=======
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
>>>>>>> 23a0a81 (final fix)
