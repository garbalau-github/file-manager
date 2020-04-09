// Basic DOM Elements and buttons
const list = document.getElementById('list');
const createFile = document.getElementById('create-file-element');
const createFolder = document.getElementById('create-folder-element');
const displayElements = document.getElementById('display-all-elements');
const deleteElements = document.getElementById('delete-all-elements');

// Simple modal window
const modal = document.getElementById('info-modal');
const modalSubject = document.getElementById('info-modal__subject');

// Modal for edit
const editForm = document.getElementById('edit-modal-form');
const editFormInput = document.getElementById('edit-modal-form-input');
const closeEditForm = document.getElementById('edit-button-close');

// Modal for delete
const deleteForm = document.getElementById('delete-modal-form');
const closeDeleteForm = document.getElementById('delete-button-close');

// Modal to add nested elements
const addForm = document.getElementById('add-modal-form');
const addFormInput = document.getElementById('add-modal-form-input');
const closeAddForm = document.getElementById('add-button-close');
const optionFile = document.getElementById('radio-file');
const optionFolder = document.getElementById('radio-folder');

// Modal to add top-level elements
const addOutsideForm = document.getElementById('outside-element-create');
const addOutsideFormInput = document.getElementById('outside-element-input');
const addOutsideoptionFile = document.getElementById('radio-file-outside');
const addOutsideoptionFolder = document.getElementById('radio-folder-outside');

// Main array
var all_elements = [];

// Constructor to create elements
class Element {
    constructor (name, filetype, position, parent) {
        this.name = name;
        this.filetype = filetype;
        this.position = position;
        this.parent = parent;
    }
}

// UL listener
list.addEventListener('click', event => {
    // Get current element and its name
    var li_element = event.target.parentNode;
    var name = li_element.firstChild.textContent.split(':')[0];
    
    // Listen for delete option
    if (event.target.className === 'delete') {
        // Refresh from data
        clearOptionsForm(deleteForm);
        // Show modal window
        closeModals();
        setTimeout(() => deleteForm.classList.add('show-modal'), 100);
        deleteForm.onsubmit = function (e) {
            e.preventDefault();
            // Call main function
            removeElement(all_elements, li_element, name)
            clearOptionsForm(deleteForm);
        };
    }
    // Listen for edit option
    if (event.target.className === 'edit') {
        // Refresh from data
        clearOptionsForm(editForm);
        // Show modal window
        closeModals();
        setTimeout(() => editForm.classList.add('show-modal'), 100);
        editForm.onsubmit = function (e) {
            e.preventDefault();
            // Call main function
            editElement(li_element, editFormInput.value);
            clearOptionsForm(editForm);
        };
    }
    // Listen for add option
    if (event.target.className === 'add') {
        // Refresh from data
        clearOptionsForm(deleteForm);
        // Show modal window
        closeModals();
        setTimeout(() => addForm.classList.add('show-modal'), 100);
        addForm.onsubmit = function (e) {
            e.preventDefault();
            // Choose specified type
            var type;
            optionFile.checked ? type = optionFile.value : type = optionFolder.value;
            // Validate entered name
            var name = addFormInput.value;
            if (!name || name === '') {
                constructInfoModal('Invalid name');
            } else if (name.indexOf(' ') >= 0) {
                constructInfoModal('No spaces, please');
            } else {
                // Call main function
                addElement('nested', li_element, type, name);
            }
            clearOptionsForm(addForm);
        };
    }
});

// Element creater listener
addOutsideForm.onsubmit = function (e) {
    e.preventDefault();
    // Choose specified type
    var type;
    addOutsideoptionFile.checked ? type = addOutsideoptionFile.value : type = addOutsideoptionFolder.value;
    // Validate entered name
    var name = addOutsideFormInput.value;
    if (!name || name === '') {
        constructInfoModal('Invalid name');
    } else if (name.indexOf(' ') >= 0) {
        constructInfoModal('No spaces, please');
    } else {
        addElement('top-level', 'none', type, name);
    }
    clearOutsideAddForm();
};

// Display all elements in console listener
displayElements.addEventListener('click', () => all_elements.length === 0 ? console.log('Array is empty') : console.log(sorted_elements));

// Delete all elements listener
deleteElements.addEventListener('click', () =>  {
    all_elements = []
    while (list.firstChild) { list.removeChild(list.firstChild); }
    constructInfoModal('Deleted');
});

// Modals event listeners
closeEditForm.addEventListener('click', () => clearOptionsForm(editForm));
closeDeleteForm.addEventListener('click', () => clearOptionsForm(deleteForm));
closeAddForm.addEventListener('click', () => clearOptionsForm(addForm));

// Function to add element
function addElement (status, parent, type, name) {
    // Create structure of element
    var element_text = document.createTextNode(`${name}:${type}`);
    var element_li = document.createElement('li');
    var element_li_p = document.createElement('p');

    // Create options for element
    var element_li_p_delete = document.createElement('p');
    var element_li_p_edit = document.createElement('p');
    var element_li_p_add = document.createElement('p');

    // Create classes for options
    element_li_p.classList.add('element-name');
    element_li_p_delete.classList.add('delete');
    element_li_p_edit.classList.add('edit');
    element_li_p_add.classList.add('add');

    // Add element text to element itself
    element_li_p.appendChild(element_text);

    // Add options to that element (DOM)
    element_li.appendChild(element_li_p);
    element_li.appendChild(element_li_p_delete);
    element_li.appendChild(element_li_p_edit);

    if (type !== 'file') {
        // Only folder has "ADD" option
        element_li.appendChild(element_li_p_add);
        element_li.classList.add('folder-css');
    } else {
        element_li.classList.add('file-css');
    }

    if (status === 'top-level') {
        // Add element in the DOM (parent / top-level)
        list.appendChild(element_li);
        // Push element in the array
        var array_item = new Element(name, type, 'top-level', 'none');
        all_elements.push(array_item);
    } else {
        // Get parent of the element
        var element_parent = parent;
        var element_parent_name = element_parent.firstChild.textContent;
        // Add element in the DOM (children / nested)
        element_parent.appendChild(element_li);
        // Push element in the array
        var array_item = new Element(name, type, 'nested', element_parent_name);
        all_elements.push(array_item);
        // Add child class to nested element
        element_li.classList.add('child-css');
    }
    refreshDOMList();
}

// Function to edit element
function editElement (element, new_text) {
    // Check if element has children
    if (element.classList.contains('folder-css') && element.children.length > 4) {
        // Cant delete element (parent) if it has any elements inside
        constructInfoModal('Element is immutable, has children inside');
    } else {
        var postfix;
        element.classList.contains('folder-css') ? postfix = ':folder' : postfix = ':file';
        if (new_text === '') {
            constructInfoModal('No name given');
        } else if (!new_text) {
            constructInfoModal('Invalid name');
        } else if (new_text.indexOf(' ') >= 0) {
            constructInfoModal('No spaces, please');
        } else if (new_text == undefined) {
            constructInfoModal('Something went wrong');
        } else {
            // Create new name for the element
            var element_new_name_full = `${new_text}${postfix}`;
            all_elements.forEach(element_in_array => {
                if(element.firstChild.textContent === `${element_in_array.name}:${element_in_array.filetype}`) {
                    // Update name of the element
                    element_in_array.name = new_text;
                }
            });
            element.firstChild.textContent = element_new_name_full;
            constructInfoModal('Name has changed');
            refreshDOMList();
        }
    }
}

// Function to remove / delete element
function removeElement (all_elements, element, text) {
    // Loop through elements
    for (let i = 0; i < all_elements.length; i++) {
        if (all_elements[i].name === text) {
            for (let j = 0; j < all_elements.length; j++) {
                // Check if element has children
                if(`${all_elements[i].name}:folder` === all_elements[j].parent) {
                    // Cant delete element (parent) if it has any elements inside
                    constructInfoModal('Element is unremovable, has children inside');
                    return;
                }
            }
            // Remove from DOM
            element.remove();
            // Remove from Array
            all_elements.splice(i, 1);
            constructInfoModal('Element deleted');
            refreshDOMList();
        }
    }
};

// Function to construct a modal window
function constructInfoModal (message) {
    modal.classList.add('show-modal');
    modalSubject.textContent = message;
    setTimeout(() => modal.classList.remove('show-modal'), 1300);
};

// Function to reset and hide modal forms
function clearOptionsForm(form) {
    form.reset();
    form.classList.remove('show-modal');
}

// Function to reset and hide main form on the control panel
function clearOutsideAddForm () {
    addOutsideForm.reset();
    addOutsideFormInput.value = '';
}

// Function to close all modal windows
function closeModals() {
    deleteForm.classList.remove('show-modal');
    editForm.classList.remove('show-modal');
    addForm.classList.remove('show-modal');
}

// Function to mimic refreshing behavior of UL after any operation
function refreshDOMList() {
    list.style.opacity = 0;
    setTimeout(() => list.style.opacity = 1, 150);
}

// Function to create basic template with 2 folders
(function basicTemplate () {
    addElement('top-level', 'none', 'folder', 'images');
    addElement('top-level', 'none', 'folder', 'styles');
})();

// Sort elements by name (in console, prototype)
var sorted_elements = all_elements.sort((a, b) => {
    if(a.name < b.name) return -1;
    if(a.name > b.name) return 1; 
    return 0;
});