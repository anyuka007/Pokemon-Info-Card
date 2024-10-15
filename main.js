document.addEventListener("DOMContentLoaded", (event) => {
    const searchButton = document.querySelector(".search button");
    const inputField = document.querySelector("input");
    const cardElement = document.querySelector(".card");
    const nameElement = document.querySelector(".name");
    const audioButton = document.getElementById("play-audio-button");
    const xpElement = document.querySelector(".xp");
    const abilitiesElement = document.querySelector(".abilities");
    const statsElement = document.querySelector(".stats");
    const imageElement = document.querySelector("img");
    const typeElement = document.querySelector(".type");

    let audio = undefined;
    function audioClickHandler() {
        if (audio) {
            audio.play();
        }
    }

    // eventListener wurde sowohl auf button click als auch auf Enter gesetzt

    function fetchPokemon() {
        const inputValue = inputField.value.trim();

        if (inputValue === "") {
            alert("Input is empty");
            return;
        }
        fetch(`https://pokeapi.co/api/v2/pokemon/${inputValue.toLowerCase()}`, {
            method: "GET",
        })
            .then((response) => response.json())
            .then((data) => {
                audio = new Audio(data.cries.latest);

                cardElement.style.display = "block";
                nameElement.textContent =
                    data.name[0].toUpperCase() +
                    data.name.slice(1).toLowerCase();
                xpElement.textContent = `${data.base_experience}XP`;
                imageElement.src =
                    data.sprites.other["official-artwork"].front_default ??
                    data.sprites.front_default;

                audioButton.addEventListener("click", audioClickHandler);
                imageElement.alt = data.name;

                // Clear previous abilities and stats
                typeElement.innerHTML = "Type";
                statsElement.innerHTML = "Stats";
                abilitiesElement.innerHTML = "Abilities";

                // Add type
                data.types.forEach((type) => {
                    const li = document.createElement("li");
                    li.textContent = `${type.type.name}`;
                    typeElement.appendChild(li);
                });
                // Add stats
                data.stats.forEach((stat) => {
                    const li = document.createElement("li");
                    li.textContent = `${stat.stat.name}: ${stat.base_stat}`;
                    statsElement.appendChild(li);
                });

                // Add abilities
                data.abilities.forEach((ability) => {
                    const li = document.createElement("li");
                    li.textContent = ability.ability.name;
                    abilitiesElement.appendChild(li);
                });
            })

            .catch((error) => alert("Error: There is no such pokemon", error));
    }

    searchButton.addEventListener("click", fetchPokemon);

    inputField.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            fetchPokemon();
        }
    });
});
