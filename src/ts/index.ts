import '../scss/reset';
import '../scss/style';
import '../scss/modal-video';

import ModalVideo from 'modal-video';

import { locomotiveScroll } from './locomotiveScroll';
import { loadingAnim } from './loadingAnim';
import { btnHoverEffect, btnHoverCircleEffect, hamburgerBtnEffect } from './btnHoverAnim';
import { hamburgerBtnClick, hamburgerBtnClickA } from './hamburgerBtnClick';
import { hoverImage } from './hoverImage';
import { slider } from './slider';
import { progress } from './progress';
import { parallaxScroll } from './scrollAnim';
import { postGet } from './postGet';
import { postHoverAnim } from './postHoverAnim';
import { textHover } from './textHover';
import { smoothScroll, pageTopChengeHref } from './smoothScroll';
import { email } from './email';
import { mouseStalker } from './mouseStalker';
import { scrollImage } from './scrollImage';
import { textAnim } from './textAnim';
import { bgAnim } from './bgAnim';

const headerHamburgerDOM = document.querySelector('.header_hamburger') as HTMLElement;
const hamburgerLineDOM = document.querySelector('.hamburger_line') as HTMLElement;
const hamburgerLineCls1DOM = document.querySelector('.hamburger_line .cls-1') as HTMLElement;
const headerHamburgerDottedDOM = document.querySelectorAll('.header_hamburger .dotted') as NodeListOf<Element>;
const headerHamburgerCircleDOMs = document.querySelectorAll('.header_hamburger .circle') as NodeListOf<Element>;
const hamburgerLineCloseDOM = document.querySelector('.header_hamburger .close') as HTMLElement;
const headerHamburgerLineDOMs = document.querySelectorAll('.header_hamburger .line') as NodeListOf<Element>;
const smoothScrollTrigger = document.querySelectorAll('a[href^="#"]') as NodeListOf<HTMLElement>;
const pagetopBtnDOM = document.querySelector('.pagetop_btn') as HTMLElement;
const pagetopLineDOM = document.querySelector('.pagetop_line') as HTMLElement;
const pagetopLineCls1DOM = document.querySelector('.pagetop_line .cls-1') as HTMLElement;
const headerHamburgerMenuWrapDOM = document.querySelector('.header_hamburger_menu_wrap') as HTMLElement;
const headerHamburgerMenuInnerDOM = document.querySelector('.header_hamburger_menu_inner') as HTMLElement;
const headerHamburgerMenuListDOMs = document.querySelectorAll('.header_hamburger_menu_list') as NodeListOf<Element>;
const headerMenuLinkDOMs = document.querySelectorAll('.header_menu_link') as NodeListOf<HTMLElement>;
const footerMenuLinkDOMs = document.querySelectorAll('.footer_menu_link') as NodeListOf<HTMLElement>;
const pcSkillWrapDOMs = document.querySelectorAll('.skill_if_pc .skill_wrap') as NodeListOf<HTMLElement>;
const spSkillWrapDOMs = document.querySelectorAll('.skill_if_sp .skill_wrap') as NodeListOf<HTMLElement>;
const postsTitleWrapDOM = document.querySelector('.posts_title_wrap') as HTMLElement;
const postsTitleDOM = document.querySelector('.posts_title') as HTMLElement;
const postsWrapDOM = document.querySelector('.posts_wrap') as HTMLElement;
const worksImgWrapDOMs = document.querySelectorAll('.works_img_wrap') as NodeListOf<HTMLElement>;
const worksImgDOMs = document.querySelectorAll<HTMLImageElement>('.works_img')!;
const worksInfoBtnDOMs = document.querySelectorAll('.works_info_btn') as NodeListOf<HTMLElement>;
const postsBtnDOM = document.querySelector('.posts_btn') as HTMLElement;;
const contactSubmitDOM = document.querySelector('.contact_submit') as HTMLElement;
const btnList = [...worksInfoBtnDOMs, postsBtnDOM, contactSubmitDOM];
const contactFormDOM = document.querySelector('.contact_form') as HTMLElement;
const contactLineInputDOMs = document.querySelectorAll('.contact_line input') as NodeListOf<HTMLElement>;
const contactLinetextareaDOMs = document.querySelectorAll('.contact_line textarea') as NodeListOf<HTMLElement>;
const formList = [...contactLineInputDOMs, ...contactLinetextareaDOMs];
const mouseStalkerDOM = document.querySelector('.mouse_stalker') as HTMLElement;
const webgl01DOM = document.querySelector<HTMLElement>('.webgl01')!;
const webgl02DOM = document.querySelector<HTMLElement>('.webgl02')!;
const webgl03DOM = document.querySelector<HTMLElement>('.webgl03')!;
const webgl04DOM = document.querySelector<HTMLElement>('.webgl04')!;

postGet(postsWrapDOM);

locomotiveScroll();
loadingAnim();

new ModalVideo('.modal_video', {ratio: '16:9.3'});

email(contactFormDOM, formList);

headerMenuLinkDOMs.forEach(target => {
    textHover(target);
});
footerMenuLinkDOMs.forEach(target => {
    textHover(target);
});

hamburgerBtnClick(headerHamburgerDOM, hamburgerLineCloseDOM, headerHamburgerLineDOMs, headerHamburgerDottedDOM);
new hamburgerBtnClickA;

new hoverImage(headerHamburgerMenuWrapDOM, headerHamburgerMenuInnerDOM, headerHamburgerMenuListDOMs);

pcSkillWrapDOMs.forEach((target: HTMLElement, index) => {
    if(index % 2 == 0){
        slider(target);
    }else{
        slider(target, true);
    }
});
spSkillWrapDOMs.forEach((target: HTMLElement, index) => {
    if(index % 2 == 0){
        slider(target);
    }else{
        slider(target, true);
    }
});
slider(postsTitleDOM);

progress();

new scrollImage(worksImgDOMs, webgl02DOM);

const mediaQueryMin600 = window.matchMedia('(min-width: 600px)');
const mediaQuery = (event: any) => {
    if (event.matches) {
        btnList.forEach(target => {
            new btnHoverEffect(target);
        });
        new hamburgerBtnEffect(headerHamburgerDOM, hamburgerLineDOM, hamburgerLineCls1DOM, headerHamburgerCircleDOMs);
        new btnHoverCircleEffect(pagetopBtnDOM, pagetopLineDOM, pagetopLineCls1DOM);
        
        worksImgWrapDOMs.forEach((target, index) => {
            parallaxScroll(target);

            if(index == 3){
                new mouseStalker(mouseStalkerDOM, target, 'View Video');
            }else{
                new mouseStalker(mouseStalkerDOM, target);
            }
        });

        const postsTitleDOMs = document.querySelectorAll('.posts_title') as NodeListOf<Element>;
        new textAnim(postsTitleDOMs, postsTitleWrapDOM, webgl03DOM);
    } else {
        //
    }
};
mediaQueryMin600.addEventListener('change', mediaQuery);
mediaQuery(mediaQueryMin600);

new bgAnim(webgl04DOM);

setTimeout(() => {
    const postsInnersDOM = document.querySelectorAll('.posts_inner') as NodeListOf<Element>;
    new postHoverAnim(postsWrapDOM, postsInnersDOM);
    locomotiveScroll();
}, 2000);

smoothScroll(smoothScrollTrigger);
pageTopChengeHref(pagetopBtnDOM);