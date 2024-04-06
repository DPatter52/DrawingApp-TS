document.addEventListener("DOMContentLoaded", () => {
  class DrawingApp {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private colorPalette: string[] = [
      "#ff0000",
      "#00ff00",
      "#0000ff",
      "#ffff00",
      "#ff00ff",
      "#00ffff",
    ];
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
      this.canvas = document.createElement("canvas");
      this.ctx = this.canvas.getContext("2d", { willReadFrequently: true })!;
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      document.body.appendChild(this.canvas);
      this.renderColorPalette();
      this.initialize();
      console.log("Contructor initialized.");
    }

    initialize() {
      this.toolSelect = document.getElementById("tool") as HTMLSelectElement;
      this.sizeInput = document.getElementById("size") as HTMLInputElement;
      this.colorInput = document.getElementById("color") as HTMLInputElement;
      this.clearInput = document.querySelector(
        "#resetButton"
      ) as HTMLButtonElement;

      this.brushSize = parseInt(this.sizeInput.value);
      this.brushColor = this.colorInput.value;

      this.addEventListeners();
    }

    // Functions

    renderColorPalette() {
      const paletteContainer = document.getElementById("color-palette")!;
      this.colorPalette.forEach((color) => {
        const colorBox = document.createElement("div");
        colorBox.classList.add("color-box");
        colorBox.style.backgroundColor = color;
        colorBox.addEventListener("click", () => {
          this.brushColor = color; 
        });
        paletteContainer.appendChild(colorBox);
      });
      console.log("Palette is made");
    }

    clearCanvas() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    getMousePosition(canvas: HTMLCanvasElement, e: MouseEvent) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;

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
      this.ctx.closePath();
    }
    draw(e: MouseEvent) {
      if (!this.painting) return;
      const pos = this.getMousePosition(this.canvas, e);
      if (this.startX === undefined || this.startY === undefined) {
        this.ctx.beginPath();
        this.ctx.moveTo(pos.x, pos.y);
      } else {
        this.ctx.beginPath();
        this.ctx.moveTo(this.startX, this.startY);
        this.ctx.lineTo(pos.x, pos.y);
        this.ctx.strokeStyle = this.brushColor;
        this.ctx.lineWidth = this.brushSize;
        this.ctx.lineCap = "round";
        this.ctx.stroke();
      }
      this.startX = pos.x;
      this.startY = pos.y;
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

    // Event Listeners
    addEventListeners() {
      this.toolSelect.addEventListener("change", () => {
        this.selectedTool = this.toolSelect.value;
        console.log("Tool changed to: " + this.selectedTool);
      });
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
