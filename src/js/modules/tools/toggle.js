
const toggleButton = document.querySelector('.toggle');


let toggleGridList = (divrow) => {
    toggleButton.addEventListener('click', () => {
        console.log(divrow);
        divrow.classList.toggle('list');
        divrow.classList.toggle('grid');
        divrow.querySelectorAll('.col').forEach(function(item) {           
            item.classList.toggle('m3');
            item.classList.toggle('m12');
        });


    })




}

export {toggleGridList as default};