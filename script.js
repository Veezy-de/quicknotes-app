const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");
const searchInput = document.querySelector("#search-input");

let notes = JSON.parse(localStorage.getItem("quicknotes")) || [];

function saveNotes() {
    localStorage.setItem("quicknotes", JSON.stringify(notes));
}

function updateCount() {
    if (notes.length === 0) {
        noteCount.textContent = "You have no notes yet.";
    } else if (notes.length === 1) {
        noteCount.textContent = "You have 1 note.";
    } else {
        noteCount.textContent = `You have ${notes.length} notes.`;
    }
}

function render(notesToDisplay = notes) {
    notesList.textContent = "";

    if (notesToDisplay.length === 0 && searchInput.value.trim() !== "") {
        const emptyMessage = document.createElement("li");
        emptyMessage.textContent = "No notes match your search.";
        notesList.appendChild(emptyMessage);
        updateCount();
        return;
    }

    notesToDisplay.forEach((note) => {
        const listItem = document.createElement("li");

        listItem.classList.add(
            "note-card",
            `category-${note.category}`
        );

        const categoryLabel = document.createElement("span");
        categoryLabel.classList.add("note-category-label");
        categoryLabel.textContent = note.category;

        const noteText = document.createElement("p");
        noteText.textContent = note.text;

        const noteDate = document.createElement("small");
        noteDate.classList.add("note-date");
        noteDate.textContent = note.createdAt;

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            notes = notes.filter((item) => item.id !== note.id);

            saveNotes();

            performSearch();
        });

        listItem.appendChild(categoryLabel);
        listItem.appendChild(noteText);
        listItem.appendChild(noteDate);
        listItem.appendChild(deleteButton);

        notesList.appendChild(listItem);
    });

    updateCount();
}

noteForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const text = noteInput.value.trim();
    const category = noteCategory.value;

    if (text === "") {
        errorMessage.textContent = "Please type a note first.";
        return;
    }

    if (text.length > 200) {
        errorMessage.textContent =
            "Notes must be 200 characters or fewer.";
        return;
    }

    const newNote = {
        id: Date.now(),
        text: text,
        category: category,
        createdAt: new Date().toLocaleString()
    };

    notes.push(newNote);

    saveNotes();

    noteInput.value = "";
    errorMessage.textContent = "";

    performSearch();
});

function performSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();

    if (searchTerm === "") {
        render();
        return;
    }

    const filteredNotes = notes.filter((note) =>
        note.text.toLowerCase().includes(searchTerm)
    );

    render(filteredNotes);
}

searchInput.addEventListener("input", performSearch);

render();