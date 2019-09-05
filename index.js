let myLibrary = [
    { title: 'Born a Crime', author: 'Trevor Noah', pages: 304, read: false },
    { title: 'Fahrenheit 451', author: 'Ray Bradbury', pages: 158, read: true }
];

function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

Book.prototype.info = function() {
    return `${this.title} by ${this.author}, ${this.pages} pages, ${this.read ? 'have read' : 'not read yet'}`;
}

//const book1 = new Book('Lord of the Rings', 'JRR Tolkien', 295, true)

//console.log(book1.info());

function addBookToLibrary(book) {
    myLibrary.push(book);
}

function render(myLibrary) {

}