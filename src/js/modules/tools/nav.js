
let convertToTabs = () => {
    let navtab = document.querySelector('.nav');
    let navItems = navtab.querySelectorAll('a');

    for(let index=0; index < navItems.length; index++){
        if (navItems[index]> 0 || navItems.length > 0){
            console.log(`${navItems[index]}`);

        }
    }

    

   
}

export { convertToTabs as default};