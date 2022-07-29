//Se instancian variables para posteriormente obtener el valor de cada una de ellas.
const btnDepositos = document.querySelector('#depositar');
const msjExitoDepositar = document.querySelector('#mensajeDepositar');
const msjExitoRetirar = document.querySelector('#mensajeRetirar');
const btnRetiros = document.querySelector('#retirar');
const nombreUsuario = document.getElementById("nombreUsers");
const boxCuentas = document.querySelector('#cuenta');

let rangMin = "";
let rangMax = "";

let nombre = localStorage.getItem('nombre');
let apellidos = localStorage.getItem('apellidos');
let cuentaSelect = "";

nombreUsuario.textContent = `Bienvenido "${apellidos} ${nombre}" al Cajero Automatico`; 

//Crear un objeto para validar si el usuario tiene cuentas.
const validaCuentas = {
    idUser: ''    
}

const cuentaUser = {
    numcta: ''
}

const cuentaUserSelect = {
    numcta: ''
}

function obtRangosImportes(){
    rangosaldos.forEach(rango => {
        //Obtener los rangos de importes minimo y maximos.
        const { minimosdo, maximosdo } = rango;
        rangMin = minimosdo;
        rangMax = maximosdo;        
    })
} 

function cargarCtas() {
    agregarOpc(cuentas);
    habilitarOperacion();
    obtRangosImportes();
}

function agregarOpc(cuentas) {
    let cadena = "<option value='' selected>Seleccione una Cuenta</option> ";

    //Obtener valores del Local Store.
    validaCuentas.idUser = localStorage.getItem('id');
    //Filtrar las cuentas por idUsuario.
    const cuentasPorUser = cuentas.filter(FiltarIdUser);
    
    cuentasPorUser.forEach(cuenta => {
        //Obtener la cuenta y su saldo correspondiente.
        const { id, numerocta } = cuenta;
        //Armar cadena.
        cadena += `                                                      
            <option value=${id}> <h1>${numerocta}</h1></option>
        `;        
    })
    boxCuentas.innerHTML = cadena;
}

//Se generan funciones para obtener los filtros a enviar.
function FiltarIdUser(item) {
    const { idUser } = validaCuentas;
    if (idUser) {
        return item.idusuario == idUser;
    }
    return cuentas;
}

function habilitarOperacion() {    
    let flagDepositar = "";
    let flagRetirar = "";   

    if (document.getElementById("saldoActual").value == '' || document.getElementById("saldoActual").value =='0') {
        flagDepositar = 'disabled style="background: black;"';
        flagRetirar = 'disabled style = "background: black;"';
    } else if (document.getElementById("saldoActual").value === '0') {
        flagRetirar = 'disabled style = "background: black;"';
    } else {
        flagDepositar = 'enabled style="background: blue;"';
        flagRetirar = 'enabled style="background: blue;"';
    }    
     
    let cadena = "";    
    //Armar cadena depositos.        
    cadena += `                                                      
            <button type="button" ${flagDepositar} class="btn btn-lg btn-primary" data-bs-toggle="modal" data-bs-target="#depositarModal" onclick="obtieneSaldoModal()">
                <img src="./icons/transferencia-movil.png" style="height:200px; width: 200px;">
                <br>
                <h1> Depositar</h1>
            </button>
        `;      
    btnDepositos.innerHTML = cadena; 
    
    cadena = "";    
    cadena += `                                                      
            <button type="button" ${flagRetirar} class="btn btn-lg btn-primary" data-bs-toggle="modal" data-bs-target="#retirarModal" onclick="obtieneSaldoModal()">
                <img src="./icons/retirar.png" style="height:200px; width: 200px;">
                <br>
                <h1> Retirar</h1>
            </button>
        `;    
    btnRetiros.innerHTML = cadena;
}

function activarMensajeDepositar(param) {
    let cadena = "";
    //Armar cadena de mensaje.    
    cadena += `                                                      
            <div class="alert alert-success" role="alert" ${param}>
                <center><strong>DEPOSITO EXITOSO</strong></center>
            </div>                                        
        `;
    msjExitoDepositar.innerHTML = cadena;
}

function activarMensajeRetirar(param) {    
    let cadena = "";
    //Armar cadena de mensaje.    
    cadena += `                                                      
            <div class="alert alert-success" role="alert" ${param}>
                <center><strong>RETIRO EXITOSO</strong></center>
            </div>                                        
        `;
    msjExitoRetirar.innerHTML = cadena;    
}

function errorMensajeDepositar(ocultar, msj) {
    let cadena = "";
    //Armar cadena de mensaje.    
    cadena += `                                                      
            <div class="alert alert-success bg-danger text-white"  style="border-radius: 1rem;" role="alert" ${ocultar}>
                <center><strong>${msj}</strong></center>
            </div>                                        
        `;
    msjExitoDepositar.innerHTML = cadena;
}

function errorMensajeRetirar(ocultar, msj) {
    let cadena = "";
    //Armar cadena de mensaje.    
    cadena += `                                                      
            <div class="alert alert-success bg-danger text-white"  style="border-radius: 1rem;" role="alert" ${ocultar}>
                <center><strong>${msj}</strong></center>
            </div>                                        
        `;
    msjExitoRetirar.innerHTML = cadena;
}

function depositaSaldoModal() {        
    const deposito = document.getElementById("impDeposito");
    const saldo = document.getElementById("impSaldoActual");    
    let saldoNew = parseInt(deposito.value) + parseInt(saldo.value);

    //Se valida que el saldo restante no sea negativo
    if (parseInt(deposito.value) < 0) {
        //Mostrar mensaje fallido.
        errorMensajeDepositar("", "SALDO NEGATIVO, INTENTE CON UN IMPORTE POSITIVO.");

        //Ocultar mensaje fallido despues de 2 segundos.
        setTimeout(errorMensajeDepositar, 4000, "hidden", "");
        return;
    } else if (parseInt(saldoNew) > parseInt(rangMax)){ //Si la suma del saldo y el deposito es mayor que el saldo permitido informar al usuario.
        //Mostrar mensaje fallido.
        errorMensajeDepositar("", `"EL SALDO MAS DEPOSITO SOBREPASA ${rangMax} DE LA CANTIDAD PERMITIDA, INTENTE CON UN IMPORTE MENOR."`);        

        //Ocultar mensaje fallido despues de 2 segundos.
        setTimeout(errorMensajeDepositar, 4000, "hidden", "");
        return;
    } if (parseInt(deposito.value) == 0 || deposito.value =='' ) {
        //Mostrar mensaje fallido.
        errorMensajeDepositar("", "IMPORTE INGRESADO INCORRECTO, INTENTE CON UN IMPORTE MAYOR A CERO.");

        //Ocultar mensaje fallido despues de 2 segundos.
        setTimeout(errorMensajeDepositar, 4000, "hidden", "");
        return;
    }

    //Obtener la cuenta en turno.
    cuentaUser.numcta = cuentaSelect
    //Filtrar la cuenta 
    let arrayCtaUpdate = cuentas.filter(filtroCtaSelect);
    
    arrayCtaUpdate.forEach(cuenta => {
        //Obtener el ID  de la cuenta. 
        const { id } = cuenta;        
        //Actualizar el nuevo saldo en el objeto de datos.
        cuentas[parseInt(id-1)].saldo = saldoNew;                        
    })
    //Actualizar el input del Saldo Actual del Modal.    
    saldo.value = saldoNew
    //Actualizar el input del saldo final de la cuenta.
    document.getElementById("saldoActual").value = saldoNew
    //Mostrar mensaje de Exito.        
    activarMensajeDepositar("");

    //Ocultar mensaje de exito despues de 2 segundo.
    setTimeout(activarMensajeDepositar, 2000, "hidden");    
    
    //Actualizo los botenes de "Depositar" y "Retirar" ya sea para habilitar o inhabilitarlos.
    habilitarOperacion();
}

function retiraSaldoModal() {
    const impRetiro = document.getElementById("impRetiro");
    const impSaldo = document.getElementById("impSaldoActualRet");

    //Se calcula el saldo restante.
    let saldoNew = parseInt(impSaldo.value) - parseInt(impRetiro.value);

    //Se valida que el saldo restante no sea negativo
    if (parseInt(impRetiro.value) > parseInt(impSaldo.value)) {
        //Mostrar mensaje fallido.
        errorMensajeRetirar("", "SALDO INSUFICIENTE, INTENTE CON UN IMPORTE MENOR.");

        //Ocultar mensaje fallido despues de 4 segundo.
        setTimeout(errorMensajeRetirar, 4000, "hidden", "");
        return;
    } else if (parseInt(impRetiro.value) < 0) {
        //Mostrar mensaje fallido.
        errorMensajeRetirar("", "SALDO NEGATIVO, INTENTE CON UN IMPORTE POSITIVO.");

        //Ocultar mensaje fallido despues de 4 segundo.
        setTimeout(errorMensajeRetirar, 4000, "hidden", "");
        return;
    } else if (parseInt(saldoNew) < parseInt(rangMin)) { //Si la resta del saldo con el retiro es menor que el saldo permitido informar al usuario.
        //Mostrar mensaje fallido.
        errorMensajeRetirar("", `"EL SALDO MENOS TRANSFERENCIA ES MENOR QUE <<${rangMin}>> DE LA CANTIDAD PERMITIDA, INTENTE CON UN RETIRO MENOR."`);        

        //Ocultar mensaje fallido despues de 4 segundos.
        setTimeout(errorMensajeRetirar, 4000, "hidden", "");
        return;
    } else if(parseInt(impRetiro.value) == 0 || impRetiro.value == '' ){
        //Mostrar mensaje fallido.
        errorMensajeRetirar("", "IMPORTE INGRESADO INCORRECTO, INTENTE CON UN IMPORTE MAYOR A CERO.");        

        //Ocultar mensaje fallido despues de 4 segundos.
        setTimeout(errorMensajeRetirar, 4000, "hidden", "");
        return;
    }

    //Se inicializa objeto.
    cuentaUser.numcta = "";

    //Obtener la cuenta en turno.
    cuentaUser.numcta = cuentaSelect
    //Filtrar la cuenta 
    let arrayCtaUpdate = cuentas.filter(filtroCtaSelect);

    arrayCtaUpdate.forEach(cuenta => {
        const { id } = cuenta;
        //Actualizar el objeto de datos "Cuentas".              
        cuentas[parseInt(id - 1)].saldo = saldoNew;
    })
    //Actualizar el input del Saldo Actual del Modal.    
    impSaldo.value = saldoNew
    //Actualizar el input del saldo final de la cuenta.    
    document.getElementById("saldoActual").value = saldoNew
    //Mostrar mensaje de Exito.
    activarMensajeRetirar("");

    //Ocultar mensaje de exito despues de 2 segundo.
    setTimeout(activarMensajeRetirar, 2000, "hidden");

    //Actualizo los botenes de "Depositar" y "Retirar" ya sea para habilitar o inhabilitarlos.
    habilitarOperacion();
}


//Se generan funciones para obtener los filtros a enviar.
function filtroCtaSelect(item) {
    const { numcta } = cuentaUser;
    if (numcta) {
        return item.numerocta == numcta.replace(/ /g, "");
    }
    return cuentas;
}


function obtieneSaldoModal(){
    //Inicializar el importe del deposito en vacio.
    document.getElementById("impDeposito").value = "";
    document.getElementById("impRetiro").value = "";    

    const saldoPrincipal = document.getElementById("saldoActual");
    const saldoModalActualDeposito = document.getElementById("impSaldoActual");
    const saldoModalActualRetiro = document.getElementById("impSaldoActualRet");
    
    //Asignar el saldo.
    saldoModalActualDeposito.value = saldoPrincipal.value;
    saldoModalActualRetiro.value = saldoPrincipal.value;    
}

function obtieneSaldo() {  
    //Se obtiene el # de tarjeta que se selecciono.    
    cuentaSelect = $('select[name="ctas"] option:selected').text();    
    //Se define variable para almacenar el saldo. 
    let SaldoArray = 0;     
    //Obtener la cuenta en turno.
    cuentaUserSelect.numcta = cuentaSelect    
    //Filtrar la cuenta 
    let arrayCtaUpdate = cuentas.filter(filtroCtaListado);
    arrayCtaUpdate.forEach(cuenta => {
        //Obtener el ID y su Saldo correspondiente.        
        const { id, saldo } = cuenta;
        //Actualizar el objeto de datos.      
        cuentas[parseInt(id-1)].saldo = saldo;
        SaldoArray = saldo;        
    })
    
    //Se actualiza el Input de Saldo:    
    document.getElementById("saldoActual").value = SaldoArray
    
    //Funcion para habilitar botones dependiendo del saldo y lo que se selecciona.
    habilitarOperacion();
}

//Se generan funciones para obtener los filtros a enviar.
function filtroCtaListado(item) {
    const { numcta } = cuentaUserSelect;
    if (numcta) {
        return item.numerocta == numcta.replace(/ /g, "");
    }
    return cuentas;
}