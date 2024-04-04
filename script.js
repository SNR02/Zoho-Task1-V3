
const inputBox = document.querySelector(".task-title input");    
const textArea = document.querySelector(".task-description textarea");
const groups=document.querySelector(".group1"); //---------->> form elements


const availabilityList=document.querySelector(".avail-list");
const displayDiv=document.createElement("div");


const alertBox=document.querySelector(".page2");        //------>>> alert box refrences
const alertHeading=document.querySelector(".custom-alert1 h2");
const alertPara=document.querySelector(".alert-para1");

const deleteAllTasksAlert = document.querySelector(".custom-alert1");
const deleteTaskAlert = document.querySelector(".custom-alert2");


const busyTimings = {
    "john": {
        "2024-04-04": ["10am", "11am", "1pm", "2pm"],
        "2024-04-05": ["5am", "9am", "7pm", "10pm"],
        "2024-04-06": ["6am", "11am", "12pm", "1pm"]
    },
    "alice": {
        "2024-02-26": ["10am", "11am", "3pm"],
        "2024-02-27": ["8am", "1pm", "3pm"],
        "2024-02-28": ["10am", "12pm", "2pm"]
    },
    "bob": {
        "2024-02-26": ["12pm", "1pm", "2pm"],
        "2024-02-27": ["4am", "6am", "8pm"],
        "2024-02-28": ["9am", "10am", "11am"]
    },
    "jack": {
        "2024-02-26": ["11pm", "5pm", "9pm"],
        "2024-02-27": ["7am", "11am", "4pm"],
        "2024-02-28": ["11am", "4pm", "6pm"]
    }
};

var allTasks = JSON.parse(localStorage.getItem("allTasks")) || [];
allTasks.forEach(task => displayTaskAsCard(task));

var completedTasks=[];
var pendingTasks=[];

function fillArrays(){
    completedTasks=[];
    pendingTasks=[];
    if(allTasks){
        allTasks.forEach(task => {
            if(task.completed){
                completedTasks.push(task);
            }
            else{
                pendingTasks.push(task);
            }
        });
    }
}

fillArrays();



let newId=1;
if(allTasks.length>0){
    newId=allTasks[allTasks.length-1].id+1;
}
let taskIdCounter = newId;
console.log(taskIdCounter);

inputBox.addEventListener("change",function(){
    if(inputBox.value.trim()){
        inputBox.style.border="2px solid #81c3ff";
        if(textArea.value.trim()){
            textArea.style.border="2px solid #81c3ff";
        }
        else{
            textArea.style.border="2px solid black";
        }
        inputBox.style.boxShadow="0 .5rem 1rem rgb(129, 195, 255,.1)";
        document.querySelector(".error1").style.display="none"; 
    }
    else{
        inputBox.style.border="2px solid black";
    }
});


textArea.addEventListener("change",function(){
    if(textArea.value.trim()){
        textArea.style.border="2px solid #81c3ff";
        if(inputBox.value.trim()){
            inputBox.style.border="2px solid #81c3ff";
        }
        else{
            inputBox.style.border="2px solid black";
        }
        textArea.style.boxShadow="0 .5rem 1rem rgb(129, 195, 255,.1)";
        document.querySelector(".error1").style.display="none";
    }
    else{
        textArea.style.border="2px solid black";
    }
});


document.querySelector(".category").addEventListener("click", function(event) {

    if (event.target.tagName === "INPUT" && event.target.value === "remainders") {
        groups.style.display="flex";
    }
    else {
        groups.style.display="none";
    }
});


document.querySelector(".clear-form").addEventListener("click",function(){

    document.getElementById("myForm").reset();

    inputBox.style.border="2px solid black";
    textArea.style.border="2px solid black";
    document.querySelectorAll(".error").style.display="none";
});

document.querySelector(".clear-btn button").addEventListener("click", function() {

    displayAlertBox("This is non-revertable.!!!","Are you sure want to clear all the data.?" );
    availabilityList.innerHTML="";
    document.getElementById("myForm").reset();
    document.getElementById("persons").multiple=false;    
    document.querySelectorAll(".category label").forEach(span => span.classList.remove("category-active"));
    document.getElementById("act-notes").classList.add("category-active");
});

function displayAlertBox(str1,str2){

    alertHeading.innerHTML="";
    alertBox.style.display="flex";
    alertBox.style.zIndex="1";
    // alertBox.style.boxShadow = "10px 20px 30px 5000px rgba(228, 228, 225, 0.5)";
    deleteAllTasksAlert.style.boxShadow = "0 0 0 1000px rgba(0, 0, 0, .3)";    // ------->>> issue 1
    deleteAllTasksAlert.style.display="flex";
    deleteTaskAlert.style.display="none";

    alertHeading.innerHTML=str1;
    alertPara.innerHTML=str2;
}

function displayAlertBox2(taskItem,taskId){
    alertBox.style.display="flex";
    alertBox.style.zIndex="1";
    document.querySelector(".alert-heading2").innerHTML="Are you sure wanna delete this Task?";
    document.querySelector(".alert-para2").innerHTML="This task will be permanently deleted";
    deleteTaskAlert.style.boxShadow = "0 0 0 1000px rgba(0, 0, 0, .3)"; 
    deleteTaskAlert.style.display="flex";
    deleteAllTasksAlert.style.display="none";
    document.querySelector(".alert-button2").addEventListener("click",function(e){
        const alertBox=document.querySelector(".page2");
        if(e.target.classList.contains("okay2")){
            taskItem.remove(); 
            const taskIndex = allTasks.findIndex(task => task.id === taskId);
            if (taskIndex !== -1) {
                allTasks.splice(taskIndex, 1);
            }
            alertBox.style.display="none";
        }
        else{
            alertBox.style.display="none";
        }
     
    });    
}

document.getElementById("myForm").addEventListener("submit", function(e) {
    e.preventDefault();


    if (inputBox.value.trim() === "" && textArea.value.trim() === "") {
        inputBox.style.border="2px solid red";
        inputBox.style.boxShadow="0 .5rem 1rem rgb(255, 40, 40,.1)";
        textArea.style.border="2px solid red";
        textArea.style.boxShadow="0 .5rem 1rem rgb(255, 40, 40,.1)";
        document.querySelector(".error1").style.display="block";            
        return;

    }

    if(inputBox.value.trim().length>45){
        let temperror = document.querySelector(".error1");
        temperror.innerHTML="";
        temperror.innerHTML="Title cant be soo long...";
        temperror.style.display="block";
        // alert("Title cant be soo long...");
        return;
    }

    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    const category = data.category;
    const taskId = parseInt(document.getElementById("taskId").value);
    console.log(data);

    if(taskId){
        const taskIndex = allTasks.findIndex(task => task.id === taskId);
        if (taskIndex === -1) {
            console.error("Task not found.");
            return;
        }

        const previousCategory=allTasks[taskIndex].category;
        // Update task properties
        allTasks[taskIndex].title = data.title;
        allTasks[taskIndex].description = data.description;

        if(previousCategory==="remainders" && category==="notes"){
            delete allTasks[taskIndex].category;
            delete allTasks[taskIndex].meeting;
            delete allTasks[taskIndex].date;
            delete allTasks[taskIndex].time;
            delete allTasks[taskIndex].timeType;
            delete allTasks[taskIndex].persons;
        }
        this.reset();

        if(category==="remainders"){


            const persons = Array.from(formData.getAll("persons"));

            if (data.meeting == "personal" && persons.length == 0) {
                document.querySelector(".error2").style.display="block";
                document.querySelector(".person-select select").style.border="2px solid red";
                return;
            }

            if (data.meeting == "group" && persons.length <= 1) {
                let temperror=document.querySelector(".error2");
                temperror.innerHTML="Select at least 2 persons...";
                temperror.style.display="block";
                document.querySelector(".person-select select").style.border="2px solid red";
                return;
            }

            if (!data.date) {
                document.querySelector(".error3").style.display="block";
                document.querySelector(".date-pick input").style.border="2px solid red";
                return;
            }

            if (!data.time) {
                document.querySelector(".error4").style.display="block";
                document.querySelector("#time").style.border="2px solid red";
                return;
            }
            if (!data["am-pm"]) {
                let ap=document.querySelector(".error4")
                ap.style.display="block";
                ap.style.textAlign="right";
                document.querySelector(".#am-pm").style.border="2px solid red";
                return;
            }

            const hour = data.time;
            const timeType=data["am-pm"];
            const timeTypeL = timeType.toLowerCase();
            const mergedTime=hour+""+timeTypeL;
            const dateS=data.date.toString();

            let busyPeople=[];
            for(let i=0;i<persons.length;i++){
                
                let name=persons[i].toLowerCase();
                if(busyTimings[name].hasOwnProperty(dateS) && busyTimings[name][dateS].includes(mergedTime)){
                    busyPeople.push(persons[i]);
                }

            }

            if(busyPeople.length>0){
                const busyName=busyPeople[0].toLowerCase();
                
                availabilityList.innerHTML='';
                const ourBusyTimings=[];
                let personBusyTimings=[];
                if(persons.length==1){
                    personBusyTimings=busyTimings[busyName][dateS];
                }
                else{
                    for(let nam of persons){
                        personBusyTimings.push(busyTimings[nam.toLowerCase()][dateS]);
                    }
                    personBusyTimings=[...new Set(personBusyTimings.flat())];

                }
                allTasks.forEach(task=> {
                    if(task.date===data.date){
                        const tempTime=task.time.split(" ");
                        const tempHours=parseInt(tempTime[0],10);
                        ourBusyTimings.push(tempHours+""+task.timeType.toLowerCase());
                    }
                });

                const allTimeSlots = [];
                for (let hour = 4; hour <= 11; hour++) {
                    allTimeSlots.push(hour + "am");
                }
                for (let hour = 1; hour <= 10; hour++) {
                    allTimeSlots.push(hour + "pm");
                }

                const excludedTimings = [...ourBusyTimings, ...personBusyTimings];

                const freeTimings = allTimeSlots.filter(timeSlot => !excludedTimings.includes(timeSlot));
                displayDiv.innerHTML=`<h2><br>Oops... ${busyPeople} is busy at the selected time slot</h2><h3>Timings at ${persons} and you are free: </h3><p>${freeTimings.join(", ")}</p>`;
                availabilityList.appendChild(displayDiv);

                return;
            }

            allTasks[taskIndex].category = data.category;
            allTasks[taskIndex].meeting = data.meeting;
            allTasks[taskIndex].date = data.date;
            allTasks[taskIndex].time = data.time + " " + data["am-pm"];
            allTasks[taskIndex].timeType = data["am-pm"];
            allTasks[taskIndex].persons = Array.from(formData.getAll("persons"));
        }

        this.reset();
        fillArrays();
        storeTasks();
        document.getElementById("persons").multiple=false;
        groups.style.display="none"

        inputBox.style.border="1px solid black";
        textArea.style.border="1px solid black";

        document.querySelector(".error1").style.display="none";

        let temp=document.querySelector(".filters .active");
        filterTasks(temp.id);

        availabilityList.innerHTML="";

        document.getElementById("persons").multiple=false;
        
        document.querySelectorAll(".category label").forEach(span => span.classList.remove("category-active"));
        document.getElementById("act-notes").classList.add("category-active");

        inputBox.value = "";
        textArea.value = "";
    }

    else{
        console.log("No");

        if (category === "notes") {

            const task = {
                id: taskIdCounter++,  //  ---->> updated with Id
                title: data.title,
                description: data.description,
                category: category,
                completed: false
            };

            allTasks.push(task);
            displayTaskAsCard(task);
        } else if (category === "remainders") {

            const persons = Array.from(formData.getAll("persons"));

            if (data.meeting == "personal" && persons.length == 0) {
                document.querySelector(".error2").style.display="block";
                document.querySelector(".person-select select").style.border="2px solid red";
                return;
            }

            if (data.meeting == "group" && persons.length <= 1) {
                let temperror=document.querySelector(".error2");
                temperror.innerHTML="Select at least 2 persons...";
                temperror.style.display="block";
                document.querySelector(".person-select select").style.border="2px solid red";
                return;
            }

            if (!data.date) {
                document.querySelector(".error3").style.display="block";
                document.querySelector(".date-pick input").style.border="2px solid red";
                return;
            }

            if (!data.time) {
                document.querySelector(".error4").style.display="block";
                document.querySelector("#time").style.border="2px solid red";
                return;
            }
            if (!data["am-pm"]) {
                let ap=document.querySelector(".error4")
                ap.style.display="block";
                ap.style.textAlign="right";
                document.querySelector(".#am-pm").style.border="2px solid red";
                return;
            }

            const hour = data.time;
            const timeType=data["am-pm"];
            const timeTypeL = timeType.toLowerCase();
            const mergedTime=hour+""+timeTypeL;
            const dateS=data.date.toString();

            let busyPeople=[];
            for(let i=0;i<persons.length;i++){
                
                let name=persons[i].toLowerCase();
                if(busyTimings[name].hasOwnProperty(dateS) && busyTimings[name][dateS].includes(mergedTime)){
                    busyPeople.push(persons[i]);
                }

            }

            if(busyPeople.length>0){
                const busyName=busyPeople[0].toLowerCase();
                
                availabilityList.innerHTML='';
                const ourBusyTimings=[];
                let personBusyTimings=[];
                if(persons.length==1){
                    personBusyTimings=busyTimings[busyName][dateS];
                }
                else{
                    for(let nam of persons){
                        personBusyTimings.push(busyTimings[nam.toLowerCase()][dateS]);
                    }
                    personBusyTimings=[...new Set(personBusyTimings.flat())];

                }
                allTasks.forEach(task=> {
                    if(task.date===data.date){
                        const tempTime=task.time.split(" ");
                        const tempHours=parseInt(tempTime[0],10);
                        ourBusyTimings.push(tempHours+""+task.timeType.toLowerCase());
                    }
                });

                const allTimeSlots = [];
                for (let hour = 4; hour <= 11; hour++) {
                    allTimeSlots.push(hour + "am");
                }
                for (let hour = 1; hour <= 10; hour++) {
                    allTimeSlots.push(hour + "pm");
                }

                const excludedTimings = [...ourBusyTimings, ...personBusyTimings];

                const freeTimings = allTimeSlots.filter(timeSlot => !excludedTimings.includes(timeSlot));
                displayDiv.innerHTML=`<h2><br>Oops... ${busyPeople} is busy at the selected time slot</h2><h3>Timings at ${persons} and you are free: </h3><p>${freeTimings.join(", ")}</p>`;
                availabilityList.appendChild(displayDiv);

                return;
            }

            const people=[];
            const overlappingTask = allTasks.find(task => {
                if (task.category === "remainders" && task.date === data.date) {
                    
                    const taskTimeParts = task.time.split(":");
                    const taskHour = parseInt(taskTimeParts[0], 10).toString();
                    const tasktimeType = task.timeType;
                    
                    if((taskHour == hour) && timeType===tasktimeType){
                        console.log(task.persons);
                        people.push(task.persons);
                    }
                    
                    return (taskHour == hour) && timeType===tasktimeType;
                }
                return false;
            });


            if (overlappingTask) {
                const allPeople=people.join(",");
                availabilityList.innerHTML="";
                displayDiv.innerHTML="";
                displayDiv.innerHTML=`<br><h2>Another meeting is already scheduled for the same time on this date for ${allPeople}</h2>`;
                availabilityList.appendChild(displayDiv);
                return;
            }


            const task = {
                id: taskIdCounter++,  //  ---->> updated with Id
                title: data.title,
                description: data.description,
                category: category,
                meeting: data.meeting,
                date: data.date,
                time: data.time + " " + data["am-pm"],
                timeType:data["am-pm"],
                persons: persons,
                completed: false
            };

            allTasks.push(task);
            displayTaskAsCard(task);
        }
        this.reset();
        storeTasks();
        fillArrays();

        document.getElementById("persons").multiple=false;
        groups.style.display="none"

        inputBox.style.border="2px solid black";
        textArea.style.border="2px solid black";
        document.querySelector(".error1").style.display="none";

        let temp=document.querySelector(".filters .active");
        filterTasks(temp.id);

        availabilityList.innerHTML="";

        document.getElementById("persons").multiple=false;
        
        document.querySelectorAll(".category label").forEach(span => span.classList.remove("category-active"));
        document.getElementById("act-notes").classList.add("category-active");


    }

});



function storeTasks() {
    localStorage.setItem("allTasks", JSON.stringify(allTasks));
}


function displayTaskAsCard(task) {
    const card = document.createElement("li");
    card.classList.add("check");
    card.id=task.id;   //  ---->> updated with Id
    console.log(card.id);
    console.log(task.id);
    card.innerHTML = `
        <input type="checkbox">
        <div class="box-div">
        <div class="content">
            <h3>${task.title}</h3><br>
            ${task.description === '' ? '' : `<p><b>Description : </b><span class="taskDescription">${task.description}</span></p><br></br>`}
            ${task.category === "remainders" ? `
                    <div class="remainder-data"><p><b>Type : </b><span class="taskMeeting">${task.meeting} Meeting</span></p>
                    <p><b>Date: </b><span class="taskDate">${task.date}</span></p>
                    <p><b>Time: </b><span class="taskTime">${task.time}</span></p></div><br>
                    <p><b>Persons: </b><span class="taskPersons">${task.persons.join(", ")}</span></p>
                ` : ''}
        </div>
        </div>
        <span class="task-menu">
            <i class="fa fa-pencil edit-task" style="font-size:15px;color:blue"> Edit</i>
            <i class="fa fa-times remove-task" style="font-size:15px;color:red"> Delete</i>
        </span>
    `;

    console.log(card);

    const checkbox = card.querySelector("input[type='checkbox']");
    checkbox.checked = task.completed;

    checkbox.addEventListener("change", function(event) {

        // const taskIndex= Arrays.from(event.target.closest(".check").parentElement.children).index(event.target.closest(".check"));
        const checkedTask = event.target.closest(".check");  //  ---->> updated with Id
        const taskIndex=parseInt(checkedTask.id)
        console.log(taskIndex);
        console.log(typeof taskIndex)
        // allTasks[taskIndex].completed = event.target.checked;

        allTasks.forEach(task=> {
            console.log(task.id);
            console.log(typeof task.id)
            console.log(task.id===taskIndex);
            if(task.id===taskIndex){
                task.completed=event.target.checked;
            }
        });
        console.log(event.target.checked);
        if(event.target.checked){
            card.querySelector(".box-div").style.backgroundColor = "#ebffeb";
        }
        else{
            card.querySelector(".box-div").style.backgroundColor = "#ffb4c5";
        }
        fillArrays();
        storeTasks();
        let temp=document.querySelector(".filters .active");
        filterTasks(temp.id);  //---------->>> simple 
    });
    
    if (task.completed) {
        card.querySelector(".box-div").style.backgroundColor = "#ebffeb";
    } else {
        card.querySelector(".box-div").style.backgroundColor = "#ffb4c5";
    }
    document.querySelector(".display-box").appendChild(card);
}
console.log(allTasks);
document.querySelector(".display-box").addEventListener("click", function(event) {   // ----------------->>> when hit cross
    // if (event.target.classList.contains("remove-task")) {
        
    //     // const taskIndex= Arrays.from(event.target.closest(".check").parentElement.children).index(event.target.closest(".check"));
    //     const taskIndex = event.target.closest(".check").id;  //  ---->> updated with Id


    //     event.target.parentElement.remove();
    //     allTasks.splice(taskIndex,1);

    //     storeTasks();
    // }

    if(event.target.classList.contains("edit-task")){
        const taskItem = event.target.closest(".check");
        const taskId = parseInt(taskItem.id); 
        document.getElementById("taskId").value = taskId;

        const actRem =document.getElementById("act-rem");
        const actNotes=document.getElementById("act-notes");

        allTasks.forEach(task =>{
            if(taskId==task.id){
                inputBox.setAttribute('value',"");
                inputBox.setAttribute('value', task.title);
                // textArea.setAttribute('value',task.description);
                textArea.innerHTML="";
                textArea.innerHTML=task.description;
                document.querySelectorAll(".category label").forEach(span => span.classList.remove("category-active"));
                actNotes.classList.add("category-active");
                actNotes.checked=true;
                actRem.checked=false;

                groups.style.display="none";
                console.log(task.category);
                if(task.category === "remainders"){
                    document.querySelectorAll(".category label").forEach(span => span.classList.remove("category-active"));         
                    actRem.classList.add("category-active");
                    document.getElementById("remainders").checked=true;

                    groups.style.display="flex";
                    
                    if(task.meeting === "personal"){
                        document.getElementById("personal").checked = true;
                        document.getElementById("persons").multiple=false;
                        document.getElementById("persons").value = task.persons[0];
                    }
                    else{
                        document.getElementById("group").checked = true;
                        document.getElementById("persons").multiple=true;
                        let selectedPersons=task.persons;
                        const allPersons = document.getElementById("persons");
                        Array.from(allPersons.options).forEach(option => {
                            if (selectedPersons.includes(option.value)) {
                                option.selected = true;
                            }
                        });
                    }

                    console.log(task.time);
                    document.querySelector(".date-pick input").setAttribute('value',task.date);
                    let taskTimeParts = task.time.split(":");
                    let taskHour = parseInt(taskTimeParts[0], 10).toString();
                    document.getElementById("times").value=taskHour;
                    document.getElementById("am-pm").value=task.timeType;
                }
                return;
                
            }
        });
    }

    if (event.target.classList.contains("remove-task")) {
        const taskItem = event.target.closest(".check");
        const taskId = parseInt(taskItem.id);
        displayAlertBox2(taskItem,taskId);

        fillArrays();
        storeTasks();
    }
});


document.querySelector(".filters").addEventListener("click", function(event) {
    if (event.target.tagName === "SPAN") {
        document.querySelectorAll(".filters span").forEach(span => span.classList.remove("active"));
        event.target.classList.add("active");
        filterTasks(event.target.id);
    }
});

// function filterTasks(filter) { //ok
//     const tasks = document.querySelectorAll(".display-box li");
//     tasks.forEach(task => {
//         switch (filter) {
//             case "upcoming":
//                 task.style.display = task.querySelector("input").checked ? "none" : "flex";
//                 break;
//             case "completed":
//                 task.style.display = task.querySelector("input").checked ? "flex" : "none";
//                 break;
//             default:
//                 task.style.display = "flex";
//         }
//     });
// }

function filterTasks(filter){
    const taskBox=document.querySelector(".display-box");
    if(filter === "upcoming"){
        taskBox.innerHTML="";
        pendingTasks.forEach(task =>{
            displayTaskAsCard(task);
        });
    }
    else if(filter === "completed"){
        taskBox.innerHTML="";
        completedTasks.forEach(task => {
            displayTaskAsCard(task);
        });
    }
    else{
        taskBox.innerHTML="";
        allTasks.forEach(task => {
            displayTaskAsCard(task);
        });
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const dtToday = new Date();
    const month = (dtToday.getMonth() + 1).toString().padStart(2, '0');
    const day = dtToday.getDate().toString().padStart(2, '0');
    const year = dtToday.getFullYear();

    const maxDate = `${year}-${month}-${day}`;

    const dateInput = document.getElementById('date');
    dateInput.setAttribute('min', maxDate);
});

// new changes here date :- 2/19/2023
document.querySelector(".meeting").addEventListener("click", function(event){
    document.querySelector(".error2").style.display="none";
    if(event.target.value==="personal"){
        document.getElementById("persons").multiple=false;
    }
    else{
        document.getElementById("persons").multiple=true;
    }
});

document.querySelector(".person-select select").addEventListener("change",function(){
    document.querySelector(".error2").style.display="none";
    document.querySelector(".person-select select").style.border="2px solid black";

});

document.querySelector(".date-pick input").addEventListener("change",function(){
    document.querySelector(".error3").style.display="none";
    document.querySelector(".date-pick input").style.border="2px solid black";
});

document.getElementById("times").addEventListener("change",function(){
    document.querySelector(".error4").style.display="none";
    document.getElementById("times").style.border="2px solid black";
});

document.getElementById("times").addEventListener("change",function(){
    document.querySelector(".error4").style.display="none";
    document.querySelector("#am-pm").style.border="2px solid black";
});


document.querySelector(".alert-button1").addEventListener("click",function(e){
    // const alertBox=document.querySelector(".custom-alert");
    const alertBox=document.querySelector(".page2");
    console.log(e.target.classList.contains("okay1"));
    const taskList = document.querySelector(".display-box");
    if(e.target.classList.contains("okay1")){
        taskList.innerHTML = "";
        localStorage.clear();
        allTasks=[];
        alertBox.style.display="none";
        fillArrays();
    }
    else{
        alertBox.style.display="none";
    }
    
});


//new changes here date :- 3/19/2023
/* SCROLL UP,  added the border red to invalid inputbox and textareas
Filters are getting dynamically updated
hidding the group1 form elements after hitting submit
custome alerts
*/ 

document.querySelector(".category").addEventListener("click", function(event) {
    if (event.target.tagName === "LABEL") {
        document.querySelectorAll(".category label").forEach(span => span.classList.remove("category-active"));
        event.target.classList.add("category-active");
    }
});
