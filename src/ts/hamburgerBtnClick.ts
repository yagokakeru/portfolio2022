import gsap from 'gsap';

const tl = gsap.timeline({pause: true});

export class hamburgerBtnClickA {
    inCanvas: HTMLElement | null;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D | null;
    canvasSize: {
        width: number;
        heigth: number;
    };
    animHeight: number;
    point: {
        currentY: number;
        curveY: number;
        pointY: number;
    }
    event: HTMLElement | null;
    
    constructor() {
        this.inCanvas = document.querySelector('.header_hamburger_menu_wrap');
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');

        this.canvasSize = {
            width: window.innerWidth,
            heigth: window.innerHeight,
        }

        this.canvas.width = this.canvasSize.width * Math.min(2, window.devicePixelRatio);
        this.canvas.height = this.canvasSize.heigth * Math.min(2, window.devicePixelRatio);

        this.canvas.style.width = `${this.canvasSize.width}px`;
        this.canvas.style.height = `${this.canvasSize.heigth}px`;
        if(this.inCanvas !== null){
            this.inCanvas.appendChild(this.canvas);
        }else{
            //
        }

        this.animHeight = this.canvas.height;
        this.point = {
            currentY: 0,
            curveY: 0,
            pointY: 0,
        }

        this.event = document.querySelector('.header_hamburger');
        if(this.event !== null){
            this.event.addEventListener('click', () => {
                this.init();
            });
        }else{
            //
        }
        window.addEventListener('resize', this.onResize.bind(this), false);
    }

    init() {
        gsap.registerEffect({
            name: 'curve',
            effect: (target: EventTarget) => {
                const tl = gsap.timeline({
                    onUpdate: () => {
                        this.cureveUpdate();
                    },
                    onStart: () => {
                        if(this.animHeight > 0){
                            this.animHeight = 0;
                        }else{
                            this.animHeight = this.canvas.height;
                        }
                    }
                })
                .to(target, .3, {
                    pointY: this.animHeight,
                }, '<')
                .to(target, .7, {
                    curveY: this.animHeight,
                    ease: 'power4.out',
                }, '<')
                .to(target, .7, {
                    currentY: this.animHeight,
                    ease: 'power4.out',
                } , '-=.45');
                return tl;
            }
        });

        const tl = gsap.timeline()
        .add(gsap.effects.curve(this.point));
    }

    cureveUpdate() {
        if(this.ctx !== null){
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = 'rgba(0,0,0,0)';

            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#ebe3e4';

            this.ctx.beginPath();
            this.ctx.moveTo(0,0);
            this.ctx.lineTo(0, this.point.pointY);
            this.ctx.quadraticCurveTo(this.canvas.width, this.point.curveY, this.canvas.width, this.point.currentY);
            this.ctx.lineTo(this.canvas.width, 0);
            this.ctx.closePath();
            this.ctx.fill();
        }
    }

    onResize() {
        this.canvasSize = {
            width: window.innerWidth,
            heigth: window.innerHeight,
        }

        this.canvas.width = this.canvasSize.width * Math.min(2, window.devicePixelRatio);
        this.canvas.height = this.canvasSize.heigth * Math.min(2, window.devicePixelRatio);

        this.canvas.style.width = `${this.canvasSize.width}px`;
        this.canvas.style.height = `${this.canvasSize.heigth}px`;

        if(this.ctx !== null){
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = 'rgba(0,0,0,0)';

            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#ebe3e4';

            this.ctx.beginPath();
            this.ctx.moveTo(0,0);
            this.ctx.lineTo(0, this.point.pointY);
            this.ctx.quadraticCurveTo(this.canvas.width, this.point.curveY, this.canvas.width, this.point.currentY);
            this.ctx.lineTo(this.canvas.width, 0);
            this.ctx.closePath();
            this.ctx.fill();
        }

    }
}

export function hamburgerBtnClick(target: HTMLElement, targetClose: HTMLElement, targetLine: NodeListOf<Element>, targetDotted: NodeListOf<Element>){
    target.addEventListener('click', () => {
        let from;
        if (window.matchMedia('(min-width: 961px)').matches) {
            from = 5;
        } else {
            from = 0;
        }

        if(target.classList.contains('active') !== true){
            tl.to(targetClose, .3, {
                scale: '1, 1'
            })
            .to(targetDotted, .2, {
                scale: 0
            }, '<')
            .to(targetLine[0], .2, {
                backgroundColor: '#2b2b2b',
                rotate: 45
            }, '+=.2')
            .to(targetLine[1], .2, {
                backgroundColor: '#2b2b2b',
                rotate: -45
            }, '<');

            gsap.timeline()
            .to('.header_hamburger_menu_wrap', .3, {
                autoAlpha: 1,
                overwrite: 'auto',
            })
            .to('.header_logo, .header_menu_link', .3, {
                color: '#2b2b2b'
            }, '<')
            .to('.header_hamburger_menu_link', 1.2, {
                y: 0,
                overwrite: 'auto',
                ease: 'power4.out',
                stagger: {
                    each: 0.2,
                    from: from,
                },
            }, '+=.3');

            target.classList.add('active');
        }else{
            tl.to(targetLine, .2, {
                backgroundColor: '#ebe3e4',
                rotate: 0
            })
            .to(targetClose, .3, {
                scale: '0, 1'
            }, '+=.2')
            .to(targetDotted, .2, {
                scale: 1
            });

            gsap.timeline().to('.header_hamburger_menu_link', .5, {
                y: '100%',
                overwrite: 'auto',
                ease: 'power4.in',
            })
            .to('.header_hamburger_menu_wrap', .5, {
                autoAlpha: 0,
                overwrite: 'auto',
                ease: 'power4.in',
            }, '<')
            .to('.header_logo, .header_menu_link', .3, {
                color: '#ebe3e4'
            }, '<');

            target.classList.remove('active');
        }
    });
}
