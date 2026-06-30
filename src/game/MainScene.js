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
}