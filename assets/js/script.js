const axios = require('axios').default; // avec intellisense/autocomplete
const regeneratorRuntime = require("regenerator-runtime");

// Définition de la classe Character
class Character {
    constructor (name, shortDescription, description, image) {
	    this.name = name;
	    this.shortDescription = shortDescription;
	    this.description = description;
	    this.image = image;
	}
}

// Fonction principale
(function main() {

	// Déclaration de variables globales du programme
	let charactersID = [];
	let viewButtons = [];
	let editButtons = [];
	let deleteButtons = [];

	let characterToEdit = {};

	// Récupération d'éléments HTML
	const viewWindow = document.getElementById("overlayView");
	const createWindow = document.getElementById("overlayCreation");
	const editWindow = document.getElementById("overlayEdit");

	// Lancement du programme

	// Génération des cartes contenant les données de l'API
	axiosGetAllExistingCharacters()
	.then(charactersArray => {
		displayAllCharacters(charactersArray.data);
		//console.table(charactersID);
		getAllButtons();
	})
	.catch(error => console.error(error));

	// Boutons d'action

	document.getElementById("btnCreation").addEventListener("click", () => {
		resetForm();
		displayWindow(createWindow);
	});

	document.getElementById("createSubmitButton").addEventListener("click", () => {
		const characterToAdd = createOneCharacter();

		axiosPostOneCharacter(characterToAdd)
		.then(character => {
			console.table(character.data);
			undisplayWindow(createWindow);
			window.location.reload(false);
		})
		.catch(error => console.error(error));
	});

	document.getElementById("editSubmitButton").addEventListener("click", () => {
		let editedCharacter = changeValuesToEditOneCharacter(characterToEdit);

		console.log("editedcharacter", editedCharacter);

		console.log("editedcharacter ID", editedCharacter.id);

		axiosUpdateOneCharacter(editedCharacter)
		.then(data => {
			console.table(data);
			undisplayWindow(editWindow);
			window.location.reload(false);
		})
		.catch(error => console.error(error));
	});

	document.getElementById("createImgSelector").addEventListener("change", () => {
		readImage(document.getElementById("createImgSelector"), document.getElementById("createImgPreview"));		
	});

	document.getElementById("editImgSelector").addEventListener("change", () => {
		readImage(document.getElementById("editImgSelector"), document.getElementById("editImgPreview"));
	});

	document.getElementById("closeView").addEventListener("click", () => {
		undisplayWindow(viewWindow);
	});

	document.getElementById("closeCreate").addEventListener("click", () => {
		undisplayWindow(createWindow);
	});

	document.getElementById("closeEdit").addEventListener("click", () => {
		undisplayWindow(editWindow);
	});

	// FIN MAIN PROGRAM


	// FUNCTIONS API CALLS

	async function axiosGetAllExistingCharacters() {
		try {
			return await axios.get("https://character-database.becode.xyz/characters");
		} 
		catch (error) {
			console.error(error);
		}
	}

	async function axiosGetOneCharacter(characterID) {
		try {
			return await axios.get("https://character-database.becode.xyz/characters" + "/" + characterID);
		}
		catch (error) {
			console.error(error);
		}
	}

	async function axiosPostOneCharacter(newCharacter) {
		try {

			return await axios.post("https://character-database.becode.xyz/characters", {
				name: newCharacter.name,
				shortDescription: newCharacter.shortDescription,
				description: newCharacter.description,
				image: newCharacter.image
			});
		}
		catch (error)
		{
			console.error(error);
		}
	}

	async function axiosUpdateOneCharacter(characterToUpdate) {
		try {

			return await axios.put("https://character-database.becode.xyz/characters" + "/" + characterToUpdate.id, {
				name: characterToUpdate.name,
				shortDescription: characterToUpdate.shortDescription,
				description: characterToUpdate.description,
				image: characterToUpdate.image
			});
		}
		catch (error)
		{
			console.error(error);
		}

		console.log(characterToUpdate.id);
	}

	async function axiosDeleteOneCharacter(characterID) {
		try {

			return await axios.delete("https://character-database.becode.xyz/characters" + "/" + characterID);
		}
		catch (error)
		{
			console.error(error);
		}
	}

	// FUNCTIONS MANAGING DATA

	function getAllButtons()
	{
		viewButtons = document.getElementsByClassName("viewHero");
		editButtons = document.getElementsByClassName("editHero");
		deleteButtons = document.getElementsByClassName("deleteHero");

		for (let i = 0; i < viewButtons.length; i++)
		{
			viewButtons[i].addEventListener("click", async () => {
				const characterToView = await axiosGetOneCharacter(charactersID[i]);
				displayWindow(viewWindow);
				displayOneCharacter(characterToView.data);
			});

			editButtons[i].addEventListener("click", async () => {
				const characterToEdit = await axiosGetOneCharacter(charactersID[i]);
				displayWindow(editWindow);
				retrieveValuesToEditOneCharacter(characterToEdit.data);
			});

			deleteButtons[i].addEventListener("click", async () => {
				return await deleteOneCharacter(i);
			});
		}
	}

	function displayAllCharacters(charactersArray)
	{	
		const charactersElement = document.getElementById("charactersBoard");
		const template = document.getElementById("tpl-card");

		charactersArray.forEach(character => {
			const clone = template.content.cloneNode(true);

			clone.querySelector(".card-title").innerHTML = character.name;
			clone.querySelector(".card-text").innerHTML = character.shortDescription;
			clone.querySelector(".card-img").src = "data:image/*;base64," + character.image;
			charactersID.push(character.id);

			charactersElement.appendChild(clone);
		});
		
	}

	function displayOneCharacter(character)
	{	
		document.querySelector(".viewCardTitle").innerHTML = character.name;
		document.querySelector(".viewCardText").innerHTML = character.shortDescription;
		document.querySelector(".viewCardLongtext").innerHTML = character.description;
		document.querySelector(".viewCardImg").src = "data:image/*;base64," + character.image;
	}

	function retrieveValuesToEditOneCharacter(character)
	{	
		document.getElementById("editName").value = character.name;
		document.getElementById("editShortDescription").value = character.shortDescription;
		document.getElementById("editDescription").value = character.description;
		document.getElementById("editImgPreview").src = "data:image/*;base64," + character.image;

		characterToEdit = character;
		console.log("Character ID:", character.id);
		console.log("CharacterToEdit ID:", characterToEdit.id);

		console.log("retrieveValue", characterToEdit.name);
	}

		// répétition sélection d'image et récupération base64
		
	function changeValuesToEditOneCharacter(character)
	{
		// vérification que les champs soient tous remplis
		const nameInput = document.getElementById("editName").value;
		const shortDescriptionInput = document.getElementById("editShortDescription").value;
		const descriptionInput = document.getElementById("editDescription").value;

		const imagePreviewElement = document.getElementById("editImgPreview");

		console.log(nameInput);
		console.log(shortDescriptionInput);
		console.log(descriptionInput);

		const base64String = imagePreviewElement.src
		.replace('data:', '')
        .replace(/^.+,/, '');

	    character.name = nameInput;
	    character.shortDescription = shortDescriptionInput;
	    character.description = descriptionInput;
	    character.image = base64String;

		return character;
	}

	async function deleteOneCharacter(index)
	{	
		let response = confirm("Are you sure you want to delete this character?");

		if(response === true)
		{
			const deletedCharacter = await axiosDeleteOneCharacter(charactersID[index]);
			window.location.reload(false);
			return deletedCharacter;
		}
		else
		{
			alert("The character has not been deleted.");
		}
	}

	function resetForm() {
		document.getElementById("createName").value = "";
		document.getElementById("createShortDescription").value = "";
		document.getElementById("createDescription").value = "";
		document.getElementById("createImgPreview").src = "";
		document.getElementById("createImgSelector").value = "";
	}

	function createOneCharacter()
	{
		const nameInput = document.getElementById("createName").value;
		const shortDescriptionInput = document.getElementById("createShortDescription").value;
		const descriptionInput = document.getElementById("createDescription").value;

		const imagePreviewElement = document.getElementById("createImgPreview");

		console.log(nameInput);
		console.log(shortDescriptionInput);
		console.log(descriptionInput);

		const base64String = imagePreviewElement.src
		.replace('data:', '')
        .replace(/^.+,/, '');

		const newCharacter = new Character(nameInput, shortDescriptionInput, descriptionInput, base64String);

		return newCharacter;
	}

	function readImage(imageSelector, imagePreview)
	{
		const imageSelectorInput = imageSelector.files[0];
		const imagePreviewElement = imagePreview;

		const reader = new FileReader();
		reader.addEventListener('load', (event) => {
		    imagePreviewElement.src = event.target.result;
		});
		reader.readAsDataURL(imageSelectorInput);
	}

	function displayWindow(window)
	{
	    window.style.display = "block";
	}

	function undisplayWindow(window)
	{
	    window.style.display = "none";
	}

})();