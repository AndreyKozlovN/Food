import {closeModal, openModal} from './modal';
import {postData} from '../services/services';

function forms(formSelector, modalTimerId) {
        const forms = document.querySelectorAll(formSelector);

        const message = {
            loading: 'img/form/spinner.svg',
            success: 'Спасибо, скоро мы с вами свяжемся',
            failure: 'Что-то пошло не так...'
        };
    
        forms.forEach(item => {
            bindPostData(item);
        });    
        // async говорит что код асинхронный, await ставим перед той операцией которую надо дождаться

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
            openModal('.modal', modalTimerId);
    
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
                closeModal('.modal');
            }, 4000);
        }
        // fetch('http://localhost:3000/menu')
        // .then(data => data.json());
        // .then(res => console.log(res)); 
}

export default forms;