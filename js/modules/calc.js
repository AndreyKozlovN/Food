function calc() {
    // Calculated colories
    const result = document.querySelector('.calculating__result span');

    let sex, height, weight, age, ratio;

    if (localStorage.getItem('sex')) {
        sex = localStorage.getItem('sex');
    } else {
        sex = 'female';
        localStorage.setItem('sex', 'female');
    }

    if (localStorage.getItem('ratio')) {
        ratio = localStorage.getItem('ratio');
    } else {
        ratio = 1.375;
        localStorage.setItem('ratio', 1.375);
    }
    // если в localStorage есть информация, то мы ее помещаем в переменные 'sex' / 'ratio'
    // если там нет значения, то установим его по умолчанию и присвоим переменным    
    function initLocalSettings(selector, activeClass) {
        const elems = document.querySelectorAll(selector);

        elems.forEach(element => {
            element.classList.remove(activeClass);
            if (element.getAttribute('id') === localStorage.getItem('sex')) {
                element.classList.add(activeClass);
            }
            if (element.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
                element.classList.add(activeClass);
            }
            // удаляем класс активности у всех элементов, перебираем их, если у элемента есть класс активности
            // в localStorage - то данному элементу мы назначим класс активности
        });
    }
    initLocalSettings('#gender div', 'calculating__choose-item_active');
    initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');

    function calcTotal() {
        if (!sex || !height || !weight || !age || !ratio) {
            result.textContent = '---';
            return;
        }

        if (sex === 'female') {
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        } else {
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        }
    }

    calcTotal();

    function getStaticInformation(selector, activeClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(elem => {
            elem.addEventListener('click', (e) => {
                if (e.target.getAttribute('data-ratio')) {
                    ratio = +e.target.getAttribute('data-ratio');
                    localStorage.setItem('ratio', +e.target.getAttribute('data-ratio'));
                    // при клике на элементы, данные сохраняютсяв локальное хранилище
                } else {
                    sex = e.target.getAttribute('id');
                    localStorage.setItem('sex', e.target.getAttribute('id'));
                }
                // если пользователь кликнул на блок с рационом(любой) мы вытаскиваем значение из data-ratio
                // если клик на пол (муж/жен), то сработает else, мы получим его id (male/female) 
                elements.forEach(elem => {
                    elem.classList.remove(activeClass);
                    // перебираем все элементы у убираем у них activeClass (класс активности)
                });
                e.target.classList.add(activeClass);
                // добавляем класс активности нужному элементу (на который кликнули)
                calcTotal();
            });
        });
    }

    getStaticInformation('#gender div', 'calculating__choose-item_active');
    getStaticInformation('.calculating__choose_big div', 'calculating__choose-item_active');

    function getDinamicInformation(selector) {
        const input = document.querySelector(selector);

        input.addEventListener('input', () => {

            if (input.value.match(/\D/g)) {
                input.style.border = '3px solid red';
            } else {
                input.style.border = 'none';
            }
            // если введено не число, то появится красная рамка на этом элементе,если число - ничего
            switch (input.getAttribute('id')) {
                // если в выбранном input id будет совпадать с case, то выполнится только он, затем break
                case 'height':
                    height = +input.value;
                    break;
                case 'weight':
                    weight = +input.value;
                    break;
                case 'age':
                    age = +input.value;
                    break;
            }
            // при каждом вводе ориентируясь на id и будем записывать данные в определенные переменные
            calcTotal();
        });
    }

    getDinamicInformation('#height');
    getDinamicInformation('#weight');
    getDinamicInformation('#age');
}

export default calc;