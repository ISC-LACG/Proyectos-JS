const carrito = document.querySelector('#carrito');
const listaCursos = document.querySelector('#lista-cursos');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
let articulosCarrito = [];

cargarEventListeners();

function cargarEventListeners() {

    listaCursos.addEventListener('click', agregarCurso);

    carrito.addEventListener('click', eliminarCurso);

    vaciarCarritoBtn.addEventListener('click', () => {
        articulosCarrito = []; //reseteamos el arreglo

        limpiarHTML(); //eliminamos todo el HTML
    }); 


}

//cuando agregamos un curso presionando "Agregar al carrito"
function agregarCurso(e) {
    e.preventDefault();
    if (e.target.classList.contains('agregar-carrito')) {   
        const cursoSeleccionado = e.target.parentElement.parentElement;
        
        leerDatosCurso(cursoSeleccionado);

    }
}

//elimina un curso del carrito

function eliminarCurso(e) {
    console.log(e.target.classList);
    if(e.target.classList.contains('borrar-curso')) {
        const cursoId = e.target.getAttribute('data-id');

        //elimina del arreglo de articulosCarrito por el data-id
        articulosCarrito = articulosCarrito.filter(curso => curso.id !== cursoId);

        carritoHTML(); //iterar sobre el carrito y mostrar su HTML
    }   


}

function leerDatosCurso(curso) {

    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('.precio span').textContent,
        id: curso.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    }

    //revisa si un elemento ya existe en el carrito
    const existe  = articulosCarrito.some(curso => curso.id === infoCurso.id);
    if(existe) {
        //actualizamos la cantidad
        articulosCarrito = articulosCarrito.map(curso => {
            if(curso.id === infoCurso.id) {
                return { ...curso, cantidad: curso.cantidad + 1 }
            } else {
                return curso;
            }
        });
    } else {
        //agregamos el curso al carrito
        articulosCarrito = [...articulosCarrito, infoCurso];
    }

    carritoHTML();

}

function carritoHTML() {

    limpiarHTML();


    articulosCarrito.forEach(curso => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${curso.imagen}" width=100>
            </td>
            <td>${curso.titulo}</td>
            <td>${curso.precio}</td>
            <td>${curso.cantidad}</td>
            <td>
                <a href="#" class="borrar-curso" data-id="${curso.id}">X</a>
            </td>
        `;

        contenedorCarrito.appendChild(row);
    });

}


function limpiarHTML() {

    while(contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
}       

