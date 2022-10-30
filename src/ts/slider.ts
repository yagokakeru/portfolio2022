import gsap from 'gsap';

export function slider(target: HTMLElement, reverse: boolean = false) {
    const cloneHTML = target.outerHTML;
    target.insertAdjacentHTML('beforebegin', cloneHTML);

    const targetClass = target.className;
    const targetIndex = target.dataset.index;
    let targetName;
    if(targetIndex !== undefined){
        targetName = `.${targetClass}[data-index="${targetIndex}"]`;
    }else{
        targetName = `.${targetClass}`;
    }

    gsap.registerEffect({
        name: 'loopSlider',
        defaults: {
            duration: 50,
            delay: 0,
            repeat: -1,
            ease: 'linear',
            xPercentFrom: 0,
            xPercentTo: -100,
        },
        effect: (targets: string, config: any) => {
            return gsap.fromTo(targets, config.duration, {
                xPercent: config.xPercentFrom,
            },
            {
                delay: config.delay,
                repeat: config.repeat,
                ease: config.ease,
                xPercent: config.xPercentTo,
            })
        },
    });

    if(reverse){
        gsap.effects.loopSlider(`${targetName}:nth-child(1)`, { xPercentFrom: -100, xPercentTo: 0, });
        gsap.effects.loopSlider(`${targetName}:nth-child(2)`, { xPercentFrom: -100, xPercentTo: 0, delay: -100, });
    }else{
        gsap.effects.loopSlider(`${targetName}:nth-child(1)`);
        gsap.effects.loopSlider(`${targetName}:nth-child(2)`, { delay: -100, });
    }
}