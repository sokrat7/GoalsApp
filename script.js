document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.input-area');
    const input = document.getElementById('task-input');
    const list = document.getElementById('task-list');

    
    let tasks = JSON.parse(localStorage.getItem('myTasks')) || [];

    
    function saveTasks() {
        localStorage.setItem('myTasks', JSON.stringify(tasks));
    }

    
    function renderTask(task, index) {
        const li = document.createElement('li');
        li.className = 'todo-item';
        
        
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

        
        if (task.completed) {
            editBtn.style.display = 'none';
        }

        
        checkbox.addEventListener('change', () => {
            task.completed = checkbox.checked; 
            saveTasks();
            if (checkbox.checked) {
                li.classList.add('completed');
                editBtn.style.display = 'none';
            } else {
                li.classList.remove('completed');
                editBtn.style.display = 'inline-block';
            }
        });

        
        deleteBtn.addEventListener('click', () => {
            tasks.splice(index, 1); 
            saveTasks(); 
            li.remove(); 
        });

        
        editBtn.addEventListener('click', () => {
            if (taskText.contentEditable === 'true') {
                
                taskText.contentEditable = 'false';
                editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
                
                
                task.text = taskText.textContent;
                saveTasks();
            } else {
                
                taskText.contentEditable = 'true';
                taskText.focus();
                editBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
            }
        });
    }

    
    function addTask(text) {
        
        const newTask = {
            text: text,
            completed: false
        };
        
        tasks.push(newTask); 
        saveTasks(); 
        
        
        renderTask(newTask, tasks.length - 1);
    }

    
    tasks.forEach((task, index) => {
        renderTask(task, index);
    });

    
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