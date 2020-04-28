// General buttons and list
var list = document.getElementById('list');
var createFile = document.getElementById('create-file-element');
var createFolder = document.getElementById('create-folder-element');
var displayElements = document.getElementById('display-all-elements');
var deleteElements = document.getElementById('delete-all-elements'); 

// Simple modal
var modal = document.getElementById('info-modal');
var modalSubject = document.getElementById('info-modal__subject'); 

// Edit modal
var editForm = document.getElementById('edit-modal-form');
var editFormInput = document.getElementById('edit-modal-form-input');
var closeEditForm = document.getElementById('edit-button-close'); 

// Delete modal
var deleteForm = document.getElementById('delete-modal-form');
var closeDeleteForm = document.getElementById('delete-button-close'); 

// Add modal (in element)
var addForm = document.getElementById('add-modal-form');
var addFormInput = document.getElementById('add-modal-form-input');
var closeAddForm = document.getElementById('add-button-close');
var optionFile = document.getElementById('radio-file');
var optionFolder = document.getElementById('radio-folder'); 

// Add modal (in main form)
var addOutsideForm = document.getElementById('outside-element-create');
var addOutsideFormInput = document.getElementById('outside-element-input');
var addOutsideoptionFile = document.getElementById('radio-file-outside');
var addOutsideoptionFolder = document.getElementById('radio-folder-outside'); 