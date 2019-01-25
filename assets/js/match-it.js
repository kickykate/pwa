function matchIt() {
	this.initialize = function() {
		// Define our database with indexable fields
		this.db.version(1).stores({
		  clothes: 'key, category, clothing, [category+clothing]'
		});
	};
	this.put = function(clothes) {
		this.db.clothes.put(clothes);
	};
	this.getAllTopsWarm = async function () {
		return await this.db.clothes.where('[category+clothing]').equals(['warm', 'top']).toArray();
	};
	this.getAllTopsCold = async function () {
		return await this.db.clothes.where('[category+clothing]').equals(['cold', 'top']).toArray();
	};
	this.getAllBottomsWarm = async function () {
		return await this.db.clothes.where('[category+clothing]').equals(['warm', 'bottom']).toArray();
	};
	this.getAllBottomsCold = async function () {
		return await this.db.clothes.where('[category+clothing]').equals(['cold', 'bottom']).toArray();
	};
	this.getTopCold = function() {
		return this.getAllTopsCold().then(function(all) {
			var index = Math.floor(Math.random() * (all.length));
			return all[index];
		});;
	};
	this.getTopWarm = function() {
		return this.getAllTopsWarm().then(function(all) {
			var index = Math.floor(Math.random() * (all.length));
			return all[index];
		});;
	};
    this.getBottomCold = function() {
		return this.getAllBottomsCold().then(function(all) {
			var index = Math.floor(Math.random() * (all.length));
			return all[index];
		});;
	};
    this.getBottomWarm = function() {
		return this.getAllBottomsCold().then(function(all) {
			var index = Math.floor(Math.random() * (all.length));
			return all[index];
		});;
	};
	
	this.db = new Dexie("matchIt");
	this.initialize();
};

var imageHelper = {
	arrayBufferToBlob: function (buffer, type) {
		return new Blob([buffer], {type: type});
	},
	blobToArrayBuffer: function (blob) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.addEventListener('loadend', (e) => {
				resolve(reader.result);
			});
			reader.addEventListener('error', reject);
			reader.readAsArrayBuffer(blob);
		});
	}
};

const fileinput = document.getElementById('input-picture');
var myImage;
var myImageType;

fileinput.addEventListener('change', (e) => {
	myImage = e.target.files[0];
	myImageType = typeof e.target.files[0];
});

var btnAdd = document.getElementById("btnadd");
btnAdd.addEventListener('click', (e) => {
	var category = document.querySelector('input[name="category"]:checked').value;
	var clothing = document.querySelector('input[name="clothing"]:checked').value;
	
	// var myImage = fileinput.files[0];

	imageHelper.blobToArrayBuffer(myImage)
		.then(function(arrayBuffer) {
				console.log("the type is " + myImage.type);

			var entry = {
				category: category,
				clothing: clothing,
				image: arrayBuffer,
				imageType: myImage.type,
				key: Math.random()
			};

			var matchItDb = new matchIt();
			matchItDb.put(entry);

			alert('saved!!!');
		});
});

var btnShow = document.getElementById("btnShow");
btnShow.addEventListener('click', (e) => {
	var message = document.getElementById("message");
	var temp = document.getElementById("temperatureinput").value;
	if (temp < 60) {
		// cold weather clothes
		message.innerHTML = "brrrr better wear somthing warm!!!";

		var matchItDb = new matchIt();
		
		clearSection('clothes-choices');
		matchItDb.getTopCold().then((clothes) => { showOneClothing(clothes, 'clothes-choices') });
		matchItDb.getBottomCold().then((clothes) => { showOneClothing(clothes, 'clothes-choices') });
	} else {
		// warm weather clothes
		message.innerHTML = "wow it's hot outside";

		var matchItDb = new matchIt();

		clearSection('clothes-choices');
		matchItDb.getTopWarm().then((clothes) => { showOneClothing(clothes, 'clothes-choices') });
		matchItDb.getBottomWarm().then((clothes) => { showOneClothing(clothes, 'clothes-choices') });
	}
})

showSection = function(clothes, sectionName) {
	var container = document.getElementById(sectionName);
	var output = "";

	for(var i = 0; i < clothes.length; i++) {
		var imageBlob = imageHelper.arrayBufferToBlob(clothes[i].image, clothes[i].imageType);
		
		var binaryData = [];
		binaryData.push(clothes[i].image);
		var imageUrl = window.URL.createObjectURL(new Blob(binaryData, {type: "application/zip"}));
		
		output += "<div><img class='u-max-full-width' src='" + imageUrl + "'></div>";
	}
	
	container.innerHTML += output
};

clearSection = function(sectionName) {
	var container = document.getElementById(sectionName);
	container.innerHTML = "";
}

showOneClothing = function(clothes, sectionName) {
	var container = document.getElementById(sectionName);
	var output = "";

	var imageBlob = imageHelper.arrayBufferToBlob(clothes.image, clothes.imageType);
	
	var binaryData = [];
	binaryData.push(clothes.image);
	var imageUrl = window.URL.createObjectURL(new Blob(binaryData, {type: "application/zip"}));
	
	output += "<div><img class='u-max-full-width' src='" + imageUrl + "'></div>";
	container.innerHTML += output
};

showAll = function() {
	var matchItDb = new matchIt();
	matchItDb.getAllTopsWarm().then((clothes) => { showSection(clothes, 'clothes') });
	matchItDb.getAllTopsCold().then((clothes) => { showSection(clothes, 'clothes') });
	matchItDb.getAllBottomsWarm().then((clothes) => { showSection(clothes, 'clothes') });
	matchItDb.getAllBottomsCold().then((clothes) => { showSection(clothes, 'clothes') });
};

var matchItDb = new matchIt();
this.showAll();