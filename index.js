//Checks if the theme is present in the Local Storage
//if not just adds light by default in the html
//if exist changes the theme with the current value on the localstorage

if (!localStorage.theme) {
  localStorage.theme = 'light'
  document.documentElement.classList.add('light')
}
else
{
  document.documentElement.classList.add(localStorage.theme)
}

/**
 * 
 * @param {String} content saves the note in localStorage
 * @returns 
 */

document.querySelector('form').addEventListener('submit', function(e) {
  e.preventDefault();

  const note = e.target.elements['note'].value;
  const category = e.target.elements['category'].value;

  let notesSaved = JSON.parse(localStorage.getItem(category)) || [];

  notesSaved.push(note);

  localStorage.setItem(category, JSON.stringify(notesSaved));

  location.reload();
});

/**
 * Change Theme
 * @param {string} theme changes the theme of page
 */

function swapTheme(theme){
  const deletePrev = theme === 'light'? 'dark' : 'light'

  document.documentElement.classList.remove(deletePrev)
  localStorage.theme = theme
  document.documentElement.classList.add(theme) 
}

/**
 * Copy Data into the Clipboard
 * @param {*} content copy the content from the button selected into the clipboard of your device
 * @returns the content saved in your clipboard or null if navigator is not supported on the client
 */

function copyData(content){

  if(navigator.clipboard){
    return navigator.clipboard.writeText(content)
  }

  return null
}

/**
 * 
 * @param {*} id hides all children buttons of an specific section
 */

function hideBlock(id){
  document.querySelector(`#${id} #buttons`).classList.toggle("hidden")
}

/**
 * Hides the create notes block
 */

function hideCreate(){
  document.querySelector("#create").classList.toggle("hidden")
}

/**
 * Loads the notes found in localstorage on each section
 */

window.onload = function(){
  loadNotes()
}

function loadNotes(){
  let categoryContainerMap = {
    'block1': 'block1',
    'block2': 'block2',
    'block3': 'block3',
    'block4': 'block4'
  };

  for (let category in categoryContainerMap) {

    let categoryArray = localStorage.getItem(category);

    if (categoryArray === null || categoryArray === 'undefined' || categoryArray.length === 0) {
      continue;
    }

    categoryArray = JSON.parse(categoryArray);

    let containerId = categoryContainerMap[category];

    let categoryContainer = document.querySelector(`#${containerId} #buttons`);

    for (let i = 0; i < categoryArray.length; i++) {
      let button = document.createElement('button');
      button.textContent = categoryArray[i];
      button.className = 'mt-2 border w-fit p-2 rounded break-all truncate max-w-[200px] font-medium bg-white hover:bg-slate-100 hover:dark:border-white hover:dark:bg-white/5 dark:bg-white/5 dark:text-white/90 dark:border-white/40';
      button.setAttribute('onclick', 'copyData("' + categoryArray[i] + '")');

      categoryContainer.appendChild(button);
    }
  }
}

/**
 * Toggle the Delete Mode for specific sections
 */

let isDeleteMode = false;

function handleDeleteNotes(id) {
  let buttons = document.getElementById(id).querySelectorAll("#buttons button");
  let deleteBtn = document.querySelector(`#${id} #deleteBtn`);
  let contactContainer = document.getElementById(id);

  if (isDeleteMode) {
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute(
        "onclick",
        "copyData('" + buttons[i].innerText + "')"
      );
    }
    deleteBtn.textContent = "Eliminar";
    contactContainer.classList.remove('deleteMode');
    isDeleteMode = false;
  } else {
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute(
        "onclick",
        "deleteData('" + buttons[i].innerText + "','"+id+ "')"
      );
    }
    deleteBtn.textContent = "Cerrar";
    contactContainer.classList.add('deleteMode');
    isDeleteMode = true;
  }
}

/**
 * 
 * @param {*} data the note to be deleted
 * @param {*} category the category where to find it
 * @returns new list
 */

function deleteData(data, category){
  let categoryContainerMap = {
    'block1': 'block1',
    'block2': 'block2',
    'block3': 'block3',
    'block4': 'block4'
  };

  if (!categoryContainerMap.hasOwnProperty(category)) {
    return;
  }

  let categoryArray = localStorage.getItem(category);

  if (categoryArray === null || categoryArray === 'undefined' || categoryArray.length === 0) {
    return;
  }

  categoryArray = JSON.parse(categoryArray);

  let dataIndex = -1;
  for (let i = 0; i < categoryArray.length; i++) {
    if (categoryArray[i] === data) {
      dataIndex = i;
      break;
    }
  }

  if (dataIndex === -1) {
    return;
  }

  categoryArray = categoryArray.slice(0, dataIndex).concat(categoryArray.slice(dataIndex + 1));

  localStorage.setItem(category, JSON.stringify(categoryArray));

  let containerId = categoryContainerMap[category];
  let categoryContainer = document.querySelector(`#${containerId} #buttons`);
  let buttons = categoryContainer.getElementsByTagName('button');

  for (let i = 0; i < buttons.length; i++) {
    if (buttons[i].textContent === data) {
      buttons[i].remove();
      break;
    }
  }

}

/**
 * Handles the header background color and saves the value in localstorage
 */

const headerColor = localStorage.getItem('headerColor');

if (headerColor) {
  document.querySelector('header').style.backgroundColor = headerColor
  document.querySelector('#changebg').value = headerColor
}

document.querySelector('#changebg').addEventListener('input', function() {
  localStorage.setItem('headerColor', this.value)
  document.querySelector('header').style.backgroundColor = this.value
})

/**
 * 
 * @param {*} id expand each button to its content
 */

function showMore(id){
  document.querySelectorAll(`#${id} #buttons button`).forEach(e => {
    e.classList.toggle("truncate")
    e.classList.toggle("max-w-[200px]")
  })
}