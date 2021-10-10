window.onload = () => {
    const runBtn = document.getElementById('run-btn');
    const minBtn = document.getElementById('min-btn');
    const iframe = document.querySelector('iframe');
    const codeAreas = document.querySelectorAll('textarea');
    let result = '';

    for (let i = codeAreas.length - 1; i >= 0; i--) {
        if (codeAreas[i].addEventListener) {
            codeAreas[i].addEventListener('input', () => {
                result = `${codeAreas[0].value}<style>${codeAreas[1].value}</style><script>${codeAreas[2].value}</script>`;
            }, false);
        }
    }

    runBtn.addEventListener('click', () => iframe.srcdoc = result);

    const minimizeEffect = () => {
        const fadeEffect = setInterval(() => {
            codeAreas.forEach((area, i) => codeAreas[i].rows !== 2 ? area.rows -= 1 : clearInterval(fadeEffect));
            iframe.style.height = '400px';
        }, 20);
    }

    minBtn.addEventListener('click', minimizeEffect);
}
