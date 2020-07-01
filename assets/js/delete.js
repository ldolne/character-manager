// Fonctions Debug

document.getElementById("getOneCharacter").addEventListener("click", () => {
	axiosGetOneCharacter("441a3c38-2aea-4051-90ae-41823e863233")
	.then(character => console.table(character.data))
	.catch(error => console.error(error));
});

document.getElementById("postOneCharacter").addEventListener("click", () => {
	const characterToAdd = createOneCharacter();

	axiosPostOneCharacter(characterToAdd)
	.then(character => {
		console.table(character.data)
		window.location.reload(false);
	})
	.catch(error => console.error(error));
});

document.getElementById("updateOneCharacter").addEventListener("click", () => {

});


document.getElementById("deleteOneCharacter").addEventListener("click", () => {
	deleteOneCharacter()
	.catch(error => console.error(error));
});

document.getElementById("run").addEventListener("click", () => {
	createOneCharacter();
});

