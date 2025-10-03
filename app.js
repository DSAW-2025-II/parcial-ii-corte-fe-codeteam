const loginButton = document.getElementById('loginButton');

loginButton.addEventListener('click', async () => {
    try {
        //Envìo las credenciales al backend
        const response = await fetch("https://TU_BACKEND_URL/api/v1/pokemonDetails", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({email: "admin@admin.com", password:"admin"})
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.error); 
            return;
        }

        localStorage.setItem("sessionToken", data.token);

        alert("Login successful!");

        } catch (error) {
            alert(error.message || "An error occurred during login.");
        }
});

const searchButton = document.getElementById('searchButton');
const pokemonInput = document.getElementById("pokeInput");

searchButton.addEventListener('click', async () => {
    const pokeName = pokemonInput.value.trim().toLowerCase();
    const token = localStorage.getItem("sessionToken");

    if (!token) {
            alert("Please log in first.");
        return;
    }

    try {
        const response = await fetch("https://TU_BACKEND_URL/api/v1/pokemonDetails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Envío el token en el header
            },
            body: JSON.stringify({ pokemonName: pokeName })
        });

        const data = await response.json();

        if (response.status === 200) {
            document.getElementById("message").textContent = "";
            document.getElementById("pokemonImage").src = data.img_url;
            document.getElementById("pokemonImage").style.display = "block";
            document.getElementById("pokemonName").textContent = `Nombre: ${data.name}`;
            document.getElementById("pokemonSpecies").textContent = `Especie: ${data.species}`;
            document.getElementById("pokemonWeight").textContent = `Peso: ${data.weight}`;
        } else {
            document.getElementById("message").textContent = "Ups! Pokémon no encontrado";
            document.getElementById("pokemonImage").style.display = "none";
            document.getElementById("pokemonName").textContent = "";
            document.getElementById("pokemonSpecies").textContent = "";
            document.getElementById("pokemonWeight").textContent = "";
        }

        } catch (error) {
        console.error("Error en la búsqueda:", error);
    }
});

