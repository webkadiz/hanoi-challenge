export default class Snowflake {

	constructor(ctx, x, y, radius, color, radians) {
		this.ctx = ctx
		this.preservedX = x
		this.preservedY = y
		this.x = x;
	    this.y = y;
	    this.radius = radius;
	    this.color = color;
	    this.radians = radians;
	    this.velocity = 0.005;
	}

    update() {
        this.radians += this.velocity;
        this.x = this.preservedX + Math.cos(this.radians) * 400 ;
        this.y = this.preservedY + Math.tan(this.radians) * 600 ;

        this.draw();
    }

    draw() {
        this.ctx.beginPath()
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        this.ctx.fillStyle = this.color
        this.ctx.fill()

        this.ctx.closePath()
    }
}