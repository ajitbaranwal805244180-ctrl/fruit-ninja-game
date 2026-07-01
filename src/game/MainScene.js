import Phaser from "phaser";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
  }

  preload() {
    // Existing base asset loading
    this.load.image("apple", "/assets/apple.png");
    this.load.image("banana", "/assets/banana.png");
    this.load.image("watermelon", "/assets/watermelon.png");
    this.load.image("strawberry", "/assets/strawberry.png");
    this.load.image("pineapple", "/assets/pineapple.png");
    this.load.image("orange", "/assets/orange.png");
    this.load.image("bomb", "/assets/bomb.png");
    this.load.image("sword", "/assets/sword.png");
    this.load.image("balloon", "/assets/balloon.png");
    this.load.image("bird", "/assets/bird.png");

    // ==========================================
    // PART 1: NEW ASSETS LOADED
    // ==========================================
    this.load.image("lemon", "/assets/lemon.png");
    this.load.image("chili", "/assets/chili.png");
    this.load.image("tomato", "/assets/tomato.png");
    this.load.image("golden_apple", "/assets/apple.png"); // Golden variant asset
    this.load.image("ice_fruit", "/assets/watermelon.png"); // Ice variant asset
    this.load.image("mango", "/assets/mango.png"); // Mango Asset Integration

    this.load.audio("cut", "/assets/cut.mp3");
    this.load.audio("boom", "/assets/boom.mp3");
    this.load.audio("bird_sound", "/assets/bird.mp3");
    this.load.audio("balloon_sound", "/assets/balloon.mp3");
    
    // Extra audio variants for special events
    this.load.audio("golden_sound", "/assets/cut.mp3"); 
    this.load.audio("combo_milestone_sound", "/assets/cut.mp3");
  }

  create() {
    // Comprehensive Tracking Stats Registry
    this.score = 0;
    this.combo = 0;
    this.gameOver = false;
    this.isPaused = false;
    this.lives = 3;
    
    // Persistent Statistics Pipeline Engine
    this.stats = {
      totalFruitsCut: 0,
      bombsHit: 0,
      highestCombo: 0,
      totalSwipes: 0,
      successfulSwipes: 0,
      sliceReactionTimes: []
    };

    // System Settings Setup
    this.settings = {
      music: true,
      sound: true,
      vibration: true,
      quality: "High"
    };

    this.playerName = localStorage.getItem("playerName") || "Ninja";
    const storedHighScore = localStorage.getItem("highScore");
    this.highScore = storedHighScore ? Number(storedHighScore) : 0;
    if (isNaN(this.highScore)) this.highScore = 0;

    // Environmental Component Configurations (Upgraded to dynamic AAA Aurora gradient setup)
    this.currentBg = { r: 8, g: 10, b: 26 };
    this.targetBg = { r: 8, g: 10, b: 26 };
    this.bgTextureGraphics = this.add.graphics();
    this.drawProceduralGradientSky();

    // Spatial Group Registry Maps
    this.fruitsGroup = this.add.group();
    this.shadowsGroup = this.add.group();
    this.cloudsGroup = this.add.group();
    this.bgSplashGroup = this.add.group();

    // ==========================================
    // PART 6 & 8: SPECIAL STATE PROPERTIES
    // ==========================================
    this.isFruitRushActive = false;
    this.isIceFreezeActive = false;

    // Structural Procedural Texture Generators
    this.generateProceduralTextures();

    // Visual Trail and Controls Setup
    this.createSwordTrailSystem();
    this.createMovingClouds();
    this.createCreativeBackground();

    // Show Beautiful Start Screen UI Layer
    this.showMainMenuScreen();
  }

  // Draw smooth real-time gradient background canvas
  drawProceduralGradientSky() {
    this.bgTextureGraphics.clear();
    const topColor = Phaser.Display.Color.GetColor(this.currentBg.r, this.currentBg.g, this.currentBg.b);
    const bottomColor = Phaser.Display.Color.GetColor(this.currentBg.r + 15, this.currentBg.g + 5, this.currentBg.b + 12);
    this.bgTextureGraphics.fillGradientStyle(topColor, topColor, bottomColor, bottomColor, 1);
    this.bgTextureGraphics.fillRect(0, 0, this.scale.width, this.scale.height);
  }

  // ================= TEXTURE GENERATION MODULE =================
  generateProceduralTextures() {
    if (!this.textures.exists("rain_drop_tx")) {
      let prGraphics = this.make.graphics({ x: 0, y: 0, add: false });
      prGraphics.fillStyle(0xaaddff, 0.4);
      prGraphics.fillRect(0, 0, 2, 14);
      prGraphics.generateTexture("rain_drop_tx", 2, 14);
      prGraphics.destroy();
    }
    if (!this.textures.exists("smoke_particle")) {
      let g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0xffffff, 1);
      g.fillCircle(8, 8, 8);
      g.generateTexture("smoke_particle", 16, 16);
      g.destroy();
    }
    if (!this.textures.exists("splash_texture")) {
      let g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0xffffff, 0.6);
      g.fillEllipse(16, 16, 32, 16);
      g.generateTexture("splash_texture", 32, 32);
      g.destroy();
    }
    // Fire shape generator for Chili
    if (!this.textures.exists("fire_particle")) {
      let g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0xffcc00, 1);
      g.fillRect(0, 0, 6, 6);
      g.generateTexture("fire_particle", 6, 6);
      g.destroy();
    }
    // Confetti square generator for High Score Celebrations
    if (!this.textures.exists("confetti_particle")) {
      let g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0xffffff, 1);
      g.fillRect(0, 0, 8, 8);
      g.generateTexture("confetti_particle", 8, 8);
      g.destroy();
    }
  }

  // ================= BEAUTIFUL ANIMATED START SCREEN (AAA REDESIGN) =================
  showMainMenuScreen() {
    this.menuContainer = this.add.container(0, 0);

    const overlay = this.add.rectangle(this.scale.width / 2, this.scale.height / 2, this.scale.width, this.scale.height, 0x030510, 0.85);
    this.menuContainer.add(overlay);

    // Decorative background moon glow aura
    const moonGlow = this.add.graphics();
    moonGlow.fillStyle(0x00ffcc, 0.06);
    moonGlow.fillCircle(this.scale.width / 2, this.scale.height / 2 - 80, 220);
    this.menuContainer.add(moonGlow);

    // Dynamic drifting menu title fruits decor
    const decorFruits = ["apple", "mango", "orange", "watermelon"];
    decorFruits.forEach((fKey, index) => {
      let itemScale = fKey === "watermelon" ? 0.28 : 0.22;
      let fDecor = this.add.image(this.scale.width * (0.2 + index * 0.2), this.scale.height * 0.25, fKey).setScale(itemScale).setAlpha(0.65);
      this.menuContainer.add(fDecor);
      this.tweens.add({
        targets: fDecor,
        y: fDecor.y + Phaser.Math.Between(15, 30),
        rotation: Phaser.Math.FloatBetween(0.5, 1.5),
        duration: Phaser.Math.Between(2500, 4000),
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut"
      });
    });

    const titleText = this.add.text(this.scale.width / 2, this.scale.height / 2 - 140, "FRUIT SLASH\nAAA CLASSIC", {
      fontSize: "48px",
      color: "#ffcc00",
      fontStyle: "bold",
      align: "center",
      stroke: "#000000",
      strokeThickness: 8
    }).setOrigin(0.5);
    this.menuContainer.add(titleText);

    this.tweens.add({
      targets: titleText,
      y: titleText.y - 12,
      scale: 1.02,
      duration: 1800,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut"
    });

    const nameBtn = this.add.text(this.scale.width / 2, this.scale.height / 2 - 40, `👤 Ninja Identity: ${this.playerName}`, {
      fontSize: "20px",
      color: "#00ffcc",
      backgroundColor: "#111625",
      padding: { x: 16, y: 10 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    this.menuContainer.add(nameBtn);

    // Interactive button hover highlights
    nameBtn.on("pointerover", () => nameBtn.setStyle({ color: "#ffffff", backgroundColor: "#1d253a" }));
    nameBtn.on("pointerout", () => nameBtn.setStyle({ color: "#00ffcc", backgroundColor: "#111625" }));
    nameBtn.on("pointerdown", () => this.showNameConfigOverlay());

    const startBtn = this.add.text(this.scale.width / 2, this.scale.height / 2 + 35, "⚔️ BLADE START", {
      fontSize: "30px",
      color: "#000",
      backgroundColor: "#00ffcc",
      fontStyle: "bold",
      padding: { x: 32, y: 14 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    this.menuContainer.add(startBtn);

    // Continuous button heartbeat pulse glow
    this.tweens.add({
      targets: startBtn,
      scale: 1.06,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: "Quad.easeInOut"
    });

    startBtn.on("pointerover", () => startBtn.setStyle({ backgroundColor: "#ffffff" }));
    startBtn.on("pointerout", () => startBtn.setStyle({ backgroundColor: "#00ffcc" }));

    const statsBtn = this.add.text(this.scale.width / 2 - 80, this.scale.height / 2 + 115, "📊 STATS", {
      fontSize: "16px",
      color: "#fff",
      backgroundColor: "#222736",
      padding: { x: 16, y: 8 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    this.menuContainer.add(statsBtn);
    statsBtn.on("pointerover", () => statsBtn.setStyle({ color: "#ffcc00" }));
    statsBtn.on("pointerout", () => statsBtn.setStyle({ color: "#fff" }));
    statsBtn.on("pointerdown", () => this.showStatisticsOverlay());

    const settingsBtn = this.add.text(this.scale.width / 2 + 80, this.scale.height / 2 + 115, "⚙️ OPTIONS", {
      fontSize: "16px",
      color: "#fff",
      backgroundColor: "#222736",
      padding: { x: 16, y: 8 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    this.menuContainer.add(settingsBtn);
    settingsBtn.on("pointerover", () => settingsBtn.setStyle({ color: "#00ffcc" }));
    settingsBtn.on("pointerout", () => settingsBtn.setStyle({ color: "#fff" }));
    settingsBtn.on("pointerdown", () => this.showUniversalPauseMenu());

    startBtn.on("pointerdown", () => {
      // Elegant cinematic swipe slice transition effect
      let flashLine = this.add.graphics();
      flashLine.lineStyle(8, 0xffffff, 1);
      flashLine.strokeLineShape(new Phaser.Geom.Line(0, this.scale.height/2, this.scale.width, this.scale.height/2));
      
      this.tweens.add({
        targets: flashLine,
        alpha: 0,
        duration: 300,
        onComplete: () => flashLine.destroy()
      });

      this.tweens.add({
        targets: this.menuContainer,
        alpha: 0,
        y: -40,
        duration: 400,
        onComplete: () => {
          this.menuContainer.destroy();
          this.startCountdown();
        }
      });
    });
  }

  showNameConfigOverlay() {
    const wrapper = document.createElement("div");
    wrapper.style.position = "fixed";
    wrapper.style.top = "0";
    wrapper.style.left = "0";
    wrapper.style.width = "100%";
    wrapper.style.height = "100%";
    wrapper.style.background = "rgba(4,6,15,0.95)";
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";
    wrapper.style.justifyContent = "center";
    wrapper.style.alignItems = "center";
    wrapper.style.zIndex = "99999";
    wrapper.style.fontFamily = "sans-serif";

    const input = document.createElement("input");
    input.value = this.playerName;
    input.placeholder = "Enter Ninja Identity";
    input.style.padding = "16px";
    input.style.fontSize = "22px";
    input.style.border = "2px solid #00ffcc";
    input.style.background = "#111";
    input.style.color = "#fff";
    input.style.borderRadius = "8px";
    input.style.textAlign = "center";

    const btn = document.createElement("button");
    btn.innerText = "CONFIRM LOCK";
    btn.style.marginTop = "18px";
    btn.style.padding = "12px 28px";
    btn.style.fontSize = "16px";
    btn.style.background = "#00ffcc";
    btn.style.border = "none";
    btn.style.fontWeight = "bold";
    btn.style.cursor = "pointer";
    btn.style.borderRadius = "6px";

    wrapper.appendChild(input);
    wrapper.appendChild(btn);
    document.body.appendChild(wrapper);

    btn.onclick = () => {
      const name = input.value.trim();
      if (!name) return;
      this.playerName = name;
      localStorage.setItem("playerName", name);
      document.body.removeChild(wrapper);
      this.scene.restart();
    };
  }

  // ================= COUNTDOWN MODULE =================
  startCountdown() {
    this.startRainEffectManager();
    this.createSword();

    const cdText = this.add.text(this.scale.width / 2, this.scale.height / 2, "3", {
      fontSize: "95px",
      color: "#ffcc00",
      fontStyle: "bold"
    }).setOrigin(0.5);

    let count = 3;
    this.time.addEvent({
      delay: 1000,
      repeat: 2,
      callback: () => {
        count--;
        if (count > 0) {
          cdText.setText(count);
          this.tweens.add({ targets: cdText, scale: { start: 1.6, end: 1 }, duration: 250 });
        } else {
          cdText.setText("GO!");
          this.tweens.add({
            targets: cdText,
            scale: { start: 2.0, end: 0 },
            alpha: 0,
            duration: 400,
            onComplete: () => {
              cdText.destroy();
              this.startGameEngine();
            }
          });
        }
      }
    });
  }

  // ================= ENGINE INITIATION =================
  startGameEngine() {
    this.gameStarted = true;
    
    this.cutSound = this.sound.add("cut");
    this.boomSound = this.sound.add("boom");
    this.birdSound = this.sound.add("bird_sound");
    this.balloonSound = this.sound.add("balloon_sound");
    this.goldenSound = this.sound.add("golden_sound");
    this.milestoneSound = this.sound.add("combo_milestone_sound");

    this.scoreText = this.add.text(20, 20, "Score: 0", { fontSize: "24px", color: "#fff", fontStyle: "bold" });
    this.comboText = this.add.text(20, 50, "Combo: x1", { fontSize: "18px", color: "#ffcc00" });
    this.difficultyText = this.add.text(20, 80, "Difficulty: Easy", { fontSize: "15px", color: "#aaa" });

    this.createInteractiveControlHUD();

    this.heartUIElements = [];
    for (let i = 0; i < 3; i++) {
      let heart = this.add.text(this.scale.width - 45 - i * 35, 20, "❤️", { fontSize: "26px" });
      this.heartUIElements.push(heart);
    }

    // ==========================================
    // PART 6: FRUIT RUSH MAIN REPETITIVE SCHEDULER
    // ==========================================
    this.fruitRushTimer = this.time.addEvent({
      delay: Phaser.Math.Between(20000, 30000),
      loop: true,
      callback: () => {
        if (this.gameOver || this.isPaused) return;
        this.triggerFruitRushEvent();
      }
    });

    this.cleanupTimer = this.time.addEvent({
      delay: 4000,
      loop: true,
      callback: () => {
        if (this.isPaused) return;
        this.children.list.forEach((obj) => {
          if (obj && (obj.y > this.scale.height + 150 || obj.x < -150 || obj.x > this.scale.width + 150)) {
            if (obj.customType && !obj.cut && !this.gameOver && obj.customType === "fruit") {
              this.combo = 0;
              this.updateUI();
            }
            this.safeDestroyObjectComponents(obj);
          }
        });
      },
    });

    // AAA PARABOLIC ARC SYSTEM SPAWNER
    this.spawnEvent = this.time.addEvent({
      delay: 1100,
      loop: true,
      callback: () => {
        if (this.gameOver || this.isPaused || this.isFruitRushActive) return;

        let currentDiff = "Easy";
        let spawnDelayBase = 1100;
        let speedModifier = 0;

        if (this.score >= 60) { currentDiff = "Insane"; spawnDelayBase = 650; speedModifier = 200; }
        else if (this.score >= 35) { currentDiff = "Hard"; spawnDelayBase = 800; speedModifier = 100; }
        else if (this.score >= 15) { currentDiff = "Medium"; spawnDelayBase = 950; speedModifier = 50; }

        this.difficultyText.setText("Difficulty: " + currentDiff);
        this.spawnEvent.delay = spawnDelayBase;

        // ==========================================
        // PART 5: MULTI-SPAWN RANDOMIZATION (1-3 FRUITS SIMULTANEOUSLY)
        // ==========================================
        const groupSpawnCount = Phaser.Math.Between(1, 3);
        for (let s = 0; s < groupSpawnCount; s++) {
          const spawnRand = Math.random();

          // --- BALANCING UPDATE CHANGES (REQUIREMENT 1) ---
          if (spawnRand < 0.11) { // 11% Bomb Rate
            this.time.delayedCall(s * 150, () => {
              if (!this.gameOver && !this.isPaused) this.launchBombItem(speedModifier);
            });
          } else if (spawnRand < 0.145) { // ~3.5% Bird Rate
            this.time.delayedCall(s * 150, () => {
              if (!this.gameOver && !this.isPaused) this.spawnHorizontalFlyingBird();
            });
          } else if (spawnRand < 0.18) { // ~3.5% Balloon Rate
            this.time.delayedCall(s * 150, () => {
              if (!this.gameOver && !this.isPaused) this.spawnTopDownFloatingBalloon();
            });
          } else { // 82% Core Fruits
            let key = this.getWeightedFruitSelection();
            this.time.delayedCall(s * Phaser.Math.Between(100, 250), () => {
              if (!this.gameOver && !this.isPaused) {
                this.launchItemWithArcTrajectory(key, "fruit", speedModifier);
              }
            });
          }
        }
      }
    });

    this.input.on("pointerdown", () => { this.stats.totalSwipes++; });
    
    this.handlePointerMove = (pointer) => {
      if (this.gameOver || this.isPaused) return;

      if (this.sword) {
        this.sword.x = pointer.x;
        this.sword.y = pointer.y;
      }
      
      this.trailPoints.push({ x: pointer.x, y: pointer.y, alpha: 1.0 });
      if (this.trailPoints.length > this.maxTrailPoints) this.trailPoints.shift();

      this.fruitsGroup.getChildren().forEach((item) => {
        if (!item || item.cut) return;

        const dist = Phaser.Math.Distance.Between(pointer.x, pointer.y, item.x, item.y);
        if (dist < 48) {
          item.cut = true;
          this.stats.successfulSwipes++;

          if (item.customType === "bomb") {
            this.stats.bombsHit++;
            this.triggerDeviceVibration(260);
            this.executeAAAExplosionPipeline(item.x, item.y);
            this.endGame();
            return;
          }

          if (item.customType === "bird" || item.customType === "balloon") {
            this.triggerDeviceVibration(45);
            if (this.settings.sound && this.birdSound) this.birdSound.play();
            if (item.customType === "balloon" && this.settings.sound && this.balloonSound) this.balloonSound.play();
            this.cameras.main.flash(150, 255, 100, 100);
            this.loseLife(item);
            return;
          }

          if (item.launchTime) {
            this.stats.sliceReactionTimes.push(this.time.now - item.launchTime);
          }

          this.triggerDeviceVibration(12);
          this.executeFruitSlicePipeline(item, pointer);
        }
      });
    };

    this.input.on("pointermove", this.handlePointerMove);
  }

  launchBombItem(speedModifier) {
    this.launchItemWithArcTrajectory("bomb", "bomb", speedModifier);
  }

  // ==========================================
  // PART 2: ADVANCED SEPARATED PATTERN SYSTEMS FOR BIRD & BALLOON
  // ==========================================
  spawnHorizontalFlyingBird() {
    const isLeftStart = Math.random() < 0.5;
    const startX = isLeftStart ? -60 : this.scale.width + 60;
    const targetX = isLeftStart ? this.scale.width + 100 : -100;
    const startY = Phaser.Math.Between(100, this.scale.height * 0.55);

    const bird = this.add.image(startX, startY, "bird").setScale(0.25);
    bird.customType = "bird";
    bird.launchTime = this.time.now;
    this.fruitsGroup.add(bird);

    if (!isLeftStart) bird.setFlipX(true);

    const flightDuration = Phaser.Math.Between(2950, 4700);

    this.tweens.add({
      targets: bird,
      x: targetX,
      duration: flightDuration,
      ease: "Linear",
      onComplete: () => this.safeDestroyObjectComponents(bird)
    });

    this.tweens.add({
      targets: bird,
      y: startY + Phaser.Math.Between(30, 60),
      duration: Phaser.Math.Between(450, 780),
      yoyo: true,
      repeat: Math.ceil(flightDuration / 500),
      ease: "Sine.easeInOut"
    });

    this.tweens.add({
      targets: bird,
      scaleY: 0.17,
      duration: 150,
      yoyo: true,
      repeat: -1,
      ease: "Quad.easeInOut"
    });
  }

  spawnTopDownFloatingBalloon() {
    const startX = Phaser.Math.Between(80, this.scale.width - 80);
    const startY = -60;

    const balloon = this.add.image(startX, startY, "balloon").setScale(0.24);
    balloon.customType = "balloon";
    balloon.launchTime = this.time.now;
    this.fruitsGroup.add(balloon);

    const fallDuration = Phaser.Math.Between(4250, 6200);

    this.tweens.add({
      targets: balloon,
      y: this.scale.height + 100,
      duration: fallDuration,
      ease: "Quad.easeOut",
      onComplete: () => this.safeDestroyObjectComponents(balloon)
    });

    this.tweens.add({
      targets: balloon,
      x: startX + Phaser.Math.Between(30, 70) * (Math.random() < 0.5 ? 1 : -1),
      duration: Phaser.Math.Between(1100, 1800),
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut"
    });

    this.tweens.add({
      targets: balloon,
      scaleX: 0.26,
      scaleY: 0.22,
      duration: 750,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut"
    });
  }

  getWeightedFruitSelection() {
    const roll = Math.random();

    if (roll < 0.05) return "golden_apple";
    if (roll < 0.10) return "ice_fruit";

    const fruitRoll = Math.random();
    if (fruitRoll < 0.45) {
      return ["apple", "banana", "orange", "mango"][Phaser.Math.Between(0, 3)];
    } else if (fruitRoll < 0.75) {
      return ["tomato", "lemon", "strawberry"][Phaser.Math.Between(0, 2)];
    } else if (fruitRoll < 0.96) {
      return ["watermelon", "pineapple"][Phaser.Math.Between(0, 1)];
    } else {
      return "chili";
    }
  }

  launchItemWithArcTrajectory(key, spawnType, speedModifier) {
    const isLeftLaunch = Math.random() < 0.5;
    
    const startX = isLeftLaunch ? Phaser.Math.Between(30, this.scale.width * 0.4) : Phaser.Math.Between(this.scale.width * 0.6, this.scale.width - 30);
    const startY = this.scale.height + 50;

    const targetX = isLeftLaunch ? startX + Phaser.Math.Between(80, 350) : startX - Phaser.Math.Between(80, 350);
    const peakY = Phaser.Math.Between(80, this.scale.height * 0.6);

    const item = this.add.image(startX, startY, key);
    
    let itemScale = 0.25;
    switch (key) {
      case "apple": case "orange": itemScale = 0.25; break;
      case "banana": case "tomato": itemScale = 0.24; break;
      case "mango": itemScale = 0.27; break;
      case "lemon": itemScale = 0.20; break;
      case "chili": case "strawberry": itemScale = 0.18; break;
      case "watermelon": itemScale = 0.32; break;
      case "pineapple": itemScale = 0.30; break;
      case "golden_apple": itemScale = 0.26; break;
      case "ice_fruit": itemScale = 0.30; break;
    }
    item.setScale(itemScale);

    item.customType = spawnType;
    item.launchTime = this.time.now;

    const shadow = this.add.ellipse(startX, startY, 44, 14, 0x000000, 0.25);
    item.shadowRef = shadow;
    this.shadowsGroup.add(shadow);

    if (spawnType === "bomb" || key === "golden_apple" || key === "ice_fruit") {
      const glow = this.add.graphics();
      let strokeColor = 0xffaa00;
      if (key === "ice_fruit") strokeColor = 0x00aaff;
      glow.lineStyle(5, strokeColor, 0.65);
      glow.strokeCircle(0, 0, 32);
      item.glowRef = glow;
    }

    this.fruitsGroup.add(item);

    let speedScalar = 1.125;
    if (spawnType === "bomb") {
      speedScalar = 1.09;
    }

    const totalDuration = (Phaser.Math.Between(1900, 2500) - speedModifier) * speedScalar;

    this.tweens.add({
      targets: item,
      x: targetX,
      duration: totalDuration,
      ease: "Linear"
    });

    this.tweens.add({
      targets: item,
      y: peakY,
      duration: totalDuration * 0.45,
      ease: "Quad.easeOut",
      yoyo: true,
      hold: Phaser.Math.Between(20, 60),
      onComplete: () => {
        this.safeDestroyObjectComponents(item);
      }
    });

    const rotationDirection = Math.random() < 0.5 ? 1 : -1;
    const rotationSpeedMagnitude = Phaser.Math.FloatBetween(1.5, 5.0);
    const targetRotation = rotationDirection * rotationSpeedMagnitude;

    this.tweens.add({
      targets: item,
      rotation: targetRotation,
      duration: totalDuration,
      ease: "Linear"
    });
  }

  triggerFruitRushEvent() {
    this.isFruitRushActive = true;
    
    const rushAnnouncement = this.add.text(this.scale.width / 2, this.scale.height / 3, "FRUIT RUSH!", {
      fontSize: "52px",
      color: "#ff3300",
      fontStyle: "bold",
      stroke: "#ffff00",
      strokeThickness: 6
    }).setOrigin(0.5);

    this.tweens.add({
      targets: rushAnnouncement,
      scale: 1.3,
      alpha: 0,
      duration: 1800,
      ease: "Quad.easeIn",
      onComplete: () => { if (rushAnnouncement && rushAnnouncement.destroy) rushAnnouncement.destroy(); }
    });

    for (let i = 0; i < 16; i++) {
      this.time.delayedCall(i * 250, () => {
        if (!this.gameOver && !this.isPaused) {
          const rushFruitKey = this.getWeightedFruitSelection();
          this.launchItemWithArcTrajectory(rushFruitKey, "fruit", 300);
        }
      });
    }

    this.time.delayedCall(5000, () => {
      this.isFruitRushActive = false;
    });
  }

  createInteractiveControlHUD() {
    this.hudPauseBtn = this.add.text(this.scale.width - 120, 65, "⏸️ MENU", {
      fontSize: "14px",
      backgroundColor: "#151515",
      padding: { x: 8, y: 5 }
    }).setInteractive({ useHandCursor: true });

    this.hudPauseBtn.on("pointerdown", () => this.showUniversalPauseMenu());
  }

  showUniversalPauseMenu() {
    if (this.isPaused) return;
    this.isPaused = true;
    
    this.tweens.pauseAll();
    if (this.rainEmitter) this.rainEmitter.stop();

    this.pauseContainer = this.add.container(0, 0);

    const cover = this.add.rectangle(this.scale.width / 2, this.scale.height / 2, this.scale.width, this.scale.height, 0x000000, 0.85);
    this.pauseContainer.add(cover);

    const pTitle = this.add.text(this.scale.width / 2, 140, "PAUSE CONTROL", { fontSize: "36px", fontStyle: "bold", color: "#fff" }).setOrigin(0.5);
    this.pauseContainer.add(pTitle);

    const soundToggle = this.add.text(this.scale.width / 2, 210, `Sound FX: ${this.settings.sound ? "ON" : "OFF"}`, { fontSize: "18px", color: "#00ffcc" }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    this.pauseContainer.add(soundToggle);
    soundToggle.on("pointerdown", () => {
      this.settings.sound = !this.settings.sound;
      soundToggle.setText(`Sound FX: ${this.settings.sound ? "ON" : "OFF"}`);
    });

    const vibToggle = this.add.text(this.scale.width / 2, 250, `Vibration: ${this.settings.vibration ? "ON" : "OFF"}`, { fontSize: "18px", color: "#00ffcc" }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    this.pauseContainer.add(vibToggle);
    vibToggle.on("pointerdown", () => {
      this.settings.vibration = !this.settings.vibration;
      vibToggle.setText(`Vibration: ${this.settings.vibration ? "ON" : "OFF"}`);
    });

    const qualToggle = this.add.text(this.scale.width / 2, 290, `Graphics Quality: ${this.settings.quality}`, { fontSize: "18px", color: "#ffcc00" }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    this.pauseContainer.add(qualToggle);
    qualToggle.on("pointerdown", () => {
      this.settings.quality = this.settings.quality === "High" ? "Low" : "High";
      qualToggle.setText(`Graphics Quality: ${this.settings.quality}`);
    });

    const resumeBtn = this.add.text(this.scale.width / 2, 360, "▶️ RESUME Slicing", { fontSize: "22px", backgroundColor: "#00aa55", padding: { x: 16, y: 8 } }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    this.pauseContainer.add(resumeBtn);
    resumeBtn.on("pointerdown", () => {
      this.isPaused = false;
      this.tweens.resumeAll();
      if (this.rainEmitter) this.rainEmitter.start();
      this.pauseContainer.destroy();
    });

    const restartBtn = this.add.text(this.scale.width / 2, 420, "🔄 RESTART Blade", { fontSize: "16px", backgroundColor: "#333", padding: { x: 12, y: 6 } }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    this.pauseContainer.add(restartBtn);
    restartBtn.on("pointerdown", () => {
      this.isPaused = false;
      if (this.pauseContainer) this.pauseContainer.destroy();
      this.scene.restart();
    });
  }

  createSwordTrailSystem() {
    this.trailGraphics = this.add.graphics();
    this.trailPoints = [];
    this.maxTrailPoints = 20;
  }

  createJuiceSplashDecal(x, y, colorHex) {
    let splash = this.add.image(x, y, "splash_texture");
    splash.setTint(colorHex);
    splash.setAngle(Phaser.Math.Between(0, 360));
    splash.setScale(Phaser.Math.FloatBetween(0.4, 0.95));
    splash.setAlpha(0.7);
    this.bgSplashGroup.add(splash);

    this.tweens.add({
      targets: splash,
      alpha: 0,
      duration: 7000,
      delay: 3000,
      onComplete: () => { if (splash && splash.destroy) splash.destroy(); }
    });
  }

  executeAAAExplosionPipeline(x, y) {
    let sw = this.add.graphics();
    sw.lineStyle(6, 0xffffff, 0.9);
    sw.strokeCircle(x, y, 10);
    this.tweens.add({
      targets: sw,
      scale: 12,
      alpha: 0,
      duration: 500,
      onComplete: () => { if (sw && sw.destroy) sw.destroy(); }
    });

    for (let i = 0; i < 12; i++) {
      let d = this.add.rectangle(x, y, Phaser.Math.Between(6, 12), Phaser.Math.Between(6, 12), 0x222222);
      this.tweens.add({
        targets: d,
        x: x + Phaser.Math.Between(-180, 180),
        y: y + Phaser.Math.Between(-180, 180),
        rotation: Phaser.Math.FloatBetween(-4, 4),
        alpha: 0,
        duration: 800,
        onComplete: () => { if (d && d.destroy) d.destroy(); }
      });
    }

    for (let j = 0; j < 16; j++) {
      let sm = this.add.image(x, y, "smoke_particle").setTint(0x555555).setAlpha(0.5);
      this.tweens.add({
        targets: sm,
        x: x + Phaser.Math.Between(-120, 120),
        y: y + Phaser.Math.Between(-140, 60),
        scale: 4.5,
        alpha: 0,
        duration: Phaser.Math.Between(700, 1200),
        onComplete: () => { if (sm && sm.destroy) sm.destroy(); }
      });
    }
  }

  executeCriticalSlashVisuals(x, y) {
    this.cameras.main.flash(160, 255, 255, 255);
    
    this.cameras.main.setZoom(1.05);
    this.time.delayedCall(160, () => {
      this.cameras.main.setZoom(1.0);
    });

    const critText = this.add.text(x, y - 40, "CRITICAL!", {
      fontSize: "34px",
      color: "#ff0055",
      fontStyle: "bold",
      stroke: "#fff",
      strokeThickness: 4
    }).setOrigin(0.5);

    this.tweens.add({
      targets: critText,
      scale: 1.5,
      alpha: 0,
      duration: 600,
      onComplete: () => { if (critText && critText.destroy) critText.destroy(); }
    });
  }

  update(time, delta) {
    if (this.currentBg.r !== this.targetBg.r || this.currentBg.g !== this.targetBg.g || this.currentBg.b !== this.targetBg.b) {
      this.currentBg.r = Math.round(Phaser.Math.Linear(this.currentBg.r, this.targetBg.r, 0.05));
      this.currentBg.g = Math.round(Phaser.Math.Linear(this.currentBg.g, this.targetBg.g, 0.05));
      this.currentBg.b = Math.round(Phaser.Math.Linear(this.currentBg.b, this.targetBg.b, 0.05));
      this.drawProceduralGradientSky();
    }

    if (!this.isPaused && this.stars) {
      this.stars.forEach(star => {
        star.alpha += star.twinkleDir * star.twinkleSpeed;
        if (star.alpha >= 0.95) { star.alpha = 0.95; star.twinkleDir = -1; }
        if (star.alpha <= 0.1) { star.alpha = 0.1; star.twinkleDir = 1; }
      });
    }

    if (!this.isPaused && this.cloudsGroup) {
      this.cloudsGroup.getChildren().forEach(cloud => {
        cloud.x += cloud.speed;
        if (cloud.x - cloud.width / 2 > this.scale.width) cloud.x = -cloud.width / 2;
      });
    }

    if (this.trailGraphics) {
      this.trailGraphics.clear();
      if (this.trailPoints.length > 1 && !this.isPaused && !this.gameOver) {
        for (let i = 1; i < this.trailPoints.length; i++) {
          let ptA = this.trailPoints[i - 1];
          let ptB = this.trailPoints[i];
          ptA.alpha -= 0.04;

          if (ptA.alpha <= 0) continue;

          this.trailGraphics.lineStyle(i * 2.2, 0x00ffff, ptA.alpha * 0.45);
          this.trailGraphics.beginPath();
          this.trailGraphics.moveTo(ptA.x, ptA.y);
          this.trailGraphics.lineTo(ptB.x, ptB.y);
          this.trailGraphics.strokePath();

          this.trailGraphics.lineStyle(i * 0.8, 0xffffff, ptA.alpha * 0.95);
          this.trailGraphics.strokePath();
        }
        this.trailPoints = this.trailPoints.filter(p => p.alpha > 0);
      }
    }

    if (this.gameOver || this.isPaused) return;

    this.fruitsGroup.getChildren().forEach((item) => {
      if (item && !item.cut && item.customType !== "bird" && item.customType !== "balloon") {
        if (item.shadowRef) {
          item.shadowRef.x = item.x;
          item.shadowRef.y = this.scale.height - 35;
        }
        if (item.glowRef) {
          item.glowRef.x = item.x;
          item.glowRef.y = item.y;
          item.glowRef.alpha = 0.4 + Math.sin(time * 0.015) * 0.25;
        }
      }
    });
  }

  executeFruitSlicePipeline(fruit, pointer) {
    let key = fruit.texture.key;
    
    if (key === "golden_apple") {
      if (this.settings.sound && this.goldenSound) this.goldenSound.play();
      this.score += 10;
      this.showFloatingScoreText(fruit.x, fruit.y, 10);
      this.spawnHighFidelityFruitJuiceParticles(fruit.x, fruit.y, 0xffff00, 20);
      this.terminateSlicedFruitPresentation(fruit);
      this.updateUI();
      return;
    }

    if (key === "ice_fruit") {
      if (this.settings.sound && this.cutSound) this.cutSound.play();
      this.cameras.main.flash(200, 0, 170, 255);
      this.triggerAAASlowMotionImpulse();
      this.spawnHighFidelityFruitJuiceParticles(fruit.x, fruit.y, 0x00ccff, 22);
      this.terminateSlicedFruitPresentation(fruit);
      this.updateUI();
      return;
    }

    if (this.settings.sound && this.cutSound) this.cutSound.play();
    this.combo++;
    this.stats.totalFruitsCut++;

    if (this.combo > this.stats.highestCombo) this.stats.highestCombo = this.combo;

    let calculatedMultiplier = Math.min(5, Math.floor(this.combo / 3) + 1);
    if (this.isFruitRushActive) {
      calculatedMultiplier *= 2;
    }
    this.score += calculatedMultiplier;

    if (this.combo === 3 || this.combo === 5 || this.combo === 8 || this.combo === 12) {
      this.cameras.main.shake(180, 0.012);
      if (this.settings.sound && this.milestoneSound) this.milestoneSound.play();
    }

    const isCritical = Math.random() < 0.08;
    if (isCritical) {
      this.score += 10;
      this.executeCriticalSlashVisuals(fruit.x, fruit.y);
    }

    this.showFloatingScoreText(fruit.x, fruit.y, calculatedMultiplier);
    if (this.combo % 3 === 0) this.displayFloatingComboPopup(calculatedMultiplier);

    let juiceColor = 0xffa500;
    let particleCount = 12;

    switch (key) {
      case "watermelon": juiceColor = 0xff2222; particleCount = 25; break;
      case "apple": juiceColor = 0xff0000; break;
      case "banana": juiceColor = 0xffff22; break;
      case "mango": juiceColor = 0xffc300; particleCount = 20; break;
      case "strawberry": juiceColor = 0xff1166; break;
      case "pineapple": juiceColor = 0xffcc11; break;
      case "orange": juiceColor = 0xffa500; break;
      case "lemon": juiceColor = 0xffff66; particleCount = 18; break;
      case "tomato": juiceColor = 0xdd0000; particleCount = 18; break;
      case "chili": juiceColor = 0xff3300; particleCount = 20; break;
    }

    this.createJuiceSplashDecal(fruit.x, fruit.y, juiceColor);
    
    if (key === "chili") {
      this.spawnChiliFireParticles(fruit.x, fruit.y);
    } else {
      this.spawnHighFidelityFruitJuiceParticles(fruit.x, fruit.y, juiceColor, particleCount);
    }

    this.updateUI();
    this.terminateSlicedFruitPresentation(fruit);
  }

  spawnHighFidelityFruitJuiceParticles(x, y, colorHex, count = 12) {
    if (this.settings.quality === "Low") return;
    for (let i = 0; i < count; i++) {
      let p = this.add.rectangle(x, y, Phaser.Math.Between(4, 8), Phaser.Math.Between(4, 8), colorHex);
      let vX = Phaser.Math.Between(-200, 200);
      let vY = Phaser.Math.Between(-300, 40);

      this.tweens.add({
        targets: p,
        x: p.x + vX * 0.55,
        y: p.y + vY * 0.55,
        alpha: 0,
        scale: 0,
        duration: Phaser.Math.Between(450, 750),
        onComplete: () => { if (p && p.destroy) p.destroy(); }
      });
    }
  }

  spawnChiliFireParticles(x, y) {
    if (this.settings.quality === "Low") return;
    for (let i = 0; i < 20; i++) {
      let f = this.add.image(x, y, "fire_particle");
      let vX = Phaser.Math.Between(-150, 150);
      let vY = Phaser.Math.Between(-250, -20);
      
      this.tweens.add({
        targets: f,
        x: x + vX * 0.6,
        y: y + vY * 0.6,
        scale: { start: 1.5, end: 0 },
        alpha: 0,
        duration: Phaser.Math.Between(400, 700),
        onComplete: () => { if (f && f.destroy) f.destroy(); }
      });
    }
  }

  terminateSlicedFruitPresentation(fruit) {
    const leftPart = this.add.image(fruit.x, fruit.y, fruit.texture.key).setScale(fruit.scaleX);
    const rightPart = this.add.image(fruit.x, fruit.y, fruit.texture.key).setScale(fruit.scaleX);

    leftPart.setCrop(0, 0, fruit.width / 2, fruit.height);
    rightPart.setCrop(fruit.width / 2, 0, fruit.width, fruit.height);

    this.tweens.add({
      targets: leftPart,
      x: fruit.x - 110,
      y: fruit.y + 240,
      rotation: -3.2,
      alpha: 0,
      duration: 650,
      ease: "Quad.easeIn",
      onComplete: () => { if (leftPart && leftPart.destroy) leftPart.destroy(); }
    });

    this.tweens.add({
      targets: rightPart,
      x: fruit.x + 110,
      y: fruit.y + 240,
      rotation: 3.2,
      alpha: 0,
      duration: 650,
      ease: "Quad.easeIn",
      onComplete: () => { if (rightPart && rightPart.destroy) rightPart.destroy(); }
    });

    this.safeDestroyObjectComponents(fruit);
  }

  triggerAAASlowMotionImpulse() {
    this.tweens.timeScale = 0.35;
    this.time.delayedCall(4000, () => {
      this.tweens.timeScale = 1.0;
    });
  }

  showFloatingScoreText(x, y, val) {
    const fsTxt = this.add.text(x, y, `+${val}`, { fontSize: "26px", color: "#00ff00", fontStyle: "bold" }).setOrigin(0.5);
    this.tweens.add({
      targets: fsTxt,
      y: y - 70,
      scale: 1.6,
      alpha: 0,
      duration: 550,
      onComplete: () => { if (fsTxt && fsTxt.destroy) fsTxt.destroy(); }
    });
  }

  displayFloatingComboPopup(mult) {
    const cbTxt = this.add.text(this.scale.width / 2, 190, `COMBO x${mult}`, {
      fontSize: "38px",
      color: "#ffcc00",
      fontStyle: "bold",
      stroke: "#000000",
      strokeThickness: 5
    }).setOrigin(0.5);

    this.tweens.add({
      targets: cbTxt,
      scale: { start: 0.2, end: 1.3 },
      alpha: { start: 1, end: 0 },
      duration: 800,
      onComplete: () => { if (cbTxt && cbTxt.destroy) cbTxt.destroy(); }
    });
  }

  createCreativeBackground() {
    this.stars = [];
    for (let i = 0; i < 45; i++) {
      let star = this.add.rectangle(
        Phaser.Math.Between(0, this.scale.width),
        Phaser.Math.Between(0, this.scale.height),
        2,
        2,
        0xffffff,
        Phaser.Math.FloatBetween(0.2, 0.7)
      );
      star.twinkleDir = Math.random() < 0.5 ? 1 : -1;
      star.twinkleSpeed = Phaser.Math.FloatBetween(0.006, 0.022);
      this.stars.push(star);
    }
  }

  createMovingClouds() {
    for (let i = 0; i < 4; i++) {
      let cloud = this.add.ellipse(Phaser.Math.Between(0, this.scale.width), Phaser.Math.Between(40, 220), Phaser.Math.Between(110, 180), Phaser.Math.Between(40, 60), 0xffffff, 0.08);
      cloud.speed = Phaser.Math.FloatBetween(0.12, 0.38);
      this.cloudsGroup.add(cloud);
    }
  }

  createSword() {
    this.sword = this.add.image(0, 0, "sword");
    this.sword.setDisplaySize(65, 65);
    this.sword.setAlpha(0.8);
  }

  startRainEffectManager() {
    this.rainEmitter = this.add.particles(0, -20, "rain_drop_tx", {
      x: { min: 0, max: this.scale.width },
      speedY: { min: 460, max: 660 },
      speedX: { min: 20, max: 50 },
      lifespan: 1300,
      frequency: 35,
      scale: 1
    });
  }

  loseLife(item) {
    if (this.gameOver) return;

    this.lives--;
    this.combo = 0;

    if (this.heartUIElements && this.heartUIElements[this.lives]) {
      this.heartUIElements[this.lives].setText("🤍").setAlpha(0.4);
    }

    this.safeDestroyObjectComponents(item);
    if (this.lives <= 0) this.endGame();
    else this.updateUI();
  }

  updateUI() {
    if (this.scoreText) this.scoreText.setText("Score: " + this.score);
    const calculatedMultiplier = Math.min(5, Math.floor(this.combo / 3) + 1);
    if (this.comboText) this.comboText.setText("Combo: x" + calculatedMultiplier);

    if (this.score >= 50) this.targetBg = { r: 32, g: 9, b: 38 };
    else if (this.score >= 25) this.targetBg = { r: 11, g: 35, b: 30 };
    else this.targetBg = { r: 8, g: 10, b: 26 };
  }

  triggerDeviceVibration(duration) {
    if (this.settings.vibration && navigator.vibrate) {
      navigator.vibrate(duration);
    }
  }

  safeDestroyObjectComponents(obj) {
    if (!obj) return;
    if (obj.shadowRef && obj.shadowRef.destroy) {
      obj.shadowRef.destroy();
      obj.shadowRef = null;
    }
    if (obj.glowRef && obj.glowRef.destroy) {
      obj.glowRef.destroy();
      obj.glowRef = null;
    }
    if (obj.destroy) obj.destroy();
  }

  showStatisticsOverlay() {
    const overlayContainer = this.add.container(0, 0);
    const panelBg = this.add.rectangle(this.scale.width / 2, this.scale.height / 2, this.scale.width * 0.85, this.scale.height * 0.75, 0x0a0a14, 0.95);
    overlayContainer.add(panelBg);

    const cX = this.scale.width / 2;
    const cY = this.scale.height / 2;

    const accuracy = this.stats.totalSwipes > 0 ? Math.round((this.stats.successfulSwipes / this.stats.totalSwipes) * 100) : 100;
    const avgReaction = this.stats.sliceReactionTimes.length > 0 ? Math.round(this.stats.sliceReactionTimes.reduce((a, b) => a + b, 0) / this.stats.sliceReactionTimes.length) : 0;

    const statsText = 
      `--- HISTORICAL DOJO RECORDS ---\n\n` +
      `Slices Logged: ${this.stats.totalFruitsCut}\n` +
      `Detonations Encountered: ${this.stats.bombsHit}\n` +
      `Highest Combo Linked: ${this.stats.highestCombo}\n` +
      `Blade Accuracy Quotient: ${accuracy}%\n` +
      `Mean Reaction Windows: ${avgReaction} ms`;

    const txtDisp = this.add.text(cX, cY - 20, statsText, { fontSize: "16px", color: "#ffffff", align: "center", lineSpacing: 8 }).setOrigin(0.5);
    overlayContainer.add(txtDisp);

    const closeBtn = this.add.text(cX, cY + 140, "✖️ CLOSE SHEET", { fontSize: "16px", backgroundColor: "#e22", padding: { x: 12, y: 6 } }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    overlayContainer.add(closeBtn);
    closeBtn.on("pointerdown", () => overlayContainer.destroy());
  }

  endGame() {
    this.gameOver = true;
    if (this.settings.sound && this.boomSound) this.boomSound.play();

    // REMOVED POINTERMOVE CRASH RISK: Unregister events instantly
    this.input.off("pointermove", this.handlePointerMove);

    this.tweens.timeScale = 1.0; 
    this.time.removeAllEvents();
    if (this.cleanupTimer) this.cleanupTimer.remove();
    if (this.spawnEvent) this.spawnEvent.remove();
    if (this.fruitRushTimer) this.fruitRushTimer.remove();
    if (this.rainEmitter) this.rainEmitter.stop();

    this.fruitsGroup.clear(true, true);
    this.shadowsGroup.clear(true, true);
    this.cloudsGroup.clear(true, true);
    this.bgSplashGroup.clear(true, true);
    if (this.trailGraphics) this.trailGraphics.clear();

    let medalTier = "🥉 Bronze";
    if (this.score >= 60) medalTier = "💎 Diamond Elite";
    else if (this.score >= 35) medalTier = "🥇 Gold Slasher";
    else if (this.score >= 15) medalTier = "🥈 Silver Blade";

    let isNewRecordBroken = false;
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem("highScore", this.highScore.toString());
      isNewRecordBroken = true;
    }

    const endPanelContainer = this.add.container(0, 50).setAlpha(0);

    const glassPanel = this.add.rectangle(this.scale.width / 2, this.scale.height / 2, this.scale.width * 0.9, this.scale.height * 0.85, 0x070c1f, 0.92);
    glassPanel.setStrokeStyle(2, 0x00ffcc, 0.4);
    endPanelContainer.add(glassPanel);

    const cY = this.scale.height / 2;
    const cX = this.scale.width / 2;

    const mainHeader = this.add.text(cX, cY - 180, "💥 COMBAT TERMINATED", { fontSize: "32px", color: "#ff2222", fontStyle: "bold" }).setOrigin(0.5);
    endPanelContainer.add(mainHeader);

    if (isNewRecordBroken) {
      const victoryCelebrationHeader = this.add.text(cX, cY - 225, "🎉 NEW HIGH RECORD OVERTHROWN! 🎉", { fontSize: "20px", color: "#fff500", fontStyle: "bold" }).setOrigin(0.5);
      endPanelContainer.add(victoryCelebrationHeader);

      this.tweens.add({
        targets: victoryCelebrationHeader,
        scale: 1.1,
        yoyo: true,
        repeat: -1,
        duration: 400
      });

      // FIXED INFINITE LOOP: 'i' variable swapped perfectly to local loop condition 'c'
      for (let c = 0; c < 30; c++) {
        let conf = this.add.image(Phaser.Math.Between(50, this.scale.width-50), Phaser.Math.Between(20, 150), "confetti_particle");
        if (conf) {
          conf.setTint(Phaser.Math.RND.pick([0xff00cc, 0x00ffcc, 0xffff00, 0xff0000]));
          this.tweens.add({
            targets: conf,
            y: this.scale.height + 20,
            rotation: 6,
            duration: Phaser.Math.Between(1500, 3000),
            ease: "Quad.easeIn",
            onComplete: () => { if (conf && conf.destroy) conf.destroy(); }
          });
        }
      }
    }

    let meritText = "Milestone: Slasher Recruit";
    if (this.stats.totalFruitsCut >= 50) meritText = "🏆 Milestone: Grandmaster (50+ Cut)";
    else if (this.stats.highestCombo >= 4) meritText = "⚡ Milestone: Combo Catalyst Linked";

    const meritDisplay = this.add.text(cX, cY - 135, meritText, { fontSize: "15px", color: "#00ffcc", fontStyle: "bold" }).setOrigin(0.5);
    endPanelContainer.add(meritDisplay);

    const mText = this.add.text(cX, cY - 95, `Rank Awarded: ${medalTier}`, { fontSize: "20px", color: "#ffcc00", fontStyle: "bold" }).setOrigin(0.5);
    endPanelContainer.add(mText);

    const sText = this.add.text(cX, cY - 50, `Current Score: 0`, { fontSize: "22px", color: "#ffffff", fontStyle: "bold" }).setOrigin(0.5);
    endPanelContainer.add(sText);
    let countObj = { val: 0 };
    this.tweens.add({
      targets: countObj,
      val: this.score,
      duration: 1000,
      ease: "Quad.easeOut",
      onUpdate: () => {
        if (sText && sText.setText) sText.setText(`Current Score: ${Math.floor(countObj.val)}`);
      }
    });

    const hText = this.add.text(cX, cY - 15, `Dojo Best: ${this.highScore}`, { fontSize: "17px", color: "#8888aa" }).setOrigin(0.5);
    endPanelContainer.add(hText);

    const accuracy = this.stats.totalSwipes > 0 ? Math.round((this.stats.successfulSwipes / this.stats.totalSwipes) * 100) : 100;
    const analyticsText = 
      `Sliced Fruits: ${this.stats.totalFruitsCut}  |  Accuracy: ${accuracy}%\n` +
      `Highest Combo: ${this.stats.highestCombo} Link  |  Bombs Cleared: ${this.stats.bombsHit}`;
    const analyticsDisplay = this.add.text(cX, cY + 35, analyticsText, { fontSize: "14px", color: "#cfd3e0", align: "center", lineSpacing: 6 }).setOrigin(0.5);
    endPanelContainer.add(analyticsDisplay);

    const retryBtn = this.add.text(cX - 95, cY + 115, "🔄 PLAY AGAIN", { fontSize: "17px", backgroundColor: "#00ffcc", color: "#000", padding: { x: 14, y: 10 }, fontStyle: "bold" }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    endPanelContainer.add(retryBtn);
    retryBtn.on("pointerover", () => retryBtn.setStyle({ backgroundColor: "#ffffff" }));
    retryBtn.on("pointerout", () => retryBtn.setStyle({ backgroundColor: "#00ffcc" }));
    retryBtn.on("pointerdown", () => this.scene.restart());

    const returnBtn = this.add.text(cX + 95, cY + 115, "👤 MAIN MENU", { fontSize: "17px", backgroundColor: "#222736", color: "#fff", padding: { x: 14, y: 10 }, fontStyle: "bold" }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    endPanelContainer.add(returnBtn);
    returnBtn.on("pointerover", () => returnBtn.setStyle({ color: "#00ffcc" }));
    returnBtn.on("pointerout", () => returnBtn.setStyle({ color: "#fff" }));
    returnBtn.on("pointerdown", () => {
      this.scene.restart();
    });

    this.tweens.add({
      targets: endPanelContainer,
      alpha: 1,
      y: 0,
      duration: 600,
      ease: "Cubic.easeOut"
    });
  }
}