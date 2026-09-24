const resultado = document.querySelector('#resultado');

document.addEventListener('DOMContentLoaded', function () {

    mostrarautos()


});


function mostrarautos(){
    autos.forEach(auto => {
        const {marca, modelo, year, precio, puertas, color, transmision} = auto;
        const autoHTML = document.createElement('p');
        autoHTML.textContent = `${marca} ${modelo} - ${year} - ${puertas} Puertas - Transmisión: ${transmision} - Precio: ${precio} - Color: ${color}`;
        resultado.appendChild(autoHTML);
    });
}



//todo: nos quedamos en el video 145 del curso apenas ibamos a comenzar  