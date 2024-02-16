let addBtn = document.querySelector('.add-btn');
let modalCont = document.querySelector('.modal-cont');
let allPriorityColors = document.querySelectorAll('.main-color')
let modalPriorityColor = 'lightpink'
let textAreaCont = document.querySelector('.textArea-cont')
let mainCont = document.querySelector('.main-cont')

let addTaskFlag = false;

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
    
    if (keyPressed === 'Shift'){
        // Create Ticket else no action required
        let ticketDesc = textAreaCont.value
        let ticketId = shortid()
        createTicket(modalPriorityColor,ticketId, ticketDesc)

        // close modal once textArea is filled and shift is pressed 
        modalCont.style.display = 'none'
        addTaskFlag = !addTaskFlag

        // Clear the text area - everytime the add button is clicked
        textAreaCont.value = ''

    }
})

function createTicket (ticketColor, ticketId, ticketDesc){
    // Dynamically Creating the ticket container and Divs
    let ticketCont = document.createElement('div')

    ticketCont.classList.add('ticket-cont')

    ticketCont.innerHTML = `<div class="ticket-color ${ticketColor}" ></div><div class="ticket-id">${ticketId}</div><div class="task-area">${ticketDesc}</div></div>`

    mainCont.appendChild(ticketCont);
}