import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc, query, where, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";



// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBAHJocAzWGBqV2xrmOlEJmiApR70Hap_8",
  authDomain: "paso-a-paso-9c86b.firebaseapp.com",
  projectId: "paso-a-paso-9c86b",
  storageBucket: "paso-a-paso-9c86b.firebasestorage.app",
  messagingSenderId: "1044592885148",
  appId: "1:1044592885148:web:10f4b279c3235461035c59",
  measurementId: "G-ZEETQMB9TZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // <--- ¡AGREGA ESTA LÍNEA!
// const analytics = getAnalytics(app);

// ==========================================
//      LÓGICA DE REGISTRO E INICIO
// ==========================================

// Referencias HTML (Asegúrate que los IDs coincidan con tu HTML)
const formularioRegistro = document.getElementById('form-registro');
const formularioLogin = document.getElementById('form-login');
const modalLoginContainer = document.getElementById('contenedor-modal'); // Para cerrarlo al entrar

// --- FUNCIÓN: CREAR CUENTA ---
if (formularioRegistro) {
    formularioRegistro.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('registro-email').value;
        const password = document.getElementById('registro-contraseña').value;

        try {
            // Intentamos crear el usuario en Firebase
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            alert("✅ ¡Cuenta creada exitosamente! Bienvenido: " + user.email);
            
            // Opcional: Cerrar modal o limpiar formulario
            formularioRegistro.reset();
            // Aquí podrías llamar a ocultarModal() si tienes esa función exportada o disponible
            
        } catch (error) {
            // Manejo de errores comunes
            if (error.code === 'auth/email-already-in-use') {
                alert("⚠️ Ese correo ya está registrado.");
            } else if (error.code === 'auth/weak-password') {
                alert("⚠️ La contraseña debe tener al menos 6 caracteres.");
            } else {
                alert("❌ Error: " + error.message);
            }
        }
    });
}

// --- FUNCIÓN: INICIAR SESIÓN ---
if (formularioLogin) {
    formularioLogin.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-pass').value;

        try {
            // Intentamos entrar
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            alert("👋 ¡Hola de nuevo! Has iniciado sesión con: " + user.email);

            // Si tienes una función para cerrar el modal, úsala aquí.
            // Ejemplo: document.getElementById('contenedor-modal').classList.add('modal-oculto');
            
        } catch (error) {
            // Errores comunes al entrar
            if (error.code === 'auth/invalid-credential') {
                alert("❌ Correo o contraseña incorrectos.");
            } else {
                alert("❌ Error al entrar: " + error.message);
            }
        }
    });
}

// ==========================================
//      OBSERVADOR DE ESTADO (La Magia)
// ==========================================

// Referencias a los botones del menú
const btnLogin = document.getElementById('btn-mostrar-login');
const btnRegistro = document.getElementById('btn-mostrar-registro');
const txtSaludo = document.getElementById('mensaje-saludo');
const btnLogout = document.getElementById('btn-cerrar-sesion');

// Esta función se ejecuta AUTOMÁTICAMENTE cada vez que alguien entra o sale
onAuthStateChanged(auth, (user) => {
    if (user) {
        // --- CASO 1: EL USUARIO ESTÁ CONECTADO ---
        console.log("Usuario autenticado:", user.email);
        
        // 1. Ocultamos botones de invitado
        if(btnLogin) btnLogin.style.display = 'none';
        if(btnRegistro) btnRegistro.style.display = 'none';
        
        // 2. Mostramos saludo y botón de salir
        if(txtSaludo) {
            txtSaludo.style.display = 'block';
            txtSaludo.textContent = `Hola, ${user.email}`; // Ponemos su correo
        }
        if(btnLogout) btnLogout.style.display = 'block';

        // 3. Cerramos cualquier modal que haya quedado abierto
        const modal = document.getElementById('contenedor-modal');
        if(modal) modal.classList.add('modal-oculto');

    } else {
        // --- CASO 2: NO HAY NADIE CONECTADO (Modo Invitado) ---
        console.log("Nadie ha iniciado sesión");
        
        // 1. Mostramos botones de invitado
        if(btnLogin) btnLogin.style.display = 'block';
        if(btnRegistro) btnRegistro.style.display = 'block';
        
        // 2. Ocultamos saludo y botón de salir
        if(txtSaludo) txtSaludo.style.display = 'none';
        if(btnLogout) btnLogout.style.display = 'none';
    }
});

// --- FUNCIÓN PARA CERRAR SESIÓN ---
if (btnLogout) {
    btnLogout.addEventListener('click', async () => {
        try {
            await signOut(auth);
            alert("👋 ¡Has cerrado sesión correctamente!");
            // El observador de arriba se encargará de restaurar los botones automáticamente
        } catch (error) {
            console.error("Error al salir:", error);
        }
    });
}

// ========================================================
//      LÓGICA VISUAL (MODALES Y BOTONES)
// ========================================================

// 1. Referencias BLINDADAS (Usamos nombres claros)
const btnNavLogin = document.getElementById('btn-mostrar-login');
const btnNavRegistro = document.getElementById('btn-mostrar-registro');
const modalElemento = document.getElementById('contenedor-modal');
const btnCerrarX = document.getElementById('cerrar-modal');

// Enlaces dentro del modal (validamos si existen antes de usarlos)
const linkIrRegistro = document.getElementById('ir-a-registro');
const linkIrLogin = document.getElementById('ir-a-login');

// Formularios
const formLoginVisual = document.getElementById('form-login');
const formRegistroVisual = document.getElementById('form-registro');

// 2. Funciones Visuales
function mostrarModalVisual(tipo) {
    if (!modalElemento) return; // Protección

    modalElemento.classList.remove('modal-oculto');

    if (tipo === 'login') {
        if(formLoginVisual) formLoginVisual.classList.remove('formulario-oculto');
        if(formRegistroVisual) formRegistroVisual.classList.add('formulario-oculto');
    } else if (tipo === 'registro') {
        if(formRegistroVisual) formRegistroVisual.classList.remove('formulario-oculto');
        if(formLoginVisual) formLoginVisual.classList.add('formulario-oculto');
    }
}

function cerrarModalVisual() {
    if (modalElemento) modalElemento.classList.add('modal-oculto');
}

// 3. Eventos (Listeners) - CON PROTECCIÓN

// Botón "Iniciar Sesión" del menú
if (btnNavLogin) {
    btnNavLogin.addEventListener('click', (e) => {
        e.preventDefault();
        mostrarModalVisual('login');
    });
}

// Botón "Registrarse" del menú
if (btnNavRegistro) {
    btnNavRegistro.addEventListener('click', (e) => {
        e.preventDefault();
        mostrarModalVisual('registro');
    });
}

// La 'X' para cerrar
if (btnCerrarX) {
    btnCerrarX.addEventListener('click', cerrarModalVisual);
}

// Enlace "¿No tienes cuenta? Regístrate aquí"
if (linkIrRegistro) {
    linkIrRegistro.addEventListener('click', (e) => {
        e.preventDefault();
        mostrarModalVisual('registro');
    });
}

// Enlace "¿Ya tienes cuenta? Inicia sesión"
if (linkIrLogin) {
    linkIrLogin.addEventListener('click', (e) => {
        e.preventDefault();
        mostrarModalVisual('login');
    });
}

// Cerrar al hacer clic fuera del modal
if (modalElemento) {
    modalElemento.addEventListener('click', (e) => {
        if (e.target === modalElemento) {
            cerrarModalVisual();
        }
    });
}

const modalInfo = document.getElementById('modal-info');
const cerrarInfo = document.getElementById('cerrar-info');
const tituloInfo = document.getElementById('info-titulo');
const textoInfo = document.getElementById('info-texto');
const imagenInfo = document.getElementById('info-gif'); //gif
const botonCTA = document.getElementById('info-cta');

const btnTareas = document.getElementById('btn-tareas');
const btnRecordatorios = document.getElementById('btn-recordatorios');
const btnProgreso = document.getElementById('btn-progreso');
const btnMotivacion = document.getElementById('btn-motivacion');
const btnAmigos = document.getElementById('btn-amigos');
const btnPersonalizar = document.getElementById('btn-personalizar');
const btnRiesgo = document.getElementById('btn-riesgo');
const btnDispositivos = document.getElementById('btn-dispositivos');
const btnPomodoro = document.getElementById('btn-pomodoro');

const contenidos = {
    tareas: {
        titulo: "Gánale a la procrastinación ✅",
        texto: "¿Te cuesta arrancar? El secreto es empezar anotando. Escribe tus tareas, organízalas y toma el control de tu tiempo. Tu 'yo' del futuro te lo agradecerá.",
        boton: "+ Agregar mi primera tarea",
        // Icono de lista de tareas
        gif: "img1.png"
    },
    recordatorios: {
        titulo: "Nunca más se te olvidará nada 🔔",
        texto: "Tu mente es para crear, no para retener horarios. Configura alertas personalizadas y deja que nosotros te avisemos cuando sea momento de actuar.",
        boton: "Crear un recordatorio",
        // Icono de campana/reloj
        gif: "https://cdn-icons-png.flaticon.com/512/3239/3239952.png"
    },
    progreso: {
        titulo: "Lo que no se mide, no mejora 📈",
        texto: "¿Sientes que haces mucho y no avanzas? Aquí verás la verdad. Tus estadísticas semanales te mostrarán gráficamente tu rendimiento real.",
        boton: "Ver mis estadísticas",
        // Icono de gráfico de crecimiento
        gif: "https://cdn-icons-png.flaticon.com/512/2936/2936723.png"
    },
   motivacion: {
        titulo: "Tu dosis diaria de energía ⚡",
        texto: "“El cambio es difícil al principio, desordenado en el medio y hermoso al final.”\n\n– Robin Sharma",
        boton: "¡Vamos a por ello!",
        // Usemos este enlace web que es 100% seguro:
        gif: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Robin_Sharma_2015.jpg"
    },
    amigos: {
        titulo: "Juntos llegamos más lejos 🤝",
        texto: "Compartir tus metas crea compromiso. Invita a tus amigos, comparen rachas y motívense mutuamente para no abandonar.",
        boton: "Invitar amigos",
        // Icono de comunidad/amigos
        gif: "https://cdn-icons-png.flaticon.com/512/3820/3820195.png"
    },
    personalizar: {
        titulo: "Tu espacio, tus reglas 🎨",
        texto: "Haz que la app se sienta tuya. Cambia los colores, el tema oscuro o el tamaño de la letra para que te sientas cómodo trabajando.",
        boton: "Ir a ajustes",
        // Icono de diseño/pincel
        gif: "https://cdn-icons-png.flaticon.com/512/2919/2919632.png"
    },
    riesgo: {
        titulo: "Anticípate al abandono ⚠️",
        texto: "Nuestro sistema detecta cuando estás bajando el ritmo y te avisa antes de que pierdas tu racha. ¡No dejes que pase!",
        boton: "Analizar mi riesgo",
        // Icono de alerta/análisis
        gif: "https://cdn-icons-png.flaticon.com/512/4201/4201973.png"
    },
    dispositivos: {
        titulo: "Tu productividad va contigo 📱",
        texto: "Accede a tu cuenta desde el celular, la tablet o la computadora. Tus datos se sincronizan al instante en la nube.",
        boton: "Vincular dispositivo",
        // Icono de múltiples dispositivos
        gif: "https://cdn-icons-png.flaticon.com/512/2933/2933245.png"
    },
    pomodoro: {
        titulo: "Enfoque láser en 25 minutos 🍅",
        texto: "Usa la técnica Pomodoro para trabajar intensamente sin quemarte. Bloques de enfoque con descansos obligatorios.",
        boton: "Iniciar temporizador",
        // Icono de temporizador/tomate
        gif: "https://cdn-icons-png.flaticon.com/512/4305/4305432.png"
    }
};


// Función para abrir el modal con la información correcta (VERSIÓN SOLO TEXTO)
function abrirModalInfo(clave) {
    // Verificamos si la clave existe en nuestro diccionario
    if (contenidos[clave]) {
        const data = contenidos[clave];

        // 1. Actualizamos solo Título, Texto y Botón
        // Nota: Ya no tocamos ninguna imagen ni gif
        if(tituloInfo) tituloInfo.textContent = data.titulo;
        
        // El texto acepta saltos de línea especiales
        if(textoInfo) {
            textoInfo.style.whiteSpace = "pre-line"; 
            textoInfo.textContent = data.texto;
        }
        
        if(botonCTA) botonCTA.textContent = data.boton;

        // 2. Mostramos el modal
        if(modalInfo) modalInfo.classList.remove('modal-oculto');
    } else {
        console.error("No existe contenido para: " + clave);
    }
}

btnTareas.addEventListener('click', (e) => {
    e.preventDefault();
    abrirModalInfo('tareas');
});

cerrarInfo.addEventListener('click', () => {
    modalInfo.classList.add('modal-oculto');
});

modalInfo.addEventListener('click', (e) => {
    if (e.target === modalInfo) {
        modalInfo.classList.add('modal-oculto');
    }
});

// ==========================================
//      NAVEGACIÓN ENTRE PANTALLAS
// ==========================================

// Referencias a las vistas
const vistaMenu = document.getElementById('vista-menu-principal');
const vistaTareas = document.getElementById('vista-tareas');
const btnVolver = document.getElementById('btn-volver-menu');

// Referencia al botón verde del modal de información
// (Asegúrate de tener: const botonCTA = document.getElementById('info-cta'); definido arriba)

// --- FUNCIÓN DE NAVEGACIÓN COMPLETA ---
function cambiarPantalla(pantallaDestino) {
    // 1. Referencias a las 3 vistas (Las buscamos aquí para asegurar que existan)
    const vMenu = document.getElementById('vista-menu-principal');
    const vTareas = document.getElementById('vista-tareas');
    const vPomodoro = document.getElementById('vista-pomodoro');

    // 2. PRIMERO OCULTAMOS TODO (Reseteo)
    if (vMenu) vMenu.style.display = 'none';
    if (vTareas) vTareas.style.display = 'none';
    if (vPomodoro) vPomodoro.style.display = 'none';

    // 3. Cerramos el modal de información si está abierto
    const modalInfo = document.getElementById('modal-info');
    if (modalInfo) modalInfo.classList.add('modal-oculto');

    // 4. MOSTRAMOS SOLO LA QUE QUEREMOS
    if (pantallaDestino === 'menu') {
        if (vMenu) vMenu.style.display = 'block';
    } 
    else if (pantallaDestino === 'tareas') {
        if (vTareas) vTareas.style.display = 'block';
    } 
    else if (pantallaDestino === 'pomodoro') {
        if (vPomodoro) vPomodoro.style.display = 'block';
    }
}

// EVENTO: Click en el botón verde del modal (El que dice "+ Agregar tarea" o "Iniciar temp")
if (botonCTA) {
    botonCTA.addEventListener('click', () => {
        const textoBoton = botonCTA.textContent;

        // CASO 1: Ir a Tareas
        if (textoBoton.includes("Agregar") || textoBoton.includes("Dashboard") || textoBoton.includes("estadísticas")) {
            cambiarPantalla('tareas');
        }
        // CASO 2: Ir a Pomodoro (ESTO ES LO NUEVO)
        else if (textoBoton.includes("temporizador") || textoBoton.includes("Pomodoro") || textoBoton.includes("Iniciar")) {
            cambiarPantalla('pomodoro');
        }
        // CASO 3: Solo cerrar (para los botones que aún no tienen función)
        else {
            const modalInfo = document.getElementById('modal-info');
            if (modalInfo) modalInfo.classList.add('modal-oculto');
        }
    });
}

// EVENTO: Botón Volver (Flecha atrás)
if (btnVolver) {
    btnVolver.addEventListener('click', () => {
        // 1. Ocultamos la vista de tareas
        if(vistaTareas) vistaTareas.style.display = 'none';
        
        // 2. Mostramos el menú principal
        if(vistaMenu) vistaMenu.style.display = 'block';
        cambiarPantalla('menu');
    });
}

// --- CONFIGURACIÓN DE LOS BOTONES ---

// Función auxiliar para conectar un botón con su contenido

function conectarBoton(idBoton, claveContenido) {
    const boton = document.getElementById(idBoton);
    if (boton) {
        boton.addEventListener('click', (e) => {
            e.preventDefault();
            abrirModalInfo(claveContenido);
        });
    }
}

// Conectamos todos los botones de una sola vez:
conectarBoton('btn-tareas', 'tareas');
conectarBoton('btn-recordatorios', 'recordatorios');
conectarBoton('btn-progreso', 'progreso');
conectarBoton('btn-motivacion', 'motivacion');
conectarBoton('btn-amigos', 'amigos');
conectarBoton('btn-personalizar', 'personalizar');
conectarBoton('btn-riesgo', 'riesgo');
conectarBoton('btn-dispositivos', 'dispositivos');
conectarBoton('btn-pomodoro', 'pomodoro');

// ==========================================
//      GESTOR DE TAREAS (CON FIREBASE) ☁️
// ==========================================

const inputTarea = document.getElementById('input-nueva-tarea');
const btnAgregarTarea = document.getElementById('btn-agregar-tarea');
const listaTareas = document.getElementById('lista-tareas');

// Referencias para las estadísticas (Dashboard)
const textoContador = document.getElementById('contador-tareas');
const textoPorcentaje = document.querySelector('.stat-info .numero-grande');
const barraRelleno = document.querySelector('.relleno');
const graficoCircularCentro = document.querySelector('.porcentaje-centro');
const graficoCircularVerde = document.querySelector('.semi-circulo::after'); // Para rotarlo

// Variable para saber quién está conectado
let usuarioActualID = null;

// 1. DETECTAR USUARIO Y CARGAR SUS TAREAS
onAuthStateChanged(auth, (user) => {
    if (user) {
        usuarioActualID = user.uid;
        cargarTareasEnTiempoReal();
    } else {
        usuarioActualID = null;
        listaTareas.innerHTML = ''; // Si se va, limpiamos la lista
    }
});

// 2. FUNCIÓN DE ESCUCHA (REAL-TIME)
function cargarTareasEnTiempoReal() {
    if (!usuarioActualID) return;

    // Consulta: Dame las tareas de ESTE usuario, ordenadas por fecha
    const q = query(
        collection(db, "tareas"), 
        where("usuarioId", "==", usuarioActualID),
        orderBy("fecha", "desc")
    );

    // El "Espía" de la base de datos
    onSnapshot(q, (snapshot) => {
        listaTareas.innerHTML = ''; // Limpiamos para no duplicar
        
        let total = 0;
        let completadas = 0;

        snapshot.forEach((docFirebase) => {
            const tarea = docFirebase.data();
            const idTarea = docFirebase.id;
            
            total++;
            if (tarea.completada) completadas++;

            // Dibujamos la tarea
            renderizarTarea(idTarea, tarea.texto, tarea.completada);
        });

        // Actualizamos las estadísticas del Dashboard
        actualizarEstadisticas(total, completadas);
    });
}

// 3. AGREGAR TAREA A LA NUBE
if (btnAgregarTarea) {
    btnAgregarTarea.addEventListener('click', async () => {
        const texto = inputTarea.value;
        if (texto === "") return alert("Escribe algo ✍️");

        if (!usuarioActualID) return alert("Debes iniciar sesión para guardar tareas");

        try {
            await addDoc(collection(db, "tareas"), {
                texto: texto,
                completada: false,
                usuarioId: usuarioActualID,
                fecha: new Date()
            });
            inputTarea.value = ""; // Limpiar input
        } catch (error) {
            console.error("Error al guardar:", error);
        }
    });
}

// 4. DIBUJAR TAREA EN PANTALLA (HTML)
function renderizarTarea(id, texto, completada) {
    const li = document.createElement('li');
    li.classList.add('tarea-item');
    if (completada) li.classList.add('completada');

    li.innerHTML = `
        <span class="texto-tarea">${texto}</span>
        <div class="acciones-tarea">
            <button class="btn-check" data-id="${id}" title="Marcar/Desmarcar">✔️</button>
            <button class="btn-borrar" data-id="${id}" title="Eliminar">🗑️</button>
        </div>
    `;

    // Evento CHECK (Actualizar en Nube)
    const btnCheck = li.querySelector('.btn-check');
    btnCheck.addEventListener('click', async () => {
        const tareaRef = doc(db, "tareas", id);
        await updateDoc(tareaRef, {
            completada: !completada // Invertimos el valor
        });
    });

    // Evento BORRAR (Borrar de Nube)
    const btnBorrar = li.querySelector('.btn-borrar');
    btnBorrar.addEventListener('click', async () => {
        if(confirm("¿Borrar esta tarea?")) {
            await deleteDoc(doc(db, "tareas", id));
        }
    });

    listaTareas.appendChild(li);
}

// 5. ACTUALIZAR DASHBOARD (VERSIÓN MEJORADA)
function actualizarEstadisticas(total, completadas) {
    // 1. Textos básicos (igual que antes)
    if(textoContador) textoContador.textContent = `${completadas}/${total}`;
    
    // 2. Calcular porcentaje (0 a 100)
    let porcentaje = 0;
    if (total > 0) porcentaje = Math.round((completadas / total) * 100);

    // 3. Actualizar textos varios
    if(textoPorcentaje) textoPorcentaje.textContent = `${porcentaje}%`;
    if(barraRelleno) barraRelleno.style.width = `${porcentaje}%`;

    // 4. NUEVA LÓGICA PARA EL ANILLO SVG
    const anillo = document.querySelector('.progress-ring__circle');
    const textoCentro = document.querySelector('.porcentaje-grande');
    
    if (anillo) {
        const radio = 50;
        const circunferencia = 2 * Math.PI * radio; // aprox 314
        
        // Calculamos cuánto offset (espacio vacío) dejar
        // Si porcentaje es 100, offset es 0 (círculo lleno)
        // Si porcentaje es 0, offset es 314 (círculo vacío)
        const offset = circunferencia - (porcentaje / 100) * circunferencia;
        
        anillo.style.strokeDashoffset = offset;
    }

    if (textoCentro) {
        textoCentro.textContent = `${porcentaje}%`;
    }
    // NUEVO: ACTUALIZAR EL BOTÓN "MONITOREA TU PROGRESO" EN EL MENÚ
    // ============================================================
    // Verificamos si existe el diccionario 'contenidos' antes de tocarlo
    if (typeof contenidos !== 'undefined' && contenidos.progreso) {
        
        // 1. Cambiamos el Título con el Porcentaje Real
        contenidos.progreso.titulo = `Tu Rendimiento: ${porcentaje}% 🚀`;
        
        // 2. Cambiamos el Texto con el detalle exacto
        if (total === 0) {
             contenidos.progreso.texto = "Aún no tienes tareas registradas. ¡Agrega la primera para ver tu progreso!";
        } else {
             contenidos.progreso.texto = `Has completado ${completadas} de ${total} tareas esta semana. ¡Mantén esa racha!`;
        }

        // 3. Cambiamos el botón para que sirva de atajo al Dashboard
        contenidos.progreso.boton = "Ir al Dashboard completo →";
    }
}

// ==========================================
//      CALENDARIO Y RELOJ EN TIEMPO REAL 🕒
// ==========================================

const elementoReloj = document.getElementById('reloj-digital');
const elementoMesAnio = document.getElementById('mes-anio-texto');
const gridDias = document.getElementById('grid-dias');

// 1. FUNCIÓN DEL RELOJ (Se actualiza cada segundo)
function iniciarReloj() {
    setInterval(() => {
        const ahora = new Date();
        // Formato de hora local (HH:MM:SS)
        const horaString = ahora.toLocaleTimeString(); 
        if(elementoReloj) elementoReloj.textContent = horaString;
    }, 1000); // 1000ms = 1 segundo
}

// 2. FUNCIÓN PARA DIBUJAR EL CALENDARIO
function renderizarCalendarioReal() {
    if (!gridDias) return;

    const fechaActual = new Date();
    const anio = fechaActual.getFullYear();
    const mes = fechaActual.getMonth(); // 0 = Enero, 1 = Febrero...
    const diaHoy = fechaActual.getDate();

    // Ponemos el título (Ej: "Marzo 2025")
    const nombresMeses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
                          "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    if(elementoMesAnio) elementoMesAnio.textContent = `${nombresMeses[mes]} ${anio}`;

    // Limpiamos los días anteriores (dejando los 7 headers de la semana)
    // Nota: Como los headers están en el HTML, borramos solo los divs que sean 'dia'
    // O mejor: borramos todo y volvemos a poner los headers para no liarnos, 
    // pero como ya tienes los headers en HTML, usaremos un truco:
    // Borramos solo los elementos que NO sean .dia-semana
    const diasViejos = gridDias.querySelectorAll('.dia');
    diasViejos.forEach(d => d.remove());

    // CÁLCULOS MATEMÁTICOS DEL MES
    // Primer día del mes (1 = Lunes, 7 = Domingo en tu diseño visual)
    // JS dice que Domingo es 0, Lunes 1... hay que ajustar.
    let primerDiaSemana = new Date(anio, mes, 1).getDay(); 
    // Ajuste para que Lunes sea 0 y Domingo 6 (o Lunes 1 y Domingo 7 según tu grid)
    // En tu grid: L M M J V S D. (Lunes es columna 1).
    if (primerDiaSemana === 0) primerDiaSemana = 7; // Si es domingo (0), lo pasamos a 7

    // Total de días en el mes (truco: día 0 del mes siguiente es el último de este)
    const totalDiasMes = new Date(anio, mes + 1, 0).getDate();

    // DIBUJAR ESPACIOS VACÍOS (Antes del día 1)
    for (let i = 1; i < primerDiaSemana; i++) {
        const vacio = document.createElement('div');
        vacio.classList.add('dia', 'vacio');
        gridDias.appendChild(vacio);
    }

    // DIBUJAR LOS DÍAS (1 al 31)
    for (let i = 1; i <= totalDiasMes; i++) {
        const diaDiv = document.createElement('div');
        diaDiv.classList.add('dia');
        diaDiv.textContent = i;

        // Si es HOY, lo marcamos azul
        if (i === diaHoy) {
            diaDiv.classList.add('hoy');
        }

        // --- LÓGICA DE RACHAS (ATENCIÓN AQUÍ) ---
        // Por ahora, como es tiempo real, no sabemos qué días hiciste tareas en el pasado.
        // Como solución temporal estética, pintaremos de verde los días anteriores al de hoy 
        // para simular progreso (luego conectaremos esto con la Base de Datos real).
        if (i < diaHoy) {
             // Descomenta la siguiente línea si quieres ver días verdes de prueba:
             // diaDiv.classList.add('racha'); 
        }
        
        // Hacemos que los días sean clickeables (para tu futura función de "ver progreso")
        diaDiv.addEventListener('click', () => {
            alert(`Has seleccionado el día: ${i} de ${nombresMeses[mes]}`);
            // Aquí luego cargaremos las tareas de ese día específico
        });

        gridDias.appendChild(diaDiv);
    }
}

// 3. INICIALIZAR AL CARGAR
// Agregamos esto para que arranque apenas abras la página
iniciarReloj();
renderizarCalendarioReal();

// ==========================================
//      RESALTAR FECHA EN GRÁFICOS 📊
// ==========================================

function resaltarBarrasActuales() {
    const fecha = new Date();
    
    // 1. DÍA DE LA SEMANA
    // getDay() devuelve: 0=Domingo, 1=Lunes, ..., 6=Sábado
    let diaSemana = fecha.getDay(); 
    
    // Buscamos la barra que tenga el data-dia igual al de hoy
    // Nota: En tu HTML el Domingo es data-dia="0", Lunes="1", etc. coincide perfecto.
    const barraDia = document.querySelector(`#barras-semanales .barra[data-dia="${diaSemana}"]`);
    if (barraDia) {
        barraDia.classList.add('actual');
        barraDia.title = "¡Hoy es " + barraDia.title + "!"; // Tooltip bonito
    }

    // 2. MES ACTUAL
    // getMonth() devuelve: 0=Enero, 11=Diciembre
    const mesActual = fecha.getMonth();
    
    const barraMes = document.querySelector(`#barras-mensuales .barra[data-mes="${mesActual}"]`);
    if (barraMes) {
        barraMes.classList.add('actual');
    }
}

// Ejecutamos la función al cargar
resaltarBarrasActuales();

// ==========================================
//      SISTEMA POMODORO 🍅
// ==========================================

// Referencias HTML
const vistaPomodoro = document.getElementById('vista-pomodoro');
const displayTiempo = document.getElementById('tiempo-display');
const textoEstado = document.getElementById('estado-texto');
const anilloRelleno = document.querySelector('.anillo-relleno');
const btnVolverPomodoro = document.getElementById('btn-volver-menu-pomodoro');

// Botones de control
const btnIniciarPomo = document.getElementById('btn-iniciar-timer');
const btnPausarPomo = document.getElementById('btn-pausar-timer');
const btnReiniciarPomo = document.getElementById('btn-reiniciar-timer');
const btnSetManual = document.getElementById('btn-set-manual');
const inputMinutos = document.getElementById('input-minutos');

// Variables del Timer
let tiempoTotal = 25 * 60; // Por defecto 25 min en segundos
let tiempoRestante = tiempoTotal;
let intervaloTimer = null;
let estaCorriendo = false;

// Circunferencia del anillo (para la animación)
const radio = 130;
const circunferencia = 2 * Math.PI * radio; // aprox 816

// 1. FUNCIÓN PARA FORMATEAR TIEMPO (MM:SS)
function formatearTiempo(segundos) {
    const m = Math.floor(segundos / 60);
    const s = segundos % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
}

// 2. FUNCIÓN PRINCIPAL DE ACTUALIZACIÓN
function actualizarTimer() {
    // Texto
    displayTiempo.textContent = formatearTiempo(tiempoRestante);
    
    // Anillo (Animación SVG)
    // Calculamos cuánto offset poner para "vaciar" el círculo proporcionalmente
    const offset = circunferencia - (tiempoRestante / tiempoTotal) * circunferencia;
    if(anilloRelleno) anilloRelleno.style.strokeDashoffset = offset;

    if (tiempoRestante <= 0) {
        clearInterval(intervaloTimer);
        estaCorriendo = false;
        textoEstado.textContent = "¡Tiempo terminado!";
        
        // Sonido de alarma (opcional)
        // new Audio('alarma.mp3').play(); 
        
        alert("¡Pomodoro terminado! 🎉 Tómate un descanso.");
        resetearBotones();
    }
    
    tiempoRestante--;
}

// 3. CONTROLES DEL TIMER
if (btnIniciarPomo) {
    btnIniciarPomo.addEventListener('click', () => {
        if (!estaCorriendo) {
            intervaloTimer = setInterval(actualizarTimer, 1000);
            estaCorriendo = true;
            textoEstado.textContent = "Enfocando...";
            
            // Cambiar botones
            btnIniciarPomo.style.display = 'none';
            btnPausarPomo.style.display = 'inline-block';
        }
    });
}

if (btnPausarPomo) {
    btnPausarPomo.addEventListener('click', () => {
        clearInterval(intervaloTimer);
        estaCorriendo = false;
        textoEstado.textContent = "Pausado";
        
        btnIniciarPomo.style.display = 'inline-block';
        btnPausarPomo.style.display = 'none';
    });
}

if (btnReiniciarPomo) {
    btnReiniciarPomo.addEventListener('click', () => {
        clearInterval(intervaloTimer);
        estaCorriendo = false;
        tiempoRestante = tiempoTotal; // Volvemos al inicio
        actualizarTimer(); // Refrescamos visualmente
        textoEstado.textContent = "Listo para enfocar";
        resetearBotones();
    });
}

function resetearBotones() {
    btnIniciarPomo.style.display = 'inline-block';
    btnPausarPomo.style.display = 'none';
}

// 4. CAMBIAR EL TIEMPO (15, 25, 30, 45)
// Esta función se llama desde el HTML con onclick="setTiempo(x)"
window.setTiempo = function(minutos) {
    clearInterval(intervaloTimer);
    estaCorriendo = false;
    resetearBotones();
    
    tiempoTotal = minutos * 60;
    tiempoRestante = tiempoTotal;
    
    textoEstado.textContent = "Listo (" + minutos + " min)";
    actualizarTimer(); // Actualiza el número en pantalla inmediatamente
};

// Entrada Manual
if (btnSetManual) {
    btnSetManual.addEventListener('click', () => {
        const mins = parseInt(inputMinutos.value);
        if (mins > 0) {
            window.setTiempo(mins);
            inputMinutos.value = "";
        }
    });
}

// 5. NAVEGACIÓN (Abrir y Cerrar vista)






// Botón Volver específico del Pomodoro
if (btnVolverPomodoro) {
    btnVolverPomodoro.addEventListener('click', () => {
        if(vistaPomodoro) vistaPomodoro.style.display = 'none';
        const menu = document.getElementById('vista-menu-principal');
        if(menu) menu.style.display = 'block';
    });
}