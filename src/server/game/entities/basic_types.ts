class Point {
	x: number;
	y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	transform(velocity: Velocity): Point {
		return new Point(this.x + velocity.x, this.y + velocity.y);
	}
}

class Velocity {
	x: number;
	y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	getSpeed(): number {
		return Math.sqrt(this.x**2 + this.y**2);
	}
}

class Rectangle {
	// This x, y point marks the top left corner of the rectangle when angle = 0;
  x: number;
  y: number
	width: number;
	height: number;
	// Angle is measured in 0 - 360 degrees, with 0 being the neutral state where
	// the 4 vertices of the rectangle are:
	// [(x, y), (x + width, y), (x + width, y - height), (x, y - height)]
	// in clockwise order. An angle of 90 would rotate the rectangle 90 degrees
	// clockwise, so that new verticies would be:
	// [(x, y), (x, y - width), (x - height, y - width), (x - height, y)]
	angle: number;

	constructor(x: number, y:number, width: number, height: number, angle = 0) {
    this.x = x;
    this.y = y;
		this.width = width;
		this.height = height;
		this.angle = angle;
	}

	isCollision(rectangle: Rectangle): boolean {
		if (this.angle != 0 || rectangle.angle != 0) {
			throw 'Unimplemented';
		}

		return this.x <= rectangle.x + rectangle.width
			&& rectangle.x <= this.x + this.width
			&& this.y <= rectangle.y + rectangle.height
			&& rectangle.y <= this.y + this.height;
	}

	transform(velocity: Velocity): Rectangle {
		return new Rectangle(this.x + velocity.x, this.y + velocity.y,
			this.width, this.height, this.angle);
	}
}

// TODO Circle
// integrate circle collisions with rectangles

export { Point, Velocity, Rectangle }
