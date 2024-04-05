document.addEventListener("DOMContentLoaded", () => {
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

    clearCanvas() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    startPosition(e: MouseEvent) {
      this.painting = true;
      this.startX = e.clientX;
      this.startY = e.clientY;
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
      this.ctx.lineWidth = this.brushSize;
      this.ctx.lineCap = "round";

      this.ctx.lineTo(e.clientX, e.clientY);
      this.ctx.strokeStyle = this.brushColor;
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.moveTo(e.clientX, e.clientY);
    }

    drawRectanglePreview(e: MouseEvent) {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const width = e.clientX - this.startX;
      const height = e.clientY - this.startY;

      this.clearCanvas();
      this.ctx.fillStyle = this.brushColor;
      this.ctx.fillRect(x, y, width, height);
    }

    drawCirclePreview(e: MouseEvent) {
      const x = this.startX;
      const y = this.startY;

      const radius = Math.sqrt(
        Math.pow(e.clientX - this.startX, 2) +
          Math.pow(e.clientY - this.startY, 2)
      );

      this.clearCanvas();
      this.ctx.fillStyle = this.brushColor;
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, Math.PI * 2);
      this.ctx.fill();
    }

    addEventListeners() {
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
    }
  }

  new DrawingApp();
});
