export class TetrisGame {
  private static readonly COLS: number = 10;
  private static readonly ROWS: number = 20;
  private static readonly BLOCK_SIZE: number = 30;
  private static readonly COLORS: string[] = [
    "cyan",
    "blue",
    "orange",
    "yellow",
    "green",
    "purple",
    "red",
  ];
  private static readonly SHAPES: number[][][] = [
    [[1, 1, 1, 1]],
    [[1, 1, 1], [1]],
    [
      [1, 1, 1],
      [0, 0, 1],
    ],
    [
      [1, 1],
      [1, 1],
    ],
    [
      [1, 1, 0],
      [0, 1, 1],
    ],
    [
      [0, 1, 1],
      [1, 1],
    ],
    [
      [0, 1, 0],
      [1, 1, 1],
    ],
  ];

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private gameLoop: number | null = null;
  private board: (string | number)[][] = Array(TetrisGame.ROWS)
    .fill(null)
    .map(() => Array(TetrisGame.COLS).fill(0));
  private currentPiece: {
    shape: number[][];
    color: string;
    x: number;
    y: number;
  } | null = null;
  private score: number = 0;

  constructor(private container: HTMLElement) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = TetrisGame.COLS * TetrisGame.BLOCK_SIZE;
    this.canvas.height = TetrisGame.ROWS * TetrisGame.BLOCK_SIZE;
    this.canvas.style.border = "1px solid black";
    this.container.appendChild(this.canvas);

    const ctx = this.canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Could not get 2D context");
    }
    this.ctx = ctx;

    this.setupEventListeners();
  }

  public startGame(): void {
    this.resetGame();
    this.gameLoop = window.setInterval(() => this.gameStep(), 500);
  }

  private resetGame(): void {
    this.board = Array(TetrisGame.ROWS)
      .fill(null)
      .map(() => Array(TetrisGame.COLS).fill(0));
    this.score = 0;
    this.spawnPiece();
  }

  private gameStep(): void {
    this.moveDown();
    this.draw();
  }

  private spawnPiece(): void {
    const shapeIndex = Math.floor(Math.random() * TetrisGame.SHAPES.length);
    const color = TetrisGame.COLORS[shapeIndex];
    this.currentPiece = {
      shape: TetrisGame.SHAPES[shapeIndex],
      color: color,
      x:
        Math.floor(TetrisGame.COLS / 2) -
        Math.ceil(TetrisGame.SHAPES[shapeIndex][0].length / 2),
      y: 0,
    };

    if (this.collision()) {
      if (this.gameLoop !== null) {
        clearInterval(this.gameLoop);
      }
      alert("Game Over! Your score: " + this.score);
    }
  }

  private moveDown(): void {
    if (this.currentPiece) {
      this.currentPiece.y++;
      if (this.collision()) {
        this.currentPiece.y--;
        this.solidifyPiece();
        this.removeFullRows();
        this.spawnPiece();
      }
    }
  }

  private collision(): boolean {
    if (!this.currentPiece) return false;

    for (let y = 0; y < this.currentPiece.shape.length; y++) {
      for (let x = 0; x < this.currentPiece.shape[y].length; x++) {
        if (
          this.currentPiece.shape[y][x] &&
          (this.currentPiece.y + y >= TetrisGame.ROWS ||
            this.currentPiece.x + x < 0 ||
            this.currentPiece.x + x >= TetrisGame.COLS ||
            this.board[this.currentPiece.y + y][this.currentPiece.x + x] !== 0)
        ) {
          return true;
        }
      }
    }
    return false;
  }

  private solidifyPiece(): void {
    if (!this.currentPiece) return;

    for (let y = 0; y < this.currentPiece.shape.length; y++) {
      for (let x = 0; x < this.currentPiece.shape[y].length; x++) {
        if (this.currentPiece.shape[y][x]) {
          this.board[this.currentPiece.y + y][this.currentPiece.x + x] =
            this.currentPiece.color;
        }
      }
    }
  }

  private removeFullRows(): void {
    for (let y = TetrisGame.ROWS - 1; y >= 0; y--) {
      if (this.board[y].every((cell) => cell !== 0)) {
        this.board.splice(y, 1);
        this.board.unshift(Array(TetrisGame.COLS).fill(0));
        this.score += 100;
      }
    }
  }

  private draw(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw board
    for (let y = 0; y < TetrisGame.ROWS; y++) {
      for (let x = 0; x < TetrisGame.COLS; x++) {
        if (this.board[y][x]) {
          this.ctx.fillStyle = this.board[y][x] as string;
          this.ctx.fillRect(
            x * TetrisGame.BLOCK_SIZE,
            y * TetrisGame.BLOCK_SIZE,
            TetrisGame.BLOCK_SIZE,
            TetrisGame.BLOCK_SIZE,
          );
          this.ctx.strokeStyle = "black";
          this.ctx.strokeRect(
            x * TetrisGame.BLOCK_SIZE,
            y * TetrisGame.BLOCK_SIZE,
            TetrisGame.BLOCK_SIZE,
            TetrisGame.BLOCK_SIZE,
          );
        }
      }
    }

    // Draw current piece
    if (this.currentPiece) {
      this.ctx.fillStyle = this.currentPiece.color;
      for (let y = 0; y < this.currentPiece.shape.length; y++) {
        for (let x = 0; x < this.currentPiece.shape[y].length; x++) {
          if (this.currentPiece.shape[y][x]) {
            this.ctx.fillRect(
              (this.currentPiece.x + x) * TetrisGame.BLOCK_SIZE,
              (this.currentPiece.y + y) * TetrisGame.BLOCK_SIZE,
              TetrisGame.BLOCK_SIZE,
              TetrisGame.BLOCK_SIZE,
            );
            this.ctx.strokeStyle = "black";
            this.ctx.strokeRect(
              (this.currentPiece.x + x) * TetrisGame.BLOCK_SIZE,
              (this.currentPiece.y + y) * TetrisGame.BLOCK_SIZE,
              TetrisGame.BLOCK_SIZE,
              TetrisGame.BLOCK_SIZE,
            );
          }
        }
      }
    }

    // Draw score
    this.ctx.fillStyle = "black";
    this.ctx.font = "20px Arial";
    this.ctx.fillText("Score: " + this.score, 10, 30);
  }

  private setupEventListeners(): void {
    document.addEventListener("keydown", (event: KeyboardEvent) => {
      if (!this.currentPiece) return;

      switch (event.key) {
        case "ArrowLeft":
          this.currentPiece.x--;
          if (this.collision()) {
            this.currentPiece.x++;
          }
          break;
        case "ArrowRight":
          this.currentPiece.x++;
          if (this.collision()) {
            this.currentPiece.x--;
          }
          break;
        case "ArrowDown":
          this.moveDown();
          break;
        case "ArrowUp":
          const rotated = this.currentPiece.shape[0].map((val, index) =>
            this.currentPiece!.shape.map((row) => row[index]).reverse(),
          );
          const previousShape = this.currentPiece.shape;
          this.currentPiece.shape = rotated;
          if (this.collision()) {
            this.currentPiece.shape = previousShape;
          }
          break;
      }
      this.draw();
    });
  }
}
