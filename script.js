// Объект с переводами для разных языков, теперь добавляем плейсхолдеры
const translations = {
    en: {
        "calculatorTitle": "Position Size Calculator",
        "warningText": "Select position type",
        "long": "Long",
        "short": "Short",
        "depositLabel": "Deposit <span class='currency-symbol'>$</span>:",
        "riskLabel": "Risk (% of deposit):",
        "entryPriceLabel": "Entry Price <span class='currency-symbol'>$</span>:",
        "stopLossLabel": "Stop Loss Price <span class='currency-symbol'>$</span>:",
        "calculateButton": "Calculate",
        "resetButton": "Reset",
        "result": "Waiting for data...",
        "currencySubmenu": "Currency ▾",
        "languageSubmenu": "Language ▾",
        "themeSubmenu": "Theme ▾",
        "lightTheme": "Light",
        "darkTheme": "Dark",
        "usd": "USD",
        "rub": "RUB",
        "eur": "EUR",
        "jpy": "JPY",
        "depositPlaceholder": "What's your deposit ?",
        "riskPlaceholder": "Enter risk (no % sign)",
        "entryPricePlaceholder": "Enter entry price",
        "stopLossPlaceholder": "Enter stop loss price"
    },
    ru: {
        "calculatorTitle": "Калькулятор объёма входа",
        "warningText": "Выберите тип сделки",
        "long": "Лонг",
        "short": "Шорт",
        "depositLabel": "Депозит <span class='currency-symbol'>₽</span>:",
        "riskLabel": "Риск (% от депозита):",
        "entryPriceLabel": "Цена входа <span class='currency-symbol'>₽</span>:",
        "stopLossLabel": "Цена стоп-лосса <span class='currency-symbol'>₽</span>:",
        "calculateButton": "Рассчитать",
        "resetButton": "Сбросить",
        "result": "Ожидание данных...",
        "currencySubmenu": "Валюта ▾",
        "languageSubmenu": "Язык ▾",
        "themeSubmenu": "Тема ▾",
        "lightTheme": "Светлая",
        "darkTheme": "Тёмная",
        "usd": "USD",
        "rub": "RUB",
        "eur": "EUR",
        "jpy": "JPY",
        "depositPlaceholder": "Какой у вас депозит ?",
        "riskPlaceholder": "Введите риск (без знака %)",
        "entryPricePlaceholder": "Введите цену входа",
        "stopLossPlaceholder": "Введите цену стоп-лосса"
    }
};

// Переменные для текущего языка, валюты и типа рынка
let positionType = '';
let currencySymbol = localStorage.getItem('currency') || '$'; // По умолчанию используем доллары
let marketType = ''; // Не будет менять калькулятор, но будет сохранено
let theme = localStorage.getItem('theme') || 'light';
let language = localStorage.getItem('language') || 'ru'; // Язык по умолчанию - русский

// Обработчик выбора темы
function applyTheme(theme) {
    document.body.classList.toggle('dark-theme', theme === 'dark');
    localStorage.setItem('theme', theme);

    // Изменяем тему на TradingView в iframe
    const iframe = document.querySelector('#tradingView iframe');
    if (iframe) {
        const currentSrc = iframe.src;
        const newSrc = currentSrc.replace(/theme=\w+/g, `theme=${theme}`);
        iframe.src = newSrc;
    }
    
    // Проверяем, существует ли элемент с id 'themeSwitch' перед изменением его состояния
    const themeSwitch = document.getElementById('themeSwitch');
    if (themeSwitch) {
        themeSwitch.checked = (theme === 'dark');
    }
}

// Функция для переключения языка
function changeLanguage(lang) {
    language = lang;
    localStorage.setItem('language', lang);

    // Обновляем все тексты на странице, включая валютные символы
    document.querySelectorAll('[data-lang]').forEach(el => {
        const key = el.getAttribute('data-lang');
        if (translations[lang] && translations[lang][key]) {
            el.innerHTML = translations[lang][key];
        }
    });

    // Обновляем плейсхолдеры для всех инпутов
    document.getElementById('deposit').setAttribute('placeholder', translations[lang]["depositPlaceholder"]);
    document.getElementById('risk').setAttribute('placeholder', translations[lang]["riskPlaceholder"]);
    document.getElementById('entryPrice').setAttribute('placeholder', translations[lang]["entryPricePlaceholder"]);
    document.getElementById('stopLoss').setAttribute('placeholder', translations[lang]["stopLossPlaceholder"]);

    // Обновляем символ валюты в соответствующих элементах
    updateCurrencySymbol(currencySymbol); // Применяем текущий символ валюты
}

// Загружаем сохранённый язык при загрузке страницы
document.addEventListener("DOMContentLoaded", function () {
    const savedLanguage = localStorage.getItem("language") || 'ru'; // По умолчанию русский
    changeLanguage(savedLanguage);

    // Загружаем сохранённую тему
    let savedTheme = localStorage.getItem('theme');
    if (!savedTheme) {
        let prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDark ? 'dark' : 'light');
    } else {
        applyTheme(savedTheme);
    }

    // Загружаем валюту
    const savedCurrency = localStorage.getItem("currency");
    if (savedCurrency !== null) {
        currencySymbol = savedCurrency;
        changeCurrency(savedCurrency);
    }

    // Загружаем тип рынка
    const savedMarket = localStorage.getItem("market");
    if (savedMarket !== null) {
        marketType = savedMarket;
    }

    // Загружаем депозиты
    const savedDeposit = localStorage.getItem("deposit");
    if (savedDeposit !== null) {
        document.getElementById("deposit").value = savedDeposit;
    }
});

// Слушатель для изменения темы при системном переключении
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
    if (!localStorage.getItem('theme')) {
        applyTheme(event.matches ? 'dark' : 'light');
    }
});

// // Функция для переключения темы
// function toggleTheme() {
//     let newTheme = document.getElementById('themeSwitch').checked ? 'dark' : 'light';
//     applyTheme(newTheme);
// }

// Функция для выбора валюты
function changeCurrency(symbol) {
    currencySymbol = symbol;
    localStorage.setItem('currency', currencySymbol);
    updateCurrencySymbol(currencySymbol);
}

// Обновление валютного символа во всех местах
function updateCurrencySymbol(symbol) {
    document.querySelectorAll('.currency-symbol').forEach(el => {
        el.innerHTML = symbol;
    });
}

// // Функция для выбора типа рынка (не влияет на калькулятор)
// function changeMarket(type) {
//     marketType = type;
//     localStorage.setItem('market', marketType);
// }

// Слушатель для открытия/закрытия меню
function toggleDropdown() {
    var menu = document.getElementById("myDropdown");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
}

// Закрытие меню при клике вне его
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.style.display === "block") {
                openDropdown.style.display = "none";
            }
        }
    }
}

// Установка типа сделки (лонг/шорт)
function setPosition(type) {
    positionType = type;
    document.getElementById('longButton').classList.toggle('active', type === 'long');
    document.getElementById('shortButton').classList.toggle('active', type === 'short');
    document.getElementById("warningText").classList.add("hidden");
}

// Функция для расчета объема
function calculateVolume() {
    const deposit = parseFloat(document.getElementById("deposit").value);
    const riskPercent = parseFloat(document.getElementById("risk").value) / 100;
    const entryPrice = parseFloat(document.getElementById("entryPrice").value);
    const stopLoss = parseFloat(document.getElementById("stopLoss").value);

    if (!positionType) {
        document.getElementById("warningText").classList.remove("hidden");
        document.getElementById("result").innerText = translations[language]["warningText"];
        return;
    }

    if ([deposit, riskPercent, entryPrice, stopLoss].some(isNaN) || deposit <= 0 || riskPercent <= 0 || entryPrice <= 0 || stopLoss <= 0) {
        document.getElementById("result").innerText = "Введите корректные данные!";
        return;
    }

    let priceDifference;
    if (positionType === "long") {
        if (stopLoss >= entryPrice) {
            document.getElementById("result").innerText = "Для лонга стоп-лосс должен быть ниже цены входа!";
            return;
        }
        priceDifference = entryPrice - stopLoss;
    } else {
        if (stopLoss <= entryPrice) {
            document.getElementById("result").innerText = "Для шорта стоп-лосс должен быть выше цены входа!";
            return;
        }
        priceDifference = stopLoss - entryPrice;
    }

    const riskAmount = deposit * riskPercent;
    const positionSize = riskAmount / priceDifference;
    const volumeInDollars = positionSize * entryPrice;

    document.getElementById("result").innerText = `Объём входа: ${currencySymbol} ${volumeInDollars.toFixed(2)}`;
}

// Сброс формы
function resetForm() {
    document.getElementById("deposit").value = "";
    document.getElementById("risk").value = "";
    document.getElementById("entryPrice").value = "";
    document.getElementById("stopLoss").value = "";
    document.getElementById("result").innerText = translations[language]["result"];
    document.getElementById("warningText").classList.add("hidden");
    document.getElementById('longButton').classList.remove('active');
    document.getElementById('shortButton').classList.remove('active');
    positionType = '';

    localStorage.removeItem("deposit");
}

// Сохраняем депозит при изменении значения в поле
document.getElementById("deposit").addEventListener("input", function () {
    localStorage.setItem("deposit", this.value);
});

// Слушатели для элементов меню (валюта)
document.getElementById("currencyUsd").addEventListener("click", () => changeCurrency('$'));
document.getElementById("currencyRub").addEventListener("click", () => changeCurrency('₽'));
document.getElementById("currencyEur").addEventListener("click", () => changeCurrency('€'));
document.getElementById("currencyJpy").addEventListener("click", () => changeCurrency('¥'));

// // Слушатели для элементов меню (рынок)
// document.getElementById("marketCrypto").addEventListener("click", () => changeMarket('crypto'));
// document.getElementById("marketStocks").addEventListener("click", () => changeMarket('stocks'));
// document.getElementById("marketForex").addEventListener("click", () => changeMarket('forex'));

// // Инициализация кнопки переключения темы
// document.getElementById("themeSwitch").addEventListener("change", toggleTheme);

// Переключение страниц
// Получаем кнопки и блоки
// Получаем кнопки для переключения
const buttons = document.querySelectorAll('.button-container .btn');

// Функция для переключения между калькулятором и TradingView
function toggleView(view) {
    const calculator = document.querySelector('.container');  // контейнер калькулятора
    const tradingView = document.getElementById('tradingView');  // контейнер TradingView

    if (view === 'calculator') {
        calculator.style.display = 'block';
        tradingView.style.display = 'none';
    } else if (view === 'tradingView') {
        calculator.style.display = 'none';
        tradingView.style.display = 'block';
    }
}

// Добавляем обработчики для кнопок
buttons.forEach((button, index) => {
    button.addEventListener('click', function () {
        // Если кнопка 1, показываем калькулятор
        if (index === 0) {
            toggleView('calculator');
        }
        // Если кнопка 2, показываем TradingView
        else if (index === 1) {
            toggleView('tradingView');
        }
    });
});

// Функция для переключения подменю
function toggleSubmenu(submenuId) {
    var submenu = document.getElementById(submenuId);
    
    // Скрыть все подменю
    var allSubmenus = document.querySelectorAll('.submenu-content');
    allSubmenus.forEach(function(item) {
        item.style.display = "none";
    });
    
    // Открыть или закрыть текущее подменю
    if (submenu.style.display === "block") {
        submenu.style.display = "none";  // Закрыть, если оно открыто
    } else {
        submenu.style.display = "block"; // Открыть, если оно закрыто
    }
}

// Закрытие меню при клике вне его
window.onclick = function(event) {
    // Проверяем, что клик не был по кнопке подменю или элементам внутри подменю
    if (!event.target.closest('.dropdown-content') && !event.target.closest('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.style.display === "block") {
                openDropdown.style.display = "none";
            }
        }
    }
}

// Функция для закрытия подменю и основного меню
function closeSubmenu() {
    // Скрываем все подменю
    var allSubmenus = document.querySelectorAll('.submenu-content');
    allSubmenus.forEach(function(submenu) {
        submenu.style.display = "none"; // Скрыть все подменю
    });
    
    // Скрываем основное меню
    var mainMenu = document.getElementById("myDropdown");
    if (mainMenu) {
        mainMenu.style.display = "none"; // Скрыть основное меню
    }
}

// Слушатели для выбора валюты
document.getElementById("currencyUsd").addEventListener("click", function() {
    changeCurrency('$');
    closeSubmenu();  // Закрываем подменю и основное меню
});
document.getElementById("currencyRub").addEventListener("click", function() {
    changeCurrency('₽');
    closeSubmenu();  // Закрываем подменю и основное меню
});
document.getElementById("currencyEur").addEventListener("click", function() {
    changeCurrency('€');
    closeSubmenu();  // Закрываем подменю и основное меню
});
document.getElementById("currencyJpy").addEventListener("click", function() {
    changeCurrency('¥');
    closeSubmenu();  // Закрываем подменю и основное меню
});

// Слушатели для выбора языка
document.getElementById("languageRu").addEventListener("click", function() {
    changeLanguage('ru');
    closeSubmenu();  // Закрываем подменю и основное меню
});
document.getElementById("languageEn").addEventListener("click", function() {
    changeLanguage('en');
    closeSubmenu();  // Закрываем подменю и основное меню
});

// Слушатели для выбора темы
document.getElementById("lightTheme").addEventListener("click", function() {
    applyTheme('light');
    closeSubmenu();  // Закрываем подменю и основное меню
});
document.getElementById("darkTheme").addEventListener("click", function() {
    applyTheme('dark');
    closeSubmenu();  // Закрываем подменю и основное меню
});
