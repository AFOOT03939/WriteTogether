let publishBtn = document.getElementsByClassName("editbarbut");

publishBtn[0].addEventListener("click", async function () {
    let titleInput = document.getElementById("title_edit_input");
    let title;

    if (titleInput) {
        title = titleInput.value.trim();
    } else {
        title = document.getElementById("title_edit").textContent.trim();
    }

    const authorId = parseInt(document.getElementById("story_author_id").value, 10);
    const categoryId = parseInt(document.getElementById("story_category_id").value, 10);
    const statusBool = true;
    const rate = 0;
    const poster = "default_poster.png";

    if (isNaN(authorId)) {
        alert("Error: No se encontró el autor.");
        return;
    }

    if (isNaN(categoryId)) {
        alert("Error: Selecciona una categoría.");
        return;
    }

    const storyData = {
        TitleSt: title,
        AutorSt: authorId,
        CategorySt: categoryId,
        StateSt: statusBool,
        RateSt: rate,
        PosterSt: poster
    };

    try {
        let response = await fetch("/Stories/createStory", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(storyData)
        });

        if (response.ok) {
            const result = await response.json();
            alert("¡Historia publicada exitosamente!");
            enterPublishedState(title);
        } else {
            const errorData = await response.json();
            alert(`No se pudo publicar: ${JSON.stringify(errorData)}`);
        }
    } catch (error) {
        alert("Error de red. Revisa la consola.");
        console.error(error);
    }
});

/**
 * Bloquea controles para modo "solo lectura" tras publicar
 */
function enterPublishedState(publishedTitle) {
    const statusBar = document.getElementById("editbar");
    if (statusBar) statusBar.textContent = "Status: Published";

    const titleInput = document.getElementById("title_edit");
    if (titleInput) {
        titleInput.value = publishedTitle;
        titleInput.disabled = true;
        titleInput.classList.add("published-title");
    }

    const buttonsToHide = document.querySelectorAll(".editbarbut, .xtag[onclick='addTag()'], .buttons_ia");
    buttonsToHide.forEach(btn => btn.style.display = 'none');

    const inputsToDisable = document.querySelectorAll("#story_category_id, #add_tag, #input_story");
    inputsToDisable.forEach(input => {
        input.disabled = true;
        input.style.backgroundColor = "#f0f0f0";
    });

    const addTagArea = document.getElementById("info_add_tags_edit");
    if (addTagArea) addTagArea.style.display = 'none';
}

var numberTags = 0;
var numberFrags = 0;

function addTag() {
    const padre = document.getElementById("info_tags_box");
    const input_texto = document.getElementById("add_tag");

    if (!input_texto.value || input_texto.value.length > 50) {
        alert("Ingresa una etiqueta válida (máx 50 caracteres)");
        return;
    }

    const nueva_tag = document.createElement("div");
    const nueva_x = document.createElement("div");

    nueva_tag.classList.add("info_tags");
    nueva_x.classList.add("xtag");
    nueva_tag.id = "tag" + numberTags;
    nueva_x.id = numberTags.toString();
    nueva_tag.textContent = input_texto.value;
    nueva_x.textContent = "x";

    nueva_x.onclick = function () {
        deleteTag(nueva_x.id);
    };

    padre.appendChild(nueva_tag);
    nueva_tag.appendChild(nueva_x);
    input_texto.value = "";
    numberTags += 1;
}

function deleteTag(xid) {
    const tag = document.getElementById("tag" + xid);
    if (tag) {
        tag.remove();
        numberTags -= 1;
    }
}

async function addFrag() {
    const padre = document.getElementById("notebook_edit");
    const input_texto = document.getElementById("input_story");

    if (!input_texto.value) {
        alert("Ingresa un texto válido");
        return;
    }

    // OBTENER EL ID CORRECTAMENTE
    const storyId = parseInt(document.getElementById("story_id").value);

    let data = {
        ContentFr: input_texto.value,
        DateUs: new Date().toISOString(),
        StoryFr: storyId
    };

    try {
        const response = await fetch("/Fragments/postFragments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        console.log(result.message);

    } catch (error) {
        console.error("Error al guardar fragmento:", error);
    }

    // Render normal
    const nuevo_frag = document.createElement("div");
    const nuevo_user = document.createElement("div");
    const nuevo_texto = document.createElement("div");
    const color = generarColor();

    nuevo_frag.classList.add("history_fragment");
    nuevo_user.classList.add("frag_user");
    nuevo_texto.classList.add("frag_text");

    nuevo_frag.style.borderLeft = "solid 4px " + color;
    nuevo_user.style.color = color;

    nuevo_user.textContent = currentUserName + "  Now" || "Unknown   Now";
    nuevo_texto.textContent = input_texto.value;

    nuevo_frag.appendChild(nuevo_user);
    nuevo_frag.appendChild(nuevo_texto);
    padre.appendChild(nuevo_frag);

    input_texto.value = "";
    numberFrags += 1;
}

function generarRandom(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generarColor() {
    const colores = [
        "rgb(228, 8, 10)",    // ROJO
        "rgb(244, 147, 1)",   // NARANJA
        "rgb(246, 198, 7)",   // AMARILLO
        "rgb(57, 184, 7)",    // VERDE
        "rgb(8, 1, 199)",     // AZUL
        "rgb(110, 1, 199)",   // MORADO
        "rgb(147, 75, 3)",    // CAFE
        "rgb(3, 144, 147)"    // AQUA
    ];
    return colores[generarRandom(0, colores.length)];
}

async function loadFragments() {
    const storyId = parseInt(document.getElementById("story_id").value);

    const response = await fetch(`/Fragments/getByStory/${storyId}`);
    const fragments = await response.json();

    const container = document.getElementById("notebook_edit");
    container.innerHTML = ""; // limpiar

    fragments.forEach(f => {
        const color = generarColor();

        const frag = document.createElement("div");
        frag.classList.add("history_fragment");
        frag.style.borderLeft = "solid 4px " + color;

        const userDiv = document.createElement("div");
        userDiv.classList.add("frag_user");
        userDiv.style.color = color;
        userDiv.textContent = f.autor;

        const textDiv = document.createElement("div");
        textDiv.classList.add("frag_text");
        textDiv.textContent = f.content;

        frag.appendChild(userDiv);
        frag.appendChild(textDiv);

        container.appendChild(frag);
    });
}

window.onload = loadFragments;
