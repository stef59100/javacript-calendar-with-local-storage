class Products {
    constructor() {
        this.products = require('./data/products.json');
    }

    async getProducts() {
        //const response = await fetch(this.products);

        //const data = await response.json();
        const data = this.products;
        //console.log(data[0]);
        return data;
        
    };
}
export {Products as default};