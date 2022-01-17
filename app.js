const modal = document.getElementById('modal');
const container = document.querySelector('.container');
const form = document.querySelector('.modal-form');

let myLibrary = [];

class Book {
    constructor(title, author, pages, read) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
    }
}

class addBookToLibrary {
    addBookToList = function (book) {
        const bookDiv = document.createElement('div');
        bookDiv.classList.add('grid-row')

        const titleS = document.createElement('span')
        const authorS = document.createElement('span')
        const pagesS = document.createElement('span')
        const buttonS = document.createElement('span')
        const removeS = document.createElement('span')

        titleS.textContent = (`${book.title}`)
        authorS.textContent = (`${book.author}`)
        pagesS.textContent = (`${book.pages}`)

        const btnRead = document.createElement('button')
        // btnRead.classList.add('bookRead')
        btnRead.textContent = 'read'
        buttonS.appendChild(btnRead)

        if (book.read == false) {
            btnRead.classList.add('bookNotRead')
        } else if (book.read == true) {
            btnRead.classList.add('bookRead')
        }

        const deteleBtn = document.createElement('button');
        deteleBtn.textContent = 'remove'
        deteleBtn.classList.add('btn-remove')
        removeS.appendChild(deteleBtn)


        // removeS.innerHTML = `<button class="btn-remove">remove</button>`

        container.appendChild(bookDiv);

        bookDiv.appendChild(titleS)
        bookDiv.appendChild(authorS)
        bookDiv.appendChild(pagesS)
        bookDiv.appendChild(buttonS)
        bookDiv.appendChild(removeS)
    };

    showAlert = function () {
        alert('Please fill empty book information below')
    }

    deleteBook = function () { };

    clearFields = function () {
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('pages').value = '';
        document.getElementById('checkbox').checked = false;
    };

    getElementById = function () { };

    deleteBook = function (target) {
        if (target.className === 'btn-remove') {
            target.parentElement.parentElement.remove();

            return true;
        }
    }

    updateStatus = function (target) {
        if (target.classList.contains('bookRead')) {
            target.classList.remove('bookRead')
            target.classList.add('bookNotRead')
        } else if (target.classList.contains('bookNotRead')) {
            target.classList.remove('bookNotRead')
            target.classList.add('bookRead')
        }
    }
};



class Store {
    static getBooks() {
        if (localStorage.getItem('books') === null) {
            myLibrary = [];
        } else {
            myLibrary = JSON.parse(localStorage.getItem('books'));
        }

        return myLibrary;
    }

    static displayBooks() {
        const books = Store.getBooks();

        books.forEach(function (book) {
            const ui = new addBookToLibrary;

            // add book to UI
            ui.addBookToList(book);
        })
    }

    static addBook(book) {
        const books = Store.getBooks();

        books.push(book)

        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(title) {
        const books = Store.getBooks();

        books.forEach(function (book, index) {
            if (book.title === title) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }

    static updateBookStatus(target) {
        const books = Store.getBooks();

        const status = books.find(({ title }) => title === target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent)

        if (status.read === true) {
            status.read = false
        } else if (status.read === false) {
            status.read = true
        }

        localStorage.setItem('books', JSON.stringify(books));
    }
};



document.addEventListener('DOMContentLoaded', Store.displayBooks);

form.addEventListener('submit', function (e) {
    e.preventDefault();

    // get form values
    const title = document.getElementById('title').value,
        author = document.getElementById('author').value,
        pages = document.getElementById('pages').value;
    checkbox = document.getElementById('checkbox').checked;

    // instantiate book
    const book = new Book(title, author, pages, checkbox);

    const ui = new addBookToLibrary();

    if (title === '' || author === '' || pages === '') {
        ui.showAlert();
    } else {
        ui.addBookToList(book);

        Store.addBook(book);

        ui.clearFields();

        modal.classList.remove('show-modal')
    }
});

// Show modal
document.getElementById('open').addEventListener('click', () =>
    modal.classList.add('show-modal')
);

// Hide modal
document.getElementById('close').addEventListener('click', () =>
    modal.classList.remove('show-modal')
);

// Hide modal on outside click
window.addEventListener('click', e =>
    e.target == modal ? modal.classList.remove('show-modal') : false
);

container.addEventListener('click', function (e) {
    e.preventDefault()

    const ui = new addBookToLibrary();

    // remove book from library
    if (e.target.classList.contains('btn-remove')) {
        ui.deleteBook(e.target)

        Store.removeBook(e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent);
    }

    // update bookstatus DOM and LS
    if (e.target.classList.contains('bookRead')) {
        ui.updateStatus(e.target)
        Store.updateBookStatus(e.target)
    } else if (e.target.classList.contains('bookNotRead')) {
        ui.updateStatus(e.target)
        Store.updateBookStatus(e.target)
    }
})