const axios = require('axios').default; // avec intellisense/autocomplete
const regeneratorRuntime = require("regenerator-runtime");

class Character {
    constructor (name, shortDescription, description, image) {
	    this.name = name;
	    this.shortDescription = shortDescription;
	    this.description = description;
	    this.image = image;
	}
}

(function main() {

	// MAIN PROGRAM

	let charactersID = [];
	let editButtons = [];
	let deleteButtons = [];

	const viewWindow = document.getElementById("viewWindow");
	const creationWindow = document.getElementById("creationWindow");
	const editWindow = document.getElementById("editWindow");

	getAllExistingCharacters()
	.then(charactersArray => {
		displayAllCharacters(charactersArray.data);
		console.table(charactersID);
		getAllButtons();
	})
	.catch(error => console.error(error));



	document.getElementById("getOneCharacter").addEventListener("click", () => {
		getOneCharacter("441a3c38-2aea-4051-90ae-41823e863233")
		.then(character => console.table(character.data))
		.catch(error => console.error(error));
	});

	document.getElementById("postOneCharacter").addEventListener("click", () => {
		const characterToAdd = createOneCharacter();

		postOneCharacter(characterToAdd)
		.then(character => {
			console.table(character.data)
			window.location.reload(false);
		})
		.catch(error => console.error(error));
	});

	document.getElementById("updateOneCharacter").addEventListener("click", () => {
		getAllExistingCharacters()
		.then(charactersArray => console.table(charactersArray))
		.catch(error => console.error(error));
	});

	document.getElementById("deleteOneCharacter").addEventListener("click", () => {
		deleteOneCharacter()
		.catch(error => console.error(error));
	});

	document.getElementById("run").addEventListener("click", () => {
		createOneCharacter();
	});

	document.getElementById("imageSelector").addEventListener("change", () => {
		readImage();
	});

	/*document.getElementById("closeButton").addEventListener("click", () => {
		undisplayWindow(viewWindow);
		undisplayWindow(creationWindow);
		undisplayWindow(editWindow);
	});

	document.getElementById("createButton").addEventListener("click", () => {
		displayWindow(createWindow);
	});

	document.getElementById("createSubmitButton").addEventListener("click", () => {
		createOneCharacter();
		undisplayWindow(creationWindow);
		//refresh

	});

	It should also contain a button to delete the character. When this deleting an item, display a modal asking for confirmation.



	*/


	// API CALLS

	async function getAllExistingCharacters() {
		try {
			return await axios.get("https://character-database.becode.xyz/characters");
		} 
		catch (error) {
			console.error(error);
		}
	}

	async function getOneCharacter(characterID) {
		try {
			return await axios.get("https://character-database.becode.xyz/characters" + "/" + characterID);
		}
		catch (error) {
			console.error(error);
		}
	}

	async function postOneCharacter(newCharacter) {
		try {

			return await axios.post("https://character-database.becode.xyz/characters", {
				name: newCharacter.name,
				shortDescription: newCharacter.shortDescription,
				description: newCharacter.description
			});
		}
		catch (error)
		{
			console.error(error);
		}
	}

	async function updateOneCharacter(characterToUpdate) {
		try {

			return await axios.put("https://character-database.becode.xyz/characters" + "/" + characterToUpdate.id, {
				id: characterToUpdate.id,
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
	}

	async function deleteOneCharacter(characterToDelete) {
		try {

			return await axios.delete("https://character-database.becode.xyz/characters" + "/" + characterToDelete);
		}
		catch (error)
		{
			console.error(error);
		}
	}

	// DISPLAY FUNCTIONS

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
		document.getElementById("view-card-title").innerHTML = character.name;
		document.getElementById("view-card-text").innerHTML = character.shortDescription;
		document.getElementById("view-card-longtext").innerHTML = character.description;
		document.getElementById("view-card-img").src = "data:image/*;base64," + character.image;
	}

	function editOneCharacter(character)
	{	
		document.getElementById("edit-card-title").innerHTML = character.name;
		document.getElementById("edit-card-text").innerHTML = character.shortDescription;
		document.getElementById("edit-card-longtext").innerHTML = character.description;
		document.getElementById("edit-card-img").src = "data:image/*;base64," + character.image;
	}

	function createOneCharacter()
	{
		const nameInput = document.getElementById("name").value;
		const shortDescriptionInput = document.getElementById("shortDescription").value;
		const descriptionInput = document.getElementById("description").value;
		const imagePreviewElement = document.getElementById("imagePreview");

		console.log(nameInput);
		console.log(shortDescriptionInput);
		console.log(descriptionInput);

		const base64String = imagePreviewElement.src
		.replace('data:', '')
        .replace(/^.+,/, '');
	    console.log("dans fonction:", base64String);

		const newCharacter = new Character(nameInput, shortDescriptionInput, descriptionInput, base64String);

		return newCharacter;
	}

	function readImage()
	{
		const imageSelectorInput = document.getElementById("imageSelector").files[0];
		const imagePreviewElement = document.getElementById("imagePreview");

		const reader = new FileReader();
		reader.addEventListener('load', (event) => {
		    imagePreviewElement.src = event.target.result;
		});

		reader.readAsDataURL(imageSelectorInput);
	}
	
	function getAllButtons()
	{
		viewButtons = document.getElementsByClassName("viewHero");
		editButtons = document.getElementsByClassName("editHero");
		deleteButtons = document.getElementsByClassName("deleteHero");

		for (let i = 0; i < viewButtons.length; i++)
		{
			viewButtons[i].addEventListener("click", async () => {
				displayWindow(viewWindow);
				const viewedCharacter = await getOneCharacter(charactersID[i]);
				displayOneCharacter(viewedCharacter);
				return viewedCharacter;
			});

			editButtons[i].addEventListener("click", async () => {
				displayWindow(editWindow);
				const editedCharacter = await getOneCharacter(charactersID[i]);
				editOneCharacter(editedCharacter);
				return editedCharacter;
			});

			deleteButtons[i].addEventListener("click", async () => {
				//A way to delete the character (You must add some kind of confirmation, like "Are you sure you want to delete this character ?")
				const deletedCharacter = await deleteOneCharacter(charactersID[i]);
				window.location.reload(false);
				return deletedCharacter;
				console.log(i);
			});
		}
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


/*

Character object

id: The identifier of the character as an UUID. // auto
name: The name of the character.
shortDescription: A short description of the character.
description: A long description of the character in Markdown.
image: An image of the character in Base64. 
When creating or modifying a character this image will always be resized to 100x100 px and recompressed to JPEG.


GET /characters[?name=:name]
Returns a complete list of all the characters.

Facultative name parameter filters on the name.

GET /characters/:id
Returns a character by id.

POST /characters
Only takes JSON as input.

Creates a new character.

Returns the newly created character id.

PUT /characters/:id
Only takes JSON as input.

Updates a character.

DELETE /characters/:id
Deletes a character.

*/