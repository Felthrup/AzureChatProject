$(function(){
    //make connection
    let socket = io.connect("http://localhost:3000");  // io available from the socket.io library

    var element = function(id) {
        return document.getElementById(id);
    }

    // get elements
    var status = element('status');
    var messages = element('messages');
    var textarea = element('textarea');
    var clearBtn = element('clear');
    var username = element('username');

    // Set default Status
    var statusDefault = status.textContent; // starts out blank

    var setStatus = function(s) {
        status.textContent = s;

        if (s !== statusDefault) {
            var delay = setTimeout(() => {
                setStatus(statusDefault);  // reset to default  
            }, 4000); // ms delay time
        }
    }

    // Ensure connected
    if (socket !== undefined) {
        console.log('Connected to chat server');
        
        // hook to emits tagged 'output'
        socket.on('output', (data) => {
            console.log("Msg recieved from server");
            console.log(data); 
            if (data.length) {
                for (var x = 0; x < data.length; x++) {
                    // Build out message div
                    var message = document.createElement('div');
                    message.setAttribute('class', 'chat-message');
                    message.textContent = data[x].name + ": " + data[x].message; 
                    messages.appendChild(message);
                    messages.insertBefore(message, messages.firstChild);
                }
            }   
        }); 

        // hook to emits tagged 'status'
        socket.on('status', (data) => {
            // get message status
            setStatus((typeof data === 'object')? data.message : data);
            
            // if status is clear, clear text
            if (data.clear) {
                textarea.value = '';    
            }
        });

        // Handle input
        textarea.addEventListener('keydown', (event) => {
            if (event.which === 13 && event.shiftKey == false) { // if user hits return or enter
                // Send textfield data to server
                console.log('Enter press detected..');
                console.log(username.value + ', ' + textarea.value);
                socket.emit('input', {
                    name: username.value,
                    message: textarea.value
                });

                event.preventDefault();
            } 
        });

        // Handle chat clear
        clearBtn.addEventListener('click', () => {
            socket.emit('clear');
        });

        // Clear message
        socket.on('cleared', () => {
            messages.textContent = '';
        });
    }

});