// Function to generate and append cards to the container
function generateCards(containerId, projectList) {
    var container = document.getElementById(containerId);

    projectList.forEach(element => {
        // Create a card element
        var card = document.createElement('div');
        card.className = "card"
        card.id = "card." + element

        var cardContent = document.createTextNode(element);
        card.appendChild(cardContent);

        // // Append the card to the container
        container.appendChild(card);
        loadPage("card." + element, "content/projects/" + element + "/index.html")

    });

    if (container.childElementCount === 0) {
        // Display a message or set a default content
        container.innerHTML = '<h1>No projects are posted yet.</h1>';
    }
}

var projects = ["flappy_cube", "RoadRun"]

generateCards('cards', projects);