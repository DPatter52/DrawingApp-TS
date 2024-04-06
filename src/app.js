"use strict";
document.addEventListener("DOMContentLoaded", () => {
  class DrawingApp {
    constructor() {
      this.toolSelect = document.createElement("select");
      this.sizeInput = document.createElement("input");
      this.colorInput = document.createElement("input");
      this.clearInput = document.createElement("button");
      this.painting = false;
      this.selectedTool = "brush";
      this.canvas = document.createElement("canvas");
      this.initialize();
    }
    initialize() {
      this.canvas = document.querySelector("canvas");
      this.ctx = this.canvas.getContext("2d");
      this.toolSelect = document.getElementById("tool");
      this.sizeInput = document.getElementById("size");
      this.colorInput = document.getElementById("color");
      this.clearInput = document.querySelector("#resetButton");
      this.canvas.height = window.innerHeight;
      this.canvas.width = window.innerWidth;
      this.brushSize = parseInt(this.sizeInput.value);
      this.brushColor = this.colorInput.value;
      this.addEventListeners();
      console.log("App initialized");
    }
    clearCanvas() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    startPosition(e) {
      this.painting = true;
      const rect = this.canvas.getBoundingClientRect();
      // Assign adjusted coordinates to startX and startY
      this.startX = e.clientX - rect.left;
      this.startY = e.clientY - rect.top;
      this.ctx.beginPath();
      this.ctx.moveTo(this.startX, this.startY); // Use startX and startY here
      console.log("startPosition initiated");
    }

    endPosition() {
      this.painting = false;
      this.ctx.beginPath();
      console.log("endPosition initiated");
    }

    draw(e) {
      if (!this.painting) return;
      const rect = this.canvas.getBoundingClientRect();
      // Draw to the new position
      this.ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      this.ctx.strokeStyle = this.brushColor;
      this.ctx.lineWidth = this.brushSize;
      this.ctx.lineCap = "round";
      this.ctx.stroke();
    }
    drawRectanglePreview(e) {
      if (!this.painting) return;

      // Get the coordinates of the initial click
      const rect = this.canvas.getBoundingClientRect();
      const startX = this.startX - rect.left;
      const startY = this.startY - rect.top;

      // Calculate the width and height based on the current mouse position
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const width = mouseX - startX;
      const height = mouseY - startY;

      // Set the fill color and draw the rectangle
      this.ctx.fillStyle = this.brushColor;
      this.ctx.fillRect(startX, startY, width, height);
    }
    drawCirclePreview(e) {
      if (!this.painting) return;
      const x = this.startX;
      const y = this.startY;
      const radius = Math.sqrt(
        Math.pow(e.clientX - this.startX, 1.5) +
          Math.pow(e.clientY - this.startY, 1.5)
      );

      this.ctx.lineWidth = this.brushSize;
      this.ctx.fillStyle = this.brushColor;
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, Math.PI * 2);
      this.ctx.fill();
      console.log("circle initiated");
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
      window.addEventListener("resize", () => {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        // Redraw content if necessary
      });
    }
  }
  new DrawingApp();
});
