import gsap from 'gsap';

gsap.registerEffect({
    name: 'autoAlpha',
    defaults: {duration: .3},
    effect: (targets: string, config: any) => {
        return gsap.fromTo(targets, config.duration, {
            autoAlpha: 0,
        },{
            autoAlpha: 1,
            ease: 'Power4.easeOut',
        })
    },
    extendTimeline: true,
});

function textSpan(textTarget: Element) {
    const string = textTarget.textContent;
    let textHTML = '';

    if(string !== null){
        string.split('').forEach(text =>{
            textHTML += `<span style="display: inline-block;">${text}</span>`;
        });
        textTarget.innerHTML = textHTML;
    }else{
        //
    }
}

export function loadingAnim() {
    const headerLogoSubDOM = document.querySelector('.header_logo_sub');
    if(headerLogoSubDOM !== null){
        textSpan(headerLogoSubDOM);
    }

    addEventListener ('load', ()=> {
        gsap.timeline()
        .autoAlpha('.header_logo_link', {duration: 1})
        .autoAlpha('.pagetop_btn', {duration: 1}, '<')
        .fromTo('.header_menu_link', 1, {
            autoAlpha: 0,
            y: 50,
        },{
            autoAlpha: 1,
            y: 0,
            ease: 'Power4.easeOut',
            stagger: {
                each: .05
            },
        }, '<')
        .fromTo('.mv_head', 2, {
            autoAlpha: 0,
            yPercent: 100,
        },{
            autoAlpha: 1,
            yPercent: 0,
            ease: 'Power4.easeOut',
            stagger: {
                each: .1
            },
        }, '-=.5')
        .to('.header_logo_sub span', .8, {
            keyframes: [
                {
                    y: -5,
                },
                {
                    y: 0,
                }
            ],
            repeat: -1,
            repeatDelay: 5,
            ease: 'Power4.easeOut',
            stagger: {
                each: .03
            },
        }, '>')
    });
}