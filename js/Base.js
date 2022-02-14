export const db = {
	users : null,
	busket : null,
}
class Base {
	static usersDB;
	constructor(data) {
		this.data = data;
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

	onUpgradeHandler = (e) => {
		db.users = e.target.result;
		if (!db.users.objectStoreNames.contains('users')) {
			let users = db.users.createObjectStore("users", {keyPath: 'login'});
			let index = users.createIndex('currentUser', 'current');
			let isAdmin = users.createIndex('isAdmin', 'isAdmin');
		} else return;
	}

	transactionDB(DB, dbName, method, login, cb) {

		let transaction = DB.transaction(dbName, method)
												.objectStore(dbName);
		let currLogin = transaction.get(login);
		currLogin.addEventListener('success', () => cb(currLogin, transaction));
		currLogin.addEventListener('error', (e) => console.log(e.target.error));
	}

	addNotes = (db, objectStore, obj) => {
		let users = db.transaction(objectStore, "readwrite")
									.objectStore(objectStore);
		users.add(obj);
		users.onsuccess = (e) => db = e.target.result;
		users.onerror = (e) => console.log("Ошибка", e.target.error);
	}

	onsuccesUsersHandler = (e) => {
		db.users = e.target.result;
		this.data.forEach(e => this.addNotes(db.users, "users", e));
	}

	createUsersDB = () => {
		indexedDB.deleteDatabase('users');
		let request = indexedDB.open('users', 1);
		request.addEventListener('error', (e) =>	console.log(e.target.error, 'Error'));
		request.addEventListener('upgradeneeded', this.onUpgradeHandler);
		request.addEventListener('success', this.onsuccesUsersHandler);
	}

	BaseInit = () => {
		this.createUsersDB();
		document.addEventListener('error', (e) => console.log(e.target.error));
	}
}

export default Base;