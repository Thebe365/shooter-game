const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Player {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.speed = 5;
      }

      moveLeft() {
        this.x -= this.speed;
      }

      moveRight() {
        this.x += this.speed;
      }

      moveUp() {
        this.y -= this.speed;
      }

      moveDown() {
        this.y += this.speed;
      }

      draw() {
        ctx.fillStyle = "blue";
        ctx.fillRect(this.x, this.y, this.width, this.height);
      }
    }

    class Projectile {

      constructor(x, y, directionX, directionY) {

        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 10;
        this.speed = 8;
        this.directionX = directionX;
        this.directionY = directionY;
      }

      update() {
        this.x += this.directionX * this.speed;
        this.y += this.directionY * this.speed;
      }

      draw() {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.width, this.height);
      }
    }

    class Enemy {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.width = 40;
        this.height = 40;
        this.speed = 2;
        this.directionX = Math.random() * 2 - 1; // Random x direction between -1 and 1
        this.directionY = Math.random() * 2 - 1; // Random y direction between -1 and 1
      }

      move() {
        this.x += this.directionX * this.speed;
        this.y += this.directionY * this.speed;

        // Bounce off canvas edges
        if (this.x <= 0 || this.x + this.width >= canvas.width) {
          this.directionX *= -1;
        }
        if (this.y <= 0 || this.y + this.height >= canvas.height) {
          this.directionY *= -1;
        }
      }

      draw() {
        ctx.fillStyle = "green";
        ctx.fillRect(this.x, this.y, this.width, this.height);
      }
    }


    const player = new Player(canvas.width / 2, canvas.height / 2);
    const projectiles = [];
    const enemies = [new Enemy(100, 100)];

    function spawnEnemies(count) {
      for (let i = 0; i < count; i++) {
        enemies.push(new Enemy());
      }
    }

    function gameLoop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (enemies.length < 5) {
        spawnEnemies(5 - enemies.length);
      }

      if (keys.ArrowLeft) player.moveLeft();
      if (keys.ArrowRight) player.moveRight();
      if (keys.ArrowUp) player.moveUp();
      if (keys.ArrowDown) player.moveDown();

      player.draw();

      for (const projectile of projectiles) {
        projectile.update();
        projectile.draw();
        checkProjectileCollision(projectile);
      }

      for (const enemy of enemies) {
        enemy.move();
        enemy.draw();
      }

      requestAnimationFrame(gameLoop);
    }

    function checkProjectileCollision(projectile) {
      for (const enemy of enemies) {
        if (
          projectile.x < enemy.x + enemy.width &&
          projectile.x + projectile.width > enemy.x &&
          projectile.y < enemy.y + enemy.height &&
          projectile.y + projectile.height > enemy.y
        ) {
          // Projectile hit enemy
          projectiles.splice(projectiles.indexOf(projectile), 1);
          enemies.splice(enemies.indexOf(enemy), 1);
        }
      }
    }

    const keys = {};

    document.addEventListener("keydown", (event) => {
      keys[event.key] = true;

      if (event.key === " ") {
        const projectile = new Projectile(
          player.x + player.width / 2,
          player.y + player.height / 2,
          Math.cos(playerAngle),
          Math.sin(playerAngle)
        );
        projectiles.push(projectile);
      }
    });

    document.addEventListener("keyup", (event) => {
      keys[event.key] = false;
    });

    canvas.addEventListener("mousemove", (event) => {
      const dx = event.clientX - player.x - player.width / 2;
      const dy = event.clientY - player.y - player.height / 2;
      playerAngle = Math.atan2(dy, dx);
    });

    let playerAngle = 0;
    gameLoop();