import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

import { locoScroll } from './locomotiveScroll';

gsap.registerPlugin(ScrollTrigger);

export function smoothScroll(clickTargets: NodeListOf<HTMLElement>) {
    clickTargets.forEach(element => {
        element.addEventListener('click', (event) => {
            event.preventDefault();

            const elementHref = element.getAttribute('href');
            const scrollTarget = document.querySelector(`${elementHref}`);
            if(elementHref == '#section_mv'){
                locoScroll.scrollTo(scrollTarget);
            }else{
                locoScroll.scrollTo(scrollTarget, { offset: -100 });
            }
        });
    });
}

export function pageTopChengeHref(target: HTMLElement) {
    locoScroll.on('scroll', (args: any) => {
        const currentElements = Object.keys(args.currentElements);
        const currentLocation  = currentElements[0];

        if(currentLocation == 'section_mv'){
            target.setAttribute('href', '#section_career');
            gsap.to('.pagetop_icon', 1, {
                rotate: 180,
                ease: 'Power4.easeOut'
            });
        }else if(currentLocation == 'section_career'){
            target.setAttribute('href', '#section_skill');
            gsap.to('.pagetop_icon', 1, {
                rotate: 180,
                ease: 'Power4.easeOut'
            });
        }else{
            target.setAttribute('href', '#section_mv');
            gsap.to('.pagetop_icon', 1, {
                rotate: 0,
                ease: 'Power4.easeOut'
            });
        }
    });
}