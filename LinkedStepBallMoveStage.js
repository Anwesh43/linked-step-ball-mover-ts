var w = window.innerWidth, h = window.innerHeight;
var nodes = 5;
var LinkedStepBallMoverStage = (function () {
    function LinkedStepBallMoverStage() {
        this.canvas = document.createElement('canvas');
        this.sm = new StepBallMover();
        this.animator = new Animator();
    }
    LinkedStepBallMoverStage.prototype.initCanvas = function () {
        this.canvas.width = w;
        this.canvas.height = h;
        this.context = this.canvas.getContext('2d');
        document.body.appendChild(this.canvas);
    };
    LinkedStepBallMoverStage.prototype.render = function () {
        this.context.fillStyle = '#212121';
        this.context.fillRect(0, 0, w, h);
        this.sm.draw(this.context);
    };
    LinkedStepBallMoverStage.prototype.handleTap = function () {
        var _this = this;
        this.canvas.onmousedown = function () {
            _this.sm.startUpdating(function () {
                _this.animator.start(function () {
                    _this.render();
                    _this.sm.update(function () {
                        _this.animator.stop();
                    });
                });
            });
        };
    };
    LinkedStepBallMoverStage.init = function () {
        var stage = new LinkedStepBallMoverStage();
        stage.initCanvas();
        stage.render();
        stage.handleTap();
    };
    return LinkedStepBallMoverStage;
})();
var State = (function () {
    function State() {
        this.scale = 0;
        this.dir = 0;
        this.prevScale = 0;
    }
    State.prototype.update = function (cb) {
        this.scale += 0.05 * this.dir;
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir;
            this.dir = 0;
            this.prevScale = this.scale;
            cb();
        }
    };
    State.prototype.startUpdating = function (cb) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale;
            cb();
        }
    };
    return State;
})();
var Animator = (function () {
    function Animator() {
        this.animated = false;
    }
    Animator.prototype.start = function (cb) {
        if (!this.animated) {
            this.animated = true;
            this.interval = setInterval(cb, 50);
        }
    };
    Animator.prototype.stop = function () {
        if (this.animated) {
            this.animated = false;
            clearInterval(this.interval);
        }
    };
    return Animator;
})();
var SMNode = (function () {
    function SMNode(i) {
        this.i = i;
        this.state = new State();
        this.addNeighbor();
    }
    SMNode.prototype.addNeighbor = function () {
        if (this.i < nodes - 1) {
            this.next = new SMNode(this.i + 1);
            this.next.prev = this;
        }
    };
    SMNode.prototype.draw = function (context, currI) {
        var gap = w / nodes;
        var r = gap / 10;
        context.lineCap = 'round';
        context.lineWidth = Math.min(w, h) / 60;
        context.strokeStyle = 'teal';
        context.fillStyle = 'teal';
        var index = this.i % 2;
        var sc1 = Math.min(0.5, this.state.scale) * 2;
        var sc2 = Math.min(0.5, Math.max(this.state.scale - 0.5, 0)) * 2;
        sc1 = (1 - sc1) * index + (1 - index) * sc1;
        var x = gap * sc2;
        console.log(gap * this.i);
        context.save();
        context.translate(gap * this.i, 0.8 * h - 0.3 * h * sc1);
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(gap, 0);
        context.stroke();
        if (currI == this.i) {
            context.beginPath();
            context.arc(x, -r, r, 0, 2 * Math.PI);
            context.fill();
        }
        context.restore();
        if (this.next) {
            this.next.draw(context, currI);
        }
    };
    SMNode.prototype.update = function (cb) {
        this.state.update(cb);
    };
    SMNode.prototype.startUpdating = function (cb) {
        this.state.startUpdating(cb);
    };
    SMNode.prototype.getNext = function (dir, cb) {
        var curr = this.prev;
        if (dir == 1) {
            curr = this.next;
        }
        if (curr) {
            return curr;
        }
        cb();
        return this;
    };
    return SMNode;
})();
var StepBallMover = (function () {
    function StepBallMover() {
        this.root = new SMNode(0);
        this.curr = this.root;
        this.dir = 1;
    }
    StepBallMover.prototype.draw = function (context) {
        this.root.draw(context, this.curr.i);
    };
    StepBallMover.prototype.update = function (cb) {
        var _this = this;
        this.curr.update(function () {
            _this.curr = _this.curr.getNext(_this.dir, function () {
                _this.dir *= -1;
            });
            cb();
        });
    };
    StepBallMover.prototype.startUpdating = function (cb) {
        this.curr.startUpdating(cb);
    };
    return StepBallMover;
})();
