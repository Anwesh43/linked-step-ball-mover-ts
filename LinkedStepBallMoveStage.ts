const w : number = window.innerWidth, h : number = window.innerHeight
const nodes : number = 5

class LinkedStepBallMoverStage {
	canvas : HTMLCanvasElement = document.createElement('canvas')
	context : CanvasRenderingContext2D
	sm : StepBallMover = new StepBallMover()
	animator : Animator = new Animator()
	
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
		this.sm.draw(this.context)
	}

	private handleTap() {
		this.canvas.onmousedown = () => {
			this.sm.startUpdating(() => {
				this.animator.start(() => {
					this.render()
					this.sm.update(() => {
						this.animator.stop()
					})
				})
			})
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

class Animator {
	animated : boolean = false
	interval : number

	start(cb : Function) {
		if (!this.animated) {
			this.animated = true
			this.interval = setInterval(cb, 50)
		}
	}

	stop() {
		if (this.animated) {
			this.animated = false
			clearInterval(this.interval)
		}
	}
}

class SMNode {
		state : State = new State()
		prev : SMNode
		next : SMNode
		constructor(public i : number) {
			this.addNeighbor()
		}

		private addNeighbor() {
			if (this.i < nodes - 1) {
				this.next = new SMNode(this.i + 1)
				this.next.prev = this
			}
		}

		draw(context : CanvasRenderingContext2D, ballDraw : Function) {
			const gap : number = w / nodes
			const r : number = gap / 10
			context.lineCap = 'round'
			context.lineWidth = Math.min(w, h) / 60
			context.strokeStyle = 'teal'
			context.fillStyle = 'teal'
			const index = this.i % 2
			var sc1 = Math.min(0.5, this.state.scale) * 2
			const sc2 = Math.min(0.5, Math.max(this.state.scale - 0.5, 0)) * 2
			sc1 = (1 - sc1) * index + (1 - index) * sc1
			const x : number =  gap * sc2
			context.save()
			context.translate(x, 0.8 * h - 0.3 * h * sc1)
			context.beginPath()
			context.moveTo(0, 0)
			context.lineTo(gap, 0)
			context.stroke()
			if (ballDraw(this.i)) {
				context.beginPath()
				context.arc(x, -r, r, 0, 2 * Math.PI)
				context.fill()
			}
			context.restore()
			if (this.next) {
					this.next.draw(context, (i) => false)
			}
		}

		update(cb : Function) {
			this.state.update(cb)
		}

		startUpdating(cb : Function) {
			this.state.startUpdating(cb)
		}

		getNext(dir : number, cb : Function) : SMNode {
			var curr : SMNode = this.prev
			if (dir == 1) {
				curr = this.next
			}
			if (curr) {
				return curr
			}
			cb()
			return this
		}
}

class StepBallMover {
	curr : SMNode = new SMNode(0)
	dir : number = 1

	draw(context : CanvasRenderingContext2D) {
		this.curr.draw(context, (i) => this.curr.i == i)
	}

	update(cb : Function) {
		this.curr.update(() => {
			this.curr = this.curr.getNext(this.dir, () => {
				this.dir *= -1
			})
			cb()
		})
	}

	startUpdating(cb : Function) {
		this.curr.startUpdating(cb)
	}
}
