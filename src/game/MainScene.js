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
    this.load.image("sword", "/assets/sword.png");

    this.load.audio("cut", "/assets/cut.mp3");
    this.load.audio("boom", "/assets/boom.mp3");
  }

  create() {
    this.score = 0;
    this.combo = 0;
    this.gameOver = false;
    this.fruitsGroup = this.add.group();

    this.playerName = localStorage.getItem("playerName");
    this.highScore = Number(localStorage.getItem("highScore")) || 0;

    this.cameras.main.setBackgroundColor("#050814");

    if (!this.playerName) {
      this.showStartScreen();
      return;
    }

    this.startGame();
  }

  // ================= NAME SCREEN =================
  showStartScreen() {
    const wrapper = document.createElement("div");
    wrapper.style.position = "fixed";
    wrapper.style.top = "0";
    wrapper.style.left = "0";
    wrapper.style.width = "100%";
    wrapper.style.height = "100%";
    wrapper.style.background = "rgba(0,0,0,0.9)";
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";
    wrapper.style.justifyContent = "center";
    wrapper.style.alignItems = "center";
    wrapper.style.zIndex = "99999";

    const input = document.createElement("input");
    input.placeholder = "Enter Name";
    input.style.padding = "12px";
    input.style.fontSize = "18px";

    const btn = document.createElement("button");
    btn.innerText = "START";
    btn.style.marginTop = "10px";
    btn.style.padding = "10px 20px";

    wrapper.appendChild(input);
    wrapper.appendChild(btn);
    document.body.appendChild(wrapper);

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
      color: "#fff",
    });

    this.comboText = this.add.text(20, 50, "Combo: x1", {
      fontSize: "18px",
      color: "#ffcc00",
    });

    this.nameText = this.add.text(20, 80, "Player: " + this.playerName, {
      fontSize: "18px",
      color: "#00ffcc",
    });

    this.highText = this.add.text(20, 110, "High Score: " + this.highScore, {
      fontSize: "18px",
      color: "#ffff00",
    });

    this.startRain();
    this.createSword();

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

    // cleanup (prevents crash)
    this.time.addEvent({
      delay: 5000,
      loop: true,
      callback: () => {
        this.children.list.forEach((obj) => {
          if (obj && obj.y > this.scale.height + 100) {
            obj.destroy();
          }
        });
      },
    });

    // SPAWN SYSTEM
    this.spawnEvent = this.time.addEvent({
      delay: 900,
      loop: true,
      callback: () => {
        if (this.gameOver) return;

        const speed = Math.max(800, 2200 - this.score * 20);

        const bombChance = Math.min(0.25, 0.08 + this.score * 0.002);
        const isBomb = Math.random() < bombChance;

        const key = isBomb
          ? "bomb"
          : this.fruits[Math.floor(Math.random() * (this.fruits.length - 1))];

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
          duration: speed,
          onComplete: () => {
            if (!fruit.cut && !this.gameOver) {
              this.combo = 0;
              this.updateUI();
            }
            fruit.destroy();
          },
        });
      },
    });

    // SWIPE SYSTEM (FIXED - NO CRASH)
    this.input.on("pointermove", (pointer) => {
      if (this.gameOver) return;

      this.sword.x = pointer.x;
      this.sword.y = pointer.y;

      this.fruitsGroup.getChildren().forEach((fruit) => {
        if (!fruit || fruit.cut) return;

        const dist = Phaser.Math.Distance.Between(
          pointer.x,
          pointer.y,
          fruit.x,
          fruit.y
        );

        if (dist < 45) {
          if (fruit.texture.key === "bomb") {
            this.endGame();
            return;
          }

          fruit.cut = true;
          this.onFruitCut(fruit);
        }
      });
    });
  }

  // ================= SWORD (REUSED - FIX CRASH) =================
  createSword() {
    this.sword = this.add.image(0, 0, "sword");
    this.sword.setDisplaySize(65, 65);
    this.sword.setAlpha(0.8);
  }

  // ================= CUT LOGIC =================
  onFruitCut(fruit) {
    this.cutSound.play();

    this.combo++;

    const multiplier = Math.min(5, Math.floor(this.combo / 3) + 1);
    this.score += multiplier;

    this.updateUI();

    const left = this.add.image(fruit.x, fruit.y, fruit.texture.key);
    const right = this.add.image(fruit.x, fruit.y, fruit.texture.key);

    left.setScale(0.25);
    right.setScale(0.25);

    this.tweens.add({
      targets: left,
      x: fruit.x - 60,
      alpha: 0,
      duration: 250,
      onComplete: () => left.destroy(),
    });

    this.tweens.add({
      targets: right,
      x: fruit.x + 60,
      alpha: 0,
      duration: 250,
      onComplete: () => right.destroy(),
    });

    fruit.destroy();
  }

  updateUI() {
    this.scoreText.setText("Score: " + this.score);

    const mult = Math.min(5, Math.floor(this.combo / 3) + 1);
    this.comboText.setText("Combo: x" + mult);

    this.updateBackground();
  }

  updateBackground() {
    if (this.score >= 50) {
      this.cameras.main.setBackgroundColor("#0b0f2a");
    } else if (this.score >= 25) {
      this.cameras.main.setBackgroundColor("#1a2a3a");
    } else {
      this.cameras.main.setBackgroundColor("#050814");
    }
  }

  // ================= RAIN =================
  startRain() {
    this.time.addEvent({
      delay: 120,
      loop: true,
      callback: () => {
        if (this.gameOver) return;

        const drop = this.add.rectangle(
          Phaser.Math.Between(0, this.scale.width),
          -10,
          2,
          10,
          0x99ccff,
          0.4
        );

        this.tweens.add({
          targets: drop,
          y: this.scale.height + 20,
          duration: 900,
          onComplete: () => drop.destroy(),
        });
      },
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

    this.add.text(200, 200, "💥 GAME OVER", {
      fontSize: "40px",
      color: "#ff0000",
    });

    this.add.text(200, 260, "Score: " + this.score, {
      fontSize: "24px",
      color: "#ffff00",
    });

    this.add.text(200, 300, "High Score: " + this.highScore, {
      fontSize: "22px",
      color: "#00ffcc",
    });

    const retry = this.add.text(200, 360, "RETRY", {
      fontSize: "24px",
      backgroundColor: "#00ffcc",
      color: "#000",
      padding: { x: 10, y: 5 },
    });

    retry.setInteractive();
    retry.on("pointerdown", () => this.scene.restart());

    const newName = this.add.text(200, 420, "NEW NAME", {
      fontSize: "22px",
      backgroundColor: "#ffcc00",
      color: "#000",
      padding: { x: 10, y: 5 },
    });

    newName.setInteractive();
    newName.on("pointerdown", () => {
      localStorage.removeItem("playerName");
      this.scene.restart();
    });
  }
}