let requestURL = 'https://kakechimaru.com/wp-json/wp/v2/posts?_embed';
let request = new XMLHttpRequest();
request.open('GET', requestURL);
request.withCredentials = true;
request.responseType = 'json';
request.send();

export function postGet(target: HTMLElement) {
    request.addEventListener('load', () => {
        const superHeroes = request.response;
        populateHeader(superHeroes, target);
    });
}

function populateHeader(post: any, target: HTMLElement) {
    let postHTML = '';
    for(let i = 0; i < 5; i++){
        postHTML += `<div class="posts_inner">`;
        postHTML += `<a class="posts_line" href="${post[i]['link']}" target="_blank">${post[i]['title']['rendered']}</a>`;
        postHTML += `<img class="posts_img" src="${post[i]['_embedded']['wp:featuredmedia'][0]['source_url']}" alt="${post[i]['title']['rendered']}">`;
        postHTML += `</div>`;
    }
    target.insertAdjacentHTML('afterbegin', postHTML);
}