console.log(window.location.pathname);
const storyGrid = document.getElementById("storiesGrid");
let filteredStory;
async function urldetection() {
    const response = await fetch("/Stories/getStory");
    if (!response.ok) {
        throw new Error(`Error en la petición: ${response.status}`);
    }
    let story = await response.json();
    console.log(story);
    let url = window.location.pathname;
    switch (url) {
        case "/Home/Category/Fantasy":
            filteredStory = storyFilter(story, 1);
            filteredStory.forEach(filtered => {
                let card = createStory(filtered);
                storyGrid.innerHTML += card;
            })
            break;
        case "/Home/Category/Romance":
            filteredStory = storyFilter(story, 2);
            filteredStory.forEach(filtered => {
                let card = createStory(filtered);
                storyGrid.innerHTML += card;
            })
            break;
        case "/Home/Category/Mistery":
            filteredStory = storyFilter(story, 3);
            filteredStory.forEach(filtered => {
                let card = createStory(filtered);
                storyGrid.innerHTML += card;
            })
            break;
        case "/Home/Category/Scifi":
            filteredStory = storyFilter(story, 4);
            filteredStory.forEach(filtered => {
                let card = createStory(filtered);
                storyGrid.innerHTML += card;
            })
            break;
        case "/Home/Category/Horror":
            filteredStory = storyFilter(story, 5);
            filteredStory.forEach(filtered => {
                let card = createStory(filtered);
                storyGrid.innerHTML += card;
            })
            break;
        case "/Home/Category/Adventure":
            filteredStory = storyFilter(story, 6);
            filteredStory.forEach(filtered => {
                let card = createStory(filtered);
                storyGrid.innerHTML += card;
            })
            break;
        case "/Home/Category/Drama":
            filteredStory = storyFilter(story, 7);
            filteredStory.forEach(filtered => {
                let card = createStory(filtered);
                storyGrid.innerHTML += card;
            })
            break;
        case "/Home/Category/Comedy":
            filteredStory = storyFilter(story, 8);
            filteredStory.forEach(filtered => {
                let card = createStory(filtered);
                storyGrid.innerHTML += card;
            })
            break;
        case "/Home/Category/Historical":
            filteredStory = storyFilter(story, 9);
            filteredStory.forEach(filtered => {
                let card = createStory(filtered);
                storyGrid.innerHTML += card;
            })
            break;
        case "/Home/Category/Thriller":
            filteredStory = storyFilter(story, 10);
            filteredStory.forEach(filtered => {
                let card = createStory(filtered);
                storyGrid.innerHTML += card;
            })
            break;
    }
}

function storyFilter(story, number) {
    const filteredStories = story.filter(story => story.categorySt == number);
    return (filteredStories);
}

function createStory(filteredStory) {
    console.log(filteredStory);
    const statusClass = `status-${filteredStory.StateSt}`;
    console.log(filteredStory.stateSt)

    const stars = '★'.repeat(filteredStory.rateSt) + '☆'.repeat(5 - filteredStory.rateSt);

    return `
            <div class="story-card" data-story-id="${filteredStory.idSt}">
                <div class="story-image">📚</div>
                <div class="story-info">
                    <h3>${filteredStory.titleSt}</h3>
                    <div class="story-rating">${stars}</div>
                    <div class="story-meta">
                        <div><strong>Autor:</strong> ${filteredStory.autorNameSt}</div>
                    </div>
                    <div class="story-status ${statusClass}">
                        ${filteredStory.stateSt ? "Finished" : "In progress"}
                    </div>
                </div>
            </div>
        `;
}

const sort = document.getElementById("sortBy");

sort.addEventListener("change", function () {
    let sorted = [...filteredStory]; 

    switch (sort.value) {
        case "0":
            sorted = sorted.filter(s => !s.stateSt);
            break;
        case "1":
            sorted = sorted.filter(s => s.stateSt);
            break;
        case "4":
            sorted.sort((a, b) => b.rateSt - a.rateSt);
            break;
    }

    storyGrid.innerHTML = "";
    sorted.forEach(st => {
        let card = createStory(st);
        storyGrid.innerHTML += card;
    });
});

urldetection();