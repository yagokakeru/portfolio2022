import gsap from 'gsap';

const tl = gsap.timeline({pause: true});

export class hamburgerBtnClick {
    inCanvas: HTMLElement | null;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D | null;
    canvasSize: {
        width: number;
        heigth: number;
    };
    point: {
        currentY: number;
        curveY: number;
    }
    constructor() {
        // const str = 'Thankyou for watching';
        // let text = '';
        // str.split('').forEach(v => {
        //     text += `<span>${v}</span>`;
        // });
        // document.querySelector('.-text').innerHTML = text;

        // gsap.set('span', {
        //     opacity: 0,
        //     y: 50,
        // });

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
        this.inCanvas.appendChild(this.canvas);

        this.point = {
            currentY: this.canvas.height,
            curveY: this.canvas.height,
        }

        this.init();
    }

    init() {
        gsap.registerEffect({
            name: 'curve',
            defaults: {
                flag: true,
            },
            effect: (target, config) => {
                const tl = gsap.timeline({
                    onUpdate: () => {
                        this.cureveUpdate(config.flag);
                    }
                })
                .to(target, {
                    duration: 0.8,
                    curveY: 0,
                    ease: 'power4.out',
                })
                .to(target, {
                    currentY: 0,
                    duration: 0.8,
                }, '<');
                return tl;
            }
        });

        const tl = gsap.timeline({delay: 1})
        .add(gsap.effects.curve(this.point))
        // .add(this.textAnim.bind(this))
        .set(this.point, {
            currentY: this.canvas.height,
            curveY: this.canvas.height,
        })
        .add(gsap.effects.curve(this.point, {flag: false}), '+=2')
        .from('.visual img', {
            autoAlpha: 0,
            y: 15,
            duration: 1,
        }, '-=0.5')
    }

    // textAnim() {
    //     const tl = gsap.timeline()
    //     .to('span', {
    //         opacity: 1,
    //         y: 0,
    //         duration: 1,
    //         ease: 'back.out(3)',
    //         stagger: {
    //             each: 0.02,
    //         }
    //     })
    //     .to('span', {
    //         opacity: 0,
    //         y: -100,
    //         duration: 0.6,
    //         ease: 'back.in(2)',
    //         stagger: {
    //             each: 0.01,
    //             ease: 'power2',
    //         }
    //     }, '-=0.2')

    //     return tl;
    // }

    cureveUpdate(flag: boolean) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#01031D';

        if(flag) {
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#fff';
        }

        this.ctx.beginPath();
        this.ctx.moveTo(0,0);
        this.ctx.lineTo(0, this.point.currentY);
        this.ctx.quadraticCurveTo(this.canvas.width / 2, this.point.curveY, this.canvas.width, this.point.currentY);
        this.ctx.lineTo(this.canvas.width, 0);
        this.ctx.closePath();
        this.ctx.fill();

    }
}

export function hamburgerBtnClick(target: HTMLElement, targetClose: HTMLElement, targetLine: NodeListOf<Element>, targetDotted: NodeListOf<Element>){
    target.addEventListener('click', () => {
        if(target.classList.contains('active') !== true){
            tl.to(targetClose, .3, {
                scale: '1, 1'
            })
            .to(targetDotted, .2, {
                scale: 0
            }, '<')
            .to(targetLine[0], .2, {
                rotate: 45
            }, '+=.2')
            .to(targetLine[1], .2, {
                rotate: -45
            }, '<');

            target.classList.add('active');
        }else{
            tl.to(targetLine, .2, {
                rotate: 0
            })
            .to(targetClose, .3, {
                scale: '0, 1'
            }, '+=.2')
            .to(targetDotted, .2, {
                scale: 1
            });

            target.classList.remove('active');
        }
    });
}