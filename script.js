// Переменные профиля и игры
let username = localStorage.getItem('globus_user') || "";
let userAvatar = localStorage.getItem('globus_avatar') || "👑";
let selectedAvatarIcon = "👑"; // Буфер для выбора в модальном окне

let coins = Number(localStorage.getItem('globus_coins')) || 0;
let clickPower = Number(localStorage.getItem('globus_clickPower')) || 1;
let rebirths = Number(localStorage.getItem('globus_rebirths')) || 0;
let upgradeCost = Number(localStorage.getItem('globus_upgradeCost')) || 10;
let rebirthCost = Number(localStorage.getItem('globus_rebirthCost')) || 1000;
let autoCPS = Number(localStorage.getItem('globus_autoCPS')) || 0;
let autoCost = Number(localStorage.getItem('globus_autoCost')) || 50;
let canSpin = true;

// DOM Элементы
const modal = document.getElementById('register-modal');
const usernameInput = document.getElementById('username-input');
const saveProfileBtn = document.getElementById('save-profile-btn');
const userAvatarDisplay = document.getElementById('user-avatar');
const userNameDisplay = document.getElementById('user-name');
const rankBadge = document.querySelector('.rank-badge');

const coinsDisplay = document.getElementById('coins');
const clickPowerDisplay = document.getElementById('click-power');
const rebirthsDisplay = document.getElementById('rebirths');
const upgradeCostDisplay = document.getElementById('upgrade-cost');
const rebirthCostDisplay = document.getElementById('rebirth-cost');
const clickBtn = document.getElementById('click-btn');
const buyUpgradeBtn = document.getElementById('buy-upgrade-btn');
const buyRebirthBtn = document.getElementById('buy-rebirth-btn');
const spinBtn = document.getElementById('spin-btn');
const wheelResult = document.getElementById('wheel-result');

// Динамически вставляем авто-кликер в HTML структуру магазина
const shopSection = document.querySelector('.shop');
const autoShopItem = document.createElement('div');
autoShopItem.className = 'shop-item';
autoShopItem.innerHTML = `
    <span>Авто-модер (+1/сек) (Цена: <span id="auto-cost">${autoCost}</span> 🪙)</span>
    <button id="buy-auto-btn">Купить</button>
`;
shopSection.insertBefore(autoShopItem, shopSection.lastElementChild);
const buyAutoBtn = document.getElementById('buy-auto-btn');
const autoCostDisplay = document.getElementById('auto-cost');

// ПРОВЕРКА РЕГИСТРАЦИИ ПРИ СТАРТЕ
if (!username) {
    modal.style.display = "flex";
} else {
    loadProfileUI();
}

// Функция выбора аватарки в меню
window.selectAvatar = function(avatar) {
    selectedAvatarIcon = avatar;
    const opts = document.querySelectorAll('.avatar-opt');
    opts.forEach(opt => opt.classList.remove('active'));
    event.target.classList.add('active');
}

// Кнопка сохранения профиля
saveProfileBtn.addEventListener('click', () => {
    let enteredName = usernameInput.value.trim();
    if (enteredName === "") {
        enteredName = "Модератор-" + Math.floor(Math.random() * 900 + 100);
    }
    username = enteredName;
    userAvatar = selectedAvatarIcon;
    
    localStorage.setItem('globus_user', username);
    localStorage.setItem('globus_avatar', userAvatar);
    
    modal.style.display = "none";
    loadProfileUI();
});

function loadProfileUI() {
    userNameDisplay.innerText = username;
    userAvatarDisplay.innerText = userAvatar;
    updateRank();
}

// Функция изменения званий модератора
function updateRank() {
    if (rebirths >= 10) {
        rankBadge.innerText = "ГЛАВНЫЙ АДМИН 👑";
        rankBadge.style.backgroundColor = "#ff5722";
    } else if (rebirths >= 5) {
        rankBadge.innerText = "Ст. Модератор ⚡";
        rankBadge.style.backgroundColor = "#e91e63";
    } else if (rebirths >= 2) {
        rankBadge.innerText = "Модератор 🎮";
        rankBadge.style.backgroundColor = "#9c27b0";
    } else {
        rankBadge.innerText = "Мл. Модератор 🌱";
        rankBadge.style.backgroundColor = "#00bcd4";
    }
}

// ЛОГИКА КЛИКЕРА И ИГРЫ
clickBtn.addEventListener('click', () => {
    let totalClick = clickPower + (rebirths * 2);
    coins += totalClick;
    updateUI();
});

buyUpgradeBtn.addEventListener('click', () => {
    if (coins >= upgradeCost) {
        coins -= upgradeCost;
        clickPower += 1;
        upgradeCost = Math.round(upgradeCost * 1.5);
        updateUI();
        saveGame();
    }
});

buyAutoBtn.addEventListener('click', () => {
    if (coins >= autoCost) {
        coins -= autoCost;
        autoCPS += 1;
        autoCost = Math.round(autoCost * 1.6);
        updateUI();
        saveGame();
    }
});

buyRebirthBtn.addEventListener('click', () => {
    if (coins >= rebirthCost) {
        rebirths += 1;
        coins = 0;
        clickPower = 1;
        autoCPS = 0;
        upgradeCost = 10;
        autoCost = 50;
        rebirthCost = Math.round(rebirthCost * 2.5);
        updateRank();
        updateUI();
        saveGame();
        alert("🌟 Перерождение! Твой уровень модератора растёт!");
    }
});

spinBtn.addEventListener('click', () => {
    if (!canSpin) return;
    canSpin = false;
    spinBtn.disabled = true;
    wheelResult.innerText = "Колесо крутится... 🎡";

    setTimeout(() => {
        const rewards =;
        const randomReward = rewards[Math.floor(Math.random() * rewards.length)];
        coins += randomReward;
        wheelResult.innerText = randomReward > 0 ? `Вы выиграли ${randomReward} 🪙!` : "Упс, пусто! 😢";
        updateUI();
        saveGame();

        let cooldown = 30;
        const interval = setInterval(() => {
            cooldown--;
            spinBtn.innerText = `Ждать ${cooldown}с`;
            if (cooldown <= 0) {
                clearInterval(interval);
                canSpin = true;
                spinBtn.disabled = false;
                spinBtn.innerText = "Крутить (Раз в 30 сек)";
            }
        }, 1000);
    }, 2000);
});

window.doQuest = function(id, reward) {
    window.open('https://t.me', '_blank'); // Ссылка заглушка
    coins += reward;
    document.getElementById(`quest-${id}`).style.display = 'none';
    updateUI();
    saveGame();
}

setInterval(() => {
    if (autoCPS > 0) {
        coins += autoCPS;
        updateUI();
    }
}, 1000);

setInterval(saveGame, 5000);

function saveGame() {
    localStorage.setItem('globus_coins', coins);
    localStorage.setItem('globus_clickPower', clickPower);
    localStorage.setItem('globus_rebirths', rebirths);
    localStorage.setItem('globus_upgradeCost', upgradeCost);
    localStorage.setItem('globus_rebirthCost', rebirthCost);
    localStorage.setItem('globus_autoCPS', autoCPS);
    localStorage.setItem('globus_autoCost', autoCost);
}

function updateUI() {
    coinsDisplay.innerText = coins;
    clickPowerDisplay.innerText = clickPower + (rebirths * 2);
    rebirthsDisplay.innerText = rebirths;
    upgradeCostDisplay.innerText = upgradeCost;
    rebirthCostDisplay.innerText = rebirthCost;
    autoCostDisplay.innerText = autoCost;
    
    buyUpgradeBtn.disabled = coins < upgradeCost;
    buyAutoBtn.disabled = coins < autoCost;
    buyRebirthBtn.disabled = coins < rebirthCost;
}

updateUI();
