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
    this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      this.scale.width,
      this.scale.height,
      0x000000
    );

    this.gameOver = false;
    this.score = 0;

    this.highScore = Number(localStorage.getItem("highScore")) || 0;

    this.fruitsGroup = this.add.group();

    this.playerName = localStorage.getItem("playerName");

    if (!this.playerName) {
      this.showNameInput();
      return;
    }

    this.startGame();
  }

  // ================= NAME INPUT =================
  showNameInput() {
    const wrapper = document.createElement("div");
    wrapper.style.position = "fixed";
    wrapper.style.top = "0";
    wrapper.style.left = "0";
    wrapper.style.width = "100%";
    wrapper.style.height = "100%";
    wrapper.style.background = "rgba(0,0,0,0.8)";
    wrapper.style.display = "flex";
    wrapper.style.justifyContent = "center";
    wrapper.style.alignItems = "center";
    wrapper.style.zIndex = "9999";

    const input = document.createElement("input");
    input.placeholder = "Enter Name";
    input.style.padding = "12px";
    input.style.fontSize = "18px";

    const btn = document.createElement("button");
    btn.innerText = "START";
    btn.style.padding = "12px";
    btn.style.marginLeft = "10px";

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
      "apple",
      "banana",
      "watermelon",
      "strawberry",
      "pineapple",
      "orange",
      "mango",
      "bomb",
    ];

    // 🍉 SPAWN
    this.spawnEvent = this.time.addEvent({
      delay: 700,
      loop: true,
      callback: () => {
        if (this.gameOver) return;

        const key =
          this.fruits[Math.floor(Math.random() * this.fruits.length)];

        const fruit = this.add.image(
          Phaser.Math.Between(80, this.scale.width - 80),
          -50,
          key
        );

        fruit.setScale(0.2);
        this.fruitsGroup.add(fruit);

        this.tweens.add({
          targets: fruit,
          y: this.scale.height + 50,
          duration: 2500,
          onComplete: () => fruit.destroy(),
        });
      },
    });

    // ✂️ CUT SYSTEM
    this.input.on("pointermove", (pointer) => {
      if (this.gameOver) return;

      this.fruitsGroup.getChildren().forEach((fruit) => {
        if (!fruit) return;

        const dx = pointer.x - fruit.x;
        const dy = pointer.y - fruit.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 45) {
          const key = fruit.texture.key;

          // 💣 BOMB = GAME OVER
          if (key === "bomb") {
            this.endGame();
            return;
          }

          this.cutSound.play();
          this.score++;
          this.scoreText.setText("Score: " + this.score);

          fruit.destroy();
        }
      });
    });
  }

  // ================= GAME OVER =================
  endGame() {
    this.gameOver = true;

    this.boomSound.play();

    this.time.removeAllEvents();
    this.fruitsGroup.clear(true, true);

    // update high score
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem("highScore", this.highScore);
    }

    // overlay
    this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      this.scale.width,
      this.scale.height,
      0x000000,
      0.8
    );

    this.add.text(
      this.scale.width / 2 - 140,
      this.scale.height / 2 - 80,
      "💥 GAME OVER",
      { fontSize: "40px", color: "#ff0000" }
    );

    this.add.text(
      this.scale.width / 2 - 150,
      this.scale.height / 2 - 20,
      "Well Tried Fuggi 😄",
      { fontSize: "24px", color: "#ffffff" }
    );

    this.add.text(
      this.scale.width / 2 - 80,
      this.scale.height / 2 + 20,
      "Score: " + this.score,
      { fontSize: "22px", color: "#ffffff" }
    );

    this.add.text(
      this.scale.width / 2 - 100,
      this.scale.height / 2 + 60,
      "High Score: " + this.highScore,
      { fontSize: "20px", color: "#ffff00" }
    );

    // 🔁 RETRY BUTTON
    const retry = this.add.text(
      this.scale.width / 2 - 70,
      this.scale.height / 2 + 120,
      "🔁 RETRY",
      {
        fontSize: "26px",
        backgroundColor: "#00ffcc",
        color: "#000",
        padding: { x: 10, y: 5 },
      }
    );

    retry.setInteractive();

    retry.on("pointerdown", () => {
      this.scene.restart();
    });
  }
}