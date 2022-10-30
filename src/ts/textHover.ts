import gsap from 'gsap';

export function textHover(target: HTMLElement){
    target.addEventListener('mouseover', () => {
        gsap.fromTo(target, .5,
            { '--hover-line-pos': '-100%' },
            { '--hover-line-pos': '0%', ease: 'Power4.easeOut' }
        );
    });
    target.addEventListener('mouseleave', () => {
        gsap.to(target, .5, { '--hover-line-pos': '100%', ease: 'Power4.easeOut' });
    });
}