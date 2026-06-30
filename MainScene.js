import Phaser from "phaser";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
  }

  preload() {
    this.load.image("apple", "assets/apple.png");
    this.load.image("banana", "assets/banana.png");
    this.load.image("watermelon", "assets/watermelon.png");
    this.load.image("strawberry", "assets/strawberry.png");
    this.load.image("pineapple", "assets/pineapple.png");
    this.load.image("orange", "assets/orange.png");
    this.load.image("mango", "assets/mango.png");
    this.load.image("bomb", "assets/bomb.png");

    this.load.audio("cut", "assets/cut.mp3");
    this.load.audio("boom", "assets/boom.mp3");
  }

  create() {
    this.add.rectangle(400, 300, 800, 600, 0x000000);

    this.gameOver = false;
    this.lastCutTime = 0;

    this.score = 0;
    this.highScore = Number(localStorage.getItem("highScore")) || 0;

    // NAME (SAFE)
    this.playerName = localStorage.getItem("playerName");

    if (!this.playerName) {
      this.askName();
      return;
    }

    this.startGame();
  }

  // 🎮 NAME INPUT (PHASER UI - NO DOM FREEZE)
  askName() {
    this.add.text(260, 200, "Enter Your Name", {
      fontSize: "28px",
      color: "#ffffff",
    });

    const box = this.add.rectangle(400, 300, 300, 50, 0xffffff);

    this.nameText = this.add.text(300, 290, "", {
      fontSize: "22px",
      color: "#000",
    });

    this.input.keyboard.on("keydown", (event) => {
      if (event.key === "Backspace") {
        this.nameText.text = this.nameText.text.slice(0, -1);
      } else if (event.key === "Enter") {
        if (!this.nameText.text.trim()) return;

        localStorage.setItem("playerName", this.nameText.text.trim());
        this.scene.restart();
      } else if (event.key.length === 1) {
        this.nameText.text += event.key;
      }
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

    // 🍉 SPAWN SYSTEM
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

    // ✂️ CUT SYSTEM (OPTIMIZED)
    this.input.on("pointermove", (pointer) => {
      if (this.gameOver) return;

      const now = Date.now();
      if (now - this.lastCutTime < 120) return;

      this.fruitGroup.getChildren().forEach((fruit) => {
        if (!fruit || !fruit.texture) return;

        const dx = pointer.x - fruit.x;
        const dy = pointer.y - fruit.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 45) {
          this.lastCutTime = now;

          const key = fruit.texture.key;

          // 💣 BOMB
          if (key === "bomb") {
            this.boomSound.play();
            this.endGame();
            fruit.destroy();
            return;
          }

          // 🍉 NORMAL CUT
          this.cutSound.play();

          this.score++;
          this.scoreText.setText("Score: " + this.score);

          fruit.destroy();
        }
      });
    });
  }

  // 💥 GAME OVER
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
    btn.on("pointerdown", () => {
      this.scene.restart();
    });

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