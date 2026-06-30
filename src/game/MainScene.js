<<<<<<< HEAD
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
    this.add.rectangle(400, 300, 800, 600, 0x000000, 1);

    this.gameOver = false;
    this.lastCutTime = 0;

    this.input.once("pointerdown", () => {
      this.sound.context.resume();
    });

    this.cutSound = this.sound.add("cut");
    this.boomSound = this.sound.add("boom");

    // 👤 NAME
    this.playerName = localStorage.getItem("playerName");

    if (!this.playerName) {
      this.askName();
      return;
    }

    this.startGame();
  }

  askName() {
    const input = document.createElement("input");
    input.placeholder = "Enter your name";
    input.style.position = "absolute";
    input.style.top = "50%";
    input.style.left = "50%";
    input.style.transform = "translate(-50%, -50%)";
    input.style.padding = "10px";
    input.style.fontSize = "18px";

    const btn = document.createElement("button");
    btn.innerText = "Start Game";
    btn.style.position = "absolute";
    btn.style.top = "60%";
    btn.style.left = "50%";
    btn.style.transform = "translate(-50%, -50%)";
    btn.style.padding = "10px 20px";

    document.body.appendChild(input);
    document.body.appendChild(btn);

    btn.onclick = () => {
      const name = input.value.trim();
      if (!name) return;

      localStorage.setItem("playerName", name);

      document.body.removeChild(input);
      document.body.removeChild(btn);

      this.scene.restart();
    };
  }

  startGame() {
    this.score = 0;
    this.highScore = Number(localStorage.getItem("highScore")) || 0;

    this.add.text(20, 20, "🍉 Fruit Ninja Pro", {
      fontSize: "28px",
      color: "#ffffff",
    });

    this.add.text(20, 50, "Player: " + this.playerName, {
      fontSize: "20px",
      color: "#00ffcc",
    });

    this.scoreText = this.add.text(20, 80, "Score: 0", {
      fontSize: "24px",
      color: "#ffffff",
    });

    this.highText = this.add.text(20, 110, "High: " + this.highScore, {
      fontSize: "20px",
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
    this.time.addEvent({
      delay: 750,
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

        this.tweens.add({
          targets: fruit,
          y: 700,
          duration: Phaser.Math.Between(2000, 3200),
          onComplete: () => fruit.destroy(),
        });
      },
    });

    // ✂️ SMOOTH CUT SYSTEM
    this.input.on("pointermove", (pointer) => {
      if (this.gameOver) return;

      const now = Date.now();
      if (now - this.lastCutTime < 120) return;

      this.children.list.forEach((child) => {
        if (!child || !child.texture) return;

        const dx = pointer.x - child.x;
        const dy = pointer.y - child.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 45) {
          this.lastCutTime = now;

          const key = child.texture.key;

          // 💣 BOMB
          if (key === "bomb") {
            this.boomSound.play();
            this.vibrate(300);
            this.endGame();
            child.destroy();
            return;
          }

          // 🍉 FRUIT CUT
          this.cutSound.play();
          this.vibrate(50);

          this.createCutEffect(child.x, child.y, key);

          this.score++;
          this.scoreText.setText("Score: " + this.score);

          child.destroy();
          return;
        }
      });
    });
  }

  // ✂️ 2 PART CUT EFFECT
  createCutEffect(x, y, key) {
    const left = this.add.image(x, y, key).setScale(0.2);
    const right = this.add.image(x, y, key).setScale(0.2);

    this.tweens.add({
      targets: left,
      x: x - 70,
      y: y + 70,
      angle: -120,
      alpha: 0,
      duration: 220,
      onComplete: () => left.destroy(),
    });

    this.tweens.add({
      targets: right,
      x: x + 70,
      y: y + 70,
      angle: 120,
      alpha: 0,
      duration: 220,
      onComplete: () => right.destroy(),
    });
  }

  vibrate(ms) {
    if (navigator.vibrate) navigator.vibrate(ms);
  }

  endGame() {
    this.gameOver = true;

    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem("highScore", this.highScore);
    }

    // 💖 SPECIAL NAMES
    const specialNames = [
      "fuggi",
      "unnati",
      "annu",
      "anu",
      "unnat",
    ];

    let isSpecial = specialNames.includes(
      this.playerName.toLowerCase().trim()
    );

    this.add.rectangle(400, 300, 800, 600, 0x000000, 0.85);

    this.add.text(220, 180, "💔 GAME OVER", {
      fontSize: "40px",
      color: "#ff4d4d",
    });

    if (isSpecial) {
      this.add.text(210, 240, "💖 I LOVE U FUGGI 💖", {
        fontSize: "32px",
        color: "#ff66cc",
      });
    }

    this.add.text(300, 310, "Score: " + this.score, {
      fontSize: "28px",
      color: "#ffffff",
    });

    this.add.text(260, 350, "High: " + this.highScore, {
      fontSize: "24px",
      color: "#ffff00",
    });

    const btn = this.add.text(300, 420, "💖 PLAY AGAIN", {
      fontSize: "26px",
      backgroundColor: "#ff66cc",
      color: "#000",
      padding: { x: 10, y: 5 },
    });

    btn.setInteractive();
    btn.on("pointerdown", () => {
      this.scene.restart();
    });

    const newName = this.add.text(300, 470, "NEW NAME", {
      fontSize: "22px",
      backgroundColor: "#ffff00",
      color: "#000",
      padding: { x: 10, y: 5 },
    });

    newName.setInteractive();
    newName.on("pointerdown", () => {
      localStorage.removeItem("playerName");
      this.scene.restart();
    });
  }
=======
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

  askName() {
    this.add.text(260, 200, "Enter Your Name", {
      fontSize: "28px",
      color: "#fff",
    });

    const input = document.getElementById("nameInput");
    input.style.display = "block";
    input.focus();

    const handler = (e) => {
      if (e.key === "Enter") {
        const name = input.value.trim();
        if (!name) return;

        localStorage.setItem("playerName", name);
        input.style.display = "none";

        input.removeEventListener("keydown", handler);
        this.scene.restart();
      }
    };

    input.addEventListener("keydown", handler);
  }

  startGame() {
    this.cutSound = this.sound.add("cut");
    this.boomSound = this.sound.add("boom");

    this.fruitGroup = this.add.group();

    this.add.text(20, 20, "🍉 Fruit Ninja", { fontSize: "24px", color: "#fff" });

    this.scoreText = this.add.text(20, 60, "Score: 0", {
      fontSize: "20px",
      color: "#fff",
    });

    this.fruits = ["apple", "banana", "watermelon", "strawberry", "pineapple", "orange", "mango", "bomb"];

    this.time.addEvent({
      delay: 700,
      loop: true,
      callback: () => {
        if (this.gameOver) return;

        const key = this.fruits[Math.floor(Math.random() * this.fruits.length)];

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
          duration: 2500,
          onComplete: () => fruit.destroy(),
        });
      },
    });

    this.input.on("pointermove", (pointer) => {
      if (this.gameOver) return;

      this.fruitGroup.getChildren().forEach((fruit) => {
        const dx = pointer.x - fruit.x;
        const dy = pointer.y - fruit.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 45) {
          const key = fruit.texture.key;

          if (key === "bomb") {
            this.gameOver = true;
            this.boomSound.play();
            fruit.destroy();
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
>>>>>>> 23a0a81 (final fix)
}