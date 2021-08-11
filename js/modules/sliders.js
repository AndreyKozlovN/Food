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