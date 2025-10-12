console.log(window.location.pathname);
const storyGrid = document.getElementById("storiesGrid");
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
            let filteredStory = storyFilter(story, 1);
            filteredStory.forEach(filtered => {
                let card = createStory(filtered);
                storyGrid.innerHTML += card;
            })
            break;
        case "/Home/Category/Romance":
            filteredStory = storyFilter(story, 2);
            createStory(filteredStory);
            break;
        case "/Home/Category/Mistery":
            filteredStory = storyFilter(story, 3);
            createStory(filteredStory);
            break;
        case "/Home/Category/Scifi":
            filteredStory = storyFilter(story, 4);
            createStory(filteredStory);
            break;
        case "/Home/Category/Horror":
            filteredStory = storyFilter(story, 5);
            createStory(filteredStory);
            break;
        case "/Home/Category/Adventure":
            filteredStory = storyFilter(story, 6);
            createStory(filteredStory);
            break;
        case "/Home/Category/Drama":
            filteredStory = storyFilter(story, 7);
            createStory(filteredStory);
            break;
        case "/Home/Category/Comedy":
            filteredStory = storyFilter(story, 8);
            createStory(filteredStory);
            break;
        case "/Home/Category/Historical":
            filteredStory = storyFilter(story, 9);
            createStory(filteredStory);
            break;
        case "/Home/Category/Thriller":
            filteredStory = storyFilter(story, 10);
            createStory(filteredStory);
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
    const statusText = {
        completed: 'Completada',
        ongoing: 'En progreso',
        paused: 'Pausada'
    };

    const stars = '★'.repeat(filteredStory.rateSt) + '☆'.repeat(5 - filteredStory.rateSt);

    return `
            <div class="story-card" data-story-id="${filteredStory.idSt}">
                <div class="story-image">📚</div>
                <div class="story-info">
                    <h3>${filteredStory.titleSt}</h3>
                    <div class="story-rating">${stars}</div>
                    <div class="story-meta">
                        <div><strong>Autor:</strong> ${filteredStory.autorSt}</div>
                    </div>
                    <div class="story-status ${statusClass}">${statusText[filteredStory.stateSt]}</div>
                </div>
            </div>
        `;
}

urldetection();