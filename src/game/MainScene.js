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
    this.add.rectangle(400, 300, 800, 600, 0x000000);

    this.gameOver = false;
    this.lastCutTime = 0;

    this.score = 0;
    this.highScore = Number(localStorage.getItem("highScore")) || 0;

    this.playerName = localStorage.getItem("playerName");

    if (!this.playerName) {
      this.askName();
      return;
    }

    this.startGame();
  }

  // ===============================
  // ✅ MOBILE FRIENDLY NAME INPUT
  // ===============================
  askName() {
    this.add.text(220, 180, "🍉 Fruit Ninja Pro", {
      fontSize: "32px",
      color: "#ffffff",
    });

    this.add.text(240, 230, "Enter Your Name", {
      fontSize: "24px",
      color: "#00ffcc",
    });

    this.add.rectangle(400, 320, 350, 60, 0x000000, 0.6);

    this.input.keyboard.enabled = false;

    const wrapper = document.createElement("div");
    wrapper.style.position = "absolute";
    wrapper.style.top = "0";
    wrapper.style.left = "0";
    wrapper.style.width = "100%";
    wrapper.style.height = "100%";
    wrapper.style.display = "flex";
    wrapper.style.justifyContent = "center";
    wrapper.style.alignItems = "center";
    wrapper.style.background = "rgba(0,0,0,0.5)";
    wrapper.style.zIndex = "9999";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Enter your name...";
    input.style.padding = "15px 20px";
    input.style.fontSize = "18px";
    input.style.border = "2px solid #00ffcc";
    input.style.borderRadius = "10px";
    input.style.outline = "none";
    input.style.width = "220px";
    input.style.textAlign = "center";
    input.style.boxShadow = "0 0 10px #00ffcc";

    const btn = document.createElement("button");
    btn.innerText = "Start Game";
    btn.style.marginLeft = "10px";
    btn.style.padding = "15px 20px";
    btn.style.fontSize = "16px";
    btn.style.border = "none";
    btn.style.borderRadius = "10px";
    btn.style.background = "#00ffcc";
    btn.style.cursor = "pointer";

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

  startGame() {
    this.cutSound = this.sound.add("cut");
    this.boomSound = this.sound.add("boom");

    this.fruitGroup = this.add.group();

    this.add.text(20, 20, "🍉 Fruit Ninja Pro", {
      fontSize: "26px",
      color: "#fff",
    });

    this.add.text(20, 55, "Player: " + this.playerName, {
      fontSize: "18px",
      color: "#00ffcc",
    });

    this.scoreText = this.add.text(20, 80, "Score: 0", {
      fontSize: "22px",
      color: "#fff",
    });

    this.add.text(20, 110, "High: " + this.highScore, {
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

    this.time.addEvent({
      delay: 700,
      loop: true,
      callback: () => {
        if (this.gameOver) return;

        const key =
          this.fruits[Math.floor(Math.random() * this.fruits.length)];

        const fruit = this.add.image(
          Phaser.Math.Between(80, 720),
          -50,
          key
        );

        fruit.setScale(0.2);
        this.fruitGroup.add(fruit);

        this.tweens.add({
          targets: fruit,
          y: 700,
          duration: Phaser.Math.Between(2000, 3200),
          onComplete: () => fruit.destroy(),
        });
      },
    });

    this.input.on("pointermove", (pointer) => {
      if (this.gameOver) return;

      const now = Date.now();
      if (now - this.lastCutTime < 120) return;

      this.fruitGroup.getChildren().forEach((fruit) => {
        if (!fruit) return;

        const dx = pointer.x - fruit.x;
        const dy = pointer.y - fruit.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 45) {
          this.lastCutTime = now;

          const key = fruit.texture.key;

          if (key === "bomb") {
            this.boomSound.play();
            this.endGame();
          } else {
            this.cutSound.play();
            this.score++;
            this.scoreText.setText("Score: " + this.score);
          }

          fruit.destroy();
        }
      });
    });
  }

  endGame() {
    this.gameOver = true;

    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem("highScore", this.highScore);
    }

    this.add.rectangle(400, 300, 800, 600, 0x000000, 0.8);

    this.add.text(250, 200, "💔 GAME OVER", {
      fontSize: "40px",
      color: "#ff4d4d",
    });

    this.add.text(300, 280, "Score: " + this.score, {
      fontSize: "28px",
      color: "#fff",
    });

    this.add.text(300, 320, "High: " + this.highScore, {
      fontSize: "22px",
      color: "#ffff00",
    });

    const btn = this.add.text(300, 400, "🔁 PLAY AGAIN", {
      fontSize: "24px",
      backgroundColor: "#ff66cc",
      color: "#000",
      padding: { x: 10, y: 5 },
    });

    btn.setInteractive();
    btn.on("pointerdown", () => this.scene.restart());

    const reset = this.add.text(300, 460, "NEW NAME", {
      fontSize: "20px",
      backgroundColor: "#ffff00",
      color: "#000",
      padding: { x: 10, y: 5 },
    });

    reset.setInteractive();
    reset.on("pointerdown", () => {
      localStorage.removeItem("playerName");
      this.scene.restart();
    });
  }
}