import gsap from 'gsap';

export class btnHoverEffect {
    el: {
        target: HTMLElement;
        x: number;
        y: number;
        w: number;
        h: number;
    };
    gravity: number;
    mouse: {
        x: number;
        y: number;
        cx: number;
        cy: number;
    };
    flag: boolean;
    mouseMove: any;

    constructor(target: HTMLElement) {
        const data = target.getBoundingClientRect();
        this.el = {
            target: target,
            x: data.x,
            y: data.y,
            w: data.width,
            h: data.height,
        }
        this.gravity = Math.min(15, this.el.w / 2);
        this.mouse = {
            x: 0,
            y: 0,
            cx: 0,
            cy: 0,
        }
        this.flag = false;
        this.el.target.addEventListener('mouseenter', this.mouseEnter.bind(this), false);
        this.el.target.addEventListener('mouseleave', this.mouseLeave.bind(this), false);
        this.mouseMove = this._mouseMove.bind(this);
        window.addEventListener('scroll', this.adjustment.bind(this), false);
        window.addEventListener('resize', this.adjustment.bind(this), false);
        this.onRaf();
    }

    _mouseMove(event: MouseEvent) {
        this.mouse.x = gsap.utils.mapRange(this.el.x, this.el.x + this.el.w, -this.gravity, this.gravity, event.clientX);
        this.mouse.y = gsap.utils.mapRange(this.el.y, this.el.y + this.el.h, -this.gravity, this.gravity, event.clientY);
    }

    mouseEnter() {
        this.flag = true;
        gsap.to(this.el.target, {
            scale: 1.02,
            duration: 0.3,
        })
        addEventListener('mousemove', this.mouseMove);
    }

    mouseLeave() {
        this.flag = false;
        this.mouse.cx = 0;
        this.mouse.cy = 0;

        gsap.to(this.el.target, {
            x: 0,
            y: 0,
            scale: 1.0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.3)'
        })
        removeEventListener('mousemove', this.mouseMove);
    }

    adjustment() {
        const data = this.el.target.getBoundingClientRect();
        this.el = {
            target: this.el.target,
            x: data.x,
            y: data.y,
            w: data.width,
            h: data.height,
        }
    }

    onRaf() {
        if(this.flag){
            this.mouse.cx = gsap.utils.interpolate(this.mouse.cx, this.mouse.x, 0.1);
            this.mouse.cy = gsap.utils.interpolate(this.mouse.cy, this.mouse.y, 0.1);
            gsap.set(this.el.target, {
                x: this.mouse.cx,
                y: this.mouse.cy,
            });
        }

        requestAnimationFrame(this.onRaf.bind(this));
    }
}

export class btnHoverCircleEffect extends btnHoverEffect {
    target: HTMLElement;
    targetLine: HTMLElement;
    targetPath: HTMLElement;
    constructor(target: HTMLElement, targetLine: HTMLElement, targetPath: HTMLElement){
        super(target);
        this.target = target;
        this.targetLine = targetLine;
        this.targetPath = targetPath;
        this.hide(target);

        this.target.addEventListener('mouseover', this.mouseOverCircle.bind(this), false);
        this.target.addEventListener('mouseleave', this.mouseLeaveCircle.bind(this), false);
        this.set();
    }
    hide(target: HTMLElement) {
        console.log(`${target} hides!`);
    }

    set() {
        gsap.set(this.targetLine, {
            rotate: -90,
        });
        gsap.set(this.targetPath, {
            strokeDashoffset: 110,
            strokeDasharray: '0px, 999999px',
        });
    }

    mouseOverCircle() {
        gsap.set(this.targetPath, {
            strokeDasharray: 110,
        });
        gsap.to(this.targetPath, .5, {
            strokeDashoffset: 0,
            opacity: .4,
            ease: 'linear',
            overwrite: true,
            onComplete: () => {
                gsap.set(this.targetPath, {
                    strokeDasharray: 'none',
                    delay: .5,
                });
            }
        });
        gsap.to(this.targetLine, .5, {
            rotate: 90,
            ease: 'linear',
            overwrite: true,
        });
    }

    mouseLeaveCircle() {
        gsap.set(this.targetPath, {
            strokeDasharray: 110,
        });
        gsap.to(this.targetPath, .5, {
            strokeDashoffset: 110,
            opacity: 1,
            ease: 'linear',
            overwrite: true,
            onComplete: () => {
                gsap.set(this.targetPath, {
                    strokeDasharray: '0px, 99999px',
                    delay: .5,
                });
            }
        });
        gsap.to(this.targetLine, .5, {
            rotate: 830,
            ease: 'linear',
            overwrite: true,
        });
    }
}

export class hamburgerBtnEffect extends btnHoverCircleEffect {
    targetCircle: NodeListOf<Element>;
    constructor(target: HTMLElement, targetLine: HTMLElement, targetPath: HTMLElement, targetCircle: NodeListOf<Element>){
        super(target, targetLine, targetPath);
        this.targetCircle = targetCircle;
        this.target.addEventListener('mouseover', this.mouseOverHamburge.bind(this), false);
        this.target.addEventListener('mouseleave', this.mouseLeaveHamburge.bind(this), false);
    }

    mouseOverHamburge() {
        gsap.to(this.targetCircle, .2, {
            y: 0,
            ease: 'linear',
            overwrite: true,
        });
    }

    mouseLeaveHamburge() {
        gsap.to(this.targetCircle[0], .2, {
            y: -6,
            ease: 'linear',
            overwrite: true,
        });
        gsap.to(this.targetCircle[2], .2, {
            y: 6,
            ease: 'linear',
            overwrite: true,
        });
    }
}