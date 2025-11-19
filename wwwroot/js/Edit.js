/*
    TITULO: FUNCIONALIDAD PARA LA EDICION DE HISTORIAS
    AUTOR: ADRIEL HERRERA


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

    console.log("Enviando:", storyData);

    try {
        let response = await fetch("/Stories/createStory", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(storyData)
        });

        if (response.ok) {
            const result = await response.json();
            alert("¡Historia publicada exitosamente!");
        } else {
            const errorData = await response.json();
            alert(`No se pudo publicar la historia: ${JSON.stringify(errorData)}`);
        }

    } catch (error) {
        alert("Error de red. Revisa la consola.");
        console.error(error);
    }
});



/**
 * Esta función bloquea todos los controles de la página
 * para pasar al estado "Publicado" (solo lectura).
 */
function enterPublishedState(publishedTitle) {
    // 1. Actualizar el texto de estado
    const statusBar = document.getElementById("editbar");
    if (statusBar) {
        statusBar.textContent = "Status: Published";
    }

    // 2. Deshabilitar el título
    const titleInput = document.getElementById("title_edit");
    if (titleInput) {
        titleInput.value = publishedTitle; // Asegura el valor
        titleInput.disabled = true; // Lo bloquea
        titleInput.classList.add("published-title"); // Clase para que le quites el borde con CSS
    }

    // 3. Ocultar todos los botones de edición
    const buttonsToHide = document.querySelectorAll(".editbarbut, .xtag[onclick='addTag()'], .buttons_ia");
    buttonsToHide.forEach(btn => {
        btn.style.display = 'none';
    });
    
    // 4. Deshabilitar los inputs restantes
    const inputsToDisable = document.querySelectorAll("#story_category_id, #add_tag, #input_story");
    inputsToDisable.forEach(input => {
        input.disabled = true;
        input.style.backgroundColor = "#f0f0f0"; // Color de fondo gris
    });

    // 5. Ocultar el área de "add new tag"
    const addTagArea = document.getElementById("info_add_tags_edit");
    if(addTagArea) addTagArea.style.display = 'none';
}


var numberTags = 0; 
var numberFrags = 0;

function addTag() {
    //IDENTIFICACION Y SELECCION DE DIVS
    const padre = document.getElementById("info_tags_box");
    const nueva_tag = document.createElement("div");
    const nueva_x = document.createElement("div");
    const input_texto = document.getElementById("add_tag");

    //SI EL USUARIO DEJA EL INPUT DEL TAG VACIO O SI ES MUY LARGO, NO PROSEGUIR
    if (input_texto.value == "" || input_texto.value == null || input_texto.value.length > 50) {
        alert("Ingresa una etiqueta válida. Inténtalo nuevamente. :D")

    } else {
        //CREAR NUEVA TAG Y NUEVA X
        nueva_tag.classList.add("info_tags");
        nueva_x.classList.add("xtag");
        nueva_tag.id = "tag" + numberTags;
        nueva_x.id = numberTags;
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
}

function deleteTag(xid) {
    const tag = document.getElementById("tag" + xid);
    tag.remove();
    numberTags -= 1;
}

async function addFrag() {
    //IDENTIFICACION Y SELECCION DE DIVS
    const padre = document.getElementById("notebook_edit");
    const nuevo_frag = document.createElement("div");
    const nuevo_user = document.createElement("div");
    const nuevo_texto = document.createElement("div");
    const input_texto = document.getElementById("input_story");
    var color = generarColor();

    //SI EL USUARIO DEJA EL INPUT VACIO, NO PROSEGUIR
    if (input_texto.value == "" || input_texto.value == null) {
        alert("Ingresa un texto válido. Inténtalo nuevamente. :D")

    } else {
        //CREAR NUEVO FRAGMENTO
        nuevo_frag.classList.add("history_fragment");
        nuevo_user.classList.add("frag_user");
        nuevo_texto.classList.add("frag_text");
        nuevo_frag.id = "frag" + numberFrags;
        nuevo_texto.textContent = input_texto.value;
        nuevo_user.textContent = "Nombre de usuario";
        nuevo_user.style.color = color;
        nuevo_frag.style.borderLeft = "solid 4px " + color;
        
        const params = new URLSearchParams(window.location.search);

        let data = {
            ContentFr: input_texto.value,
            DateUs: new Date().toISOString(),
            StoryFr: parseInt(params.get("id"))
        }
        try {
            const response = await fetch("/Fragments/postFragments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)

            })
            const result = await response.json();
            console.log(result.message);
        } catch (error) {
            console.error(error)
        }

        padre.appendChild(nuevo_frag);
        nuevo_frag.appendChild(nuevo_user);
        nuevo_frag.appendChild(nuevo_texto);
        input_texto.value = "";
        numberFrags += 1;
    }
}

function deleteFrag(xid) {
    const tag = document.getElementById("tag" + xid);
    tag.remove();
    numberTags -= 1;
}

function generarRandom(min, max) {
    return (Math.floor(Math.random() * (max - min)) + min);
}

function generarColor() {
    var numero = generarRandom(0, 7);
    var color = "black";

    switch (numero) {
        case 0:
            color = "rgb(228, 8, 10)"; //ROJO
            break;
        case 1:
            color = "rgb(244, 147, 1)"; //NARANJA
            break;
        case 2:
            color = "rgb(246, 198, 7)"; //AMARILLO
            break;
        case 3:
            color = "rgb(57, 184, 7)"; //VERDE
            break;
        case 4:
            color = "rgb(8, 1, 199)"; //AZUL
            break;
        case 5:
            color = "rgb(110, 1, 199)"; //MORADO
            break;
        case 6:
            color = "rgb(147, 75, 3)"; //CAFE
            break;
        case 7:
            color = "rgb(3, 144, 147)"; //AQUA
            break;
        default:
            color = "black";
            break;
        
    }
    
    return color;
}

