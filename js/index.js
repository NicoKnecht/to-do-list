const taskInput = document.querySelector('#taskInput');
const taskButton = document.querySelector('#taskBtn');
const tasksContainer = document.querySelector('.peddingTasks');//ul



const list = [];
let counter = 0;

if (list.length == 0) {
    let initialSentence = `<p class="withoutTasks">  ¡Comienza a ingresar tus tareas y no te olvides nada esta semana! :D</p> `;
    tasksContainer.innerHTML = initialSentence;
}


//evento click ( button) AGREGAR
taskButton.addEventListener('click', function () {
    add(taskInput.value); //con el valor de input y un contador, llena el array de obj list
    render();//func render usa parametro array obj List, previamente llenado por func ADD

    taskInput.value = "";// limpia imput
})

//evento enter AGREGAR
taskInput.addEventListener("keydown", function (event) {
    if (event.keyCode == 13) {
        add(taskInput.value);
        render();

        taskInput.value = "";
    }

});

// evento clcik( button delete)  REMOVER
tasksContainer.addEventListener('click', function (event) {
    if (event.target.className == "fas fa-trash-alt") {
        let id = event.target.dataset.id;

        remove(id); // le pasamos el id a "remove" para que saque ese objeto del array LIST
        resetIdCounter();// reinicio counter id// CADA VEZ QUE SE BORRA UNA, SE ORDENAN LOS ID OTRA VEZ
        render();// vuelvo a renderizar el array sin ese objeto y con el counter id reiniciado para todos los objetos del array(incluso los viejos)
    }

})

// evento clcik( button edit)  Editar
tasksContainer.addEventListener('click', function (e) {

    edit(e);
})



const add = (task) => {
    if (task !== "") {
        list.push({ id: counter, title: task });//Ingreso contador y task en el array LIST
        counter++;

    }
}

const remove = (id) => {

    let index = list.findIndex(tasks => tasks.id == id); // metodo de iteracion fidIndex busca indice que cumpla la condicion
    if (index !== -1) {// si no lo encuentra
        list.splice(index, 1); // borramos objeto del array con es indice
    }
}

const edit = (event) => {
    if (event.target.className == "far fa-edit") {// nos aseguramos que este apretando la imagen edit del boton
        let id = event.target.dataset.id; // agarro el id  conatdor de dataset del boton
        let inputText = document.getElementById(id); // selecciono el input con el id
        let labelText = document.getElementById("label" + id); // selecciono el label con el id mas una palabra( para poder usar siempre el mismo id)


        if (inputText.type == "checkbox") {
            labelText.style.display = "none";/* desaparesco de pantalla lo escrito en el label
            luego ,al renderizar, el valor del input pasara al label*/

            inputText.classList.add("taskInputEdit");/* agrego clase que se manifestara  con input text
            NO hace falta sacar la clase. Se elimina cuando se vuelve a renderizar el input ya que esta clase
            no se encuentra en el template original*/
            inputText.type = "text";
            let index = list.findIndex(tasks => tasks.id == id);// agarro index del array List
            inputText.value = list[index].title;// paso el valor que ya habia al input para que se visualice



            inputText.addEventListener('change', function () {// cuando toco el input, puedo cambiar el valor, luego al desacer foco queda el valor en el label y en el array
                list[index].title = inputText.value;
                inputText.type = "checkbox";
                render();
            })

        } else {
            render();/*si vuelvo a apretar el boton edit, como el IF ya se ejecuto y cambio el
                input a text, NO SE VOLVERA A EJECUTAR y pasara al else
                El else rjrcuta el render  volviendo todo a la normalidad( y el input a checkbox por lo que el IF se podra volver a ejecutar
                    
                OJO!, ESTO PASA SI NO EDITO NADA. SI EDITO ALGO YA SE DISPARA EL EVENTO ONCHANGE 
                Y RENDERIZA DESDE AHI DENTRO    */
        }
    }
}


const resetIdCounter = () => {
    counter = 0;
    list.forEach(idCounter => {
        idCounter.id = counter;
        counter++;
    })

}

const template = (task) => {


    return `
                        <li class="taskList" >
                            <div class="checkYtextWrapper">
                                <input class="taskCheckbox " id="${task.id}" type="checkbox">
                                <label class="taskText "  id="label${task.id}"  >${task.title}</label>
                            </div>
                            <div class="buttonWrapper">
                                <button class="btnEdit" ><i class="far fa-edit" data-id="${task.id}"></i></button>
                                <button class="btnDelete"  ><i  class="fas fa-trash-alt" data-id="${task.id}"></i></button>
                            </div>
                        <li>
                        `;
    // solucionar vulnerabilidad xss 
}

const renderWithoutTasks = () => {
    let InitialTemplate = `<p class="withoutTasks"> No hay tareas pendientes ¿seguro no te olvidaste de nada? ;D</p> `
    tasksContainer.innerHTML = InitialTemplate;

}
const render = () => {

    if (list.length == 0) {
        renderWithoutTasks()
    } else {
        let output = list.map(template)//genera array con templates
        /*El map agarra el array de objetos LIST y le aplica la funcion TEMPLATE 
        es decir, que en cada iteracion mete cada objeto de List dentro del template
        luego se aplica un join('') para que no se visualice la coma entre objeto y objeto(solo por eso)*/
        tasksContainer.innerHTML = output.join("");
    }
}


