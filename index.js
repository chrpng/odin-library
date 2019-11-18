let myLibrary = [
    { title: 'The Way of Kings', author: 'Brandon Sanderson', pages: 234, status: 'Plan To Read', key: '0' },
    { title: 'Born a Crime', author: 'Trevor Noah', pages: 304, status: 'Completed', key: '1' },
    { title: 'Fahrenheit 451', author: 'Ray Bradbury', pages: 158, status: 'Completed', key: '2' }
];

let isList = false;
let isEdit = false;
let editBookKey = '';

function Book(title, author, pages, status) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.status = status;
}

Book.prototype.info = function() {
    return `${this.title} by ${this.author}, ${this.pages} pages, ${this.status}`;
}
// HOW TO USE:
//const book1 = new Book('Lord of the Rings', 'JRR Tolkien', 295, 'Plan To Read')
//console.log(book1.info());

const container = document.querySelector('#container');
const grid = document.querySelector('.grid');

const toggleLayoutBtn = document.querySelector('.toggle-layout');
const newBookBtn = document.querySelector('.new-book');
const updateLibraryBtn = document.querySelector('.update-library');
const addToLibraryBtn = document.querySelector('.add-to-library');

const closeBtn = document.querySelector('.close-btn');

const toggle = (e) => {
    e.target.classList.toggle('fa-bars');
    e.target.classList.toggle('fa-th');
    grid.classList.toggle('grid');
    grid.childNodes.forEach(current => {
        current.classList.toggle('flex');
    });
    isList = !isList;
}

const validateBook = (e) => {
    e.preventDefault();

    const newTitle = document.querySelector('#new-title').value;
    const newAuthor = document.querySelector('#new-author').value;
    const newPages = document.querySelector('#new-pages').value;
    const newStatus = document.querySelector('#read-status').value;

    const isValid = [newTitle, newAuthor, newPages].every(current => current);

    if(isValid) {
        const newBook = new Book(newTitle, newAuthor, newPages, newStatus);
        return { isValid, newBook };
    }
    return { isValid, newBook: null };
}

const processBook = (e) => {
    const validBook = validateBook(e);
    if(validBook.isValid) {
        //addBookToLibrary(validBook.newBook);
        addBookToDatabase(validBook.newBook);
        //render(myLibrary);
        closeForm();
    } else {
        alert('Invalid Entry!');
    }
}

// function addBookToLibrary(book) {
//     myLibrary.push(book);
// }

const addBookToDatabase = ({ title, author, pages, status }) => {
    if(isEdit) {
        let editObj = firebase.database().ref(editBookKey);
        editObj.set({
            title, 
            author, 
            pages, 
            status, 
            key: editBookKey
        });
        isEdit = false;
    } else {
        //Push generates am object(?) at the root node with a brand new key
        let newObj = firebase.database().ref().push();
        newObj.set({
            title,
            author,
            pages,
            status,
            key: newObj.getKey()
        });
    }
};

const editBook = (e) => {
    const book = e.target.parentNode;
    const key = book.getAttribute('key');
    openForm();
    
    document.getElementById('new-title').value = myLibrary[key].title;
    document.getElementById('new-author').value = myLibrary[key].author;
    document.getElementById('new-pages').value = myLibrary[key].pages;
    document.getElementById('read-status').value = myLibrary[key].status;
    isEdit = true;
    editBookKey = key;
    addToLibraryBtn.innerText = 'Update Book';
}

//Only for local use, and it only removes the visual render and doesn't actually delete from database
const deleteBook = (e) => {
    //Want to delete parent element of delete icon, but an element cannot delete itself
    //Must go to parent of parent and delete child from there
    e.target.parentNode.parentNode.removeChild(e.target.parentNode);
}

const deleteBookFromDatabase = (e) => {
    const key = e.target.parentNode.getAttribute('key');
    firebase.database().ref(key).remove();
}

function createBookTemplate(book) {
    const div = document.createElement('div');
    div.classList.add('book-item');
    if(isList) div.classList.add('flex');

    const title = document.createElement('h2');
    title.textContent = book.title;
    const author = document.createElement('div');
    author.classList.add('author');
    author.textContent = book.author;
    const pages = document.createElement('div');
    pages.classList.add('pages');
    pages.textContent = book.pages + ' pages';
    const status = document.createElement('div');
    status.classList.add('status');
    status.textContent = book.status;
    const editBtn = document.createElement('i');
    editBtn.classList.add('edit-btn', 'fa', 'fa-cog');
    editBtn.addEventListener('click', editBook);
    const deleteBtn = document.createElement('i');
    deleteBtn.classList.add('delete-btn', 'fa', 'fa-times'); //fa for FA 4.0, fas for FA 5.0
    deleteBtn.addEventListener('click', deleteBookFromDatabase);

    div.appendChild(title);
    div.appendChild(author);
    div.appendChild(pages);
    div.appendChild(status);
    div.appendChild(editBtn);
    div.appendChild(deleteBtn);

    return div;
}

function createFormTemplate() {
    const div = document.createElement('div');
}

function render(myList) {
    //Clear any existing list before rendering
    while(grid.firstChild) {
        grid.removeChild(grid.firstChild);
    }
    for (let i in myList) {
        const bookDiv = createBookTemplate(myList[i]);
        // div.className = 'book1';
        bookDiv.setAttribute('key', myList[i].key);
        grid.appendChild(bookDiv);
    }
}

const openForm = () => {
    const formBG = document.querySelector('.form-gray');
    formBG.classList.add('open-form');
    const form = document.querySelector('form');
    form.classList.add('show');

    document.getElementById('new-title').value = '';
    document.getElementById('new-author').value = '';
    document.getElementById('new-pages').value = '';
    document.getElementById('read-status').value = 'Completed';
    addToLibraryBtn.innerText = 'Add To Library';
};

const closeForm = () => {
    const formBG = document.querySelector('.form-gray');
    formBG.classList.remove('open-form');
    const form = document.querySelector('form');
    form.classList.remove('show');
}

toggleLayoutBtn.addEventListener('click', toggle);
newBookBtn.addEventListener('click', openForm);
closeBtn.addEventListener('click', closeForm);
addToLibraryBtn.addEventListener('click', processBook);

const dbReference = firebase.database().ref();
//Every time a value event is processed, get a snapshot of the changes and render them
dbReference.on('value', snapshot => {
    myLibrary = snapshot.val();
    render(snapshot.val());
});