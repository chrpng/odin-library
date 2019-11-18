let myLibrary = [
    { title: 'Born a Crime', author: 'Trevor Noah', pages: 304, status: 'Completed' },
    { title: 'The Way of Kings', author: 'Brandon Sanderson', pages: 234, status: 'Plan To Read' },
    { title: 'Fahrenheit 451', author: 'Ray Bradbury', pages: 158, status: 'Completed' }
];

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

function addBookToLibrary(book) {
    myLibrary.push(book);
}

const container = document.querySelector('#container');

const grid = document.querySelector('.grid');

const toggleLayoutBtn = document.querySelector('.toggle-layout');

let isList = false;

const toggle = (e) => {
    e.target.classList.toggle('fa-bars');
    e.target.classList.toggle('fa-th');
    grid.classList.toggle('grid');
    grid.childNodes.forEach(current => {
        current.classList.toggle('flex');
    });
    isList = !isList;
}

toggleLayoutBtn.addEventListener('click', toggle);

function createBookTemplate(book) {
    const div = document.createElement('div');
    div.classList.add('book-item');
    console.log(isList);
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
    const deleteBtn = document.createElement('i');
    deleteBtn.classList.add('delete-btn', 'fa', 'fa-times'); //fa for FA 4.0, fas for FA 5.0
    deleteBtn.addEventListener('click', deleteBook);

    div.appendChild(title);
    div.appendChild(author);
    div.appendChild(pages);
    div.appendChild(status);
    div.appendChild(deleteBtn);

    return div;
}

function createFormTemplate() {
    const div = document.createElement('div');
}

function render(myLibrary) {
    //Clear any existing list before rendering
    while(grid.firstChild) {
        grid.removeChild(grid.firstChild);
    }
    for (let i in myLibrary) {
        const bookDiv = createBookTemplate(myLibrary[i]);
        // div.className = 'book1';
        bookDiv.classList.add(`book${i}`);
        grid.appendChild(bookDiv);
    }
}

const deleteBook = (e) => {
    //Want to delete parent element of delete icon, but an element cannot delete itself
    //Must go to parent of parent and delete child from there
    e.target.parentNode.parentNode.removeChild(e.target.parentNode);
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
        console.log(newBook.info());
        return { isValid, newBook };
    }
    return { isValid, newBook: null };
}

const processBook = (e) => {
    const validBook = validateBook(e);
    if(validBook.isValid) {
        addBookToLibrary(validBook.newBook);
        render(myLibrary);
        closeForm();
    } else {
        alert('Invalid Entry!')
    }
}
render(myLibrary);

const openForm = () => {
    const formBG = document.querySelector('.form-gray');
    formBG.classList.add('open-form');
    const form = document.querySelector('form');
    form.classList.add('show');
};

const closeForm = () => {
    const formBG = document.querySelector('.form-gray');
    formBG.classList.remove('open-form');
    const form = document.querySelector('form');
    form.classList.remove('show');
}

const newBookBtn = document.querySelector('.new-book');
newBookBtn.addEventListener('click', openForm);

const closeBtn = document.querySelector('.close-btn');
closeBtn.addEventListener('click', closeForm);

const addToLibraryBtn = document.querySelector('.add-to-library');

addToLibraryBtn.addEventListener('click', processBook);


// const container = document.querySelector('#container');

// const redText = document.createElement('p');
// redText.style.color = 'red';
// redText.textContent = 'Hey I\'m red!';

// const blueText = document.createElement('h3');
// blueText.style.color = 'blue';
// blueText.textContent = 'I\'m a blue h3!';

// const div = document.createElement('div');
// div.style.cssText = 'border: 2px solid black; background: pink'

// const divHeader = document.createElement('h1');
// divHeader.textContent = 'I\'m in a div';

// const divParagraph = document.createElement('p');
// divParagraph.textContent = 'ME TOO!';

// const button = document.createElement('button');
// button.textContent = 'button';

// button.addEventListener('click', function(e) {
//     e.target.style.background = 'blue';
// })

// button.addEventListener('dblclick', function(e) {
//     //e.target.removeAttribute('style');
//     e.target.setAttribute('style', 'background: ');
// })

// div.appendChild(divHeader);
// div.appendChild(divParagraph);

// container.appendChild(redText);
// container.appendChild(blueText);
// container.appendChild(div);
// container.appendChild(button);