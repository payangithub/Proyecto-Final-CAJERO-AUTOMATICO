//Se instancian variables para posteriormente obtener el valor de cada una de ellas.
const frmLogin = document.querySelector('#frmlogin');
const inputUsuario = document.querySelector('#inputUsuario');
const inputPassword = document.querySelector('#inputPassword');
const boxMensaje = document.querySelector('#box-mensaje');

//Crear un objeto para validar si existe el usuario y contraseña ingresados.
const validaUsuario = {
    usuario: '',
    password: ''
}

//Crear evento para ejecutar la validacion del usuario-password.
//frmLogin.addEventListener('submit', (e) => {
frmLogin.addEventListener('submit',(e) => {    
    //Se detiene la accion del submit para hacer el proximo bloque de codigo.    
    e.preventDefault();

    //Se asigna el valor que ingreso el usuario al objeto que  le corresponde validar la informacion.
    validaUsuario.usuario = inputUsuario.value;
    validaUsuario.password = inputPassword.value;

    //Se ejecuta funcion para validar al usuario.
    confirmarUsuario();

})

var detenerUnSeg;
//Se crea funcion para validar si existe el usuario en Base de Datos.
function confirmarUsuario() {
    const resultado = usuarios.filter(filtrarUsuario).filter(paramPassword);

    //Obtener los parametros que se ingresaron.
    const parametrosVacios = Object.values(validaUsuario).filter(e => e);
    
    //Validar primeramente si se ingresaron los campos obligatorios.
    if (parametrosVacios.length) {        
        if (resultado.length) {
            
            //Se agrega el Id al Local Store
            addItemLS("id", resultado[resultado.length - 1].id); 
            //Se agrega el apellido del cliente al Local Store
            addItemLS("apellidos", resultado[resultado.length - 1].apellidos); 
            //Se agrega el nombre del cliente al Local Store
            addItemLS("nombre", resultado[resultado.length -1].nombre); 

            //Se abre la pagina del menu cajero.            
            window.location.assign("menu.html")            
        } else {            
            //Se resetean los valores.                           
            frmLogin.reset();             
            
            //Se muestra mensaje de error.
            avisoFallido();                        
        }
    } else {
        //Se muestra mensaje de error.
        avisoFallido();        
    }
}

//Se generan funciones para obtener los filtros a enviar.
function filtrarUsuario(item) {
    const { usuario } = validaUsuario;
    if (usuario) {
        return item.usuario == usuario;
    }
    return usuarios;
}

function paramPassword(campoPassword) {
    const { password } = validaUsuario;
    if (password) {
        return campoPassword.password == password;
    }
    return usuarios;
}

//Funcion que muestra mensaje de sin resultado.
function avisoFallido() {    
    const avisoFallido = document.createElement('div');
    avisoFallido.classList.add('bg-danger', 'text-white', 'border-danger', 'p-4', 'text-center', 'id=mensaje');
    avisoFallido.textContent = 'Usuario o Contraseña Incorrecto';
    
    boxMensaje.parentElement.appendChild(avisoFallido);
}

function addItemLS(key,item) {  
    if(typeof item == 'string' )
    {
        localStorage.setItem(key, item);
    }else{
        localStorage.setItem(key, JSON.stringify(item));
    }    
}