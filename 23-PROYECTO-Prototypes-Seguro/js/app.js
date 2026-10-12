//constructor de seguro

function Seguro(marca, anio, tipo) {
    this.marca = marca;
    this.anio = anio;
    this.tipo = tipo;
}

function UI() {

    const max = new date().getFullYear()

}

document.addEventListener('DOMContentLoaded', () => {
    const ui = new UI();
    ui.llenarOpciones(); //llena el select con los años
})


//todo: me quedo en el video 171 