document.addEventListener('DOMContentLoaded', function() {

    // Objeto que guarda el valor de cada campo del formulario
    const email = {
        email: '',
        asunto: '',
        mensaje: ''
    };

    // Seleccionar los elementos del DOM
    const inputEmail = document.querySelector('#email');
    const inputAsunto = document.querySelector('#asunto');
    const inputMensaje = document.querySelector('#mensaje');
    const formulario = document.querySelector('#formulario');
    const btnSubmit = document.querySelector('#formulario button[type="submit"]');
    const btnReset = document.querySelector('#formulario button[type="reset"]');
    const spinner = document.querySelector('#spinner');

    // -----------------------------
    // Eventos de los inputs
    // -----------------------------
    inputEmail.addEventListener('input', validar);
    inputAsunto.addEventListener('input', validar);
    inputMensaje.addEventListener('input', validar);

    // También validamos al salir del campo
    inputEmail.addEventListener('blur', validar);
    inputAsunto.addEventListener('blur', validar);
    inputMensaje.addEventListener('blur', validar);

    // Evento para enviar el formulario
    formulario.addEventListener('submit', enviarEmail);

    // Evento para resetear el formulario
    btnReset.addEventListener('click', function(e) {
        e.preventDefault();
        resetFormulario();
    });

    // -----------------------------
    // Función principal al enviar
    // -----------------------------
    function enviarEmail(e) {
        e.preventDefault();

        // Mostrar spinner mientras se procesa
        spinner.classList.add('flex');
        spinner.classList.remove('hidden');

        // Simular envío con un retraso de 3 segundos
        setTimeout(() => {
            spinner.classList.remove('flex');
            spinner.classList.add('hidden');

            // Reiniciar formulario y campos
            resetFormulario();

            // Crear mensaje de éxito
            const alertaExito = document.createElement('P');
            alertaExito.classList.add(
                'bg-green-500',
                'text-white',
                'p-2',
                'text-center',
                'rounded-lg',
                'mt-10',
                'font-bold',
                'text-sm',
                'uppercase'
            );
            alertaExito.textContent = 'Mensaje enviado correctamente';

            formulario.appendChild(alertaExito);

            // Quitar el mensaje después de 3 segundos
            setTimeout(() => {
                alertaExito.remove();
            }, 3000);
        }, 3000);
    }

    // -----------------------------
    // Validar cada campo
    // -----------------------------
    function validar(e) {
        // Si el campo está vacío
        if (e.target.value.trim() === '') {
            mostrarAlerta(`El Campo ${e.target.id} es obligatorio`, e.target.parentElement);
            email[e.target.name] = '';
            comprobarEmail();
            return;
        }

        // Validar email con regex
        if (e.target.id === 'email' && !validarEmail(e.target.value)) {
            mostrarAlerta('El email no es válido', e.target.parentElement);
            email[e.target.name] = '';
            comprobarEmail();
            return;
        }

        // Si todo está bien
        limpiarAlerta(e.target.parentElement);

        // Guardar el valor en el objeto email
        email[e.target.name] = e.target.value.trim().toLowerCase();

        // Comprobar si ya está completo el formulario
        comprobarEmail();
    }

    // -----------------------------
    // Mostrar alerta de error
    // -----------------------------
    function mostrarAlerta(mensaje, referencia) {
        limpiarAlerta(referencia);

        const error = document.createElement('P');
        error.textContent = mensaje;
        error.classList.add('bg-red-600', 'text-white', 'p-2', 'text-center');

        referencia.appendChild(error);
    }

    // -----------------------------
    // Borrar la alerta si ya existe
    // -----------------------------
    function limpiarAlerta(referencia) {
        const alerta = referencia.querySelector('.bg-red-600');
        if (alerta) {
            alerta.remove();
        }
    }

    // -----------------------------
    // Validar formato de email
    // -----------------------------
    function validarEmail(email) {
        const regex = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
        return regex.test(email);
    }

    // -----------------------------
    // Habilitar o deshabilitar el botón
    // -----------------------------
    function comprobarEmail() {
        if (Object.values(email).includes('')) {
            btnSubmit.classList.add('opacity-50');
            btnSubmit.disabled = true;
            return;
        }

        btnSubmit.classList.remove('opacity-50');
        btnSubmit.disabled = false;
    }

    // -----------------------------
    // Reiniciar el formulario
    // -----------------------------
    function resetFormulario() {
        email.email = '';
        email.asunto = '';
        email.mensaje = '';

        formulario.reset();
        comprobarEmail();
    }
});
