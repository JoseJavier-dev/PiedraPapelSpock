//funciones auxiliares y variables globales
const opciones = ["piedra", "papel", "tijeras", "lagarto", "spock"];

let scoreJugador = 0;
let scoreIA = 0;

const reglas = {
    piedra: ["tijeras", "lagarto"],
    papel: ["piedra", "spock"],
    tijeras: ["papel", "lagarto"],
    lagarto: ["spock", "papel"],
    spock: ["tijeras", "piedra"]
};

function numeroAleatorio() {
    return Math.floor(Math.random() * opciones.length)
}

function obtenerCounters(eleccionJugador) {
    return Object.keys(reglas).filter(opcion =>
        reglas[opcion].includes(eleccionJugador)
    );
}

//logica del juego
function jugar(eleccionJugador) {
    let dosJugadores = document.getElementById("two-players-toggle").checked;
    if (dosJugadores) return;

    let dificultad = document.getElementById("difficulty").value;

    eleccionDeLaIa(eleccionJugador, dificultad) 

}
function eleccionDeLaIa(eleccionJugador, dificultad) {

    let ia;

    switch (parseInt(dificultad)) {
        //siempre pierde
        case 0:

            let pierde = reglas[eleccionJugador];
            ia = pierde[Math.floor(Math.random() * pierde.length)];
            break;


        //coge aleatorio,si es counter 50% de rerolear
        //probabilidad de ganar de ia 28% aprox
        case 1:

            ia = opciones[numeroAleatorio()];

            const countersJugador = obtenerCounters(eleccionJugador);
            const esCounter = countersJugador.includes(ia);

            if (esCounter) {
                if (Math.random() >= 0.5) {
                    ia = opciones[numeroAleatorio()];
                }
            }

            break;
        case 2:
            //completamente aleatorio 40% ganar 20% empate
             ia = opciones[numeroAleatorio()];

            break;

        //gana el 99.4% de las veces
        case 3:
            const counters = obtenerCounters(eleccionJugador);

            if (Math.random() < 0.99) {
                ia = counters[Math.floor(Math.random() * counters.length)];
            } else {
                ia = opciones[numeroAleatorio()];
            }
            break;

    }

    resolverRonda(eleccionJugador, ia);
}



// cosas relacionadas con el mensaje del final
const emojis = {
    piedra: "🪨",
    papel: "📄",
    tijeras: "✂️",
    lagarto: "🦎",
    spock: "🖖"
};
const acciones = {
    piedra: {
        tijeras: "aplasta",
        lagarto: "aplasta"
    },
    papel: {
        piedra: "envuelve",
        spock: "refuta"
    },
    tijeras: {
        papel: "corta",
        lagarto: "decapita"
    },
    lagarto: {
        spock: "envenena",
        papel: "come"
    },
    spock: {
        tijeras: "rompe",
        piedra: "desintegra"
    }
};

function resolverRonda(eleccionJugador, ia) {

    let resultado = "";

    let emoJugador = emojis[eleccionJugador];
    let emoIA = emojis[ia];

    if (eleccionJugador === ia) {
        resultado = `Empate  (${emoJugador} vs ${emoIA})`;
    }
    else if (reglas[eleccionJugador].includes(ia)) {

        let accion = acciones[eleccionJugador][ia];

        resultado = `Ganaste  ${emoJugador} ${accion} ${emoIA}`;
        scoreJugador++;

    }
    else {

        let accion = acciones[ia][eleccionJugador];

        resultado = `Perdiste  ${emoIA} ${accion} ${emoJugador}`;
        scoreIA++;

    }

    document.getElementById("resultado").textContent = resultado;
    document.getElementById("scoreJugador").textContent = scoreJugador;

    document.getElementById("scoreIA").textContent = scoreIA;

    checkGanador();
}
function checkGanador() {

    const limite = parseInt(document.getElementById("win-limit").value);
    const dificultad = parseInt(document.getElementById("difficulty").value);

    if (scoreJugador >= limite) {

        if (dificultad == 0) {
            alert("Felicidades,has elegido echar horas a un proyecto en vez de atender en clase y hacer un examen de dos horas");
        } else {
            alert("¡Has ganado la partida!");
        }

        resetJuego();
        return;
    }

    if (scoreIA >= limite) {
        alert("La IA ha ganado la partida");
        resetJuego();
        return;
    }
}
function resetJuego() {
    scoreJugador = 0;
    scoreIA = 0;

    document.getElementById("scoreJugador").textContent = 0;
    document.getElementById("scoreIA").textContent = 0;
    document.getElementById("resultado").textContent = "";
}

//Multijugador in real life 


function actualizarNombresUI() {

    const nombre1 = document.getElementById("player1-name").value;
    const nombre2 = document.getElementById("player2-name").value;

    const pJugador = document.getElementById("scoreJugador").parentElement;
    const pIA = document.getElementById("scoreIA").parentElement;

    pJugador.innerHTML = `${nombre1}: <span id="scoreJugador">${scoreJugador}</span>`;
    pIA.innerHTML = `${nombre2}: <span id="scoreIA">${scoreIA}</span>`;
}
document.getElementById("player1-name").addEventListener("input", actualizarNombresUI);
document.getElementById("player2-name").addEventListener("input", actualizarNombresUI);
function restaurarNombresDefault() {

    document.getElementById("scoreJugador").parentElement.innerHTML =
        `Jugador: <span id="scoreJugador">${scoreJugador}</span>`;

    document.getElementById("scoreIA").parentElement.innerHTML =
        `IA: <span id="scoreIA">${scoreIA}</span>`;
}
document.getElementById("two-players-toggle").onchange = function (e) {

    const activo = e.target.checked;

    document.getElementById("multiplayer-ui").style.display = activo ? "block" : "none";

    if (activo) {
        alert("Yo llevo la cuenta de las victorias pero existe una cosa para jugar dos personas al piedra papel tijeras que son las manos ");
        actualizarNombresUI();
        resetJuego();
        bloquearJuego(true);
    } else {
        restaurarNombresDefault();
        resetJuego();
        bloquearJuego(false);
    }
};
function checkGanadorMultiplayer() {

    const limite = parseInt(document.getElementById("win-limit").value);

    const nombre1 = document.getElementById("player1-name").value;
    const nombre2 = document.getElementById("player2-name").value;

    if (scoreJugador >= limite) {
        alert(`${nombre1} ha ganado`);
        resetJuego();
    }

    if (scoreIA >= limite) {
        alert(`${nombre2} ha ganado`);
        resetJuego();
    }
}
function sumarPunto(jugador) {

    if (jugador === 1) {
        scoreJugador++;
        document.getElementById("scoreJugador").textContent = scoreJugador;
    } else {
        scoreIA++;
        document.getElementById("scoreIA").textContent = scoreIA;
    }

    checkGanadorMultiplayer();
}

//sonidos

let volumen = 1;

const slider = document.getElementById("volume-slider");


slider.addEventListener("input", () => {
    volumen = parseFloat(slider.value);
    musica.volume = volumen;
});
function hacerSonido(tipo) {

    const sonidoActivo = document.getElementById("sound-toggle").checked;
    if (!sonidoActivo) return;

    let audio;

    switch (tipo) {
        case "piedra":
            audio = new Audio(".//res/sonidoPiedra.mp3");
            break;
        case "papel":
            audio = new Audio(".//res/sonidoPapel.mp3");
            break;
        case "tijeras":
            audio = new Audio(".//res/sonidoTijeras.mp3");
            break;
        case "lagarto":
            audio = new Audio(".//res/sonidoLizard.mp3");
            break;
        case "spock":
            audio = new Audio(".//res/sonidoSpook.mp3");
            break;
    }

    if (audio) {
        audio.volume = volumen;
        audio.play();
    }
}

let musica = new Audio("res/musica.mp3");
musica.loop = true;
musica.volume = volumen;

document.getElementById("music-toggle").addEventListener("change", (e) => {
    if (e.target.checked) {
        musica.play();
    } else {
        musica.pause();
    }
});
document.body.addEventListener("click", () => {
    if (musica.paused && document.getElementById("music-toggle").checked) {
        musica.play();
    }
}, { once: true });


//info del juego 
const modal = document.getElementById("info-modal");
const btn = document.getElementById("info-btn");


btn.onclick = () => {
    modal.classList.remove("hidden");
};


modal.onclick = () => {
    modal.classList.add("hidden");
};

//colores
const textPicker = document.getElementById("text-color-picker");
const bgPicker = document.getElementById("bg-color-picker");


textPicker.addEventListener("input", (e) => {

    const color = e.target.value;

    const elementos = document.querySelectorAll(".colorizable");

    elementos.forEach(element => {
        element.style.color = color;
    });
});


bgPicker.addEventListener("input", (element) => {
    document.body.style.background = element.target.value;
});