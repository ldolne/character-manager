const axios = require('axios').default; // avec intellisense/autocomplete
const regeneratorRuntime = require("regenerator-runtime");

let charactersID = [];
let editButtons = [];
let deleteButtons = [];

class Character {
    constructor (name, shortDescription, description) {
	    this.name = name;
	    this.shortDescription = shortDescription;
	    this.description = description;
	    //this.image = image;
	}
}

(function main() {

	// MAIN PROGRAM
	getAllExistingCharacters()
	.then(charactersArray => {
		displayAllCharacters(charactersArray.data);
		console.table(charactersID);
		getAllButtons();
	})
	.catch(error => console.error(error));








	/*document.getElementById("getOneCharacter").addEventListener("click", () => {
		getOneCharacter("441a3c38-2aea-4051-90ae-41823e863233")
		.then(character => console.table(character.data))
		.catch(error => console.error(error));
	})

	document.getElementById("postOneCharacter").addEventListener("click", () => {
		const characterToAdd = createOneCharacter();

		postOneCharacter(characterToAdd)
		.then(character => console.table(character.data))
		.catch(error => console.error(error));
	})

	document.getElementById("updateOneCharacter").addEventListener("click", () => {
		getAllExistingCharacters()
		.then(charactersArray => console.table(charactersArray))
		.catch(error => console.error(error));
	})

	document.getElementById("deleteOneCharacter").addEventListener("click", () => {
		deleteOneCharacter()
		.catch(error => console.error(error));
	})

	document.getElementById("run").addEventListener("click", () => {
		createOneCharacter();
	})*/
})();

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

function getAllButtons()
{
	viewButtons = document.getElementsByClassName("viewHero");
	editButtons = document.getElementsByClassName("editHero");
	deleteButtons = document.getElementsByClassName("deleteHero");

	/*editButtons.forEach(editButton => {
		editButton.addEventListener("click", () => {
			// get un character en particulier
		});
	});*/

	for (let i = 0; i < viewButtons.length; i++)
	{
		viewButtons[i].addEventListener("click", async () => {
			// delete un character en particulier
			return await deleteOneCharacter(charactersID[i]);
			/*let removed = charactersID.splice(i, 1);
			console.log(removed);
			console.table(charactersID);*/
			// Refresh/load la page
		});

		editButtons[i].addEventListener("click", async () => {
			// delete un character en particulier
			return await deleteOneCharacter(charactersID[i]);
			/*let removed = charactersID.splice(i, 1);
			console.log(removed);
			console.table(charactersID);*/
			// Refresh/load la page
		});

		deleteButtons[i].addEventListener("click", async () => {
			return await deleteOneCharacter(charactersID[i]);
			/*let removed = charactersID.splice(i, 1);
			console.log(removed);
			console.table(charactersID);*/
			// Refresh/load la page
		});
	}
}

function createOneCharacter()
{
	const nameInput = document.getElementById("name").value;
	const shortDescriptionInput = document.getElementById("shortDescription").value;
	const descriptionInput = document.getElementById("description").value;

	console.log(nameInput);
	console.log(shortDescriptionInput);
	console.log(descriptionInput);

	// FAIRE LES IMAGES
	/*const imageSelector = document.getElementById("image");

	imageSelector.addEventListener("change", event => {
		const imageInput = event.target.files;
		console.table(imageInput);
	});*/

	const newCharacter = new Character(nameInput, shortDescriptionInput, descriptionInput);

	return newCharacter;
}
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