let addBtn = document.querySelector('.add-btn');
let modalCont = document.querySelector('.modal-cont');
let allPriorityColors = document.querySelectorAll('.main-color')
let modalPriorityColor = 'lightpink'
let textAreaCont = document.querySelector('.textArea-cont')
let mainCont = document.querySelector('.main-cont')
let removeBtn = document.querySelector('.delete-btn')
let toolboxColors = document.querySelectorAll('.color')

let addTaskFlag = false;
let removeTaskFlag = false;
let lockIconClass = 'fa-lock'
let unlockIconClass = 'fa-lock-open'
let colors = ['lightpink', 'lightgreen', 'lightblue', 'black']
let ticketArray = []  // --> To store vital info of all tickets



addBtn.addEventListener('click', function(event){
    addTaskFlag = !addTaskFlag;
    if (addTaskFlag == true){
        //Show
        modalCont.style.display = 'flex'
    }else {
        //Hide
        modalCont.style.display = 'none'
    }
})

// Selecting Ticket Color
allPriorityColors.forEach(function(colorEle){
    colorEle.addEventListener('click', function(event){  //Traditional Style
        // Step 1 - Remove active class from Pre-existing divs
        allPriorityColors.forEach(priorityColor => { // Arrow Fuction style
            priorityColor.classList.remove('active')

        })

        // Step 2 - Add active class to clicked div
        colorEle.classList.add('active')
        modalPriorityColor = colorEle.classList[0]
        
    })
})

// Ticket Creation

modalCont.addEventListener('keydown', event => {
    let keyPressed = event.key // This will give the value of the Key pressed 
    
    if (keyPressed === 'Control'){
        // Create Ticket else no action required
        let ticketDesc = textAreaCont.value
        let ticketId = shortid()
        createTicket(modalPriorityColor, ticketDesc)

        // close modal once textArea is filled and shift is pressed 
        modalCont.style.display = 'none'
        addTaskFlag = !addTaskFlag

        // Clear the text area - everytime the add button is clicked
        textAreaCont.value = ''

    }else {
        // do nothing
    }
})

function createTicket(ticketColor, ticketDesc, ticketId){
    // Dynamically Creating the ticket container and Divs
    let id = ticketId || shortid()

    let ticketCont = document.createElement('div')
    
    ticketCont.classList.add('ticket-cont')

    ticketCont.innerHTML = `<div class="ticket-color ${ticketColor}" ></div><div class="ticket-id">${id}</div><div class="task-area">${ticketDesc}</div></div><div class="ticket-lock"><i class="fa-solid fa-lock"></i></div>`

    mainCont.appendChild(ticketCont);

    // maintaining a ticket data
    // Creating an object

    // let ticketMetadata = {
    //     "ticketColor": ticketColor,
    //     "ticketId": ticketId,                    //Old method of creating Objects 
    //     "ticketDesc": ticketDesc
    // }

    let ticketMetadata = {
        ticketColor,
        ticketId: id,                                  // Alternate method of creating objects  
        ticketDesc
    }

    
    //***  If freshly creeated tickets
    //Only then push the tickets
    //otherwise, dont push (case of duplicate tickets)
    if (!ticketId){
        ticketArray.push(ticketMetadata) // To keep updating the ticketArray and keeping a list for further use
    }
    
    handleRemove(ticketCont)

    handleLock(ticketCont)

    handleColor(ticketCont)
}

//Selecting Remove Btn
removeBtn.addEventListener('click', (event) => {
    removeTaskFlag = !removeTaskFlag

    if (removeTaskFlag == true){
        // show alert
        alert("Delete mode is activated")
        // change icon color to red
        removeBtn.style.color = 'red'
    }else {
        //Change icon color to white
        removeBtn.style.color = 'white'
    }
})


//Adding Remove Feature   
function handleRemove(ticket){
    ticket.addEventListener('click', event =>{
        if (removeTaskFlag){    // same as ---> (removeTaskFlag == true)
            
            //removing to be deleted ticket from ticketArray first
            let ticketId = ticket.children[1].innerText
            let ticketIndex = ticketArray.findIndex(t =>{
                return t.ticketId == ticketId
            })
            ticketArray.splice(ticketIndex, 1)

            //remove ticket - ui removal
            // ticket.style.display = 'none'  -->  This will not delete the div from the HTML file but will just stop diplaying
            ticket.remove();

        }else {
            // do nothing
        }
    })
}

//Lock and unlock feature
function handleLock(ticket){
    let ticketLockEle = ticket.querySelector('.ticket-lock')

    let ticketLockIcon = ticketLockEle.children[0]

    let taskArea = ticket.querySelector('.task-area')

    ticketLockIcon.addEventListener('click', () => {
        if(ticketLockIcon.classList.contains(lockIconClass)){
            //remove locked class
            ticketLockIcon.classList.remove(lockIconClass)
            //add unlocked class
            ticketLockIcon.classList.add(unlockIconClass)
            //make the ticket editable 
            taskArea.setAttribute('contenteditable', 'true')
        }else{
            //remove unlocked class
            ticketLockIcon.classList.remove(unlockIconClass)
            //add locked class
            ticketLockIcon.classList.add(lockIconClass)
            //make the ticket uneditable 
            taskArea.setAttribute('contenteditable', 'false')
        }

        //updating ticketArray state with newly edited text
        let ticketId = ticket.children[1].innerText

        ticketArray.forEach( t => {
            if (t.ticketId == ticketId){
                t.ticketDesc = taskArea.innerText
            }
        })
    })
}

//change ticket priority 
function handleColor(ticket){
    let ticketColorBand = ticket.querySelector('.ticket-color')

    ticketColorBand.addEventListener('click', (event) => {
        let currentColor = ticketColorBand.classList[1] //derived from line 72 - ticketCont.innerHTML line

        let currentColorIndex = colors.findIndex(color => {
            return color == currentColor
        })
        currentColorIndex++;

        let newColorIndex = currentColorIndex % colors.length // Logic is to contain the index count within length of Colors Array--> As there can be multiple clicks so maintainig counters is not feasible 
        let newColor = colors [newColorIndex]

        //remove current color
        ticketColorBand.classList.remove(currentColor)
        // add new color
        ticketColorBand.classList.add(newColor)

        //updating ticketArray state with newly edited color

        // let ticketId = ticket.children[1].innerText

        ticketArray.forEach(t => {
            if (t.ticketId == ticketId){
                t.ticketColor = newColor
            }
        })
    })
}

//implementing filter 
// color based already done - Using a array based approach to recreate the selection and operate upon

toolboxColors.forEach(toolboxColor => {
    toolboxColor.addEventListener('click', () => {
        let selectedToolboxColor = toolboxColor.classList[0]

        let filteredTickets = ticketArray.filter(ticket => {
            return selectedToolboxColor == ticket.ticketColor
        })

        //remove all tickets
        let allTickets = document.querySelectorAll('.ticket-cont')
        allTickets.forEach(ticket => {
            ticket.remove();
        })

        //recreate tickets within filtered array

        filteredTickets.forEach(filteredTicket => {
            createTicket(filteredTicket.ticketColor, filteredTicket.ticketId, filteredTicket.ticketDesc)
        })
    })

    toolboxColor.addEventListener('dblclick', () => {
        // remove all tickets from DOM 
        let allTickets = document.querySelectorAll('.ticket-cont')
        allTickets.forEach(ticket => {
            ticket.remove();
        })
        // create all tickets from ticket Array
        ticketArray.forEach(ticket => {
            createTicket(ticket.ticketColor, ticket.ticketId, ticket.ticketDesc)
        })
    })
})