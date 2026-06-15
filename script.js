// 📦 BANCO DE PERGUNTAS: Dados estritamente amarrados ao conteúdo textual do site
const quizData = [
    { question: "Qual é a porcentagem que o agronegócio representa no PIB nacional?", options: ["10%", "25%", "50%", "66%"], correct: 1 },
    { question: "Nas últimas duas décadas, o aumento da produtividade de grãos foi de quanto?", options: ["60%", "84%", "135%", "160%"], correct: 2 },
    { question: "O Brasil ocupa o 1º lugar global na produção e exportação de qual cultura?", options: ["Milho", "Café", "Trigo", "Soja"], correct: 3 },
    { question: "As exportações do agronegócio ultrapassaram qual marca histórica em receita?", options: ["US$ 50 bilhões", "US$ 100 bilhões", "US$ 160 bilhões", "US$ 200 bilhões"], correct: 2 },
    { question: "Quantos por cento dos produtores rurais utilizam ao menos uma tecnologia digital?", options: ["25%", "60%", "66%", "84%"], correct: 3 },
    { question: "Qual é a margem de erro do GPS agrícola de dupla frequência em tratores autônomos?", options: ["3 centímetros", "15 centímetros", "1 metro", "Zero erro"], correct: 0 },
    { question: "Qual é a porcentagem do território brasileiro mantido com vegetação nativa preservada?", options: ["25%", "35%", "66%", "84%"], correct: 2 },
    { question: "Graças ao clima tropical, quantas safras por ano podem ser feitas na mesma área?", options: ["Apenas 1", "Até 2 safras", "Até 3 safras", "Até 5 safras"], correct: 2 }
];

// 🔄 ESTADO DO JOGO: Variáveis de controle de fluxo
let currentQuestionIndex = 0;
let score = 0;
let answered = false;
let playerObj = { name: "Jogador", correctCount: 0, timeTotal: 0 };

// ⏱️ VARIÁVEIS DO CRONÔMETRO
let startTime;
let timerInterval;

// 👥 RANKING DE SIMULAÇÃO: Histórico inicial para simular competidores reais
let leaderboards = [
    { name: "AgroTech_99", correctCount: 8, timeTotal: 14.2 },
    { name: "Doutor_Soja", correctCount: 7, timeTotal: 19.5 },
    { name: "Fazenda_Futuro", correctCount: 6, timeTotal: 16.8 }
];

// 🛫 INICIAR O QUIZ: Valida o nome do jogador e inicia a contagem do tempo
function startQuiz() {
    const nameInput = document.getElementById('username').value.trim();
    if (nameInput === "") {
        alert("Por favor, digite um nome ou apelido!");
        return;
    }
    playerObj.name = nameInput;

    // Transiciona as telas (Esconde a entrada de nome, exibe as perguntas)
    document.getElementById('setup-box').style.display = "none";
    document.getElementById('quiz-box').style.display = "block";

    // Dispara a contagem do tempo em milissegundos
    startTime = Date.now();
    timerInterval = setInterval(() => {
        let elapsed = (Date.now() - startTime) / 1000;
        document.getElementById('timer-text').innerText = `Tempo: ${elapsed.toFixed(1)}s`;
    }, 100);

    loadQuestion();
}

// 📖 CARREGAR PERGUNTA: Constrói dinamicamente os elementos HTML da questão atual
function loadQuestion() {
    answered = false;
    document.getElementById('next-btn').style.display = "none";
    const optionsBox = document.getElementById('options-box');
    optionsBox.innerHTML = ""; // Limpa botões da rodada anterior
    
    let currentQuestion = quizData[currentQuestionIndex];
    document.getElementById('question-text').innerText = `${currentQuestionIndex + 1}. ${currentQuestion.question}`;
    document.getElementById('score-text').innerText = `Placar: ${score}/${quizData.length}`;

    // Gera os botões das alternativas
    currentQuestion.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.innerText = option;
        button.classList.add('option-btn');
        button.addEventListener('click', () => selectOption(index, button));
        optionsBox.appendChild(button);
    });
}

// 🎯 SELECIONAR ALTERNATIVA: Valida se a resposta clicada está certa ou errada
function selectOption(selectedIndex, clickedButton) {
    if (answered) return; // Trava o clique caso o usuário já tenha respondido essa pergunta
    answered = true;

    let currentQuestion = quizData[currentQuestionIndex];
    const buttons = document.getElementById('options-box').querySelectorAll('.option-btn');

    // Valida o índice correto
    if (selectedIndex === currentQuestion.correct) {
        clickedButton.classList.add('correct'); // Pinta de Verde
        score++;
    } else {
        clickedButton.classList.add('wrong'); // Pinta de Vermelho
        buttons[currentQuestion.correct].classList.add('correct'); // Revela a correta em verde
    }

    document.getElementById('score-text').innerText = `Placar: ${score}/${quizData.length}`;
    
    // Atualiza o texto do botão de avanço
    if (currentQuestionIndex < quizData.length - 1) {
        document.getElementById('next-btn').innerText = "Próxima";
    } else {
        document.getElementById('next-btn').innerText = "Finalizar e Ver Ranking";
    }
    document.getElementById('next-btn').style.display = "block";
}

// ⏭️ EVENT LISTENER DO BOTÃO PRÓXIMA: Gerencia o avanço das rodadas ou finalização
document.getElementById('next-btn').addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        loadQuestion();
    } else {
        // Encerramento do Quizizz
        clearInterval(timerInterval); // Interrompe o relógio
        let finalTime = (Date.now() - startTime) / 1000;
        
        playerObj.correctCount = score;
        playerObj.timeTotal = parseFloat(finalTime.toFixed(1));

        // Renderiza tela de conclusão interna do bloco
        document.getElementById('question-text').innerText = "Excelente! Quiz Concluído!";
        document.getElementById('options-box').innerHTML = `
            <p style='font-size: 1.2rem; text-align: center; color: var(--primary-neon); font-weight: bold; margin-bottom:10px;'>
                Você acertou ${score} de ${quizData.length} perguntas!
            </p>
            <p style='text-align: center; color: var(--text-muted);'>Tempo total de resposta: ${playerObj.timeTotal} segundos</p>
        `;
        document.getElementById('next-btn').style.display = "none";

        // Adiciona e ordena a tabela de classificação
        atualizarRanking(playerObj);
    }
});

// 🏆 ORGANIZAR RANKING: Adiciona o jogador real na array, ordena os dados e reconstrói o HTML da tabela
function atualizarRanking(novoJogador) {
    leaderboards.push(novoJogador);

    // CRITÉRIO DE ORGANIZAÇÃO: Maior pontuação. Em caso de empate, menor tempo total.
    leaderboards.sort((a, b) => {
        if (b.correctCount !== a.correctCount) {
            return b.correctCount - a.correctCount;
        }
        return a.timeTotal - b.timeTotal;
    });

    const rankingBody = document.getElementById('ranking-body');
    rankingBody.innerHTML = ""; // Limpa a tabela antiga

    // Reconstrói a tabela atualizada
    leaderboards.forEach((player, index) => {
        const row = document.createElement('tr');
        
        // Destaca visualmente a linha se for o registro do próprio usuário logado
        if(player.name === playerObj.name) {
            row.style.background = "rgba(0, 225, 255, 0.15)";
        }

        row.innerHTML = `
            <td>${index + 1}º</td>
            <td>${player.name} ${player.name === playerObj.name ? "⭐ (Você)" : ""}</td>
            <td>${player.correctCount} / ${quizData.length}</td>
            <td>${player.timeTotal}s</td>
        `;
        rankingBody.appendChild(row);
    });
}