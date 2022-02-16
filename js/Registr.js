import Base from "./Base.js";
class Register extends Base {
	constructor() {
		super();
		this.AuthInitDOM();
		this.AuthInit();
	}

	addUser = (log, pass1, pass2) => {
		if (pass1 === pass2) {
			let requestUpg = () => {
				console.log('upgrade');
			}
			let requestSucc = (e) => {
				let res = e.target.result;
				let transaction = res.transaction('users', 'readwrite')
														.objectStore('users');
				let user = {
					login : log,
					pass : pass1,
					current: false,
					isAdmin: false,
				}
				let req = transaction.add(user);
				req.addEventListener('success', () => {
					this.modalError.textContent = '';
					this.redirect("../index.html");
				});
				req.addEventListener('error', (e) => {
					this.modalError.textContent = 'there is such a login';
				});
			}
			this.requestDB('users', 1, requestUpg, requestSucc);
		} else {
			this.modalError.textContent = 'second password is not correct';
		}
	}

	submitHandler = (e) => {
		if (e.target.closest('.btns__submit') || e.code === 'Enter') {
			let login = this.inpLog.value;
			let pass1 = this.inpPass.value;
			let pass2 = this.inpPass2.value;
			if (login && pass1 && pass2) {
				this.addUser(login, pass1, pass2);	
			} else {
				this.modalError.textContent = 'Fill in all the fields';
			}
		} else return;
	}
	
	keyDownHandler = (e) => {
		this.submitHandler(e);
	}

	AuthInitDOM() {
		this.form = document.querySelector('#authorization');
		this.inpPass = document.querySelector('#userPass');
		this.inpPass2 = document.querySelector('#userPass2');
		this.inpLog = document.querySelector('#userLogin');
		this.inpChbx = document.querySelector('#chbxShowPass');
		this.modalError = document.querySelector('.modal-error');
		this.btnRegistr = document.querySelector('.btns__registr');
	}

	async AuthInit() {
		this.clearInputs(
			['value', 'value', 'value', 'checked'],
			this.inpLog, this.inpPass, this.inpPass2, this.inpChbx
		);
		document.addEventListener('click', event => {
			this.showPass(this.inpPass, this.inpChbx);
			this.showPass(this.inpPass2, this.inpChbx);
			this.submitHandler(event);
		});
		document.addEventListener('keydown', this.keyDownHandler);
		this.btnRegistr.addEventListener('click', () => this.redirect("../index.html"));
	}
}

new Register;