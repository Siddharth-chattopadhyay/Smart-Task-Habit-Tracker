const tasklist = document.getElementById("tasklist");
function getFilter(){
    return {
        "title": document.getElementById("ftitle").value,
        "category": document.getElementById("fcategory").value,
        "status": document.getElementById("fstatus").value,
    }
}

class Task{
    #tasks = [];

    getTask(uid){
        return this.#tasks[this.#tasks.findIndex(v => v.uid == uid)];
    }
    createTask(title, description, category, due_date, status){
        this.#tasks.push({
            "uid": new Date().getTime(),
            "title": title,
            "description": description,
            "category": category,
            "due": due_date,
            "status": status
        });
    }
    updateTask(uid, title, description, category, due_date, status){
        const index = this.#tasks.findIndex(v => v.uid == uid);
        this.#tasks[index].title = title;
        this.#tasks[index].description = description;
        this.#tasks[index].category = category;
        this.#tasks[index].due = due_date;
        this.#tasks[index].status = status;
    }
    deleteTask(uid){
        this.#tasks.splice((this.#tasks.findIndex(v => v.uid == uid)), 1);
    }
    markComplete(uid){
        const v = this.getTask(uid);
        this.updateTask(v.uid, v.title, v.description, v.category, v.due, "completed");
    }
    refresh(filter){
        tasklist.innerHTML = "";
        const filtered = this.#tasks
            .filter(v => filter?.title === undefined || filter?.title === "" || filter.title === v.title)
            .filter(v => filter?.category === undefined || filter?.category === "" || filter.category === v.category)
            .filter(v => filter?.status === undefined || filter?.status === "any" || filter.status === v.status);
        for (const task of filtered)
            tasklist.innerHTML += TaskCard(task.uid, task.title, task.description, task.category, task.due, task.status);
        const totalHolder = document.querySelector(".total");
        const completedHolder = document.querySelector(".completed");
        const pendingHolder = document.querySelector(".pending");
        const overdueHolder = document.querySelector(".overdue");
        const progressHolder = document.querySelector(".progress_");

        totalHolder.innerHTML = "Total: " + this.#tasks.length;
        completedHolder.innerHTML = "Completed: " + this.#tasks.filter(v => v.status === "completed").length;
        pendingHolder.innerHTML = "Pending: " + this.#tasks.filter(v => v.status === "pending").length;
        overdueHolder.innerHTML = "Overdue: " + this.#tasks.filter(v => v.status === "overdue").length;
        progressHolder.innerHTML = "Progress: " + (this.#tasks.length === 0? "No Task" : `${(this.#tasks.filter(v => v.status === "completed").length/this.#tasks.length) * 100}%`);
    }

    markOverdue(){
        const todayDate = new Date().getTime();
        this.#tasks.filter(v => new Date(v.due).getTime() < todayDate && v.status !== "completed").forEach(v => this.updateTask(v.uid, v.title, v.description, v.category, v.due, "overdue"));
    }
}

const cardHolder = document.getElementById("cardholder");

const modal = document.getElementById("form-create-new-task");
const create = document.getElementById("btn-create-new");


function TaskCard(uid, title, description, category, due_date, status){
    const tags = `<div class="card" style="width: 100%;"">
            <div class="card-body">
                <h5 class="card-title">${title}</h5>
                <p><strong>Category</strong>: ${category}</p>
                <p><strong>Status</strong>: ${status}</p>
                <p><strong>Due Date</strong>: ${new Date(due_date).toLocaleString()}</p>
                <p class="card-text">${description}</p>
                <a class="btn btn-primary" onclick="markComplete(${uid})">Mark Complete</a>
                <a class="btn btn-danger" onclick="deleteTask(${uid})">Delete</a>
            </div>
            </div>`;
return tags;
}

const title = modal.querySelector("#title");
const desc = modal.querySelector("#description");
const cat = modal.querySelector("#category");
const due = modal.querySelector("#due-date");
const stat = modal.querySelector("#status");

const taskManager = new Task;

function save(){
    taskManager.createTask(title.value, desc.value, cat.value, due.value || new Date().toJSON(), stat.value);
    taskManager.refresh(getFilter());
    title.value = "";
    desc.value = "";
    cat.value = "";
    due.value = "";
    stat.value = "pending";
};

function markComplete(uid){
    taskManager.markComplete(uid);
    taskManager.refresh(getFilter());
}

function deleteTask(uid){
    taskManager.deleteTask(uid);
    taskManager.refresh(getFilter());
}

function filter(){
    taskManager.refresh(getFilter());
}

function onRefresh(){
    taskManager.markOverdue();
    taskManager.refresh(getFilter());
}