/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./js/modules/calc.js":
/*!****************************!*\
  !*** ./js/modules/calc.js ***!
  \****************************/
/***/ ((module) => {

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

module.exports = calc;

/***/ }),

/***/ "./js/modules/cards.js":
/*!*****************************!*\
  !*** ./js/modules/cards.js ***!
  \*****************************/
/***/ ((module) => {

function cards() {
    // Используем классы для создание карточек меню
    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 27;
            this.changeToUAH();
        }

        changeToUAH() {
            this.price = this.price * this.transfer;
        }

        render() {
            const element = document.createElement('div');

            if (this.classes.length === 0) {
                this.classes = "menu__item";
                element.classList.add(this.classes);
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }

            element.innerHTML = `
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                    </div>
                `;
            this.parent.append(element);
        }
    }

    const getResource = async (url) => {
        const res = await fetch(url);

        if (!res.ok) {
            // если в запросе что то пошло не так, выкинем ошибку вручную(блок catch)
            throw new Error(`Could nor fetch ${url}, status: ${res.status}`);
        }
        return await res.json();
    };
    // получаем по get запросу инфу с db.json
    //     getResource('http://localhost:3000/menu')
    //         .then(data => {
    //             data.forEach(({img, altimg, title, descr, price}) => {
    // // {} деструктуризация объекта, достаем свойства из объекта по отдельным частям
    //                 new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
    //             });
    //         });
    // //получаем данные по ссылке,т.к. придет массив,вызовем конструктор на каждый объект массива
    axios.get('http://localhost:3000/menu')
        .then(data => {
            data.data.forEach(({
                img,
                altimg,
                title,
                descr,
                price
            }) => {
                new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
            });
        });
    // создание карточки с помощью подключеной библиотеки axios


    //     getResource('http://localhost:3000/menu')
    //         .then(data => createCard(data));

    //         function createCard(data, ) {
    //             data.forEach(({img, altimg, title, descr, price}) => {
    //                 const element = document.createElement('div');
    //                 price = price * 27;
    //                 element.classList.add('menu__item');

    //                 element.innerHTML = `
    //                     <img src=${img} alt=${altimg}>
    //                     <h3 class="menu__item-subtitle">${title}</h3>
    //                     <div class="menu__item-descr">${descr}</div>
    //                     <div class="menu__item-divider"></div>
    //                     <div class="menu__item-price">
    //                         <div class="menu__item-cost">Цена:</div>
    //                         <div class="menu__item-total"><span>${price}</span> грн/день</div>
    //                     </div>
    //                 `;
    //                 document.querySelector('.menu .container').append(element);
    //             });
    //         }
    // // createCatd получает data, т.к. это массив, перебираем его, деструктуризируем объект на свойства
    // // создает div,дает ему класс,внутрь кладет свойства которые пришли из сервера,append к элементу
}

module.exports = cards;

/***/ }),

/***/ "./js/modules/forms.js":
/*!*****************************!*\
  !*** ./js/modules/forms.js ***!
  \*****************************/
/***/ ((module) => {

function forms() {
        // Forms
        const forms = document.querySelectorAll('form');

        const message = {
            loading: 'img/form/spinner.svg',
            success: 'Спасибо, скоро мы с вами свяжемся',
            failure: 'Что-то пошло не так...'
        };
    
        forms.forEach(item => {
            bindPostData(item);
        });    
        // async говорит что код асинхронный, await ставим перед той операцией которую надо дождаться
        const postData = async (url, data) => {
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: data
            });
            return await res.json();
            // возвращаем promise что бы его обработать
        };
        //посылаем запрос(fetch) и настраиваем его, получаем его и трансформируем в Json
        function bindPostData(form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
    
                const statusMessage = document.createElement('img');
                statusMessage.src = message.loading;
                statusMessage.style.cssText = `
                    display: block;
                    margin: 0 auto;
                `;
                form.insertAdjacentElement('afterend', statusMessage);
                // const request = new XMLHttpRequest();
                // request.open('POST', 'server.php');
                // request.setRequestHeader('Content-type', 'application/json');
                //если XMLHttpRequest в связке с FormData, заголовок устанавливать не надо
                const formData = new FormData(form);
    
                const json = JSON.stringify(Object.fromEntries(formData.entries()));
                // получим данные с формы в виде массива с массивами, превращаем в объект, затем в JSON
    
                //если внутри fetch, promise попадает на ошибку которая связана с http(404, 502), не будет reject,
                //а выполнится resolve, т.к запрос выполнился, reject будет при сбое сети или что то помешало
    
                //обращаемся к server.php(куда), метод POST запрос(как), заголовки, body(что) - это мы отправим
                //говорим,что с сервера придет какой то data(пока этоне Json формат)
                //выводим в data в консоль,запускаем функцию,потом удаляем спиннер 
                postData('http://localhost:3000/requests', json)
                    //ссылку получили командой npx json-server db.json
                    // .then(data => data.text()) - сейчас она происходит на 230стр(внутри POST)
                    //модицифируем и говорим что data придет к нам в виде текста
                    .then(data => {
                        console.log(data);
                        showThanksModal(message.success);
                        statusMessage.remove();
                        //.catch блок для ошибок,если на этапе запроса(254стр.),вызовется функция
                    }).catch(() => {
                        showThanksModal(message.failure);
                        //.finally запускается при любом исходе, form.reset(); - очистим форму
                    }).finally(() => {
                        form.reset();
                    });
                // старый код HTTPXmlRequest
                // request.addEventListener('load', () => {
                //     if (request.status === 200) {
                //         console.log(request.response);
                //         showThanksModal(message.success);
                //         form.reset();
                //         statusMessage.remove();
                //     } else {
                //         showThanksModal(message.failure);
                //     }
                // });
            });
        }
    
        function showThanksModal(message) {
            const prevModalDialog = document.querySelector('.modal__dialog');
    
            prevModalDialog.classList.add('hide');
            openModal();
    
            const thanksModal = document.createElement('div');
            thanksModal.classList.add('modal__dialog');
            thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>&times;</div>
                <div class="modal__title">${message}</div>
            </div>
            `;
    
            document.querySelector('.modal').append(thanksModal);
            setTimeout(() => {
                thanksModal.remove();
                prevModalDialog.classList.add('show');
                prevModalDialog.classList.remove('hide');
                closeModal();
            }, 4000);
        }
        // fetch('http://localhost:3000/menu')
        // .then(data => data.json());
        // .then(res => console.log(res)); 
}

module.exports = forms;

/***/ }),

/***/ "./js/modules/modal.js":
/*!*****************************!*\
  !*** ./js/modules/modal.js ***!
  \*****************************/
/***/ ((module) => {

function modal() {
    // Modal
    const modalTrigger = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal');

    modalTrigger.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') == '') {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === "Escape" && modal.classList.contains('show')) {
            closeModal();
        }
    });

    const modalTimerId = setTimeout(openModal, 50000);

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }
    window.addEventListener('scroll', showModalByScroll);
}

module.exports = modal;

/***/ }),

/***/ "./js/modules/sliders.js":
/*!*******************************!*\
  !*** ./js/modules/sliders.js ***!
  \*******************************/
/***/ ((module) => {

function sliders() {
    // Sliders
    let slideIndex = 1;
    let offset = 0;
    const slides = document.querySelectorAll('.offer__slide'),
        // класс который определяет каждый слайд
        slider = document.querySelector('.offer__slider'),
        prev = document.querySelector('.offer__slider-prev'),
        // стрелочка назад
        next = document.querySelector('.offer__slider-next'),
        // стрелочка вперед
        total = document.querySelector('#total'),
        current = document.querySelector('#current'),
        // определяет текущещ положение в слайдере
        slidesWrapper = document.querySelector('.offer__slider-wrapper'),
        // общая обертка слайдов
        slidesField = document.querySelector('.offer__slider-inner'),
        // поле с нашими слайдами
        width = window.getComputedStyle(slidesWrapper).width;
    // получим свойство с шириной объекта с уже примененными к нему стилями


    // Slider v.2 в html добавлен класс offer__slider-inner (в него завернули старые блоки)
    if (slides.length < 10) {
        total.textContent = `0${slides.length}`;
        current.textContent = `0${slideIndex}`;
    } else {
        total.textContent = slides.length;
        current.textContent = slideIndex;
    }

    slidesField.style.width = 100 * slides.length + '%';
    // будет занимать большое кол-во простр-ва в одну строку и выстраивать слайды
    // умножаем кол-во слайдов на 100% и помещаем их в slidesField
    slidesField.style.display = 'flex';
    // помещаем все слайды в один ряд
    slidesField.style.transition = '0.5s all';
    // определяем переходное состояние между ВСЕМИ (all) элементами/слайдами
    slidesWrapper.style.overflow = 'hidden';
    // скрываем все элементы которые не попадают в область видимости
    slides.forEach(slide => {
        slide.style.width = width;
        // перебираем все слайды и указываем им одинаковую ширину
    });

    slider.style.position = 'relative';
    // все элементы внутри slider будут нормально отображаться
    const indicators = document.createElement('ol'),
        dots = [];
    indicators.classList.add('carousel-indicators');
    // создаем новый элемент и присваиваем ему новый класс(его нет в css)
    indicators.style.cssText = `
           position: absolute;
           right: 0;
           bottom: 0;
           left: 0;
           z-index: 15;
           display: flex;
           justify-content: center;
           margin-right: 15%;
           margin-left: 15%;
           list-style: none;
       `;
    slider.append(indicators);

    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i + 1);
        // к каждой точки будет устанавливаться атрибут и нумерация
        dot.style.cssText = `
               box-sizing: content-box;
               flex: 0 1 auto;
               width: 30px;
               height: 6px;
               margin-right: 3px;
               margin-left: 3px;
               cursor: pointer;
               background-color: #fff;
               background-clip: padding-box;
               border-top: 10px solid transparent;
               border-bottom: 10px solid transparent;
               opacity: .5;
               transition: opacity .6s ease;
           `;
        if (i == 0) {
            dot.style.opacity = 1;
            // устанавливаем непрозрачность элемента
        }
        indicators.append(dot);
        dots.push(dot);
        // добавляем dot(наши точки в слайдере) в массив созданный ранее
    }

    next.addEventListener('click', () => {
        if (offset == deleteNotDigits(width) * (slides.length - 1)) {
            offset = 0;
            // если отступ равен ширине одного слайда(мы долистали до конца),возвращаемся в самое начало
        } else {
            offset += deleteNotDigits(width);
        }
        // если это не последний слайд, к offset добавляется ширина еще одного слайда и слайд смещается на опред. ширину

        slidesField.style.transform = `translateX(-${offset}px)`;
        // сдвигаем слайд ВЛЕВО(-...px)

        if (slideIndex == slides.length) {
            slideIndex = 1;
        } else {
            slideIndex++;
        }
        // если долистали до последнего слайда, то возвращаемся к 1, если нет, то увеличиваем на единицу
        numSlides();

        dotsOpacity();
    });

    prev.addEventListener('click', () => {
        if (offset == 0) {
            offset = deleteNotDigits(width) * (slides.length - 1);
        } else {
            offset -= deleteNotDigits(width);
        }

        slidesField.style.transform = `translateX(-${offset}px)`;

        if (slideIndex == 1) {
            slideIndex = slides.length;
        } else {
            slideIndex--;
        }

        numSlides();

        dotsOpacity();
    });

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const slideTo = e.target.getAttribute('data-slide-to');

            slideIndex = slideTo;
            offset = deleteNotDigits(width) * (slideTo - 1);

            slidesField.style.transform = `translateX(-${offset}px)`;

            numSlides();

            dotsOpacity();
        });
    });

    function deleteNotDigits(str) {
        return +str.replace(/\D/g, '');
    }

    function dotsOpacity() {
        dots.forEach(dot => dot.style.opacity = '.5');
        dots[slideIndex - 1].style.opacity = '1';
    }
    // перебираем массив(точки на слайде) и устанавливаем прозрачность
    function numSlides() {
        if (slides.length < 10) {
            current.textContent = `0${slideIndex}`;
        } else {
            current.textContent = slideIndex;
        }
    }
    // подставляем 0, если число меньше 10, если больше, используем без 0


    // Slider v.1
    // showSlides(slideIndex);

    // if (slides.length < 10) {
    //     total.textContent = `0${slides.length}`;
    // } else {
    //     total.textContent = slides.length;
    // }

    // function showSlides(n) {
    //     if (n > slides.length) {
    //         slideIndex = 1;
    //     }
    //     // если последний слайд(правая граница) перемещаемся в самое начало слайдов
    //     if (n < 1) {
    //         slideIndex = slides.length;
    //     }
    //     // если слайд меньше 1 (максимально слева), перемещаемся в конец слайдов

    //     slides.forEach((item) => item.style.display = 'none');
    //     // обращаемся ко всем слайдам,перебираем их,и применяем к каждому 'none' (скрываем их)

    //     slides[slideIndex - 1].style.display = 'block';
    //     // -1 т.к нумерация в массиве идет с 0, а у людей с 1.устанавливаем 'block', делаем видимым

    //     if (slides.length < 10) {
    //         current.textContent = `0${slideIndex}`;
    //     } else {
    //         current.textContent = slideIndex;
    //     }
    // }

    // function plusSlides(n) {
    //     showSlides(slideIndex += n);
    // }
    // // вызываем функцию showSlides, если n = 1 то прибавляем, если -1 то отнимаем от значения,и вызываем функцию

    // prev.addEventListener('click', () => {
    //     plusSlides(-1);
    // });

    // next.addEventListener('click', () => {
    //     plusSlides(1);
    // });
}

module.exports = sliders;

/***/ }),

/***/ "./js/modules/tabs.js":
/*!****************************!*\
  !*** ./js/modules/tabs.js ***!
  \****************************/
/***/ ((module) => {

function tabs() {
    // Tabs
    let tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent() {

        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', function (event) {
        const target = event.target;
        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });
}

module.exports = tabs;

/***/ }),

/***/ "./js/modules/timer.js":
/*!*****************************!*\
  !*** ./js/modules/timer.js ***!
  \*****************************/
/***/ ((module) => {

function timer() {
    // Timer
    const deadline = '2021-09-11';

    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()),
            days = Math.floor((t / (1000 * 60 * 60 * 24))),
            seconds = Math.floor((t / 1000) % 60),
            minutes = Math.floor((t / 1000 / 60) % 60),
            hours = Math.floor((t / (1000 * 60 * 60) % 24));

        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return '0' + num;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {

        const timer = document.querySelector(selector),
            days = timer.querySelector("#days"),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);

        updateClock();

        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }
    setClock('.timer', deadline);
}

module.exports = timer;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./js/script.js ***!
  \**********************/
window.addEventListener('DOMContentLoaded', function () {
    const tabs = __webpack_require__(/*! ./modules/tabs */ "./js/modules/tabs.js"),
          modal = __webpack_require__(/*! ./modules/modal */ "./js/modules/modal.js"),
          timer = __webpack_require__(/*! ./modules/timer */ "./js/modules/timer.js"),
          cards = __webpack_require__(/*! ./modules/cards */ "./js/modules/cards.js"),
          calc = __webpack_require__(/*! ./modules/calc */ "./js/modules/calc.js"),
          forms = __webpack_require__(/*! ./modules/forms */ "./js/modules/forms.js"),
          sliders = __webpack_require__(/*! ./modules/sliders */ "./js/modules/sliders.js");
    
          tabs();
          modal();
          timer();
          cards();
          calc();
          forms();
          sliders();
});
})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map