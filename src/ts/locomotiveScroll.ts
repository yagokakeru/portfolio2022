import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import LocomotiveScroll from 'locomotive-scroll';

const smoothScrollDOM = document.querySelector('.smooth_scroll') as HTMLElement;

gsap.registerPlugin(ScrollTrigger);

export const locoScroll = new LocomotiveScroll({
    el: smoothScrollDOM,
    smooth: true,
    lerp: 0.1,
    multiplier: 0.5,
});

export function locomotiveScroll() {
    locoScroll.on('scroll', () => {
        ScrollTrigger.update;
    });
    ScrollTrigger.scrollerProxy(smoothScrollDOM, {
        scrollTop(value) {
            return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
            return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
        },
        pinType: smoothScrollDOM.style.transform ? 'transform' : 'fixed'
    });
    ScrollTrigger.addEventListener('refresh', () => locoScroll.update());
    ScrollTrigger.refresh();
}