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

  // ================= MOBILE INPUT =================
  askName() {
    this.add.text(200, 200, "🍉 Fruit Ninja", {
      fontSize: "32px",
      color: "#ffffff",
    });

    this.add.text(240, 250, "Enter Your Name", {
      fontSize: "24px",
      color: "#00ffcc",
    });

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
    wrapper.style.background = "rgba(0,0,0,0.6)";
    wrapper.style.zIndex = "9999";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Enter name...";
    input.style.padding = "12px";
    input.style.fontSize = "18px";
    input.style.borderRadius = "10px";

    const btn = document.createElement("button");
    btn.innerText = "START";
    btn.style.marginLeft = "10px";
    btn.style.padding = "12px";

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

    this.fruitGroup = this.add.group();

    this.add.text(20, 20, "🍉 Fruit Ninja Pro", {
      fontSize: "24px",
      color: "#fff",
    });

    this.add.text(20, 50, "Player: " + this.playerName, {
      fontSize: "18px",
      color: "#00ffcc",
    });

    this.scoreText = this.add.text(20, 80, "Score: 0", {
      fontSize: "20px",
      color: "#fff",
    });

    this.fruits = ["apple","banana","watermelon","strawberry","pineapple","orange","mango","bomb"];

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

  // ================= GAME OVER =================
  endGame() {
    this.gameOver = true;

    this.add.rectangle(400, 300, 800, 600, 0x000000, 0.8);

    this.add.text(250, 200, "GAME OVER", {
      fontSize: "40px",
      color: "#ff0000",
    });

    this.add.text(280, 280, "Score: " + this.score, {
      fontSize: "28px",
      color: "#fff",
    });

    const btn = this.add.text(280, 350, "RESTART", {
      fontSize: "24px",
      backgroundColor: "#00ffcc",
      color: "#000",
      padding: { x: 10, y: 5 },
    });

    btn.setInteractive();
    btn.on("pointerdown", () => this.scene.restart());
  }
}