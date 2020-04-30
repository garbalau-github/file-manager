$(document).ready(function () {
    // Array with all elements
    var all_elements = []

    // Element constructor
    var Element = function (name, filetype, position, parent) {
        this.name = name
        this.filetype = filetype
        this.position = position
        this.parent = parent
    }

    // UL listener
    $('#list').click(function (event) {
        // Get main LI elements from click
        var li_element = event.target.parentNode
        var name = li_element.firstChild.textContent.split(':')[0]
        // Listener for LI options
        switch(event.target.className) {
            case 'delete' :
                closeModals()
                $('#delete-modal-form').addClass('show-modal')
                $('#delete-modal-form').submit(function (e) {
                    e.preventDefault()
                    removeElement(all_elements, li_element, name)
                    closeModals()
                })
                break
            case 'edit' :
                closeModals()
                setTimeout(function () {
                    $('#edit-modal-form').addClass('show-modal')
                    // Get the old name
                    $('#edit-modal-form-input').val(name)
                }, 100)
                $('#edit-modal-form')[0].onsubmit = function (e) {
                    e.preventDefault()
                    // Send new name
                    editElement(li_element, $('#edit-modal-form-input').val())
                    closeModals()
                }
                break
            case 'add' :
                closeModals()
                setTimeout(function () {
                    $('#add-modal-form').addClass('show-modal')
                }, 100)
                $('#add-modal-form')[0].onsubmit = function (e) {
                    e.preventDefault();
                    var type;
                    // Get the checkbox value
                    if ( $('#radio-file').is(':checked') ) {
                        type = $('#radio-file').val()
                    } else {
                        type = $('#radio-folder').val();
                    }
                    var name = $('#add-modal-form-input').val();
                    var result = validateName(name);
                    if (result) {
                        addElement('nested', li_element, type, name)
                    }
                    closeModals()
                }
                break
            default : 
                break
        }
    })

    // Outside form element creator
    $('#outside-element-create').submit(function (e) {
        e.preventDefault()
        // Validate type
        var type
        $('#radio-file-outside').is(':checked') ? 
            type = $('#radio-file-outside').val() : type = $('#radio-folder-outside').val()
        // Validate name
        var name = $('#outside-element-input').val()
        var result = validateName(name)
            if (result) addElement('top-level', 'none', type, name) 
        // Clean inputs
        $('#outside-element-input').val('')
        $('#outside-element-create').trigger('reset')
    })

    // Display all elements in console
    $('#display-all-elements').click(function () {
        // Check if elements exist in array
        all_elements.length < 1 ?
            constructInfoModal('Array is empty') : console.log(all_elements)
    })

    // Delete every element from array / UI
    $('#delete-all-elements').click(function () {
        // Delete from array
        all_elements = []
        // Delet from UI
        $('#list').empty()
        constructInfoModal('Everything is deleted')
    })

    // General add function
    function addElement (status, parent, type, name) {
        // Create basic structure of elements
        var element_text = document.createTextNode("".concat(name, ":").concat(type))
        var element_li = document.createElement('li')
        var element_li_p = document.createElement('p')
        var element_li_p_delete = document.createElement('p')
        var element_li_p_edit = document.createElement('p')
        var element_li_p_add = document.createElement('p')
        // Set elements classses
        element_li_p.classList.add('element-name')
        element_li_p_delete.classList.add('delete')
        element_li_p_edit.classList.add('edit')
        element_li_p_add.classList.add('add')
        // Append items to DOM
        element_li_p.appendChild(element_text)
        element_li.appendChild(element_li_p)
        element_li.appendChild(element_li_p_delete)
        element_li.appendChild(element_li_p_edit)
        // Check for given type
        if (type !== 'file') {
            element_li.appendChild(element_li_p_add)
            element_li.classList.add('folder-css')
        } else {
            element_li.classList.add('file-css')
        }
        // Check for given element status
        if (status === 'top-level') {
            // Add element to DOM
            $('#list').append(element_li)
            // Add element to array
            var array_item = new Element(name, type, 'top-level', 'none')
            all_elements.push(array_item)
        } else {
            element_li.classList.add('child-css')
            // Set elements parent
            var element_parent = parent
            var element_parent_name = element_parent.firstChild.textContent
            // Add element to DOM parent
            element_parent.appendChild(element_li)
            // Add element to array
            var array_item = new Element(name, type, 'nested', element_parent_name)
            all_elements.push(array_item)
        }
    }
    
    // Edit function
    function editElement (element, new_text) {
        if (element.classList.contains('folder-css') && element.children.length > 4) {
            constructInfoModal('Cannot edit element, if it has children inside')
        } else {
            var postfix
            element.classList.contains('folder-css') ? postfix = ':folder' : postfix = ':file'
            switch (true) {
                case new_text === '' :
                    constructInfoModal('No name given')
                    break
                case !new_text :
                    constructInfoModal('Invalid name')
                    break
                case new_text.indexOf(' ') >= 0 :
                    constructInfoModal('Avoid spaces in a name, please')
                    break
                case !(new_text.indexOf(' ') >= 0) :
                    var element_new_name_full = "".concat(new_text).concat(postfix)
                    all_elements.forEach(function (element_in_array) {
                        // If names are the same
                        if (element.firstChild.textContent === "".concat(element_in_array.name, ":").concat(element_in_array.filetype)) {
                            element_in_array.name = new_text
                        }
                    });
                    element.firstChild.textContent = element_new_name_full
                    break
                default :
                    break
            }
        }
    } 
    
    // Delete element function
    function removeElement (all_elements, element, text) {
        for (var i = 0; i < all_elements.length; i++) {
            if (all_elements[i].name === text) {
                for (var j = 0; j < all_elements.length; j++) {
                    // If names are the same
                    if ("".concat(all_elements[i].name, ":folder") === all_elements[j].parent) {
                        constructInfoModal('Element has childrens or has duplicate name, change it, and try again')
                        return
                    }
                }
                element.remove()
                all_elements.splice(i, 1)
            }
        }
    }

    // Validate name function
    function validateName (name) {
        return (!name || name === '' || (name.indexOf(' ') >= 0)) ? 
            constructInfoModal('Invalid name') : true
    }
    
    // Modal constructor function
    function constructInfoModal (message) {
        $('#info-modal').addClass('show-modal')
        $('#info-modal__subject').text(message)
        setTimeout(function () {
            $('#info-modal').removeClass('show-modal')
        }, 2000)
    };
    
    // Close all modals / reset forms function
    function closeModals () {
        forms = [
            $('#delete-modal-form'), 
            $('#edit-modal-form'), 
            $('#add-modal-form')
        ]
        for (var i = 0; i < forms.length; i++) {
            forms[i].trigger('reset')
            forms[i].removeClass('show-modal')
        }
    }

    // Close button on forms event
    var modalCloseButtons = [$('#edit-button-close'), $('#delete-button-close'), $('#add-button-close')]
    for (var i = 0; i < modalCloseButtons.length; i++) {
        modalCloseButtons[i].click(function () {
            constructInfoModal('Operation canceled')
            closeModals()
        })
    }
    
    // Auto-generate some elements
    (function basicTemplate () {
        addElement('top-level', 'none', 'folder', 'css')
        addElement('top-level', 'none', 'folder', 'img')
        addElement('top-level', 'none', 'file', 'main.js')
    })();
})