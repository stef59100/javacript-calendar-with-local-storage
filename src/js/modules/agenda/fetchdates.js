class Agenda {
    constructor() {
        this.evenements = require('./data/agenda.json');
    }

    async getDates() {
        //const response = await fetch(this.products);

        //const data = await response.json();
        const data = this.evenements;
        //console.log(data[0]);
        return data;
        
    };
}
export {Agenda as default};