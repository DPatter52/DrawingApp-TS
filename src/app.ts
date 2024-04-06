document.addEventListener("DOMContentLoaded", () => {
  type Color = {
    r: number;
    g: number;
    b: number;
    a: number;
  };

  class DrawingApp {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    toolSelect: HTMLSelectElement = document.createElement(
      "select"
    ) as HTMLSelectElement;
    sizeInput: HTMLInputElement = document.createElement(
      "input"
    ) as HTMLInputElement;
    colorInput: HTMLInputElement = document.createElement(
      "input"
    ) as HTMLInputElement;
    clearInput: HTMLButtonElement = document.createElement(
      "button"
    ) as HTMLButtonElement;

    private imageData!: ImageData;

    painting = false;
    selectedTool = "brush";
    brushSize!: number;
    brushColor!: string;
    startX!: number;
    startY!: number;

    constructor() {
      this.initialize();
      this.canvas = document.createElement("canvas");
      this.ctx = this.canvas.getContext("2d")!;
      this.imageData = this.ctx.getImageData(
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );
      console.log("Contructor initialized.");
    }

    initialize() {
      this.canvas = document.querySelector("canvas") as HTMLCanvasElement;
      this.ctx = this.canvas.getContext("2d")!;

      this.toolSelect = document.getElementById("tool") as HTMLSelectElement;
      this.sizeInput = document.getElementById("size") as HTMLInputElement;
      this.colorInput = document.getElementById("color") as HTMLInputElement;
      this.clearInput = document.querySelector(
        "resetButton"
      ) as HTMLButtonElement;

      this.canvas.height = window.innerHeight;
      this.canvas.width = window.innerWidth;

      this.brushSize = parseInt(this.sizeInput.value);
      this.brushColor = this.colorInput.value;

      this.addEventListeners();
    }

    // Functions
    clearCanvas() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    getMousePosition(canvas: HTMLCanvasElement, evt: MouseEvent) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (evt.clientX - rect.left) * scaleX;
      const y = (evt.clientY - rect.top) * scaleY;

      return { x, y };
    }

    startPosition(e: MouseEvent) {
      const pos = this.getMousePosition(this.canvas, e);
      this.painting = true;
      this.startX = pos.x;
      this.startY = pos.y;
      if (this.selectedTool === "brush") {
        this.draw(e);
      } else if (this.selectedTool === "rectangle") {
        this.drawRectanglePreview(e);
      } else if (this.selectedTool === "circle") {
        this.drawCirclePreview(e);
      }
    }

    endPosition() {
      this.painting = false;
      this.ctx.beginPath();
    }

    draw(e: MouseEvent) {
      if (!this.painting) return;
      const pos = this.getMousePosition(this.canvas, e);
      this.ctx.lineWidth = this.brushSize;
      this.ctx.lineCap = "round";

      this.ctx.lineTo(pos.x, pos.y);
      this.ctx.strokeStyle = this.brushColor;
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.moveTo(pos.x, pos.y);
    }

    drawRectanglePreview(e: MouseEvent) {
      const pos = this.getMousePosition(this.canvas, e);

      const width = pos.x - this.startX;
      const height = pos.y - this.startY;

      this.clearCanvas();
      this.ctx.fillStyle = this.brushColor;
      this.ctx.fillRect(this.startX, this.startY, width, height);
    }

    drawCirclePreview(e: MouseEvent) {
      const pos = this.getMousePosition(this.canvas, e);
      const radius = Math.sqrt(
        Math.pow(pos.x - this.startX, 2) + Math.pow(pos.y - this.startY, 2)
      );

      this.clearCanvas();
      this.ctx.fillStyle = this.brushColor;
      this.ctx.beginPath();
      this.ctx.arc(this.startX, this.startY, radius, 0, Math.PI * 2);
      this.ctx.fill();
    }

    getColorAtPixel(x: number, y: number): Color {
      const index = (y * this.canvas.width + x) * 4;
      return {
        r: this.imageData.data[index],
        g: this.imageData.data[index + 1],
        b: this.imageData.data[index + 2],
        a: this.imageData.data[index + 3],
      };
    }

    floodFill(
      x: number,
      y: number,
      targetColor: Color,
      replacementColor: Color
    ): void {
      if (x < 0 || x >= this.canvas.width || y < 0 || y >= this.canvas.height)
        return;

      const currentColor = this.getColorAtPixel(x, y);
      if (
        currentColor.r === targetColor.r &&
        currentColor.g === targetColor.g &&
        currentColor.b === targetColor.b &&
        currentColor.a === targetColor.a
      ) {
        const index = (y * this.canvas.width + x) * 4;
        this.imageData.data[index] = replacementColor.r;
        this.imageData.data[index + 1] = replacementColor.g;
        this.imageData.data[index + 2] = replacementColor.b;
        this.imageData.data[index + 3] = replacementColor.a;

        this.floodFill(x + 1, y, targetColor, replacementColor);
        this.floodFill(x - 1, y, targetColor, replacementColor);
        this.floodFill(x, y + 1, targetColor, replacementColor);
        this.floodFill(x, y - 1, targetColor, replacementColor);
      }
      this.ctx.putImageData(this.imageData, 0, 0);
    }

    // Event Listeners
    addEventListeners(): void {
      this.canvas.addEventListener("mousedown", (e) => this.startPosition(e));
      this.canvas.addEventListener("mouseup", () => this.endPosition());
      this.canvas.addEventListener("mousemove", (e) => {
        if (this.selectedTool === "rectangle" && this.painting) {
          this.drawRectanglePreview(e);
        } else if (this.selectedTool === "circle" && this.painting) {
          this.drawCirclePreview(e);
        } else if (this.selectedTool === "brush" && this.painting) {
          this.draw(e);
        }
      });
      this.clearInput.addEventListener("click", () => this.clearCanvas());

      this.toolSelect.addEventListener("change", () => {
        this.selectedTool = this.toolSelect.value;
      });

      this.sizeInput.addEventListener("input", () => {
        this.brushSize = parseInt(this.sizeInput.value);
      });

      this.colorInput.addEventListener("input", () => {
        this.brushColor = this.colorInput.value;
      });
      this.canvas.addEventListener("click", (e) => {
        if (this.selectedTool === "fill") {
          const pos = this.getMousePosition(this.canvas, e);
          const targetColor = this.getColorAtPixel(pos.x, pos.y);
          const replacementColor = { r: 255, g: 0, b: 0, a: 255 }; // Example: filling with red
          this.floodFill(pos.x, pos.y, targetColor, replacementColor);
        }
      });
    }
  }

  new DrawingApp();
});
