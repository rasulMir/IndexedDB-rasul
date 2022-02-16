import {users} from "./data.js";
import {phoneCards} from "./data.js";
class Base {
	constructor() {
		this.users = users;
		this.phoneCards = phoneCards;
	}

	addRemoveClass(select, className) {
		if (!select.classList.contains('.' + className)) {
			select.classList.add(className);
		} else {
			select.classList.remove(className);
		}
	}

	clearInputs(arr, ...args) {
		args.forEach((arg, i) => arg[arr[i]] = '');
	}

	redirect(url) {
		setTimeout(() => location.href = url, 0);
	}

	showPass = (inp, chbx) => inp.type = (chbx.checked) ? 'text' : 'password';
	
	requestDB = async (dbName, version, upgrade, succes) => {
		let request = indexedDB.open(dbName, version);
		request.addEventListener('error', (e) =>	console.log(e.target.error, 'Error'));
		request.addEventListener('upgradeneeded', upgrade);
		request.addEventListener('success', succes);
	}

	eventListeners(current, cb) {
		current.addEventListener('success', cb);
		current.addEventListener('error', (e) => console.log(e.target.error));
	}

	addNotes = (db, objectStore, obj) => {
		let users = db.transaction(objectStore, "readwrite")
									.objectStore(objectStore);
		users.add(obj);
		users.onsuccess = (e) => db = e.target.result;
		users.onerror = (e) => console.log("Ошибка", e.target.error);
	}

	onSuccesUsersHandler = (e) => {
		let users = e.target.result;
		this.users.forEach(e => this.addNotes(users, "users", e));
	}

	onUpgradeUsersHandler = (e) => {
		let usersDB = e.target.result;
		if (!usersDB.objectStoreNames.contains('users')) {
			let users = usersDB.createObjectStore("users", {keyPath: 'login'});
			users.createIndex('currentUser', 'current');
			users.createIndex('isAdmin', 'isAdmin');
		} else return;
	}

	onUpgradePhoneCardsHandler = (e) => {
		let phoneCards = e.target.result;
		if (!phoneCards.objectStoreNames.contains('phoneCards')) {
			phoneCards.createObjectStore("phoneCards", {keyPath: 'id'});
		} else return;
	}

	onSuccesPhoneCardsHandler = (e) => {
		let phoneCards = e.target.result;
		this.phoneCards.forEach(e => this.addNotes(phoneCards, "phoneCards", e));
	}

	BaseInit = () => {
		this.requestDB('users', 1, this.onUpgradeUsersHandler, this.onSuccesUsersHandler);
		this.requestDB('phoneCards', 1, this.onUpgradePhoneCardsHandler, this.onSuccesPhoneCardsHandler);
		document.addEventListener('error', (e) => console.log(e.target.error));
	}
}

new Base().BaseInit();

export default Base;