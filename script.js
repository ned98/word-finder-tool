let allElements = document.querySelectorAll('*');
let input = $('input')
let wordList = $('.word-list');
let log = console.log;

$(document).ready(function () {
    showList();
});

// On Enter key press
input.keypress(function (e) {
    if (e.which === 13) $('.btnAdd').click();
});

// Adds new ELement, if input is not empty
$('.btnAdd').click(function () {
    if (input.val().length === 0) {
        input.addClass('shake');

        setTimeout(function () {
            input.removeClass('shake');
        }, 950);

        return;
    }
    addElement();
});

$("ul").click(function (e) {
    let closestLi = $(e.target).closest('li');
    let closestText = closestLi.find('.li-text');

    if ($(e.target).hasClass('delBtn')) {
        e.target.parentElement.remove();   // Removes the 'li' element
        deleteElement(closestText.text()); // Removes the element from Chrome Storage
    }
});

// Removes all items from Chrome Storage
$(".resetBtn").click(function () {
    if (confirm("Are you sure?") == false) return;  // Asks the user for confirmation
    clearStorage();
});

chrome.storage.local.get(function (items) {
    if (Object.keys(items).length > 0 && items.words) {
        items.words.forEach(function (word) {
            allElements.forEach(function (element) {
                findAndReplaceDOMText(element, {
                    find: word,
                    wrap: "em",
                    wrapClass: "rainbow"
                });
            });
        });
    };
});

// Adds new Element & Saves to Storage
function addElement() {
    let li =
        `<li>
            <p class="li-text">${input.val()}</p>
            <img src="images/delete.png" class="delBtn">
        </li>`;
    wordList.append(li);

    let trimmedInput = $("input").val().trim();
    saveToStorage(trimmedInput);
    input.val('');
}

// Saves to Chrome Storage
function saveToStorage(word) {
    chrome.storage.local.get(function (items) {
        if (Object.keys(items).length > 0 && items.words) {
            items.words.push(word);
        } else items.words = [];

        chrome.storage.local.set(items, function () {
            log(items.words.toString());
            log('Data saved to storage!');
        });
    });
}

function showList() {
    chrome.storage.local.get(function (items) {
        if (Object.keys(items).length > 0 && items.words) {
            items.words.forEach(word => {
                let li =
                    `<li>
                        <p class="li-text">${word}</p>
                        <img src="images/delete.png" class="delBtn">
                    </li>`;
                wordList.append(li);
            });
        }
    });
}

// Removes all items from Chrome Storage
function clearStorage() {
    wordList.empty();

    chrome.storage.local.clear(function () {
        log('Data removed from storage!');
        let error = chrome.runtime.lastError;
        if (error) console.error(error);
    });
}

// Removes one element
function deleteElement(word) {
    chrome.storage.local.get(function (items) {
        items.words.splice(items.words.indexOf(word), 1);

        chrome.storage.local.set(items, function () {
            log('Item removed from storage!');
            let error = chrome.runtime.lastError;
            if (error) console.error(error);
        });
    });
}