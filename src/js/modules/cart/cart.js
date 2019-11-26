
class Cart {
    constructor(){
        this.key = 'd75ff247-e041-480d-ad24-874cc8e01b1b';
        this.content = [];
    }
    init(){
        const cartButton = document.querySelector('#cartButton');
        const cartWRapper = document.querySelector('#cart');
        
        cartButton.addEventListener('click', ()=> {
            cartWRapper.classList.toggle('hidden');
        });
    
    };
    addItem(item){
        this.content.push(item);
        console.log(this.content);
    }



}


export {Cart as default};