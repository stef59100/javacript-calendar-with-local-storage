import '../css/main.scss';
import Products from './modules/products/fetchproducts';
import { BuildUi, Storage } from './modules/products/buildUi';

import toggleGridList from './modules/tools/toggle';
import convertToTabs from './modules/tools/nav';

const productList = new Products();
const displayUi = new BuildUi();
displayUi.setupApp();

productList.getProducts()
    .then(data => {
        //updateUi(data);
        displayUi.displayProducts(data);
        Storage.saveProducts(data);
    }).then(() => {
        displayUi.getCartButtons();
        displayUi.showCart();
        displayUi.cartLogic();
    })
    .catch(err => console.log(err));

// console.log(productList);





// const updateUi = data => {
//     const row = document.createElement('div');
//     row.classList.add('row', 'grid');
//     container.appendChild(row);
//     const details = data;

//     details.forEach(
//         element => {
//             const divProduct = document.createElement('div');
//             divProduct.setAttribute('data-href', element.Link);
//             const innerDiv = document.createElement('div');
//             const title = document.createElement('h1');

//             const figure = document.createElement('figure');
//             const visuel = document.createElement('img');
//             visuel.classList.add('left', "pos-1");
//             visuel.setAttribute('src', element.Image);
//             let widthImage;
//             if (element.Image.includes('wid=250')) {
//                 widthImage = 250;
//             }
//             visuel.setAttribute('width', widthImage);
//             figure.appendChild(visuel);

//             const titleContent = `${element.Type} <strong>${element.Marque}</strong> ${element.Produit}`;
//             title.classList.add('heading', 'thin');
//             title.innerHTML = titleContent;

//             const price = document.createElement('p');
//             price.classList.add('price', 'heading');
//             price.textContent = `${element.Prix} ${element.currency}`;

//             const odr = document.createElement('p');
//             odr.classList.add('odr');
//             const colourUL = document.createElement('ul');
//             colourUL.classList.add('colors');

//             for (let prop in element.colors) {
//                 console.log(`${element.colors[prop]}`);
//                 let colorItem = document.createElement('li');
//                 let colorInnerSpan = document.createElement('span');
//                 colorInnerSpan.setAttribute("style", `background-color : ${element.colors[prop]}`);
//                 colorItem.appendChild(colorInnerSpan);
//                 colourUL.appendChild(colorItem);
//             }

//             const caracsContainer = document.createElement('div');
//             caracsContainer.classList.add('slice', 'grid-hidden');
//             const caracsHeader = document.createElement('div');
//             const caracsNav = document.createElement('ul');
//             caracsNav.classList.add('nav');

//             const navElt1 = document.createElement('li');
//             const navElt2 = document.createElement('li');

//             const caracsTitle = document.createElement('a');
//             const caracsTitle1 = document.createElement('a');

//             caracsTitle.textContent = "Caractéristiques";
//             caracsTitle.setAttribute('data-href', `caracteristique_${element.id}`);
//             caracsTitle1.textContent = "Fonctionnalités";
//             caracsTitle1.setAttribute('data-href', `fonctionnalites_${element.id}`);



//             const caracsInner = document.createElement('ul');
//             caracsInner.setAttribute('id', `caracteristique_${element.id}`);
//             navElt1.appendChild(caracsTitle);
//             navElt2.appendChild(caracsTitle1);
//             caracsNav.appendChild(navElt1);
//             caracsNav.appendChild(navElt2);
//             caracsHeader.appendChild(caracsNav);
//             caracsContainer.appendChild(caracsHeader);
//             for (let carac in element.caracs) {

//                 let caracItem = document.createElement('li');
//                 caracItem.textContent = element.caracs[carac];
//                 caracsInner.appendChild(caracItem);
//             }
//             caracsContainer.appendChild(caracsInner);

//             const fonctionnalites = document.createElement('ul');
//             fonctionnalites.setAttribute('id', `fonctionnalites_${element.id}`);
//             for (let fonctionnalite in element.fonctionnalites) {

//                 let fxItem = document.createElement('li');
//                 fxItem.textContent = `${fonctionnalite} : ${element.fonctionnalites[fonctionnalite]}`;
//                 fonctionnalites.appendChild(fxItem);
//             }
//             caracsContainer.appendChild(fonctionnalites);

//             if (element.Odr != "") {
//                 odr.textContent = `${element.Odr}`;
//             }

//             const cta = document.createElement('a');
//             // cta.setAttribute('href', element.Link);
//             cta.classList.add('brand-primary', 'base', 'btn', 'js-addToCart');
//             cta.textContent = "Ajouter au panier";



//             divProduct.appendChild(innerDiv);

//             divProduct.appendChild(figure);
//             innerDiv.appendChild(title);
//             if (element.Odr != "") {
//                 innerDiv.appendChild(odr);
//             }
//             innerDiv.appendChild(price);
//             innerDiv.appendChild(cta);
//             cta.addEventListener('click', shoppingCart.addItem(element));
//             innerDiv.appendChild(colourUL);
//             innerDiv.classList.add('right', 'white', "pos-2", "grow-1");

//             divProduct.appendChild(caracsContainer);
//             divProduct.classList.add('col', 's12', 'm3', 'between');

//             row.appendChild(divProduct);
//             const divider = document.createElement('div');
//             divider.classList.add('divider');
//             row.appendChild(divider);
//         });
//     toggleGridList(row);
//     convertToTabs();

// };