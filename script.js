document.addEventListener("DOMContentLoaded", function () {
    let position = null; // Выбранная позиция (long или short)

    // Новые переменные для двух разных состояний
    let menuSelection = null; // "btnCalulator" или "tradingView"
    let tradePosition = null; // "long" или "short"

    const longBtn = document.getElementById("long");
    const shortBtn = document.getElementById("short");
    const calculateBtn = document.getElementById("result");
    const resetBtn = document.querySelector(".btnReset");

    const depoInput = document.getElementById("depo");
    const riskInput = document.getElementById("risk");
    const entryInput = document.getElementById("in");
    const stoplossInput = document.getElementById("stoploss");
    const resultBox = document.getElementById("resultInput");


    const calcBtn = document.getElementById("btnCalulator");
    const tradingViewBtn = document.getElementById("tradingView");

    const settings = document.getElementById("settings");
    const backBtn = document.getElementById("backBtn");

    // При загрузке делаем calcBtn активной
    calcBtn.classList.add("active");


    // выподающее меню
    settings.addEventListener("click", function() {
        document.getElementById("menu").classList.toggle("active");
    });

    backBtn.addEventListener("click", function() {
        document.getElementById("menu").classList.remove("active");
    });




    // Выбор кнопки меню
    function selectMenu(type) {
        menuSelection = type;
        calcBtn.classList.remove("active");
        tradingViewBtn.classList.remove("active");

        if (type === "btnCalulator") {
            calcBtn.classList.add("active");
        } else {
            tradingViewBtn.classList.add("active");
        }
    }

    // Обработчики кнопок меню
    calcBtn.addEventListener("click", () => selectMenu("btnCalulator"));
    tradingViewBtn.addEventListener("click", () => selectMenu("tradingView"));

    calcBtn.addEventListener("click", () => {
        selectMenu("btnCalulator");
        document.getElementById("page-calculator").style.display = "flex";
        document.getElementById("header").style.display = "flex";
        document.getElementById("tradingview-widget").style.display = "none";
    });
    
    tradingViewBtn.addEventListener("click", () => {
        selectMenu("tradingView");
        document.getElementById("page-calculator").style.display = "none";
        document.getElementById("header").style.display = "none";
        document.getElementById("tradingview-widget").style.display = "flex";
    });
    

    function selectPosition(type) {
        tradePosition = type;
        longBtn.classList.remove("active");
        shortBtn.classList.remove("active");

        if (type === "long") {
            longBtn.classList.add("active");
        } else {
            shortBtn.classList.add("active");
        }
    }

    // Функция выбора позиции
    function selectPosition(type) {
        position = type;
    
        // Сначала убираем активный класс у обеих кнопок
        longBtn.classList.remove("active");
        shortBtn.classList.remove("active");
    
        // Затем добавляем активный класс только к выбранной кнопке
        if (type === "long") {
            longBtn.classList.add("active");
        } else {
            shortBtn.classList.add("active");
        }
    }

    
    
    // Обработчики кнопок Long/Short
    longBtn.addEventListener("click", () => selectPosition("long"));
    shortBtn.addEventListener("click", () => selectPosition("short"));

    // Функция расчёта объёма входа
    calculateBtn.addEventListener("click", function () {
        if (!position) {
            resultBox.textContent = 'Выберите позицию: Long или Short';
            resultBox.classList.add('resultBoxErr')
            return;
        }

        resultBox.classList.remove('resultBoxErr');

        const depo = parseFloat(depoInput.value);
        const risk = parseFloat(riskInput.value);
        const entry = parseFloat(entryInput.value);
        const stoploss = parseFloat(stoplossInput.value);

        if (isNaN(depo) || isNaN(risk) || isNaN(entry) || isNaN(stoploss) || depo <= 0 || risk <= 0) {
            resultBox.textContent = "Ошибка! Заполните все поля корректно.";
            return;
        }

        // Проверяем условия для Long и Short
        if (position === "long" && entry <= stoploss) {
            resultBox.textContent = "Ошибка! В Long-позиции цена входа должна быть выше стоп-лосса.";
            return;
        }

        if (position === "short" && entry >= stoploss) {
            resultBox.textContent = "Ошибка! В Short-позиции цена входа должна быть ниже стоп-лосса.";
            return;
        }

        // Рассчитываем риск в валюте депозита
        const riskAmount = (depo * risk) / 100;
        const stopLossSize = Math.abs(entry - stoploss); // Разница между входом и стоп-лоссом

        if (stopLossSize === 0) {
            resultBox.textContent = "Ошибка! Стоп-лосс не может быть равен цене входа.";
            return;
        }

        const volume = (riskAmount / stopLossSize) * entry;
        resultBox.textContent = `Объём входа: ${volume.toFixed(2)}`;

    });

    // Функция сброса всех полей, кроме депозита
    resetBtn.addEventListener("click", function () {
        riskInput.value = "";
        entryInput.value = "";
        stoplossInput.value = "";
        resultBox.textContent = "Ожидание данных...";
        position = null;
        longBtn.classList.remove("active");
        shortBtn.classList.remove("active");
    });
});

