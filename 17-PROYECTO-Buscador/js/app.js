const marca = document.querySelector('#marca');
const minimo = document.querySelector('#minimo');
const maximo = document.querySelector('#maximo');
const puertas = document.querySelector('#puertas');
const transmision = document.querySelector('#transmision');
const color = document.querySelector('#color');
const year = document.querySelector('#year');
const resultado = document.querySelector('#resultado');
const max = new Date().getFullYear();
const min = max - 20;   


//genrerar un objeto con la busqueda
const datosbusqueda={
    marca: '',
    year: '',
    minimo: '',
    maximo: '',
    puertas: '',
    transmision: '',
    color: ''
}

document.addEventListener('DOMContentLoaded', function () {

    mostrarautos(autos)  //muestra todos los autos al cargar la pagina

    llenarSelect(); //llena los select de año, marca y precio   


});

//event listener para los select de busqueda
marca.addEventListener('change', e => {
    datosbusqueda.marca = e.target.value;
    filtrarAuto();
});

year.addEventListener('change', e => {
    datosbusqueda.year = parseInt(e.target.value);
    filtrarAuto();
});

minimo.addEventListener('change', e => {
    datosbusqueda.minimo = e.target.value;
    filtrarAuto();
});

maximo.addEventListener('change', e => {
    datosbusqueda.maximo = e.target.value;
    filtrarAuto();
});         

puertas.addEventListener('change', e => {
    datosbusqueda.puertas = parseInt(e.target.value);
    filtrarAuto();
});

transmision.addEventListener('change', e => {
    datosbusqueda.transmision = e.target.value;
    filtrarAuto();
});

color.addEventListener('change', e => {
    datosbusqueda.color = e.target.value;
    filtrarAuto();
});     




function mostrarautos(autos){

    limpiarhtml(); //elimina el html previo
    autos.forEach(auto => {
        const {marca, modelo, year, precio, puertas, color, transmision} = auto;
        const autoHTML = document.createElement('p');
        autoHTML.textContent = `${marca} ${modelo} - ${year} - ${puertas} Puertas - Transmisión: ${transmision} - Precio: ${precio} - Color: ${color}`;
        resultado.appendChild(autoHTML);
    });
}

//limpiar el html

function limpiarhtml(){

    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }

}


//generar los años del select
function llenarSelect(){

    for (let i = max; i >= min; i--){
        const opcion = document.createElement('option');
        opcion.value = i;
        opcion.textContent = i;
        year.appendChild(opcion); //agrega las opciones de año al select
    }   

}


//filtrar autos en base a la busqueda

function filtrarAuto(){
    const resultado = autos.filter(filtrarMarca).filter(filtraryear).filter(filtrarMinimo).filter(filtrarMaximo).filter(filtrarPuertas).filter(filtrarTransmision).filter(filtrarColor);
    console.log(resultado);
    mostrarautos(resultado);

    if(resultado.length){
        mostrarautos(resultado);
    }else{
        noResultado();
    }   
}

function noResultado(){
    limpiarhtml();
    const noResultado = document.createElement('div');
    noResultado.classList.add('alerta', 'error');
    noResultado.textContent = 'No hay resultados, intenta con otros términos de búsqueda';
    resultado.appendChild(noResultado);
}

function filtrarMarca(auto){
    if(datosbusqueda.marca){
        return auto.marca === datosbusqueda.marca;
    }
    return auto;
}

function filtraryear(auto){
    if(datosbusqueda.year){
        return auto.year === datosbusqueda.year;
    }
    return auto;
}

function filtrarMinimo(auto){
    if(datosbusqueda.minimo){
        return auto.precio >= datosbusqueda.minimo;
    }
    return auto;
}

function filtrarMaximo(auto){
    if(datosbusqueda.maximo){
        return auto.precio <= datosbusqueda.maximo;
    }
    return auto;
}

function filtrarPuertas(auto){
    if(datosbusqueda.puertas){
        return auto.puertas === datosbusqueda.puertas;
    }
    return auto;
}

function filtrarTransmision(auto){
    if(datosbusqueda.transmision){
        return auto.transmision === datosbusqueda.transmision;
    }
    return auto;
}

function filtrarColor(auto){
    if(datosbusqueda.color){
        return auto.color === datosbusqueda.color;
    }
    return auto;
}       

