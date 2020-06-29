const axios = require('axios').default; // avec intellisense/autocomplete
const regeneratorRuntime = require("regenerator-runtime");

(() => {
	async function getAllExistingCharacters() {
		try {
			return await axios.get("https://character-database.becode.xyz/characters");
		} 
		catch (error) {
			console.error(error);
		}
	}

	function displayAllCharacters(charactersArray)
	{
		const characterElement = document.getElementById("character");
		const template = document.getElementById("tpl-character");

		charactersArray.forEach(character => {
			const clone = template.content.cloneNode(true);

			clone.getElementById("name").innerHTML = character.name;
			clone.getElementById("shortDescription").innerHTML = character.shortDescription;
			clone.getElementById("description").innerHTML = character.description;
			clone.getElementById("image").src = character.image;

			characterElement.appendChild(clone);
		});
	}

	getAllExistingCharacters()
	.then(charactersArray => {
		displayAllCharacters(charactersArray.data);
	})
	.catch(error => console.error(error));

})();