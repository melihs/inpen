window.onload = () => {
    const runBtn = document.getElementById('run-btn');
    const minBtn = document.getElementById('min-btn');
    const saveBtn = document.getElementById('save-btn');
    const iframe = document.querySelector('iframe');
    const codeAreas = document.querySelectorAll('textarea');
    let result = '';
    let areaData = {};

    for (let i = codeAreas.length - 1; i >= 0; i--) {
        if (codeAreas[i].addEventListener) {
            codeAreas[i].addEventListener('input', () => {
                areaData = ['html', 'css', 'js'].reduce((acc, key, index) => {
                    acc[key] = codeAreas[index].value;
                    return acc;
                }, {});

                result = `${codeAreas[0].value}<style>${codeAreas[1].value}</style><script>${codeAreas[2].value}</script>`;
            }, false);
        }
    }

    runBtn.addEventListener('click', () => {
        iframe.srcdoc = result
    });

    document.addEventListener("keydown", (e) => {
        if (e.ctrlKey && e.key === "s") iframe.srcdoc = result;
    });

    const minimizeEffect = () => {
        const fadeEffect = setInterval(() => {
            codeAreas.forEach((area, i) => codeAreas[i].rows !== 2 ? area.rows -= 1 : clearInterval(fadeEffect));
            iframe.style.height = '400px';
        }, 20);
    }

    minBtn.addEventListener('click', minimizeEffect);

    saveBtn.addEventListener('click', () => {
        const templateName = document.getElementById('template-name');

        const validated = validate(
            {
                value: templateName.value,
                type: 'string',
                message: 'Please enter template name',
            },
            {
                value: Object.values(areaData),
                type: 'array',
                message: 'Please enter template codes',
            }
        );

        if (validated) {
            areaData.name = templateName.value;
            localStorage.setItem(areaData.name, JSON.stringify(areaData));

            validationMessage('save successful', 'success');
            templateName.value = '';

        }
    });

    const validate = (...rules) => {
        if (!rules) return false;
        const hasErrors = [];
        const errorMessages = document.querySelectorAll('.error-msg');
        if (errorMessages) errorMessages.forEach(e => e.remove());

        rules.forEach((rule, i) => {
            switch (rules[i].type) {
                case 'array':
                    if (!rules[i].value.find(val => val !== '')) {
                        validationMessage(rules[i].message, 'error');
                        hasErrors[i] = true;
                    }
                    break;
                default:
                    if (!rules[i].value) {
                        validationMessage(rules[i].message, 'error');
                        hasErrors[i] = true;
                    }
                    break;
            }
        });
        return hasErrors.every(e => e === false);
    }

    const validationMessage = (message, type) => {
        const templateName = document.getElementById('template-name');
        const elmLi = document.createElement('li');

        if (type === 'error') {
            elmLi.classList.add('error-msg', 'text-danger');
        } else {
            elmLi.classList.add('error-msg', 'text-success');
        }

        elmLi.innerText = message;
        templateName.parentElement.appendChild(elmLi);

        setTimeout(() => {
            const messages = templateName.parentElement.getElementsByTagName('li');
            [...messages].forEach((m) => m.remove());

        }, 3000);
    }

    const initHistories = () => {
        if (localStorage.length === 0) return;
        const dropdownMenu = document.querySelector('.dropdown-menu');

        Object.keys(localStorage).forEach((key) => {
            const elmLi = document.createElement('li');
            const elmButton = document.createElement('button');
            elmButton.setAttribute('id', key);
            elmButton.classList.add('dropdown-item');
            elmButton.innerText = key;
            elmLi.append(elmButton);
            dropdownMenu.append(elmLi);
        });
    }

    const getHistory = () => {
        Object.keys(localStorage).forEach((key) => {
            const elmButton = document.getElementById(key);
            elmButton.addEventListener('click', () => {
                const rendererCodes = JSON.parse(localStorage.getItem(key));
                delete rendererCodes.name;

                Object.keys(rendererCodes).forEach((c, i) => {
                    codeAreas[i].value = rendererCodes[c];
                });

                result = `${rendererCodes['html']}<style>${rendererCodes['css']}</style><script>${rendererCodes['js']}</script>`;
            })
        });
    }

    initHistories();
    getHistory();
}
