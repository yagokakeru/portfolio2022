import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

gsap.registerEffect({
    name: 'parallaxis',
    defaults: {
        duration: 5,
        y: -100,
    },
    effect: (targets: string, config: any) => {
        return gsap.to(targets, config.duration, {
            y: config.y,
            scrollTrigger: {
                trigger: targets,
                start: 'top bottom',
                scrub: 1,
                scroller: '.smooth_scroll',
            }
        })
    },
});

export function parallaxScroll(target: Element){
    gsap.effects.parallaxis(target);
}