const inputBox = document.getElementById('input-box');
const listContainer = document.getElementById('list-container');
let btnClear = document.getElementById('btn-clear');
let btnSave = document.getElementById('btn-save');
let emptyTask = document.createElement('div');
emptyTask.textContent = 'You dont have any tasks at this moment';
function addTask() {
    if (inputBox.value === '') {
        alert('must fill task')
    } else {
        let li = document.createElement('li');
        li.innerHTML = inputBox.value;
        listContainer.appendChild(li)
        let span = document.createElement('span');
        span.innerHTML = '\u00d7';
        li.appendChild(span);
        let edit = document.createElement('img');
        edit.src = './images/edit.png';
        edit.classList.add('edit');
        li.appendChild(edit);
        edit.addEventListener('click', () => {
            inputBox.value = li.innerText.slice(0, -1);
            li.remove();
            updateBtnDisplay();
            checkEmpty()
        });
        updateBtnDisplay();
        btnClear.addEventListener('click', () => {
            li.remove();
            btnClear.style.display = 'none';
            btnSave.style.display = 'none';
            checkEmpty();
        })
        checkEmpty()
        removeStorageButtons();
    }
    inputBox.value = ''

}
function updateBtnDisplay() {
    if (listContainer.getElementsByTagName('li').length > 0) {
        btnClear.style.display = 'block';
        btnSave.style.display = 'block';
    } else {
        btnClear.style.display = 'none';
        btnSave.style.display = 'none';
    }
}
listContainer.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
        e.target.classList.toggle('checked');

    } else if (e.target.tagName === 'SPAN') {
        e.target.parentElement.remove();
        updateBtnDisplay();

    }
}, false)


function saveData() {
    localStorage.setItem('data', listContainer.innerHTML);
    localStorage.setItem('btnClearDisplay', btnClear.style.display);
    localStorage.setItem('btnSaveDisplay', btnSave.style.display);
    alert('Tasks Saved Successfully!')
}

function loadData() {
    listContainer.innerHTML = localStorage.getItem('data');
    btnClear.style.display = localStorage.getItem('btnClearDisplay');
    btnSave.style.display = localStorage.getItem('btnSaveDisplay');
    attachButtonEventListeners()
    attachEditEventListeners();
}

function storageManegg() {
    if (localStorage.data) {
        let btnLoad = document.createElement('button');
        btnLoad.innerText = 'Load Previuse Tasks';
        btnLoad.classList.add('btn', 'btn-load');
        emptyTask.textContent = 'would you like to load previus tasks?'
        let btnClearStorage = document.createElement('button');
        btnClearStorage.innerText = 'Clear Previuse Tasks';
        btnClearStorage.classList.add('btn', 'btn-clear-storage')
        listContainer.appendChild(btnLoad);
        listContainer.appendChild(btnClearStorage);
        btnLoad.addEventListener('click', () => {
            loadData();
        })
        btnClearStorage.addEventListener('click', () => {
            localStorage.clear();
            removeStorageButtons()
            emptyTask.textContent = 'You dont have any tasks at this moment';
        })
    }
}
window.onload = () => {
    storageManegg();
};

function attachButtonEventListeners() {
    btnClear.addEventListener('click', () => {
        listContainer.innerHTML = '';
        updateBtnDisplay();
        checkEmpty()
    });
}

function attachEditEventListeners() {
    const editButtons = listContainer.getElementsByClassName('edit');
    for (let i = 0; i < editButtons.length; i++) {
        const editButton = editButtons[i];
        editButton.addEventListener('click', () => {
            const li = editButton.parentElement;
            inputBox.value = li.innerText.slice(0, -1);
            li.remove();
            updateBtnDisplay();
        });
    }
}

function checkEmpty() {
    if (listContainer.getElementsByTagName('li').length === 0) {
        listContainer.appendChild(emptyTask);
    } else {
        emptyTask.remove();
    }
}
checkEmpty()

function removeStorageButtons() {
    const btnLoad = document.querySelector('.btn-load');
    if (btnLoad) {
        btnLoad.remove();
    }
    const btnClearStorage = document.querySelector('.btn-clear-storage');
    if (btnClearStorage) {
        btnClearStorage.remove();
    }
}


window.onload = () => {
    btnSave.addEventListener('click', () => {
        saveData();
    });

    storageManegg();
};
