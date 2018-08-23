const w : number = window.innerWidth, h : number = window.innerHeight
const nodes : number = 5

class LinkedStepBallMoverStage {
	canvas : HTMLCanvasElement = document.createElement('canvas')
	context : CanvasRenderingContext2D

	constructor() {

	}

	private initCanvas() {
		this.canvas.width = w
		this.canvas.height = h
		this.context = this.canvas.getContext('2d')
		document.body.appendChild(this.canvas)
	}

	private render() {
		this.context.fillStyle = '#212121'
		this.context.fillRect(0, 0, w, h)
	}

	private handleTap() {
		this.canvas.onmousedown = () => {

		}
	}

	public static init() {
	 	const stage : LinkedStepBallMoverStage = new LinkedStepBallMoverStage()
		stage.initCanvas()
		stage.render()
		stage.handleTap()
	}
}

class State {
	scale : number = 0
	dir : number = 0
	prevScale : number = 0

	update(cb : Function) {
		this.scale += 0.1 * this.dir
		if (Math.abs(this.scale - this.prevScale) > 1) {
			this.scale = this.prevScale + this.dir
			this.dir = 0
			this.prevScale = this.prevScale
			cb()
		}
	}

	startUpdating(cb : Function) {
		if (this.dir == 0) {
			this.dir = 1 - 2 * this.prevScale
			cb()
		}
	}
}
