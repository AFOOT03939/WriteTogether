let fragmentContainer = document.getElementById("contribuitons-list-selector");

// this function shows the fragments that people wrote
async function showFragmentsInProfile() {
    const response = await fetch("/Users/getFragments")
    if (!response.ok) {
        console.error("Error al obtener los datos:", response.status, response.statusText);
        return;
    }

    const fragmentData = await response.json();
    console.log(fragmentData);
    console.log("Keys:", Object.keys(fragmentData));
    console.log("Values:", Object.values(fragmentData));


    let fragments = Object.values(fragmentData)

    // Generate a card for each fragment
    fragments.forEach((fragment, index) => {
        // Parse Date
        const date = new Date(fragment.dateFr)
        const formattedDate = date.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })

        fragmentContainer.innerHTML += `
            <div class="story-card">
                <div class="story-title">${fragment.titleSt} ${formattedDate}</div>
                <div class="story-text">${fragment.content_Fr}</div>
            </div>
        `
    })
}

async function showNameProfile() {
    let fragmentContainer = document.getElementsByClassName("name-avatar");
    const response = await fetch("/Users/getUserInfo");
    const name = await response.json();
    const userName = name["0"];
    fragmentContainer[0].innerText = "Hello: " + userName;
    fragmentContainer[1].innerText += userName;
}

showFragmentsInProfile();
showNameProfile()