const bookself = [];
const RENDER_EVENT = "update-data";
const SAVED_EVENT = "saved-event";
const STORAGE_KEY = "BOOKSELF";

const formSend = document.getElementById("inputBuku");
const readOrNotyet = document.getElementById("inputStatusReading");
const beforeReadBook = document.getElementById("booksBeforeReading");
const afterReadBook = document.getElementById("booksAfterReading");
const formSearch = document.getElementById("formSearchBook");
const valueSearch = document.getElementById("valueSearch");
const popupBox = document.getElementById("popupAll");
const popupButtonTrue = document.getElementById("buttonTrue");
const popupButtonFalse = document.getElementById("buttonFalse");

document.addEventListener("DOMContentLoaded", () => {
    formSend.addEventListener("submit", (e) => {
        e.preventDefault();
        saveAddBook();
        formSend.reset();
    });
    formSearch.addEventListener("submit", (e) => {
        e.preventDefault();
        searchBook();
    });    
    if (isStorageExist()) {
        loadFromLocalStorage();
    };
});
document.addEventListener(RENDER_EVENT, () => {
    // console.log(bookself);
    afterReadBook.innerHTML = "";
    beforeReadBook.innerHTML = "";
    for (const book of bookself) {
        const bookElement = addingBook(book);
        if (!book.isRead) {
            beforeReadBook.append(bookElement);
        }
        else {
            afterReadBook.append(bookElement);
        };
    };
});
function saveAddBook() {
    const titleBook = document.getElementById("inputJudulBuku").value;
    const writerBook = document.getElementById("inputPenulisBuku").value;
    const yearBook = document.getElementById("inputTahunTerbit").value;
    const IDBook = makeId();
    let bookObject = [];
    readOrNotyet.checked ? statsRead = false : statsRead = true;
    if (statsRead) {
        bookObject = makeBookObject(IDBook, titleBook, writerBook, yearBook, false);
    }
    else {
        bookObject = makeBookObject(IDBook, titleBook, writerBook, yearBook, true);
    };
    bookself.push(bookObject);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveLocalStorage();
};
function makeId() {
    return +new Date();
};
function makeBookObject(id, title, writer, year, isRead) {
    return {
        id,
        title,
        writer,
        year,
        isRead
    };
};
function addingBook(bookObject) {
    const textTitle = document.createElement("h3");
    const textWriter = document.createElement("p");
    const textYear = document.createElement("p");
    const bookContainer = document.createElement("div");
    const allContainer = document.createElement("div");
    const checkButton = document.createElement("button");
    const undoButton = document.createElement("button");
    const trashButton = document.createElement("button");
    const buttonContainer = document.createElement("div");
    const popupContent = document.getElementById("popupContent");
    const popupContentText = "Apakah Anda Yakin Ingin Menghapus Buku Ini?";
    textTitle.innerText = bookObject.title;
    textWriter.innerText = "Penulis : " + bookObject.writer;
    textYear.innerHTML = "Tahun : " + bookObject.year;
    bookContainer.classList.add("aboutBook");
    allContainer.classList.add("listBook");
    bookContainer.append(textTitle, textWriter, textYear);
    allContainer.append(bookContainer);
    allContainer.setAttribute("id", `bookID-${bookObject.id}`);
    if (bookObject.isRead) {
        undoButton.classList.add("buttonUnCompleatedReading");
        undoButton.addEventListener("click", () => {
            undoBookFromAfter(bookObject.id);
        });
        buttonContainer.append(undoButton, trashButton);
    }
    else {
        checkButton.classList.add("buttonCompleatedReading");
        checkButton.addEventListener("click", () => {
            addBookToAfter(bookObject.id);
        });
        buttonContainer.append(checkButton, trashButton);
    };
    trashButton.classList.add("buttonDeleteBook");
    trashButton.addEventListener("click", () => {
        popupContent.innerHTML = "<p>"+popupContentText+"</p>";
        popupBox.style.display = "block";
        popupButtonTrue.addEventListener("click", () => {
            popupBox.style.display = "none";
            removeBookFromAfter(bookObject.id);
        });
        popupButtonFalse.addEventListener("click", () => {
            popupBox.style.display = "none";
        });    
    });
    buttonContainer.classList.add("manyButtons");
    allContainer.append(buttonContainer);
    return allContainer;
};
function addBookToAfter (bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget != null) {
        bookTarget.isRead = true;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveLocalStorage();
    };
;}
function removeBookFromAfter (bookId) {
    const bookTarget = findBookIndex(bookId);
    if (bookTarget !== -1) {
        bookself.splice(bookTarget, 1);
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveLocalStorage();
    }
    else return;
};
function undoBookFromAfter(todoId) {
    const bookTarget = findBook(todoId);
    if (bookTarget !== null) {
        bookTarget.isRead = false;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveLocalStorage();
    }
    else return;
};
function findBook(bookId) {
    for (const bookItem of bookself) {
        if (bookItem.id === bookId) {
            return bookItem;
        };
    };
    return null;
};
function findBookIndex(bookId) {
    for (const index in bookself) {
        if (bookself[index].id === bookId) {
            return index;
        };
    };
    return -1;
};

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert("Fitur Web Storage Tidak Tersedia Pada Browser Ini");
        return false;
    };
    return true;
};
function loadFromLocalStorage() {
    const serialLocalStorage = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serialLocalStorage);
    if (data !== null) {
        for (const book of data) {
            bookself.push(book);
        };
    };
    document.dispatchEvent(new Event(RENDER_EVENT));
};
function saveLocalStorage() {
    if (isStorageExist) {
        const parsed = JSON.stringify(bookself);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    };
};

function searchBook() {
    const filterSearch = valueSearch.value.toUpperCase();
    const bookItem = document.getElementsByClassName("listBook");
    const bookHeader = document.getElementsByTagName("h3");
    for (i = 0; i < bookHeader.length; i++) {
        a = bookItem[i].getElementsByTagName("h3")[0];
        if (a.innerHTML.toUpperCase().indexOf(filterSearch) > -1) {
          bookItem[i].style.display = "";
        }
        else {
          bookItem[i].style.display = "none";
        };
    };
};
