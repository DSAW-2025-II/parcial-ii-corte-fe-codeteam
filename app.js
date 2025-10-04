const BASE_URL = "https://parcial-ii-corte-be-codeteam-19.onrender.com";

//--Elementos--//
const loginButton = document.getElementById('loginButton');
const searchButton = document.getElementById('searchButton');
const pokemonInput = document.getElementById("pokemonName");

const loginPoke = document.getElementById("loginPoke");
const searchPoke = document.getElementById("searchPoke");
const resultPoke = document.getElementById("resultPoke");
const errorPoke = document.getElementById("errorPoke");

window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('sessionToken');
    if (token) {
        loginPoke.style.display = 'none';
        searchPoke.style.display = 'block';
    }
});

// --- LOGIN ---
loginButton.addEventListener('click', async () => {
    try {
        loginButton.disabled = true;
        loginButton.textContent = "Iniciando sesión...";

        const response = await fetch(`${BASE_URL}/api/v1/auth`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "admin@admin.com", password: "admin" })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.error || "Error en login");
            loginButton.disabled = false;
            loginButton.textContent = "Login";
            return;
        }

        localStorage.setItem("sessionToken", data.token);
        alert("✅ Login exitoso");

        //--Oculto el login y muestro el buscador--//
        document.getElementById("loginPoke").style.display = "none";  
        document.getElementById("searchPoke").style.display = "block";  

    } catch (error) {
        alert(error.message || "Error en el login");
        loginButton.disabled = false;
        loginButton.textContent = "Login";
    }
});

// --- BUSCAR POKÉMON ---
searchButton.addEventListener('click', async () => {
    const pokeName = pokemonInput.value.trim().toLowerCase();
    const token = localStorage.getItem("sessionToken");

    if (!token) {
        alert("⚠️ Primero haz login");
        return;
    }

    if (!pokeName) {
        alert("⚠️ Ingresa el nombre de un Pokémon");
        return;
    }

    try {
        searchButton.disabled = true;
        searchButton.textContent = "Buscando...";

        const response = await fetch(`${BASE_URL}/api/v1/pokemonDetails`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}`
        },
            body: JSON.stringify({ pokemonName: pokeName })
        });

        const data = await response.json();

       if (response.status === 200 && data.name) {
            document.getElementById("pokemonImage").src = data.img_url;
            document.getElementById("pokemonImage").style.display = "block";
            document.getElementById("pokemonNameR").textContent = data.name;
            document.getElementById("pokemonSpeciesR").textContent = data.species;
            document.getElementById("pokemonWeightR").textContent = data.weight;

            errorPoke.classList.remove("active");
            resultPoke.classList.add("active");

        } else if (response.status === 400) {
            resultPoke.classList.remove("active");
            errorPoke.classList.add("active");
            errorPoke.textContent = "❌ Pokémon no encontrado";

        } else if (response.status === 403) {
            alert("⚠️ Sesión expirada, haz login de nuevo");
            localStorage.removeItem("sessionToken");
            loginPoke.style.display = "block";
            searchPoke.style.display = "none";
            resultPoke.classList.remove("active");
            errorPoke.classList.remove("active");
        }

    } catch (error) {
        console.error("Error en la búsqueda:", error);
        errorPoke.classList.add("active");
        errorPoke.textContent = "❌ Error de conexión con el servidor";
    } finally {
        searchButton.disabled = false;
        searchButton.textContent = "Buscar";
    }
});



