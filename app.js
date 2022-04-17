// ********** - SELECT ITEMS - **********
const alert = document.querySelector('.alert');
const form = document.querySelector('.grocery-form');
const grocery = document.getElementById('grocery');
const submitBtn = document.querySelector('.submit-btn');
const container = document.querySelector('.grocery-container');
const list = document.querySelector('.grocery-list');
const clearBtn = document.querySelector('.clear-btn');
const background = document.getElementsByTagName('body')[0];

// edit options
let editElement;
let editFlag = false;
let editID = '';

// style
const colors = [
  '#16a085',
  '#27ae60',
  '#2c3e50',
  '#f39c12',
  '#e74c3c',
  '#9b59b6',
  '#FB6964',
  '#342224',
  '#472E32',
  '#BDBB99',
  '#77B1A9',
  '#73A857'
];

// ********** - EVENT LISTENERS - **********
// submit form
form.addEventListener('submit', addItem)
// clear items
clearBtn.addEventListener('click', clearItems)
// load items
window.addEventListener('DOMContentLoaded', setupItems)


// ********** - FUNCTIONS - **********
function addItem(e){
  e.preventDefault();
  const value = grocery.value;
  const id = new Date().getTime().toString();
  updateColour();
  if (value && !editFlag){
    createListItem(id, value)
    displayAlert(`${value} added to list`, 'success');
    addToLocalStorage(id, value);
    setBackToDefault();
  }
  else if (value && editFlag){
    editElement.innerHTML = value;
    displayAlert('Item successfully updated', 'success');
    editLocalStorage(editID, value);
    setBackToDefault();
  }
  else {
    displayAlert('Please add an item', 'danger');
  }
}

function displayAlert(text, action){
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);
  setTimeout(function(){
    alert.textContent = '';
    alert.classList.remove(`alert-${action}`);
  }, 1500 )
}

function editItem(e){
  const item = e.currentTarget.parentElement.parentElement;
  const id = item.dataset.id;
  editElement = e.currentTarget.parentElement.previousElementSibling;
  grocery.value = editElement.innerHTML;
  editFlag = true;
  editID = id;
  submitBtn.textContent = 'Update';
}

function deleteItem(e){
  const item = e.currentTarget.parentElement.parentElement;
  const id = item.dataset.id;
  list.removeChild(item);
  if (list.children.length==0){
    container.classList.remove('show-container');
  }
  displayAlert('item removed', 'danger');
  setBackToDefault();
  removeFromLocalStorage(id);
}

function clearItems(){
  const items = document.querySelectorAll('.grocery-item');
  if (items.length > 0){
    items.forEach(function(i) {
      list.removeChild(i)
    })
  }
  container.classList.remove('show-container');
  displayAlert('empty list', 'success')
  setBackToDefault();
  localStorage.removeItem('list')
}

function setBackToDefault(){
  grocery.value = '';
  editFlag = false;
  editID = '';
  submitBtn.textContent = 'Submit';
}

function updateColour(){
  const idx = Math.floor(Math.random() * colors.length);
  const color = colors[idx]
  background.style.backgroundColor = color;
  submitBtn.style.backgroundColor = color;
  submitBtn.style.color = 'white';
}

// ********** - LOCAL STORAGE - **********
function addToLocalStorage(id, value){
  const grocery = {id, value};
  let items = getLocalStorage();
  items.push(grocery);
  setLocalStorage(items)
}

function removeFromLocalStorage(id){
  let items = getLocalStorage();
  items = items.filter(item => item.id !== id);
  setLocalStorage(items)
}

function editLocalStorage(id, value){
  let items = getLocalStorage();
  items = items.map(item => {
    if (item.id === id){
      item.value = value;
    }
    return item;
  })
  setLocalStorage(items)
}

function getLocalStorage(){
  return localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list')):[];
}

function setLocalStorage(items){
  localStorage.setItem('list', JSON.stringify(items)) 
}

// ********** - SETUP ITEMS - **********
function setupItems(){
  let items = getLocalStorage();
  if (items){
    items.forEach(item=> {
      createListItem(item.id, item.value)
    })
  }
}

function createListItem(id, value){
  const element = document.createElement('article');
  element.classList.add('grocery-item');
  const attr = document.createAttribute('data-id');
  attr.value = id;
  element.setAttributeNode(attr);
  element.innerHTML = `
  <p class="title">${value}</p>
    <div class="btn-container">
      <button type="button" class="edit-btn">
        Edit
      </button>
      <button type="button" class="delete-btn">
        Delete
      </button>
    </div>`
  const editBtn = element.querySelector('.edit-btn');
  const deleteBtn = element.querySelector('.delete-btn');
  editBtn.addEventListener('click', editItem);
  deleteBtn.addEventListener('click', deleteItem);
  container.classList.add('show-container');
  list.appendChild(element);
}