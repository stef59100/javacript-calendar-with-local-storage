let events = [];
let agendaWithEvents;
let formDiv = document.querySelector('.js-eventForm');
const overlayDOM = document.querySelector(".js-overlay");
const DateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

class BuildUi {
    constructor() {
        this.domElement = document.querySelector("#agenda");
        this.time = new Date();
        this.year = this.time.getFullYear();
        this.month = this.time.getMonth();
        this.content = document.createElement('div');
        this.monthDiv = document.createElement('div');

        // Liste des mois
        this.monthList = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'aôut', 'septembre', 'octobre', 'novembre', 'décembre'];
        // Liste des jours de la semaine
        this.dayList = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
        //Date actuelle à laquelle le calendrier va etre initialisé

        this.time.setHours(0, 0, 0, 0);
        // Mois actuel
        this.currentMonth = new Date(this.year, this.month, 1);
    }

    displayAgenda() {
        //construction du header
        let header = document.createElement('div');
        header.classList.add('header', 'deep-orange', 'base');
        this.domElement.appendChild(header);
        //Affichage des jours
        this.content.classList.add('content', 'row');

        this.domElement.appendChild(this.content);
        // Bouton "précédent"
        let previousButton = document.createElement('button');
        previousButton.setAttribute('data-action', '-1');
        previousButton.classList.add('btn', 'js-nav');
        previousButton.textContent = '\u003c';
        header.appendChild(previousButton);

        // Div qui contiendra le mois/année affiché
        this.monthDiv.classList.add('month');
        header.appendChild(this.monthDiv);

        // Bouton "suivant"
        let nextButton = document.createElement('button');
        nextButton.setAttribute('data-action', '1');
        nextButton.textContent = '\u003e';
        nextButton.classList.add('btn', 'js-nav');
        header.appendChild(nextButton);

        // Action des boutons "précédent" et "suivant"
        this.domElement.querySelectorAll('.js-nav').forEach(element => {
            element.addEventListener('click', () => {
                // On multiplie par 1 les valeurs pour forcer leur convertion en "int"
                this.currentMonth.setMonth(this.currentMonth.getMonth() * 1 + element.dataset.action * 1);
                this.loadMonth(this.currentMonth);
                this.displayCalendarEvents();
            });
        });
        this.loadMonth(this.currentMonth);
    }

    loadMonth(date) {
        // On vide notre calendrier
        this.content.textContent = '';

        // On ajoute le mois/année affiché
        this.monthDiv.textContent = `${this.monthList[date.getMonth()].toUpperCase()}  ${date.getFullYear()}`;

        // Création des cellules contenant le jour de la semaine
        for (let i = 0; i < this.dayList.length; i++) {
            let cell = document.createElement('div');
            cell.classList.add('cell');
            cell.classList.add('day');
            cell.textContent = this.dayList[i].substring(0, 3).toUpperCase();
            this.content.appendChild(cell);
        }

        // Création des cellules vides si nécessaire
        for (let i = 0; i < date.getDay(); i++) {
            let cell = document.createElement('div');
            cell.classList.add('cell');
            cell.classList.add('empty');
            this.content.appendChild(cell);
        }

        // Nombre de jour dans le mois affiché
        let monthLength = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

        // Création des cellules contenant les jours du mois affiché
        for (let i = 1; i <= monthLength; i++) {
            let cell = document.createElement('div');
            let dayDigit = document.createElement('div');
            let eventContent = document.createElement('div');
            eventContent.classList.add('event-content');
            cell.classList.add('cell');
            if (i % 2 == 0) { cell.classList.add('odd') } else { cell.classList.add('even') };
            dayDigit.textContent = `${i}`;
            cell.appendChild(dayDigit);
            cell.appendChild(eventContent);
            this.content.appendChild(cell);

            // Timestamp de la cellule
            let timestamp = new Date(date.getFullYear(), date.getMonth(), i).getTime();
            cell.dataset.identifier = timestamp;

            cell.addEventListener('click', (e) => {

                if (!cell.classList.contains('past')) {
                    this.showForm(cell.dataset.identifier);
                }
            })

            // Ajoute une classe spéciale pour aujourd'hui
            if (timestamp === this.time.getTime()) {
                cell.classList.add('today');
            } else if (timestamp < this.time.getTime()) {
                cell.classList.add('past');
            }
        }
    }
    setupApp() {
        events = Storage.getAgenda();
    }
    showForm(timestamp) {
        //on fait apparaitre l'overlay
        overlayDOM.style.zIndex = "9998";
        overlayDOM.style.opacity = "1";
        let selectedDay = new Date(parseInt(timestamp));
        let dayDOM = document.createElement('h4');
        selectedDay = selectedDay.toLocaleString('fr-FR', DateOptions);
        console.log(selectedDay);
        dayDOM.textContent = selectedDay;
        formDiv.querySelector('.form-header').appendChild(dayDOM);

        formDiv.dataset.timestamp = timestamp;
        formDiv.classList.toggle('hidden');

        //On appelle storeEvent en passant en paramètre le timestamp de la cellule 
        this.storeEvent(timestamp);
    }
    hideForm() {
        overlayDOM.addEventListener('click', () => {

            if (!formDiv.classList.contains('hidden')) {
                formDiv.classList.add('hidden');
            }
            overlayDOM.style.zIndex = "-1";
            overlayDOM.style.opacity = "0";
        })
    }
    // stockage  de l'evenement en local storage
    storeEvent(timestamp) {
        let recordButton = document.querySelector('.js-store');
        let titleField = document.querySelector('.js-eventTitle');
        let eventDesc = document.querySelector('.js-eventDesc');

        recordButton.addEventListener('click', (e) => {
            //On vérifie dans un premier temps que les champs sont remplis
            if (titleField.value != '' && eventDesc != '') {

                //on construit un objet avec "timestamp", "title" et "description"
                let eventItem = {};
                eventItem.timestamp = timestamp;
                eventItem.title = titleField.value;
                eventItem.description = eventDesc.value;


                //Si tout est OK on pousse eventItem dans le tableau events
                events = [...events, eventItem];

                this.displayCalendarEvents();

                //on stocke dans le local storage;                
                Storage.saveAgenda(events);
                //on referme et on réinitialise les champs
                e.target.parentElement.parentElement.classList.toggle('hidden');
                overlayDOM.style.zIndex = "-1";
                overlayDOM.style.opacity = "0";

                titleField.value = ``;
                eventDesc.value = '';

            }
        })
    }
    //Affichage des evenements enregistrés;
    displayCalendarEvents() {
        agendaWithEvents = Storage.getAgenda();

        //Parcourir tous les ".cell", lire leur "data-dentifier"
        // si le data-identifier existe dans l'un des events de l'agenda, on affiche l'evenement dans la cellule
        let timestampedCells = document.querySelectorAll('.cell');
        timestampedCells.forEach(cell => {
            let cellTimestamp = cell.dataset.identifier;
            let eventContent = cell.querySelector('.event-content');

            let eventsRecorded = events.find(item => item.timestamp == cellTimestamp);
            if (eventsRecorded) {

                cell.classList.add('event');
                eventContent.innerHTML = `<span>${eventsRecorded.title} ${eventsRecorded.description}</span>
                <button class="btn orange base js-remove" data-id="${cellTimestamp}">Supprimer</button>`;
                this.deleteEvent(cellTimestamp);
            }
        })

    }
    //Suppression d'un évènement
    removeItem(id) {
        agendaWithEvents = agendaWithEvents.filter(item => item.timestamp !== id);
        Storage.saveAgenda(agendaWithEvents);
        // this.displayCalendarEvents();
        // On rafraichit la vue
        document.location.reload();
    }
    stopEvent(e) {
        e.stopPropagation();
    }
    deleteEvent() {
        let removeButtons = document.querySelectorAll('.js-remove');
        removeButtons.forEach(button => {
            button.addEventListener('click', e => {
                let deleteStamp = button.dataset.id;
                this.stopEvent(e);

                this.removeItem(deleteStamp);
            }, false)
        })
    }
}
class Storage {
    static saveEvenement(events) {
        localStorage.setItem("events", JSON.stringify(events));
    }
    static getEvenement(id) {
        let events = JSON.parse(localStorage.getItem('events'));
        return events.find(evenement => evenement.timestamp === id);
    }
    static saveAgenda(agenda) {
        //localStorage.clear();
        localStorage.setItem('Agenda', JSON.stringify(agenda))
    }
    static getAgenda() {
        return localStorage.getItem('Agenda') ? JSON.parse(localStorage.getItem('Agenda')) : [];
    }

};

export { BuildUi, Storage };