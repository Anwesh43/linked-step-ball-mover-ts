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
