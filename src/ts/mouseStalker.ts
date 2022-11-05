import gsap from 'gsap';

export class mouseStalker {
    mouseTarget: {
        el: HTMLElement;
        width: number;
        height: number;
    };
    hoverTarget: HTMLElement;
    btnText: string;
    mouse: {
        x: number;
        y: number;
    }

    constructor(mouseTarget: HTMLElement, hoverTarget: HTMLElement, btnText: string = 'View Site') {
        const data = mouseTarget.getBoundingClientRect();
        this.mouseTarget = {
            el: mouseTarget,
            width: data.width,
            height: data.height
        };
        this.hoverTarget = hoverTarget;
        this.btnText = btnText;

        this.mouse = {
            x: 0,
            y: 0
        }

        this.hoverTarget.addEventListener('mouseover', this.mouseover.bind(this));
        this.hoverTarget.addEventListener('mouseleave', this.mouseleave.bind(this));
        window.addEventListener('mousemove', this.mousemove.bind(this));
    }

    mouseover() {
        gsap.to(this.mouseTarget.el, .2, { autoAlpha: 1, ease: 'linear' });
        this.mouseTarget.el.textContent = this.btnText
    }

    mouseleave() {
        gsap.to(this.mouseTarget.el, .2, { autoAlpha: 0, ease: 'linear' });
    }

    mousemove(event: MouseEvent) {
        this.mouse.x = event.clientX - this.mouseTarget.width / 2;
        this.mouse.y = event.clientY - this.mouseTarget.height / 2;

        gsap.to(this.mouseTarget.el, 2, { x: this.mouse.x, y: this.mouse.y, ease: 'Power1.easeOut' });
    }
}