import Base from "./Base.js";

class Auth extends Base {
	constructor() {
		super();
		this.AuthInitDOM();
		this.AuthInit();
	}

	submitHandler = (e) => {
		if (e.target.closest('.btns__submit') || e.code === 'Enter') {
			let pass = this.inpPass.value;
			let upgrade = (e) => console.log('Upgraded', e.target.result);
			let requestSuccess = (e) => {
				let res = e.target.result;
				let transaction = res.transaction('users', 'readwrite')
														.objectStore('users');
				let log = transaction.get(this.inpLog.value);
				
				log.addEventListener('success', (e) => {
					let currUser = e.target;
					if (currUser.result) {
						if (pass === currUser.result.pass) {
							currUser.result.current = 'true';
							let req = transaction.put(currUser.result);
							this.redirect('./html/main.html');
						} else {
							this.modalError.textContent = 'uncorrect paswword';
						}
					} else {
						this.modalError.textContent = 'uncorrect login';
					}
				});
				log.addEventListener('error', (e) => console.log(e.target.result));
			}	
			this.modalError.textContent = '';
			this.requestDB('users', 1, upgrade, requestSuccess);
		} else return;
	}

	currentFalseAll = async () => {
		let upgrade = (e) => console.log(e.target.result, 'Upgraded');
		let requestSuccess = (e) => {
			let transaction = e.target.result.transaction('users', 'readwrite')
																				.objectStore('users');
			let users = transaction.getAll();
			this.eventListeners(users, (e) => {
				e.target.result.forEach(user => {
					user.current = false;
					transaction.put(user);
				});
			});
		}
		this.requestDB('users', 1, upgrade, requestSuccess);
	}

	keyDownHandler = async (e) => {
		this.submitHandler(e);
	}

	AuthInitDOM() {
		this.form = document.querySelector('#authorization');
		this.inpPass = document.querySelector('#userPass');
		this.inpLog = document.querySelector('#userLogin');
		this.inpChbx = document.querySelector('#chbxShowPass');
		this.modalError = document.querySelector('.modal-error');
		this.btnRegistr = document.querySelector('.btns__registr');
	}

	async AuthInit() {
		let a = await this.currentFalseAll();
		document.addEventListener('click', event => {
			this.showPass(this.inpPass, this.inpChbx);
			this.submitHandler(event);
		});
		document.addEventListener('keydown', this.keyDownHandler);
		this.btnRegistr.addEventListener('click', () => this.redirect("./html/registr.html"));
	}
}

new Auth;