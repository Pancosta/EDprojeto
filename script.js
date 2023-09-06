// Obtém a referência para a tabela HTML com o ID 'myTable'
const table = document.getElementById('myTable');

// Define o número de linhas e colunas da grade da cidade
const rows = 25;
const columns = 40;

// Matriz representando a estrutura da cidade (0 para construção, 1 para rua)

const cidade = 4;
let cityLayout;

if (cidade == 1) {
    cityLayout = [
        [1, 0, 0, 0, 1, 0, 0],
        [1, 0, 0, 0, 1, 0, 0],
        [1, 0, 1, 1, 1, 1, 1],
        [1, 0, 1, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1],
    ];
} else if (cidade == 2) {
    cityLayout = [
        [1, 0, 1, 1, 0, 0, 1],
        [1, 0, 1, 1, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1],
        [1, 0, 1, 1, 0, 0, 1],
        [1, 0, 1, 1, 0, 0, 1],
    ];
} else if (cidade == 3) {
    cityLayout = [
        [1, 0, 0, 0, 1, 0, 0],
        [1, 0, 0, 0, 1, 0, 0],
        [1, 0, 0, 0, 1, 1, 1],
        [1, 0, 0, 0, 1, 0, 0],
        [1, 1, 1, 1, 1, 0, 0],
    ];
} else if (cidade == 4) {
    cityLayout = [
        [1, 0, 1, 1, 1, 0, 0],
        [1, 0, 1, 0, 1, 0, 0],
        [1, 0, 1, 0, 1, 1, 1],
        [1, 1, 1, 0, 1, 0, 0],
        [0, 0, 1, 0, 1, 0, 0],
    ];
}

// Variáveis globais para armazenar o ponto de partida, ponto de chegada e o caminho
let startPoint = null;
let endPoint = null;
let path = [];

// Função para criar a tabela da cidade
function criarTabela() {
    table.innerHTML = '';

    for (let i = 0; i < rows; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < columns; j++) {
            const cell = document.createElement('td');
            if (cityLayout[i % cityLayout.length][j % cityLayout[0].length] === 1) {
                if (Math.random() < 0.05) {
                    // 5% de chance de engarrafamento (marcado em marrom)
                    cell.classList.add('traffic-jam');
                } else {
                    // 95% de chance de rua regular (marcada em branco)
                    cell.classList.add('street');
                    cell.addEventListener('click', () => {
                        if (startPoint === null) {
                            // Defina o ponto de partida (verde)
                            startPoint = cell;
                            startPoint.style.backgroundColor = 'green';
                        } else if (endPoint === null && cell !== startPoint) {
                            // Defina o ponto de chegada (vermelho)
                            endPoint = cell;
                            endPoint.style.backgroundColor = 'red';
                            findShortestPath();
                        }
                    });
                }
            } else {
                cell.classList.add('building');
            }
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
}

// Função para encontrar o caminho mais curto usando busca em largura
function findShortestPath() {
    // Verifica se tanto o ponto de partida quanto o ponto de chegada foram definidos
    if (!startPoint || !endPoint) {
        alert('Por favor, defina um ponto de partida e um ponto de chegada.');
        return;
    }

    const queue = []; // Fila para a busca em largura
    const visited = new Set(); // Conjunto para acompanhar células visitadas
    const parentMap = new Map(); // Mapeia cada célula para seu pai no caminho

    // Adicione o ponto de partida à fila
    queue.push(startPoint);
    visited.add(startPoint);

    // Enquanto houver células na fila
    while (queue.length > 0) {
        const currentCell = queue.shift();

        // Se chegamos ao ponto de chegada, reconstruímos o caminho e o destacamos
        if (currentCell === endPoint) {
            highlightPath(parentMap, currentCell);
            return;
        }

        // Obtém as coordenadas da célula atual
        const row = currentCell.parentElement.rowIndex;
        const col = currentCell.cellIndex;

        // Define os vizinhos (acima, abaixo, esquerda, direita)
        const neighbors = [
            { row: row - 1, col: col },
            { row: row + 1, col: col },
            { row: row, col: col - 1 },
            { row: row, col: col + 1 },
        ];

        // Itera pelos vizinhos
        for (const neighbor of neighbors) {
            const { row, col } = neighbor;
            const nextCell = table.rows[row] && table.rows[row].cells[col];

            // Verifica se o vizinho é uma rua não visitada
            if (nextCell && !visited.has(nextCell) && nextCell.classList.contains('street')) {
                queue.push(nextCell);
                visited.add(nextCell);
                parentMap.set(nextCell, currentCell);
            }
        }
    }

    // Se chegamos aqui, não foi encontrado um caminho
    alert('Não foi possível encontrar um caminho até o ponto de chegada.');
}

// Função para destacar o caminho encontrado
function highlightPath(parentMap, currentCell) {
    path = [];
    while (currentCell) {
        path.push(currentCell);
        currentCell = parentMap.get(currentCell);
    }
    path.reverse(); // Reverte o caminho para começar no ponto de partida
    path.forEach(cell => {
        // Verifica se a célula não é o ponto de partida nem o ponto de chegada
        if (cell !== startPoint && cell !== endPoint) {
            cell.style.backgroundColor = 'yellow';
        }
    });
}

// Função para redefinir o mapa
function resetMap() {
    startPoint = null;
    endPoint = null;
    path = [];

    // Restaura as cores de todas as células da rua para branco
    const allCells = document.querySelectorAll('.street');
    allCells.forEach(cell => {
        cell.style.backgroundColor = 'white';
    });
}

// Inicialização: cria a tabela da cidade e adiciona um botão de redefinição
criarTabela();
const resetButton = document.getElementById('reset-button');
resetButton.addEventListener('click', resetMap);
