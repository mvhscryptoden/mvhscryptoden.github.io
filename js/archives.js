const archiveCards = document.querySelectorAll(".archiveCard");

archiveCards.forEach(card => {
    const button = card.querySelector(".archiveHeader");

    button.addEventListener("click", function () {
        const isOpen = card.classList.contains("open");

        archiveCards.forEach(c => c.classList.remove("open"));

        if (!isOpen) {
            card.classList.add("open");
        }
    });
});