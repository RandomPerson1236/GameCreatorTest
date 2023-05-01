const explorer = document.getElementById('code-examples-container')

let shown = false
explorer.addEventListener('click', _=>{
    let ev = _ || window.event

    if (ev.target.parentElement.className === 'side-code-ex-container'){
        let g = ev.target.parentElement
        if (shown) g.children[1].style.display = 'none';
        else g.children[1].style.display = 'block';

        shown = !shown
    }
})