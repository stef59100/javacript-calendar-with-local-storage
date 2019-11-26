const container = document.querySelector('.row');
const cartButton = document.querySelector('#cartButton');
const cartTotal = document.querySelector('.cartTotal');
const cartContent = document.querySelector('.cartContent');
const cartContainer = document.querySelector('#cart');
const cartClose = document.querySelector('.close-cart');
const cartClear = document.querySelector('.clear-cart');
const overlay = document.querySelector('.overlay');
let cart = [];
let buttonsDOM = [];
class BuildUi {
    
    displayProducts(products) {
        let result = container.innerHTML;
        products.forEach(
            product => {
                result += `
                <div class="col s12 m3 between">
                <div class="right white pos-2 grow-1">
                <h1 class="heading thin">${product.Type} <strong>${product.Marque}</strong> ${product.Produit}</h1>
                <p class="odr">${product.Odr}</p>
                <p class="price heading">${product.Prix} ${product.currency}</p>
                <button data-id=${product.id} class="brand-primary base btn js-addToCart">Ajouter au panier</button>
                
                </div>
                <figure><img src="${product.Image}" alt="${product.Type} " class="left pos-1"></figure>
                <div class="slice grid-hidden"></div>
                
                </div>`;
                container.innerHTML = result;
            }
            )
        }
        //On recupere tous les boutons "ajouter au panier"
        getCartButtons() {
            const buttons = [...document.querySelectorAll('.js-addToCart')];
            buttonsDOM = buttons;
            
            buttons.forEach(button => {
                let id = button.dataset.id;                
                let inCart = cart.find(item => item.id === id);
                if (inCart) {
                    //On parcours le panier, si il y a dans le panier un item avec le même id que le dataset du bouton, on desactive le bouton 
                    button.innerText = "Ajouté";
                    button.disabled = true;                   
                }
                button.addEventListener('click', (event) => {
                   
                    event.target.innerText = "Ajouté";
                    event.target.disabled = true;
                    
                    //On recupere le produit
                    let cartItem = {
                        ...Storage.getProducts(id),
                        amount: 1
                    };
                    //on ajoute le produit au panier
                    cart = [...cart, cartItem];
                    //On stocke dans local storage
                    Storage.saveCart(cart);
                    //set cart values
                    this.setCartValues(cart);
                    //display cart items
                    this.showCartItem(cartItem);
                    //display cart                  
                })
            });
            
        }
        setCartValues(cart) {
            let tempTotal = 0;
            let itemsTotal = 0;
            cart.map(item => {
                tempTotal += item.Prix * item.amount;
                itemsTotal += item.amount;
            })
            cartButton.innerHTML = `Panier <span class="badge">(${itemsTotal})</span>`;
            cartTotal.innerHTML = `${parseFloat(tempTotal.toFixed(2))} €`;
        }
        showCartItem(item) {
            const div = document.createElement('div');
            div.classList.add('cart-item', 'row');
            div.innerHTML = `
            <figure class="col s12 l1">
            <img src="${item.Image}" alt="${item.Type} ${item.Marque} ${item.Produit}" class="img-fluid">
            </figure>
            <div class="col s12 l10 ">
            <div class="row"> 
            <h4 class="cart-item-title col s12 l6">${item.Type} ${item.Marque} ${item.Produit}</h4>
            
            <p class="cart-item-amount col l2">${item.Prix} €</p>
            <button class="cart-item-remove remove-item btn col l2" data-id="${item.id}">supprimer</button>
            <div class="qty_control col l2">
            <button class="btn-qty remove-one brand-primary white-text btn base" data-id="${item.id}">-</button>
            <span class="item-amount" data-id="${item.id}">${item.amount}</span>
            <button class="btn-qty add-one brand-primary white-text btn base" data-id="${item.id}">+</button>
            </div>
            </div>
            </div>
            <div class="divider"></div>`;             
            cartContent.appendChild(div);            
        }
        
        showCart() {
            cartButton.addEventListener('click', () => {
                cartContainer.classList.toggle('hidden');
                overlay.classList.toggle('hidden');
            })
            cartClose.addEventListener('click', () => {
                this.hideCart();
            })
        }
        hideCart() {
            cartContainer.classList.toggle('hidden');
            overlay.classList.toggle('hidden');
        }
        setupApp() {
            cart = Storage.getCart();
            this.setCartValues(cart);
            this.populateCart(cart);
        }
        populateCart(cart) {
            cart.forEach(item => {
                this.showCartItem(item);
            })
        }
        cartLogic() {
            //Suppression du panier
            cartClear.addEventListener('click', () => {
                this.clearCart()
            });
            //fonctionnalites panier
            cartContent.addEventListener('click', (e) => {
                if (e.target.classList.contains('remove-one')) {
                    let decreaseAmount = e.target;
                    let id = decreaseAmount.dataset.id;
                    this.decreaseItem(decreaseAmount, id);
                    
                } else if (e.target.classList.contains('add-one')) {
                    let addAmount = e.target;
                    let id = addAmount.dataset.id;
                    this.increaseItem(addAmount, id);
                    
                } else if (e.target.classList.contains('remove-item')) {
                    let removeItem = e.target;
                    let cartParent = e.target.parentElement.parentElement.parentElement;
                    console.log(cartParent);
                    
                    this.removeItem(removeItem.dataset.id);
                    cartContent.removeChild(cartParent);                    
                }
            })
        }
        clearCart() {
            let cartItems = cart.map(item => item.id);
            cartItems.forEach(id => this.removeItem(id));
            while (cartContent.length > 0) {
                cartContent.removeChild(cartContent.children[0]);
            }
           this.toggleCartButton();
            this.hideCart();
            
            
        }
        removeItem(id) {
            cart = cart.filter(item => item.id !== id);
            this.setCartValues(cart);
            Storage.saveCart(cart);
            let button = this.getSingleButton(id);
            button.disabled = false;
            button.textContent = 'Ajouter au panier';
        }
        getSingleButton(id) {
            return buttonsDOM.find(button => button.dataset.id === id);
        }
        
        //clic sur le btn -
        decreaseItem(decreaseAmountBtn, id) {
            let tempItem = cart.find(item => item.id === id);
            tempItem.amount = tempItem.amount - 1;
            if (tempItem.amount > 0) {
                Storage.saveCart(cart);
                this.setCartValues(cart);
                decreaseAmountBtn.nextElementSibling.innerText = tempItem.amount;
            } else {
                let cartParent = decreaseAmountBtn.parentElement.parentElement.parentElement.parentElement;
                cartContent.removeChild(cartParent);
                this.removeItem(id);
            }
        }
        
        //clic sur le btn +
        increaseItem(increaseAmountBtn, id) {
            let tempItem = cart.find(item => item.id === id);
            
            tempItem.amount++;
            Storage.saveCart(cart);
            this.setCartValues(cart);
            increaseAmountBtn.previousElementSibling.innerText = tempItem.amount;
            
        }
        toggleCartButton (){
            cartButton.disabled ? cartButton.disabled = false: cartButton.disabled=true;
        }
        
    }
    class Storage {
        static saveProducts(products) {
            localStorage.setItem("products", JSON.stringify(products));
        }
        static getProducts(id) {
            let products = JSON.parse(localStorage.getItem('products'));
            return products.find(product => product.id === id);
        }
        static saveCart(cart) {
            localStorage.setItem("cart", JSON.stringify(cart));
        }
        static getCart() {
            return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
            
        }
    };
    
    export {
        BuildUi,
        Storage
    };