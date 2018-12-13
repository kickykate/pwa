const dbName = "clothes_db";

var db;
var objectStore;
var request = indexedDB.open(dbName, 2);

request.onerror = function(event) {
  // Handle errors.
};
request.onsuccess = function(event) {
  db = event.target.result;
};
request.onupgradeneeded = function(event) {
	console.log("onupgradeneeded");
	
	var db = event.target.result;
	
	// Create an objectStore to hold information about our customers. We're
	// going to use "ssn" as our key path because it's guaranteed to be
	// unique - or at least that's what I was told during the kickoff meeting.
	var objectStore = db.createObjectStore("clothes", { keyPath: "key" });
  
	// Create an index to search customers by name. We may have duplicates
	// so we can't use a unique index.
	objectStore.createIndex("category", "category", { unique: false });

	// Create an index to search customers by email. We want to ensure that
	// no two customers have the same email, so use a unique index.
	objectStore.createIndex("clothing", "clothing", { unique: true });

	// Use transaction oncomplete to make sure the objectStore creation is 
	// finished before adding data into it.
	objectStore.transaction.oncomplete = function(event) {
		// Store values in the newly created objectStore.
		var customerObjectStore = db.transaction("clothes", "readwrite").objectStore("customers");
		customerData.forEach(function(customer) {
		customerObjectStore.add(customer);
		});
	};
};
request.put = function (clothes) {
	// Open a transaction to the database
	var transaction = db.transaction(["clothes"], "readwrite");

	// Put the blob into the dabase
	var key = clothes.category + "." + clothes.clothing;
	var put = transaction.objectStore("clothes").add(clothes);
};
request.get = function(key) {
	var objectStore = db.transaction("clothes", "readwrite").objectStore("clothes");
	var index = objectStore.index("category");

	index.get("warm").onsuccess = function(event) {
		console.log(event.target.result);
	};
}

const fileInput = document.getElementById('input-picture');

fileInput.addEventListener('change', (e) => {
	var clothing = {
		category: "warm",
		clothing: "top",
		image: e.target.files,
		key: "warm-clothes"
	};

	request.put(clothing);
});