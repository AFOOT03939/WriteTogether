const GEMINI_API_KEY = "micadena"; 
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

async function callGeminiAPI(prompt, isJsonMode = false) {
    const requestBody = {
        contents: [{ parts: [{ text: prompt }] }]
    };

    // Si pedimos JSON, forzamos el modo JSON de Gemini (disponible en modelos nuevos)
    // o simplemente confiamos en el prompt si el modelo no soporta generationConfig explícito via REST simple sin SDK.
    // Para asegurar compatibilidad con fetch simple, reforzamos el prompt.

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) throw new Error(`Error API: ${response.status}`);

        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text;

        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return cleanText;
    } catch (error) {
        throw error;
    }
}

async function getAllFragments(storyId) {
    const response = await fetch(`/Fragments/getByStory/${storyId}`);
    return await response.json();
}

async function updateFragmentInDB(fragmentId, correctedText) {
    await fetch(`/Fragments/updateFragment/${fragmentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ContentFr: correctedText }),
    });
}

async function correctFragment(fragmentId, originalText, fragmentElement, storyId) {
    const textDiv = fragmentElement.querySelector(".frag_text");
    const originalHTML = textDiv.innerHTML;
    textDiv.innerHTML = '<span style="color: blue;">✨ Analizando contexto y corrigiendo...</span>';

    try {
        // 1. Obtener contexto
        const allFragments = await getAllFragments(storyId);
        const previousFragments = allFragments
            .filter(f => f.id < fragmentId)
            .sort((a, b) => a.id - b.id);

        let prompt = "";

        if (previousFragments.length > 0) {
            const contextText = previousFragments.map(f => f.content).join("\n---\n");

            prompt = `
            Actúa como un editor literario experto. Tienes la tarea de corregir el SIGUIENTE FRAGMENTO de una historia.
            
            INSTRUCCIONES CRÍTICAS:
            1. Analiza el TONO y ESTILO de los "FRAGMENTOS ANTERIORES".
            2. Reescribe el "FRAGMENTO A CORREGIR" eliminando errores ortográficos y gramaticales.
            3. ADAPTA el estilo del fragmento para que fluya naturalmente con lo anterior (mismo tiempo verbal, misma voz narrativa, vocabulario acorde).
            4. Solo devuelve el texto corregido. Nada más.

            FRAGMENTOS ANTERIORES (Contexto):
            ${contextText}

            FRAGMENTO A CORREGIR:
            ${originalText}
            `;
        } else {
            prompt = `
            Corrige la ortografía, puntuación y gramática del siguiente texto. 
            Mantenlo coherente y profesional. Solo devuelve el texto corregido:
            
            ${originalText}
            `;
        }

        const correctedText = await callGeminiAPI(prompt);

        await updateFragmentInDB(fragmentId, correctedText);
        textDiv.textContent = correctedText;

        fragmentElement.style.backgroundColor = "#d1e7dd";
        setTimeout(() => fragmentElement.style.backgroundColor = "", 1500);

    } catch (error) {
        console.error(error);
        textDiv.innerHTML = originalHTML; 
        alert("Ocurrió un error al procesar la solicitud.");
    }
}

async function correctAllFragments(storyId) {
    const loadingOverlay = document.createElement('div');
    loadingOverlay.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);color:white;display:flex;justify-content:center;align-items:center;z-index:9999;font-size:20px;";
    loadingOverlay.innerText = "🤖 La IA está reescribiendo tu historia para darle coherencia total. Esto puede tardar unos segundos...";
    document.body.appendChild(loadingOverlay);

    try {
        const fragments = await getAllFragments(storyId);
        if (fragments.length === 0) throw new Error("La historia está vacía");
        fragments.sort((a, b) => a.id - b.id);

        const fragmentsPayload = fragments.map(f => ({ id: f.id, text: f.content }));

        const prompt = `
        Eres un editor de novelas best-seller. Vas a recibir una lista de fragmentos de una historia en formato JSON.
        
        TU TAREA:
        1. Leer todos los fragmentos y entender la narrativa global.
        2. Reescribir CADA fragmento para que la historia completa tenga:
           - Coherencia total (mismo tono, sin contradicciones).
           - Ortografía perfecta.
           - Transiciones suaves entre fragmentos.
        3. NO fusiones fragmentos. Si recibes 5 fragmentos, devuelve 5 fragmentos.
        4. Devuelve UNICAMENTE un JSON válido con este formato exacto:
        
        [
            { "id": 123, "text": "Texto corregido del fragmento..." },
            { "id": 124, "text": "Texto corregido del siguiente..." }
        ]

        ENTRADA JSON:
        ${JSON.stringify(fragmentsPayload)}
        `;

        const responseText = await callGeminiAPI(prompt);

        let correctedData;
        try {
            correctedData = JSON.parse(responseText);
        } catch (e) {
            throw new Error("La IA no devolvió un formato válido. Intenta de nuevo.");
        }
        const updatePromises = correctedData.map(item => {
            if (fragments.some(f => f.id === item.id)) {
                return updateFragmentInDB(item.id, item.text);
            }
            return Promise.resolve();
        });

        await Promise.all(updatePromises);

        alert("¡Historia completamente unificada y corregida!");
        location.reload(); 

    } catch (error) {
        console.error(error);
        alert("Error: " + error.message);
    } finally {
        document.body.removeChild(loadingOverlay);
    }
}