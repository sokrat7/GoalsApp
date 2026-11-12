document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.input-area');
    const input = document.getElementById('task-input');
    const list = document.getElementById('task-list');

    // 1. Получаем задачи из LocalStorage при загрузке (или пустой массив)
    let tasks = JSON.parse(localStorage.getItem('myTasks')) || [];

    // Функция сохранения текущего состояния в LocalStorage
    function saveTasks() {
        localStorage.setItem('myTasks', JSON.stringify(tasks));
    }

    // Функция создания DOM-элемента задачи (чтобы не дублировать код)
    function renderTask(task, index) {
        const li = document.createElement('li');
        li.className = 'todo-item';
        
        // Если задача выполнена, сразу добавляем класс
        if (task.completed) {
            li.classList.add('completed');
        }

        li.innerHTML = `
            <div class="task-left">
                <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''}>
                <span class="task-text">${task.text}</span>
            </div>
            <div class="task-right">
                <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
                <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;

        list.appendChild(li);

        const checkbox = li.querySelector('.checkbox');
        const taskText = li.querySelector('.task-text');
        const editBtn = li.querySelector('.edit-btn');
        const deleteBtn = li.querySelector('.delete-btn');

        // Если задача была выполнена, прячем кнопку редактирования
        if (task.completed) {
            editBtn.style.display = 'none';
        }

        // --- ОБРАБОТЧИК ЧЕКБОКСА ---
        checkbox.addEventListener('change', () => {
            task.completed = checkbox.checked; // Обновляем данные
            saveTasks(); // Сохраняем

            if (checkbox.checked) {
                li.classList.add('completed');
                editBtn.style.display = 'none';
            } else {
                li.classList.remove('completed');
                editBtn.style.display = 'inline-block';
            }
        });

        // --- ОБРАБОТЧИК УДАЛЕНИЯ ---
        deleteBtn.addEventListener('click', () => {
            tasks.splice(index, 1); // Удаляем из массива
            saveTasks(); // Сохраняем
            li.remove(); // Удаляем из DOM
        });

        // --- ОБРАБОТЧИК РЕДАКТИРОВАНИЯ ---
        editBtn.addEventListener('click', () => {
            if (taskText.contentEditable === 'true') {
                // Сохраняем изменения
                taskText.contentEditable = 'false';
                editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
                
                // Обновляем текст в массиве и сохраняем
                task.text = taskText.textContent;
                saveTasks();
            } else {
                // Включаем редактирование
                taskText.contentEditable = 'true';
                taskText.focus();
                editBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
            }
        });
    }

    // Функция добавления новой задачи
    function addTask(text) {
        // Создаем объект новой задачи
        const newTask = {
            text: text,
            completed: false
        };
        
        tasks.push(newTask); // Добавляем в массив
        saveTasks(); // Сохраняем в LocalStorage
        
        // Отрисовываем новую задачу на экране
        renderTask(newTask, tasks.length - 1);
    }

    // 2. Отрисовываем все задачи из LocalStorage при загрузке страницы
    tasks.forEach((task, index) => {
        renderTask(task, index);
    });

    // Обработчик отправки формы (Добавление)
    form.addEventListener('submit', (event) => {
        event.preventDefault(); 
        const text = input.value.trim();
        
        if (text !== '') {
            addTask(text);
            input.value = ''; 
            input.focus(); 
        }
    });
});