"use strict";

// js/_dom_elements.js

var all_elements = []; 

var Element = function (name, filetype, position, parent) {
    this.name = name;
    this.filetype = filetype;
    this.position = position;
    this.parent = parent;
}; 

list.addEventListener('click', function (event) {

    var li_element = event.target.parentNode;
    var name = li_element.firstChild.textContent.split(':')[0];

    // Switching between different options (delete, edit, add)
    switch(event.target.className) {

        case 'delete':

            clearOptionsForm(deleteForm);
            closeModals();

            deleteForm.classList.add('show-modal');

            deleteForm.addEventListener('submit', function(e) {
                e.preventDefault();
                removeElement(all_elements, li_element, name);
                clearOptionsForm(deleteForm);
            })

            break;
        
        case 'edit':

            clearOptionsForm(editForm);
            closeModals();

            editForm.classList.add('show-modal');

            editForm.addEventListener('submit', function(e) {
                e.preventDefault();
                editElement(li_element, editFormInput.value);
                clearOptionsForm(editForm);
            })

            break;
        
        case 'add':

            clearOptionsForm(deleteForm);
            closeModals();

            addForm.classList.add('show-modal');

            addForm.addEventListener('submit', function(e) {
                e.preventDefault();

                var type;
                optionFile.checked ? type = optionFile.value : type = optionFolder.value;

                var name = addFormInput.value;

                if (!name || name === '' || (name.indexOf(' ') >= 0)) {
                    constructInfoModal('Invalid name, try without spaces');
                } else {
                    addElement('nested', li_element, type, name);
                }

                clearOptionsForm(addForm);
            })

            break;
        
        default:
            break;
    }
})

addOutsideForm.addEventListener('submit', function(e) {
    e.preventDefault(); 
    
    var type;
    addOutsideoptionFile.checked ? type = addOutsideoptionFile.value : type = addOutsideoptionFolder.value;

    var name = addOutsideFormInput.value;

    if (!name || name === '' || (name.indexOf(' ') >= 0)) {
        constructInfoModal('Invalid name, try without spaces');
    } else {
        addElement('top-level', 'none', type, name);
    }

    clearOutsideAddForm();
})

displayElements.addEventListener('click', function () {
    return all_elements.length === 0 ? console.log('Array is empty') : console.log(sorted_elements);
})

deleteElements.addEventListener('click', function () {
    all_elements = [];

    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }

    constructInfoModal('Deleted');
})

closeEditForm.addEventListener('click', function () {
    return clearOptionsForm(editForm);
})

closeDeleteForm.addEventListener('click', function () {
    return clearOptionsForm(deleteForm);
})

closeAddForm.addEventListener('click', function () {
    return clearOptionsForm(addForm);
})

function addElement(status, parent, type, name) {

    var element_text = document.createTextNode("".concat(name, ":").concat(type));
    var element_li = document.createElement('li');
    var element_li_p = document.createElement('p'); 
    
    var element_li_p_delete = document.createElement('p');
    var element_li_p_edit = document.createElement('p');
    var element_li_p_add = document.createElement('p'); 
    
    element_li_p.classList.add('element-name');
    element_li_p_delete.classList.add('delete');
    element_li_p_edit.classList.add('edit');
    element_li_p_add.classList.add('add'); 
    
    element_li_p.appendChild(element_text); 
    
    element_li.appendChild(element_li_p);
    element_li.appendChild(element_li_p_delete);
    element_li.appendChild(element_li_p_edit);

    if (type !== 'file') {
        element_li.appendChild(element_li_p_add);
        element_li.classList.add('folder-css');
    } else {
        element_li.classList.add('file-css');
    }

    if (status === 'top-level') {

        list.appendChild(element_li);

        var array_item = new Element(name, type, 'top-level', 'none');
        all_elements.push(array_item);

    } else {

        var element_parent = parent;
        var element_parent_name = element_parent.firstChild.textContent;

        element_parent.appendChild(element_li);

        var array_item = new Element(name, type, 'nested', element_parent_name);
        all_elements.push(array_item);

        element_li.classList.add('child-css');
    }

}

function editElement(element, new_text) {

    if (element.classList.contains('folder-css') && element.children.length > 4) {
        constructInfoModal('Element is immutable, has children inside');
    } else {
        var postfix;
        element.classList.contains('folder-css') ? postfix = ':folder' : postfix = ':file';

        if (!new_text || new_text === '' || (new_text.indexOf(' ') >= 0) || new_text == undefined) {
            constructInfoModal('Invalid name');
        } else {
            var element_new_name_full = "".concat(new_text).concat(postfix);

            all_elements.forEach(function (element_in_array) {
                if (element.firstChild.textContent === "".concat(element_in_array.name, ":").concat(element_in_array.filetype)) {
                    element_in_array.name = new_text;
                }
            });

            element.firstChild.textContent = element_new_name_full;
            constructInfoModal('Name has changed');
        }
    }
} 

function removeElement(all_elements, element, text) {

    for (var i = 0; i < all_elements.length; i++) {
        if (all_elements[i].name === text) {
            for (var j = 0; j < all_elements.length; j++) {

                if ("".concat(all_elements[i].name, ":folder") === all_elements[j].parent) {
                    constructInfoModal('Element is unremovable, has children inside');
                    return;
                }
            }

            element.remove(); 

            all_elements.splice(i, 1);
            constructInfoModal('Element deleted');
        }
    }
}

function constructInfoModal(message) {
    modal.classList.add('show-modal');
    modalSubject.textContent = message;
    setTimeout(function () {
        return modal.classList.remove('show-modal');
    }, 1300);
}

function clearOptionsForm(form) {
    form.reset();
    form.classList.remove('show-modal');
} 

function clearOutsideAddForm() {
    addOutsideForm.reset();
    addOutsideFormInput.value = '';
} 

function closeModals() {
    deleteForm.classList.remove('show-modal');
    editForm.classList.remove('show-modal');
    addForm.classList.remove('show-modal');
} 

(function () {
    addElement('top-level', 'none', 'folder', 'images');
    addElement('top-level', 'none', 'folder', 'styles');
})();