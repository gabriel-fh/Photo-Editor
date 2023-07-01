const inputRange = document.querySelectorAll('.input-range');
const btnTransformRotate = document.querySelectorAll('.rotation-container button');
const img = document.querySelector('img');
const inputFile = document.querySelector('.file');
const btnSave = document.querySelector('.save');
const btnReset = document.querySelector('.reset');
const form = document.querySelector('form');
form.addEventListener('submit', function (e) {
    e.preventDefault();
});

const initialValue = [100, 100, 100, 0, 0, 0];

// filtros que serão aplicados na imagem
const filters = {
    brightness: 100,
    contrast: 100,
    saturate: 100,
    hueRotate: 0,
    blur: 0,
    grayscale: 0,
};

// prosições que serão aplicadas na imagem
const transform = {
    scaleY: 1,
    scaleX: 1,
};

// aplicando as edições na imagem;
const applyCanges = function () {
    img.style.filter = `brightness(${filters.brightness}%)
                        contrast(${filters.contrast}%)
                        saturate(${filters.saturate}%)
                        hue-rotate(${filters.hueRotate}deg)
                        blur(${filters.blur}px)
                        grayscale(${filters.grayscale}%)`;

    img.style.transform = `scale(${transform.scaleX}, ${transform.scaleY})`;
};

// muda os values do inputRange de acordo com o id
const changeFilterValues = function (input) {
    if (input.id === 'brightness') {
        filters.brightness = input.value;
    } else if (input.id === 'contrast') {
        filters.contrast = input.value;
    } else if (input.id === 'saturate') {
        filters.saturate = input.value;
    } else if (input.id === 'hue-rotate') {
        filters.hueRotate = input.value;
    } else if (input.id === 'blur') {
        filters.blur = input.value;
    } else {
        filters.grayscale = input.value;
    }
    applyCanges();
};

// verifica o id o botão, e o valor que a posição x e y possuem, e atribuem um novo valor
const changeTransformValues = function (btn) {
    if (btn.id === 'scaleY') {
        transform.scaleY = transform.scaleY == 1 ? transform.scaleY = -1 : transform.scaleY = 1;
    } else if (btn.id === 'scaleX') {
        transform.scaleX = transform.scaleX == 1 ? transform.scaleX = -1 : transform.scaleX = 1;
    }
    applyCanges();
};

// reseta os valores
const reset = function () {
    for (let i = 0; i < initialValue.length; i++) {
        inputRange[i].value = initialValue[i];
        changeFilterValues(inputRange[i]);
    }
    img.style.transform = `scale(${1}, ${1})`;
};

// percorre todos os inputRange e os envia pra função que vai mudar os values do input
inputRange.forEach(input => {
    input.addEventListener('input', function () {
        changeFilterValues(this);
    });
});

// percorre todos os botões e os envia pra função que vai verificar o valor da posiçao
btnTransformRotate.forEach(btn => {
    btn.addEventListener('click', function () {
        changeTransformValues(this);
    })
});

// adiciona uma nova imagem a partir da máquina do usuário
inputFile.addEventListener('change', function () {
    if (this.files[0]) {
        img.src = URL.createObjectURL(this.files[0]);
        reset()
    }
});

// permite que a imagem editada seja baixada na máquina do usuário
btnSave.addEventListener('click', function () {
    // cria um elemento de canvas no documento HTML
    const canvas = document.createElement('canvas');

    // obtém o contexto 2D do canvas
    const ctx = canvas.getContext('2d');

    // define a largura e altura do canvas com base nas dimensões naturais da imagem
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    // define os filtros de imagem usando a propriedade filter do contexto 2D
    ctx.filter = `brightness(${filters.brightness}%)
            contrast(${filters.contrast}%)
            saturate(${filters.saturate}%)
            hue-rotate(${filters.hueRotate}deg)
            blur(${filters.blur}px)
            grayscale(${filters.grayscale}%)`;

    // translada o contexto para o centro do canvas
    ctx.translate(canvas.width / 2, canvas.height / 2);

    // aplica a escala no contexto
    ctx.scale(transform.scaleX, transform.scaleY);

    // desenha a imagem no contexto do canvas
    ctx.drawImage(img, - canvas.width / 2, - canvas.height / 2, canvas.width, canvas.height);

    // cria um elemento de link no documento HTML
    const link = document.createElement("a");

    // define o href do link como a representação da imagem editada em formato de dados URL
    link.href = canvas.toDataURL();

    // define o nome do arquivo para download
    link.download = "imagem-editada.png";

    // aciona o evento de clique no elemento de link, iniciando o download da imagem
    link.click();

});

btnReset.addEventListener('click', reset);

window.addEventListener('load', reset);
