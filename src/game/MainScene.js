import Phaser from "phaser";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
  }

  preload() {
    this.load.image("apple", "/assets/apple.png");
    this.load.image("banana", "/assets/banana.png");
    this.load.image("watermelon", "/assets/watermelon.png");
    this.load.image("strawberry", "/assets/strawberry.png");
    this.load.image("pineapple", "/assets/pineapple.png");
    this.load.image("orange", "/assets/orange.png");
    this.load.image("mango", "/assets/mango.png");
    this.load.image("bomb", "/assets/bomb.png");

    this.load.audio("cut", "/assets/cut.mp3");
    this.load.audio("boom", "/assets/boom.mp3");
  }

  create() {
    this.score = 0;
    this.gameOver = false;
    this.fruitsGroup = this.add.group();

    this.highScore = Number(localStorage.getItem("highScore")) || 0;
    this.playerName = localStorage.getItem("playerName");

    this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      this.scale.width,
      this.scale.height,
      0x000000
    );

    if (!this.playerName) {
      this.showStartScreen();
      return;
    }

    this.startGame();
  }

  // ================= START SCREEN =================
  showStartScreen() {
    const wrapper = document.createElement("div");
    wrapper.style.position = "fixed";
    wrapper.style.top = "0";
    wrapper.style.left = "0";
    wrapper.style.width = "100%";
    wrapper.style.height = "100%";
    wrapper.style.background = "linear-gradient(#000,#111)";
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";
    wrapper.style.justifyContent = "center";
    wrapper.style.alignItems = "center";
    wrapper.style.zIndex = "99999";

    const title = document.createElement("h1");
    title.innerText = "🍉 Fruit Slash Game";
    title.style.color = "white";
    title.style.marginBottom = "20px";

    const input = document.createElement("input");
    input.placeholder = "Enter Your Name";
    input.style.padding = "12px";
    input.style.fontSize = "18px";
    input.style.borderRadius = "10px";

    const btn = document.createElement("button");
    btn.innerText = "START GAME";
    btn.style.marginTop = "15px";
    btn.style.padding = "12px 25px";
    btn.style.fontSize = "18px";
    btn.style.background = "#00ffcc";
    btn.style.border = "none";
    btn.style.cursor = "pointer";

    wrapper.appendChild(title);
    wrapper.appendChild(input);
    wrapper.appendChild(btn);
    document.body.appendChild(wrapper);

    input.focus();

    const start = () => {
      const name = input.value.trim();
      if (!name) return;

      localStorage.setItem("playerName", name);
      document.body.removeChild(wrapper);
      this.scene.restart();
    };

    btn.onclick = start;

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") start();
    });
  }

  // ================= GAME START =================
  startGame() {
    this.cutSound = this.sound.add("cut");
    this.boomSound = this.sound.add("boom");

    this.scoreText = this.add.text(20, 20, "Score: 0", {
      fontSize: "24px",
      color: "#ffffff",
    });

    this.add.text(20, 50, "Player: " + this.playerName, {
      fontSize: "18px",
      color: "#00ffcc",
    });

    this.add.text(20, 80, "High Score: " + this.highScore, {
      fontSize: "18px",
      color: "#ffff00",
    });

    this.fruits = [
      "apple","banana","watermelon","strawberry",
      "pineapple","orange","mango","bomb"
    ];

    // 🍉 SPAWN
    this.spawn = this.time.addEvent({
      delay: 700,
      loop: true,
      callback: () => {
        if (this.gameOver) return;

        const key = this.fruits[Math.floor(Math.random() * this.fruits.length)];

        const fruit = this.add.image(
          Phaser.Math.Between(80, this.scale.width - 80),
          -50,
          key
        );

        fruit.setScale(0.25);
        this.fruitsGroup.add(fruit);

        this.tweens.add({
          targets: fruit,
          y: this.scale.height + 50,
          duration: 2500,
          onComplete: () => fruit.destroy(),
        });
      },
    });

    // ✂️ CUT
    this.input.on("pointermove", (pointer) => {
      if (this.gameOver) return;

      this.fruitsGroup.getChildren().forEach((fruit) => {
        if (!fruit) return;

        const dx = pointer.x - fruit.x;
        const dy = pointer.y - fruit.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 45) {
          const key = fruit.texture.key;

          if (key === "bomb") {
            this.endGame();
            return;
          }

          this.cutSound.play();
          this.score++;
          this.scoreText.setText("Score: " + this.score);

          this.splitFruit(fruit, key);
        }
      });
    });
  }

  // ================= SPLIT EFFECT =================
  splitFruit(fruit, key) {
    const x = fruit.x;
    const y = fruit.y;

    fruit.destroy();

    const left = this.add.image(x, y, key).setScale(0.15);
    const right = this.add.image(x, y, key).setScale(0.15);

    this.tweens.add({
      targets: left,
      x: x - 70,
      y: y + 80,
      angle: -180,
      alpha: 0,
      duration: 400,
      onComplete: () => left.destroy(),
    });

    this.tweens.add({
      targets: right,
      x: x + 70,
      y: y + 80,
      angle: 180,
      alpha: 0,
      duration: 400,
      onComplete: () => right.destroy(),
    });
  }

  // ================= GAME OVER =================
  endGame() {
    this.gameOver = true;

    this.boomSound.play();

    this.time.removeAllEvents();
    this.fruitsGroup.clear(true, true);

    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem("highScore", this.highScore);
    }

    this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      this.scale.width,
      this.scale.height,
      0x000000,
      0.85
    );

    this.add.text(this.scale.width / 2 - 120, this.scale.height / 2 - 80,
      "💥 GAME OVER", { fontSize: "40px", color: "#ff0000" });

    this.add.text(this.scale.width / 2 - 140, this.scale.height / 2 - 20,
      "Well Tried Fuggi 😄", { fontSize: "24px", color: "#ffffff" });

    this.add.text(this.scale.width / 2 - 90, this.scale.height / 2 + 20,
      "Score: " + this.score, { fontSize: "22px", color: "#ffff00" });

    this.add.text(this.scale.width / 2 - 110, this.scale.height / 2 + 60,
      "High Score: " + this.highScore, { fontSize: "20px", color: "#00ffcc" });

    // 🔁 RETRY
    const retry = this.add.text(
      this.scale.width / 2 - 50,
      this.scale.height / 2 + 110,
      "RETRY",
      {
        fontSize: "24px",
        backgroundColor: "#00ffcc",
        color: "#000",
        padding: { x: 10, y: 5 },
      }
    );

    retry.setInteractive();
    retry.on("pointerdown", () => this.scene.restart());

    // 👤 NEW NAME
    const newName = this.add.text(
      this.scale.width / 2 - 70,
      this.scale.height / 2 + 160,
      "NEW NAME",
      {
        fontSize: "22px",
        backgroundColor: "#ffcc00",
        color: "#000",
        padding: { x: 10, y: 5 },
      }
    );

    newName.setInteractive();
    newName.on("pointerdown", () => {
      localStorage.removeItem("playerName");
      this.scene.restart();
    });
  }
}