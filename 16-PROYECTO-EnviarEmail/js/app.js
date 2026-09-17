document.addEventListener('DOMContentLoaded', function() {
    //campos del forumulario
    const email= document.querySelector('#email');
    const asunto= document.querySelector('#asunto');
    const mensaje = document.querySelector('#mensaje');
    const formulario = document.querySelector('#formulario');

    //asignar eventos
    
    email.addEventListener('blur', validar);

    asunto.addEventListener('blur', validar);

    mensaje.addEventListener('blur',validar);

    function validar(e) {
    if(e.target.value.trim() === ""){
       mostrarError(`El campo ${e.target.id} es obligatorio`, e.target.parentElement); 
    
    }

    limpiarError(e.target.parentElement);

    }; 
    
    
    function mostrarError(mensaje,referencia) {
      //comprobar si ya existe un error

      const errorExiste = referencia.querySelector('.bg-red-600');
      if(errorExiste){
        error.remove();
      }

       const error = document.createElement('p');
       error.textContent = mensaje;
       error.classList.add('bg-red-600', 'text-white', 'p-2', 'text-center', 'rounded-lg');

       //inyectar el error al formulario
       referencia.appendChild(error);
    }
    

    limpiarError = (referencia) => {
      const error = referencia.querySelector('.bg-red-600');
      if(error){
        error.remove();
      }
    } 
});


