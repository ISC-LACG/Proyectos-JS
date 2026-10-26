/**
 * Buscador de autos con filtros combinables, ejecutado en el navegador.
 *
 * Origen de los datos:
 * - js/db.js declara `autos`, un arreglo de objetos con marca, modelo, year,
 *   precio, puertas, color y transmision. No se consulta una API ni un servidor.
 * - index.html carga db.js antes de app.js mediante scripts clásicos, por eso
 *   este archivo puede acceder a `autos` sin importarlo.
 * - Los select y el contenedor #resultado están definidos en index.html.
 *   Marca, precios, puertas, transmisión y color ya tienen opciones en el HTML;
 *   únicamente las opciones de año se generan aquí.
 *
 * Flujo: cambiar un select → actualizar datosbusqueda → filtrar el catálogo
 * completo → reemplazar los resultados visibles o mostrar un aviso.
 * Los criterios activos se combinan con AND: el auto debe cumplirlos todos.
 */

// Referencias al DOM (la representación del HTML que permite modificar la página).
// # indica un id en un selector CSS. Se guardan las referencias para reutilizarlas.
// Los scripts están al final del body: estos elementos ya existen al ejecutar
// querySelector. Si se cambia un id o falta un elemento, se obtendrá null.
const marca = document.querySelector('#marca');
const minimo = document.querySelector('#minimo');
const maximo = document.querySelector('#maximo');
const puertas = document.querySelector('#puertas');
const transmision = document.querySelector('#transmision');
const color = document.querySelector('#color');
const year = document.querySelector('#year');
const resultado = document.querySelector('#resultado');
// Límites de años calculados con la fecha local del navegador, no con db.js.
// No confundir max/min (años) con maximo/minimo (select de precios).
const max = new Date().getFullYear();
const min = max - 20;   


// Estado compartido de los filtros: guarda lo elegido, no los autos encontrados.
// Una cadena vacía significa «sin filtro» y coincide con value="" de «Seleccione».
// const impide reasignar el objeto, pero permite modificar sus propiedades.
// Año y puertas pasan a number al seleccionarse; los precios siguen como string.
const datosbusqueda={
    marca: '',
    year: '',
    minimo: '',
    maximo: '',
    puertas: '',
    transmision: '',
    color: ''
}

// Inicialización cuando termina de analizarse el HTML; no espera a las imágenes.
// Las declaraciones function de abajo pueden invocarse antes de su posición
// en el archivo porque JavaScript las prepara al crear el ámbito (hoisting).
document.addEventListener('DOMContentLoaded', function () {

    mostrarautos(autos)  //muestra todos los autos al cargar la pagina

    llenarSelect(); // Añade únicamente los años; las demás opciones vienen del HTML.   


});

// Cada evento change registra el nuevo criterio y recalcula con todos los filtros.
// e es el evento que entrega el navegador; e.target es el select que lo disparó.
// Su value siempre es texto, incluso cuando la opción representa un número.
// No hace falta enviar el formulario: el filtrado ocurre en memoria.
marca.addEventListener('change', e => {
    datosbusqueda.marca = e.target.value;
    filtrarAuto();
});

// db.js guarda year como número. parseInt permite compararlo con === sin
// enfrentar un string con un number. Al elegir «Seleccione», parseInt('') da
// NaN, que es falsy: el filtro de año se desactiva en su comprobación if.
year.addEventListener('change', e => {
    datosbusqueda.year = parseInt(e.target.value);
    filtrarAuto();
});

// Aquí se conservan los precios como texto. En los predicados, >= y <=
// los convierten implícitamente a número porque auto.precio ya es numérico.
minimo.addEventListener('change', e => {
    datosbusqueda.minimo = e.target.value;
    filtrarAuto();
});

maximo.addEventListener('change', e => {
    datosbusqueda.maximo = e.target.value;
    filtrarAuto();
});         

// Mismo tratamiento numérico que el año: db.js define puertas como number.
// Seleccionar la opción vacía produce NaN y desactiva este criterio.
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




/**
 * Sustituye el contenido de #resultado por un párrafo por auto.
 * @param {Array<{marca: string, modelo: string, year: number, precio: number,
 * puertas: number, color: string, transmision: string}>} autos Lista a mostrar.
 * Este parámetro es local y oculta el nombre del catálogo global: puede recibir
 * el catálogo completo o un arreglo filtrado. No modifica los objetos recibidos.
 */
function mostrarautos(autos){

    limpiarhtml(); //elimina el html previo
    // forEach recorre la lista para producir un efecto en el DOM, no otra lista.
    autos.forEach(auto => {
        // Desestructuración: extrae propiedades del objeto en variables locales.
        const {marca, modelo, year, precio, puertas, color, transmision} = auto;
        const autoHTML = document.createElement('p');
        // La plantilla ${...} compone el texto; textContent lo trata como texto,
        // sin interpretar etiquetas HTML que pudieran aparecer en los datos.
        autoHTML.textContent = `${marca} ${modelo} - ${year} - ${puertas} Puertas - Transmisión: ${transmision} - Precio: ${precio} - Color: ${color}`;
        resultado.appendChild(autoHTML);
    });
}

/**
 * Vacía el contenedor antes de cada renderizado para no acumular resultados
 * anteriores ni conservar un aviso de búsqueda vacía.
 * firstChild cambia tras cada eliminación; el bucle termina cuando es null.
 */

function limpiarhtml(){

    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }

}


/**
 * Añade años en orden descendente, desde el actual hasta hace 20 años inclusive
 * (21 opciones). value es lo que recibe el evento; textContent es lo visible.
 * Conserva la opción «Seleccione» que ya existe en index.html.
 * Se llama una vez: invocarla nuevamente agregaría años duplicados.
 * El rango no depende del catálogo, así que puede ofrecer años sin autos.
 */
function llenarSelect(){

    for (let i = max; i >= min; i--){
        const opcion = document.createElement('option');
        opcion.value = i;
        opcion.textContent = i;
        year.appendChild(opcion); //agrega las opciones de año al select
    }   

}


/**
 * Aplica todos los criterios al catálogo original en cada cambio. Así, al quitar
 * un filtro, los autos descartados anteriormente pueden volver a aparecer.
 * Cada filter crea un nuevo arreglo con los elementos cuyo predicado devuelve
 * un valor truthy; no elimina elementos de `autos`. Encadenarlos expresa AND y
 * separa cada criterio en una función fácil de leer, aunque hace varias pasadas.
 */

function filtrarAuto(){
    // Este resultado local es un arreglo y oculta la referencia global al DOM
    // solo dentro de filtrarAuto. Las otras funciones conservan su propio ámbito.
    const resultado = autos.filter(filtrarMarca).filter(filtraryear).filter(filtrarMinimo).filter(filtrarMaximo).filter(filtrarPuertas).filter(filtrarTransmision).filter(filtrarColor);
    // Salida de diagnóstico para inspeccionar las coincidencias en la consola.
    console.log(resultado);
    // Observación del código actual: este primer renderizado es redundante.
    // Si hay coincidencias, el if vuelve a renderizarlas; si no, noResultado
    // vuelve a limpiar. Se conserva el comportamiento original al documentarlo.
    mostrarautos(resultado);

    // length > 0 es truthy; length === 0 es falsy.
    if(resultado.length){
        mostrarautos(resultado);
    }else{
        noResultado();
    }   
}

/** Muestra el estado vacío; las clases alerta y error se estilizan en el CSS. */
function noResultado(){
    limpiarhtml();
    // Variable local con el mismo nombre que la función; aquí representa un div.
    const noResultado = document.createElement('div');
    noResultado.classList.add('alerta', 'error');
    noResultado.textContent = 'No hay resultados, intenta con otros términos de búsqueda';
    resultado.appendChild(noResultado);
}

// Predicados de Array.filter: reciben un auto por llamada.
// Con un criterio activo devuelven true/false según la comparación. Sin criterio
// devuelven el objeto auto, que es truthy, y filter conserva ese elemento.
// No se transforma el objeto: devolver true expresaría la misma intención.
// Las comparaciones de texto con === son exactas y distinguen mayúsculas.

/** Compara con el value de la marca seleccionada, que coincide con db.js. */
function filtrarMarca(auto){
    if(datosbusqueda.marca){
        return auto.marca === datosbusqueda.marca;
    }
    return auto;
}

/** Compara años numéricos; cadena vacía o NaN dejan pasar todos los autos. */
function filtraryear(auto){
    if(datosbusqueda.year){
        return auto.year === datosbusqueda.year;
    }
    return auto;
}

/**
 * Límite inferior inclusivo: conserva también los autos con precio igual al mínimo.
 * La conversión implícita funciona con los valores numéricos definidos en el HTML.
 */
function filtrarMinimo(auto){
    if(datosbusqueda.minimo){
        return auto.precio >= datosbusqueda.minimo;
    }
    return auto;
}

/**
 * Límite superior inclusivo. No se valida mínimo <= máximo: si el usuario elige
 * un rango invertido, ningún auto cumple ambos límites y se muestra el aviso.
 */
function filtrarMaximo(auto){
    if(datosbusqueda.maximo){
        return auto.precio <= datosbusqueda.maximo;
    }
    return auto;
}

/** Compara cantidades numéricas de puertas usando igualdad estricta. */
function filtrarPuertas(auto){
    if(datosbusqueda.puertas){
        return auto.puertas === datosbusqueda.puertas;
    }
    return auto;
}

/**
 * Compara los valores internos «automatico» o «manual», no la etiqueta visible
 * «Automática» del select. Estos valores coinciden con los de db.js.
 */
function filtrarTransmision(auto){
    if(datosbusqueda.transmision){
        return auto.transmision === datosbusqueda.transmision;
    }
    return auto;
}

/** Compara el color seleccionado con el texto almacenado en el catálogo. */
function filtrarColor(auto){
    if(datosbusqueda.color){
        return auto.color === datosbusqueda.color;
    }
    return auto;
}       

