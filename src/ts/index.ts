import '../scss/reset';
import '../scss/style';

// import gsap from 'gsap';

import { btnHoverEffect, btnHoverCircleEffect, hamburgerBtnEffect } from './btnHoverAnim';
import { hamburgerBtnClick } from './hamburgerBtnClick';

const headerHamburgerDOM = document.querySelector('.header_hamburger') as HTMLElement;
const hamburgerLineDOM = document.querySelector('.hamburger_line') as HTMLElement;
const hamburgerLineCls1DOM = document.querySelector('.hamburger_line .cls-1') as HTMLElement;
const headerHamburgerDottedDOM = document.querySelectorAll('.header_hamburger .dotted') as NodeListOf<Element>;
const headerHamburgerCircleDOMs = document.querySelectorAll('.header_hamburger .circle') as NodeListOf<Element>;
const hamburgerLineCloseDOM = document.querySelector('.header_hamburger .close') as HTMLElement;
const headerHamburgerLineDOMs = document.querySelectorAll('.header_hamburger .line') as NodeListOf<Element>;
const pagetopBtnDOM = document.querySelector('.pagetop_btn') as HTMLElement;


// addEventListener('load', () => {
    new hamburgerBtnEffect(headerHamburgerDOM, hamburgerLineDOM, hamburgerLineCls1DOM, headerHamburgerCircleDOMs);
    new btnHoverEffect(pagetopBtnDOM);
// });

hamburgerBtnClick(headerHamburgerDOM, hamburgerLineCloseDOM, headerHamburgerLineDOMs, headerHamburgerDottedDOM);