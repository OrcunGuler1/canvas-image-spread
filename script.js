'use strict'
window.addEventListener('load', () => {
  const canvas = document.getElementById('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  const btn = document.getElementById('warpbutton')
  class Particle {
    constructor(x, y, effect, color) {
      this.ox = Math.floor(x)
      this.oy = Math.floor(y)
      this.effect = effect
      this.x = Math.random() * this.effect.width
      this.y = Math.random() * this.effect.height
      this.size = this.effect.gap
      this.vx = 0
      this.vy = 0
      this.color = color
      this.ease = 0.1
      this.dx = 0
      this.dy = 0
      this.dist = 0
      this.force = 0
      this.angle = 0
      this.friction = 0.95
    }
    draw(ctx) {
      ctx.fillStyle = this.color
      ctx.fillRect(this.x, this.y, this.size, this.size)
    }
    update() {
      this.dx = this.effect.mouse.x - this.x
      this.dy = this.effect.mouse.y - this.y
      this.dist = this.dx * this.dx + this.dy * this.dy
      this.force = -this.effect.mouse.radius / this.dist
      if (this.dist < this.effect.mouse.radius) {
        this.angle = Math.atan2(this.dy, this.dx)
        this.vx += this.force * Math.cos(this.angle)
        this.vy += this.force * Math.sin(this.angle)
      }

      this.x += (this.vx *= this.friction) + (this.ox - this.x) * this.ease
      this.y += (this.vy *= this.friction) + (this.oy - this.y) * this.ease
    }
    warp() {
      this.x = Math.random() * this.effect.width
      this.y = Math.random() * this.effect.height
    }
  }

  class Effect {
    constructor(width, height) {
      this.width = width
      this.height = height
      this.particles = []
      this.image = document.getElementById('image')
      this.center = {
        x: this.width / 2 - this.image.width / 2,
        y: this.height / 2 - this.image.height / 2,
      }
      this.gap = 2
      this.mouse = {
        radius: 3000,
        x: undefined,
        y: undefined,
      }
      window.addEventListener('mousemove', e => {
        this.mouse.x = e.x
        this.mouse.y = e.y
      })
    }
    init(ctx) {
      ctx.drawImage(this.image, this.center.x, this.center.y)
      const pixels = ctx.getImageData(0, 0, this.width, this.height).data
      for (let y = 0; y < this.height; y += this.gap) {
        for (let x = 0; x < this.width; x += this.gap) {
          const index = (y * this.width + x) * 4
          const r = pixels[index]
          const g = pixels[index + 1]
          const b = pixels[index + 2]
          const a = pixels[index + 3]
          const color = `rgb(${r}, ${g}, ${b})`
          if (a > 0) {
            this.particles.push(new Particle(x, y, this, color))
          }
        }
      }
    }
    draw(ctx) {
      this.particles.forEach(particle => particle.draw(ctx))
    }
    update() {
      this.particles.forEach(particle => particle.update())
    }
    warp() {
      this.particles.forEach(particle => particle.warp())
    }
  }
  const eff = new Effect(canvas.width, canvas.height)
  eff.init(ctx)
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    eff.draw(ctx)
    eff.update()
    requestAnimationFrame(animate)
  }
  animate()
  btn.addEventListener('click', () => {
    eff.warp()
  })
})
