/**
 * EmailJS使用
 * https://dashboard.emailjs.com/
 */
import emailjs from '@emailjs/browser';

const userId = 'D6KUY7qxb2eZgsd1Q';
const serviceId = 'service_pcvxvcb';
const templateId = 'template_7dj7dg8';

emailjs.init(userId);
export function email(formTarget: HTMLElement, valueTarget: HTMLElement[]) {
    formTarget.addEventListener('submit', (event) => {
        event.preventDefault();
    
        emailjs.sendForm(serviceId, templateId, `.${formTarget.className}`)
        .then((response) => {
            console.log('SUCCESS!', response.status, response.text);

            valueTarget.forEach((target: any) => {
                target.value = '';
            });
        }, (err) => {
            console.log('FAILED...', err);
        });
    });
}