import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function progress() {
    const pathDOMs: NodeListOf<SVGGeometryElement> = document.querySelectorAll('.skill_value_progress path');
    const skillValueNumberDOMs = document.querySelectorAll('.skill_value_number');

    pathDOMs.forEach((target, index) => {
        const skillValueNumber = skillValueNumberDOMs[index].textContent;
        skillValueNumberDOMs[index].textContent = '';

        const pathLength = target.getTotalLength();
        target.style.strokeDasharray = String(pathLength);
        target.style.strokeDashoffset = String(pathLength);

        gsap.to(target, 3, {
            strokeDashoffset: 0,
            ease: 'Power1.easeOut',
            scrollTrigger: {
                trigger: '.section_skill',
                start: 'top bottom',
                scroller: '.smooth_scroll',
            },
            onUpdate: () => {
                const currentStrokeDashoffset = Number(target.style.strokeDashoffset.replace(/[^0-9.]/g, ''));
                const currentNumber = Math.floor( Math.abs( currentStrokeDashoffset / pathLength - 1) * Number(skillValueNumber ) );

                skillValueNumberDOMs[index].textContent = String(currentNumber);
            }
        });
    });
}