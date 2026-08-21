const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');

// 1. Creamos el servidor Web para cargar el archivo index.html
const servidorWeb = http.createServer((peticion, respuesta) => {
    fs.readFile(path.join(__dirname, 'index.html'), (error, contenido) => {
        if (error) {
            respuesta.writeHead(500);
            respuesta.end('Error al cargar el HTML');
        } else {
            respuesta.writeHead(200, { 'Content-Type': 'text/html' });
            respuesta.end(contenido); // Enviamos el HTML al navegador
        }
    });
});

// 2. Conectamos los WebSockets a este mismo servidor Web
const servidor = new WebSocket.Server({ server: servidorWeb });

let jugadores = [];
let tablero = [null, null, null, null, null, null, null, null, null];
let turnoActual = 'X';

servidor.on('connection', (cliente) => {
    if (jugadores.length >= 2) {
        cliente.send(JSON.stringify({ tipo: 'error', mensaje: 'El juego está lleno' }));
        cliente.close();
        return;
    }

    const simbolo = jugadores.length === 0 ? 'X' : 'O';
    jugadores.push({ cliente: cliente, simbolo: simbolo });
    
    cliente.send(JSON.stringify({ tipo: 'inicio', simbolo: simbolo }));
    enviarEstadoATodos();

    cliente.on('message', (mensajeRecibido) => {
        const datos = JSON.parse(mensajeRecibido);

        if (datos.tipo === 'movimiento' && jugadores.length === 2) {
            const jugador = jugadores.find(j => j.cliente === cliente);
            if (jugador && jugador.simbolo === turnoActual) {
                if (tablero[datos.indice] === null) {
                    tablero[datos.indice] = simbolo;
                    turnoActual = turnoActual === 'X' ? 'O' : 'X';
                    enviarEstadoATodos();
                }
            }
        }

        if (datos.tipo === 'reiniciar') {
            tablero = [null, null, null, null, null, null, null, null, null];
            turnoActual = 'X';
            enviarEstadoATodos();
        }
    });

    cliente.on('close', () => {
        jugadores = jugadores.filter(j => j.cliente !== cliente);
        tablero = [null, null, null, null, null, null, null, null, null];
        turnoActual = 'X';
        enviarEstadoATodos();
    });
});

function enviarEstadoATodos() {
    const ganador = comprobarGanador();
    const mensaje = JSON.stringify({ 
        tipo: 'actualizacion', tablero: tablero, turnoActual: turnoActual, 
        ganador: ganador, cantidadJugadores: jugadores.length 
    });
    jugadores.forEach(j => j.cliente.send(mensaje));
}

function comprobarGanador() {
    const lineasGanadoras = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
    for (let linea of lineasGanadoras) {
        const [a, b, c] = linea;
        if (tablero[a] && tablero[a] === tablero[b] && tablero[a] === tablero[c]) return tablero[a];
    }
    if (!tablero.includes(null)) return 'Empate';
    return null;
}

// 3. Iniciamos el servidor en el puerto 3000
servidorWeb.listen(3000, () => {
    console.log("Servidor web y juego iniciados.");
    console.log("👉 Entra en tu navegador a: http://localhost:3000");
});