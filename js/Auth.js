import Base from "./Base.js";
import {db} from "./Base.js";

class Auth extends Base {
	constructor(data) {
		super(data);
		this.AuthInitDOM();
		this.AuthInit();
	}

	submitHandler = (e) => {
		if (e.target.closest('.btns__submit') || e.code === 'Enter') {
			let pass = this.inpPass.value;

			let onSucces = (currLogin, trans) => {
				if (currLogin.result) {
					let currLog = currLogin.result.login;
					let currPass = currLogin.result.pass;
					if (currLog && currPass === pass) {
						currLogin.result.current = 'true';
						let req = trans.put(currLogin.result);
						req.onsuccess = () => this.redirect('./html/main.html');
						req.onerror = (e) => console.log(e.target.error);
					}	else {
						this.modalError.textContent = 'uncorrect login or password';
					}
				}	else {
					this.modalError.textContent = 'fill in these fields';
				}
			}	
			this.transactionDB(db.users, "users", "readwrite", this.inpLog.value, onSucces);
			this.modalError.textContent = '';
		} else return;
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
		this.BaseInit();
		document.addEventListener('click', event => {
			this.showPass(this.inpPass, this.inpChbx);
			this.submitHandler(event);
		});
		document.addEventListener('keydown', this.keyDownHandler);
	}
}

new Auth([
	{login: 'rasul', pass: '12345', current: false, isAdmin: 'true'},
	{login: 'zhenya', pass: '12345', current: false, isAdmin: false},
	{login: 'alisher', pass: '12345', current: false, isAdmin: false},
]);