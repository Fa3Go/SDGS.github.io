document.addEventListener('DOMContentLoaded', function() {
    // 初始化按鈕事件監聽
    document.getElementById('start-btn').addEventListener('click', showGameModes);
    document.getElementById('quiz-btn').addEventListener('click', startQuiz);
    document.getElementById('match-btn').addEventListener('click', startMatch);
    document.getElementById('continue-btn').addEventListener('click', closeModal);
    document.getElementById('menu-btn').addEventListener('click', returnToMenu);

    // 添加標題點擊事件
    document.getElementById('game-title').addEventListener('click', returnToHome);

    // 初始化遊戲
    updateScore(0);
});

// 遊戲狀態
const gameState = {
    score: 0,
    level: '新手探索者',
    currentMode: null,
    questions: [
        {
            question: '聯合國永續發展目標(SDGs)共有幾個目標？',
            options: ['15個', '16個', '17個', '18個'],
            correct: 2
        },
        {
            question: '哪一項是SDGs目標1的主要內容？',
            options: ['消除貧窮', '零飢餓', '優質教育', '性別平等'],
            correct: 0
        },
        {
            question: 'SDGs目標預計在西元哪一年達成？',
            options: ['2025年', '2030年', '2035年', '2040年'],
            correct: 1
        },
        {
            question: '下列哪個顏色不是SDGs標誌的主要色系？',
            options: ['紅色', '綠色', '藍色', '黑色'],
            correct: 3
        },
        {
            question: 'SDGs目標3「良好健康與福祉」的標誌是什麼顏色？',
            options: ['紅色', '綠色', '黃色', '藍色'],
            correct: 0
        },
        {
            question: '「世界自然保育方略」首次提出「永續」一詞是在哪一年？',
            options: ['1970年', '1975年', '1980年', '1985年'],
            correct: 2
        },
        {
            question: '下列哪一項不是SDGs目標12「負責任消費和生產」的重點？',
            options: ['減少食物浪費', '資源永續管理', '軍事發展', '減少化學污染'],
            correct: 2
        },
        {
            question: 'SDGs目標14「保育海洋生態」的英文名稱是？',
            options: ['Life on Land', 'Life Below Water', 'Clean Water', 'Ocean Protection'],
            correct: 1
        },
        {
            question: '誰在1962年出版「寂靜的春天」一書，開啟了現代環保意識？',
            options: ['瑞秋‧卡森', '珍古德', '萊昂納多‧狄卡皮歐', '艾爾‧高爾'],
            correct: 0
        },
        {
            question: '「布朗特蘭報告」提出的永續發展定義強調什麼？',
            options: [
                '經濟發展優先',
                '環境保護至上',
                '滿足當代需求且不危及後代需求',
                '科技創新發展'
            ],
            correct: 2
        },
        {
            question: 'SDGs目標5提倡什麼？',
            options: ['消除貧窮', '性別平等', '清潔能源', '和平正義'],
            correct: 1
        },
        {
            question: '下列哪個不是SDGs目標6「淨水與衛生」的重點？',
            options: ['改善水質', '提高用水效率', '發展核能', '保護水生態'],
            correct: 2
        },
        {
            question: 'SDGs目標13「氣候行動」主要關注什麼問題？',
            options: [
                '氣候變遷與其影響',
                '太空探索',
                '文化保存',
                '運動發展'
            ],
            correct: 0
        },
        {
            question: '聯合國在哪一年通過「千禧年宣言」？',
            options: ['1995年', '2000年', '2005年', '2010年'],
            correct: 1
        },
        {
            question: 'SDGs目標15「陸地生態」主要關注什麼？',
            options: [
                '海洋保育',
                '都市發展',
                '陸地生態系統保護',
                '工業發展'
            ],
            correct: 2
        },
        {
            question: '下列哪個不是實現SDGs的重要原則？',
            options: [
                '不遺落任何人',
                '整體性思維',
                '利益最大化',
                '全球夥伴關係'
            ],
            correct: 2
        },
        {
            question: 'SDGs目標7提倡什麼類型的能源？',
            options: [
                '核能',
                '化石燃料',
                '可負擔的永續能源',
                '木材燃料'
            ],
            correct: 2
        },
        {
            question: '「The Future We Want」文件是在哪次會議中產出的？',
            options: [
                '2010年氣候變遷會議',
                '2012年里約永續發展會議',
                '2015年巴黎氣候會議',
                '2018年生物多樣性會議'
            ],
            correct: 1
        },
        {
            question: 'SDGs目標16強調什麼？',
            options: [
                '經濟發展',
                '科技創新',
                '和平、正義與強大機構',
                '文化保存'
            ],
            correct: 2
        },
        {
            question: '實現SDGs需要誰的參與？',
            options: [
                '只需要政府',
                '只需要企業',
                '只需要非營利組織',
                '需要所有利害關係人'
            ],
            correct: 3
        }
    ],
    currentQuestion: 0
};

// 在原有的 gameState 中添加配對遊戲相關狀態
const matchGameState = {
    cards: [],
    flippedCards: [],
    moves: 0,
    timer: 0,
    timerInterval: null,
    isPlaying: false
};

// SDGs配對卡片數據
const sdgsCards = [
    { id: 1, content: "消除貧窮", description: "在全世界消除一切形式的貧窮" },
    { id: 2, content: "零飢餓", description: "消除飢餓，實現糧食安全" },
    { id: 3, content: "良好健康與福祉", description: "確保健康的生活方式，促進福祉" },
    { id: 4, content: "優質教育", description: "確保包容和公平的優質教育" },
    { id: 5, content: "性別平等", description: "現性別平等，增強女性權能" },
    { id: 6, content: "淨水與衛生", description: "確保水資源永續管理" },
    { id: 7, content: "可負擔能源", description: "確保人人獲得可負擔能源" },
    { id: 8, content: "就業與經濟成長", description: "促進包容且永續的經濟成長" }
];

// 顯示遊戲模式選擇
function showGameModes() {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-modes').classList.remove('hidden');
}

// 開始問答遊戲
function startQuiz() {
    gameState.currentMode = 'quiz';
    gameState.currentQuestion = 0;
    document.getElementById('game-modes').classList.add('hidden');
    document.getElementById('quiz-section').classList.remove('hidden');
    showQuestion();
}

// 開始配對遊戲
function startMatch() {
    // 隱藏其他區段，顯示配對遊戲
    document.querySelectorAll('.section').forEach(section => section.classList.add('hidden'));
    document.getElementById('match-section').classList.remove('hidden');
    
    // 初始化配對遊戲
    initializeMatchGame();
}

// 返回首頁
function returnToHome() {
    console.log('返回首頁'); // 用於除錯
    
    // 隱藏所有 section
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.add('hidden');
    });
    
    // 顯示開始畫面
    const startScreen = document.getElementById('start-screen');
    startScreen.classList.remove('hidden');
    
    // 重置分數
    if (typeof updateScore === 'function') {
        updateScore(0);
    }
    
    // 停止配對遊戲計時器（如果存在）
    if (window.matchGameState && matchGameState.timerInterval) {
        clearInterval(matchGameState.timerInterval);
    }
}

// 隱藏所有區段
function hideAllSections() {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.add('hidden'));
}

// 初始化遊戲
function initializeGame() {
    document.getElementById('start-screen').classList.remove('hidden');
    updateScore(0);
}

// 顯示問題
function showQuestion() {
    if (gameState.currentQuestion >= gameState.questions.length) {
        showResult(`遊戲結束！你的得分是：${gameState.score}`);
        return;
    }

    const question = gameState.questions[gameState.currentQuestion];
    document.getElementById('question').textContent = question.question;
    
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = option;
        button.onclick = () => checkAnswer(index);
        optionsDiv.appendChild(button);
    });

    updateProgress();
}

// 初始化配對遊戲
function initializeMatchGame() {
    matchGameState.moves = 0;
    matchGameState.timer = 0;
    matchGameState.flippedCards = [];
    matchGameState.isPlaying = true;
    
    // 更新顯示
    document.getElementById('match-moves').textContent = '0';
    document.getElementById('match-timer').textContent = '0';
    
    // 清除先前的計時器
    if (matchGameState.timerInterval) {
        clearInterval(matchGameState.timerInterval);
    }
    
    // 開始計時
    matchGameState.timerInterval = setInterval(() => {
        if (matchGameState.isPlaying) {
            matchGameState.timer++;
            document.getElementById('match-timer').textContent = matchGameState.timer;
        }
    }, 1000);

    // 創建卡片對
    const cards = [...sdgsCards, ...sdgsCards].map((card, index) => ({
        ...card,
        uniqueId: index,
        isMatched: false
    }));
    
    // 洗牌
    matchGameState.cards = shuffleArray(cards);
    
    // 渲染卡片
    renderMatchGrid();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function renderMatchGrid() {
    const grid = document.getElementById('match-grid');
    grid.innerHTML = '';
    
    matchGameState.cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = `card${card.isMatched ? ' matched' : ''}`;
        cardElement.innerHTML = `
            <div class="card-front">
                <div class="card-question">?</div>
            </div>
            <div class="card-back">
                <div class="card-content">
                    <h3>${card.content}</h3>
                    <p>${card.description}</p>
                </div>
            </div>
        `;
        
        cardElement.addEventListener('click', () => handleCardClick(card, cardElement));
        grid.appendChild(cardElement);
    });
}

function handleCardClick(card, cardElement) {
    // 如果卡片已配對或已翻開，則忽略點擊
    if (card.isMatched || cardElement.classList.contains('flipped') || 
        matchGameState.flippedCards.length >= 2) {
        return;
    }
    
    // 翻開卡片
    cardElement.classList.add('flipped');
    matchGameState.flippedCards.push({ card, element: cardElement });
    
    // 如果翻開了兩張卡片
    if (matchGameState.flippedCards.length === 2) {
        matchGameState.moves++;
        document.getElementById('match-moves').textContent = matchGameState.moves;
        
        const [card1, card2] = matchGameState.flippedCards;
        
        // 檢查是否配對成功
        if (card1.card.id === card2.card.id) {
            card1.card.isMatched = true;
            card2.card.isMatched = true;
            card1.element.classList.add('matched');
            card2.element.classList.add('matched');
            matchGameState.flippedCards = [];
            
            // 檢查是否完成遊戲
            checkGameComplete();
        } else {
            // 如果配對失敗，延遲後翻回
            setTimeout(() => {
                card1.element.classList.remove('flipped');
                card2.element.classList.remove('flipped');
                matchGameState.flippedCards = [];
            }, 1000);
        }
    }
}

function checkGameComplete() {
    if (matchGameState.cards.every(card => card.isMatched)) {
        matchGameState.isPlaying = false;
        clearInterval(matchGameState.timerInterval);
        
        showResult(`恭喜完成！\n使用步數：${matchGameState.moves}\n用時：${matchGameState.timer}秒`);
    }
}

// 更新分數
function updateScore(points) {
    gameState.score += points;
    document.getElementById('score').textContent = gameState.score;
    updateLevel();
}

function updateLevel() {
    const levels = {
        0: '新手探索者',
        30: '永續實踐者',
        60: '永續大使',
        90: '永續專家'
    };

    for (let threshold in levels) {
        if (gameState.score >= threshold) {
            gameState.level = levels[threshold];
        }
    }
    document.getElementById('level').textContent = gameState.level;
}

function checkAnswer(selectedIndex) {
    const question = gameState.questions[gameState.currentQuestion];
    const isCorrect = selectedIndex === question.correct;
    
    // 如果答對就加分
    if (isCorrect) {
        updateScore(10);
    }
    
    // 直接進入下一題
    gameState.currentQuestion++;
    
    // 如果還有題目，顯示下一題
    if (gameState.currentQuestion < gameState.questions.length) {
        showQuestion();
    } else {
        // 如果是最後一題，顯示最終結果
        showResult(`遊戲結束！\n你的總得分是：${gameState.score}分`);
    }
}

function startSimulation() {
    gameState.currentMode = 'simulation';
    // 實現生活模擬遊戲邏輯
}

function showResult(message, type = 'success') {
    const modal = document.getElementById('result-modal');
    const resultText = document.getElementById('result-text');
    resultText.textContent = message;
    modal.classList.remove('hidden');
}

function closeModal() {
    document.getElementById('result-modal').classList.add('hidden');
}

document.getElementById('sdg-select').addEventListener('change', function() {
    const descriptions = {
        "1": "目標1: 在全世界消除一切形式的貧困。",
        "2": "目標2: 消除飢餓，實現糧食安全，改善營養狀況和促進永續農業。",
        // 其他目標描述
        "17": "目標17: 加強執行手段，重振永續發展的全球夥伴關係。"
    };

    const selectedValue = this.value;
    const descriptionDiv = document.getElementById('description');
    descriptionDiv.textContent = descriptions[selectedValue] || "請選擇一個目標來查看描述。";
});

function updateProgress() {
    const progress = ((gameState.currentQuestion + 1) / gameState.questions.length) * 100;
    document.getElementById('progress').style.width = `${progress}%`;
}

function returnToMenu() {
    closeModal();
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById('game-modes').classList.remove('hidden');
}

// 添加重新開始按鈕的事件監聽器
document.addEventListener('DOMContentLoaded', function() {
    // ... 原有的事件監聽器 ...
    
    document.getElementById('restart-match').addEventListener('click', initializeMatchGame);
});

