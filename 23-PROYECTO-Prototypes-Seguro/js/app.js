// Constructor: al usar `new Seguro(...)` crea un objeto con los datos de una cotización.
function Seguro(marca, nombreMarca, year, tipo) {
    this.marca = marca;               // Código numérico del select; se usa para calcular el precio.
    this.nombreMarca = nombreMarca;   // Texto visible del select; se muestra en el resumen.
    this.year = year;                 // Año del vehículo elegido.
    this.tipo = tipo;                 // Cobertura seleccionada: "basico" o "completo".
}

// Se agrega el método al prototype para que todas las instancias de Seguro lo compartan,
// en lugar de crear una copia de la función dentro de cada objeto.
Seguro.prototype.cotizarSeguro = function() {
    let cantidad;
    const base = 2000; // Precio inicial antes de aplicar marca, antigüedad y tipo de cobertura.

    // El valor de cada opción del select identifica el multiplicador por marca.
    switch (this.marca) {
        case '1':
            cantidad = base * 1.15;
            break;
        case '2':
            cantidad = base * 1.05;
            break;
        case '3':
            cantidad = base * 1.35;
            break;
        default:
            // La marca se valida antes de crear Seguro; este caso evita dejar una opción sin tratar.
            break;
    }

    // Calcula cuántos años tiene el vehículo para aplicar el descuento por antigüedad.
    const diferencia = new Date().getFullYear() - this.year;
    // Reduce 3% del precio por cada año de diferencia respecto del año actual.
    cantidad -= ((diferencia * 3) * cantidad) / 100;

    // La cobertura modifica el precio después de aplicar el descuento por antigüedad.
    if (this.tipo === 'basico') {
        cantidad *= 1.30; // El seguro básico aumenta el precio en 30%.
    } else {
        cantidad *= 1.50; // El seguro completo aumenta el precio en 50%.
    }

    return cantidad; // Devuelve el precio final para poder mostrarlo en el resumen.
}   

// Constructor de la interfaz: sus métodos se agregan al prototype de UI.
function UI() {}

// Llena el selector de años con el año actual y los 19 anteriores.
UI.prototype.llenarOpciones = () => {
    const max = new Date().getFullYear(),
        min = max - 20;

    // Busca el select existente en el HTML donde se agregarán las opciones.
    const selectAnio = document.querySelector('#year');

    for (let i = max; i > min; i--) {
        // Cada option tiene un valor para el formulario y un texto que verá el usuario.
        let option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        // appendChild agrega la opción al final de las opciones que ya tenga el select.
        selectAnio.appendChild(option);
    }
}

// Crea un mensaje temporal de error o de éxito dentro del formulario.
UI.prototype.mostrarMensaje = (mensaje, tipo) => {
    // Evita que se acumulen mensajes si se muestra uno nuevo antes de que desaparezca el anterior.
    const mensajeExistente = document.querySelector('.mensaje');
    if (mensajeExistente) {
        mensajeExistente.remove();
    }

    // Crea el elemento y asigna las clases CSS según el tipo de mensaje.
    const div = document.createElement('div');
    if (tipo === 'error') {
        div.classList.add('mensaje', 'error');
    } else {
        div.classList.add('mensaje', 'correcto');
    }
    div.classList.add('mensaje', 'mt-10');
    div.textContent = mensaje; // textContent inserta el texto sin interpretarlo como HTML.

    // Lo coloca antes de #resultado para que aparezca en una posición concreta del formulario.
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.insertBefore(div, document.querySelector('#resultado'));

    // Quita este mensaje después de 3 segundos.
    setTimeout(() => {
        div.remove();
    }, 3000);
}

// Vacía un elemento para quitar contenido anterior antes de mostrar contenido nuevo.
UI.prototype.limpiarHTML = (elemento) => {
    elemento.innerHTML = '';
}

// Construye y muestra el resumen con los datos del seguro y el precio calculado.
UI.prototype.mostrarResultado = (total, seguro) => {
    const div = document.createElement('div');
    div.classList.add('mt-10');

    // Inserta los datos de la cotización en el contenido del resumen.
    div.innerHTML = `
        <p class="header">Tu Resumen</p>
        <p class="font-bold">Marca: <span class="font-normal">${seguro.nombreMarca}</span></p>
        <p class="font-bold">Año: <span class="font-normal">${seguro.year}</span></p>
        <p class="font-bold">Tipo: <span class="font-normal capitalize">${seguro.tipo}</span></p>
        <p class="font-bold">Total: <span class="font-normal">$ ${total}</span></p>
    `;

    // Agrega el resumen dentro del contenedor reservado en el HTML.
    const resultadoDiv = document.querySelector('#resultado');
    resultadoDiv.appendChild(div);
}              


// Se crea una instancia de UI para usar sus métodos en el resto del programa.
const ui = new UI();
// Guarda el temporizador de la cotización para poder cancelarlo si se envía otra antes de que termine.
let timeoutId;

// Espera a que el documento HTML esté cargado antes de buscar y llenar el selector de años.
document.addEventListener('DOMContentLoaded', () => {
    ui.llenarOpciones();
})

// Registra los eventos que necesita la aplicación.
eventListeners();

function eventListeners() {
    // Al enviar el formulario se ejecuta cotizarSeguro en vez de recargar la página.
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.addEventListener('submit', cotizarSeguro);
}

// Controla el envío del formulario: lee y valida los datos, calcula la cotización y actualiza la interfaz.
function cotizarSeguro(e) {
    e.preventDefault(); // Evita el envío tradicional del formulario y la recarga de la página.

    // Lee tanto el código de la marca (para el cálculo) como el texto que se mostrará al usuario.
    const selectMarca = document.querySelector('#marca');
    const marca = selectMarca.value;
    const nombreMarca = selectMarca.options[selectMarca.selectedIndex].textContent.trim();

    // Lee el año elegido en el select.
    const anio = document.querySelector('#year').value;

    // Lee el radio seleccionado. El HTML tiene una opción marcada por defecto.
    const tipo = document.querySelector('input[name="tipo"]:checked').value;

    // Si falta alguno de los datos obligatorios, muestra un error y detiene el proceso.
    if(marca ==='' || anio === '' || tipo === ''){
        ui.mostrarMensaje('Todos los campos son obligatorios', 'error');
        return;
    }

    // Crea el objeto con todos los datos de esta cotización.
    const seguro = new Seguro(marca, nombreMarca, anio, tipo);

    // Llama al método compartido en Seguro.prototype y obtiene el precio final.
    const total = seguro.cotizarSeguro();

    // Obtiene los elementos que se actualizarán en la interfaz.
    const resultado = document.querySelector('#resultado');
    const spinner = document.querySelector('#cargando');

    // Borra el resumen anterior para que no se acumulen resultados.
    ui.limpiarHTML(resultado);
    // Si había una espera de una cotización anterior, la cancela antes de iniciar la nueva.
    clearTimeout(timeoutId);
    // Muestra el indicador de carga mientras se espera antes de presentar el resultado.
    spinner.style.display = 'block';

    // Simula el tiempo de cálculo; al terminar, oculta el spinner y presenta el mensaje y el resumen.
    timeoutId = setTimeout(() => {
        spinner.style.display = 'none';
        ui.mostrarMensaje('Cotización realizada con éxito', 'exito');
        ui.mostrarResultado(total, seguro);
    }, 3000);
}