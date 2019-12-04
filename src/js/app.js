import '../css/main.scss';
import Agenda from './modules/agenda/fetchdates';
import { BuildUi, Storage } from './modules/agenda/buildUi';


const dateList = new Agenda();
const displayUi = new BuildUi();


displayUi.setupApp();


dateList.getDates()
    .then(data => {
        
       displayUi.displayAgenda(data);        
        //Storage.saveEvenement(data);
        Storage.saveAgenda(data);
        displayUi.displayCalendarEvents(); 
        displayUi.hideForm();
    }).catch(err => console.log(err));