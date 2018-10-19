export default class Particle {
  constructor(screenWidth, screenHeight, width, height, color) {
    this.x = Math.floor(Math.random() * screenWidth);
    this.y = Math.floor(Math.random() * screenHeight);
    this.width = width;
    this.height = height;
    this.color = color;
  }
}