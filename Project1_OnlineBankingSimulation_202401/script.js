/*
This script is created by WAN Ho Yeung
Date: 2023-01-08
Last-Modified: 2023-01-10
*/

class BankA {
	name = "Bank A";
	customers = [];
	interestRate = 3.5;

	constructor(numberOfBranches) {
		this.numberOfBranches = numberOfBranches;
	}

	addCustomer(customer) {
		this.customers.push(customer);
	}

	getCustomers() {
		return this.customers;
	}

	// Customer's search method
	checkCustomerExists(customerId) {
		return this.customers.some(
			(customer) => customer.customerId === customerId
		);
	}

	checkCustomerExistsName(accountName) {
		return this.customers.some(
			(customer) => customer.accountName === accountName
		);
	}

	checkCustomerExistsAccountNo(accountNo) {
		return this.customers.some((customer) => customer.accountNo === accountNo);
	}

	CustomerSearch(customerId) {
		if (this.checkCustomerExists(customerId)) {
			console.log("**This account is in bank's record.");
			this.customers
				.filter((customer) => customer.customerId === customerId)
				.forEach((customer) => console.log(customer));
		} else {
			console.log("**This account doesn't exist.");
		}
	}
}

class BankASaving extends BankA {
	constructor(bank, accountNo, accountName, customerId, password, deposit) {
		super();
		this.bank = bank;
		this.accountNo = accountNo;
		this.accountName = accountName;
		this.customerId = customerId;
		this.accountBalance = deposit;
		this.password = password;
		this.accountStatus = false;
		this.promotionValue = false;
		this.transactionRecord = "";
		this.transactions = [];
	}

	openAccount() {
		if (super.checkCustomerExists(this.customerId)) {
			console.log(
				"The account cannot be opened as the account with this customer id is exist. Account name: " +
					this.accountName
			);
		} else {
			this.bank.addCustomer(this);
			this.accountStatus = true;
			console.log(
				"The account is opened with accountNo of " + this.accountNo + "."
			);
			this.transactionRecord += "Deposit: +" + this.accountBalance + "\n";
			this.addTransaction("Deposit", this.accountBalance);
		}
	}

	applyPromotion(promotionCode) {
		if (promotionCode === "MKT2024A1") {
			if (!this.promtionValue) {
				this.interestRate += 1;
				this.promtionValue = true;
				console.log(
					"Promotion is applied, You now have 1% bonus in the interest rate"
				);
			} else {
				console.log("Promotion is already applied");
			}
		}
	}

	closeAccount() {
		this.accountStatus = false;
		const index = super.getCustomers().indexOf(this);
		if (index > -1) {
			this.bank.getCustomers().splice(index, 1);
		}
		this.customerId = "";
		alert("The account is callceled.");
	}

	accountCheck() {
		if (this.accountStatus === true) {
			console.log(
				`${this.name}, Account No: ${this.accountNo}, Account Name: ${this.accountName}, Customer ID: ${this.customerId}, Account Balance: ${this.accountBalance}, Interest Rate: ${this.interestRate}`
			);
		} else {
			console.log("This account doesn't exist.");
		}
	}

	deposit(amount) {
		if (amount < 0) {
			throw new Error("Amount must be positive");
		}
		this.accountBalance += amount;
		console.log("Customer Object deposit: ");
		console.log(this);

		console.log(
			"Deposit successful. Your new balance is: " + this.accountBalance
		);
		this.transactionRecord += "Deposit: +" + amount + "\n";
		this.addTransaction("Deposit", amount);
	}

	withdraw(amount) {
		if (amount < 0) {
			throw new Error("Amount must be positive");
		}
		this.accountBalance -= amount;
		console.log(
			"Withdrawal successful. Your new balance is: " + this.accountBalance
		);
		console.log("Customer Object withdraw: ");
		console.log(this);

		this.transactionRecord += "Withdraw: -" + amount + "\n";
		this.addTransaction("Withdraw", (amount *= -1));
	}

	transfer(amount, toAccountName) {
		const toAccount = this.bank
			.getCustomers()
			.find((customer) => customer.accountName === toAccountName);
		console.log("Transfer Event: " + amount);
		console.log(this);
		console.log(toAccount);
		this.accountBalance -= amount;
		this.transactionRecord +=
			"Transfer to " + toAccountName + ": -" + amount + "\n";

		this.addTransaction("Transfer to " + toAccountName, (amount *= -1));

		toAccount.accountBalance += amount;
		toAccount.transactionRecord +=
			"Transfer from " + this.accountName + ": +" + amount + "\n";
		toAccount.addTransactionNULL(
			"Transfer from " + this.accountName,
			(amount *= -1)
		);
	}

	addTransaction(type, amount) {
		let time = new Date().toLocaleString();
		this.transactions.push({ time, type, amount });
		updateTransactionsTable(this);
	}

	addTransactionNULL(type, amount) {
		let time = new Date().toLocaleString();
		this.transactions.push({ time, type, amount });
	}
}

// Initialize the form and dashboard UI
const createAccountForm = document.getElementById("create-account-form");
const loginForm = document.getElementById("login-form");
const dashboard = document.getElementById("dashboard-container");
const dashboardAccountNo = document.getElementById("account-no");
const dashboardAccountName = document.getElementById("dashaccount-name");
const dashboardCustID = document.getElementById("dashcust-id");
const dashboardBalance = document.getElementById("current-balance");
// const dashboardTransactionRecord =
// 	document.getElementById("transaction-record");
const depositButton = document.getElementById("deposit-button");
const withdrawButton = document.getElementById("withdraw-button");
const transferButton = document.getElementById("transfer-button");
const logOutButton = document.getElementById("log-out-button");
const closeAccountButton = document.getElementById("close-account-button");
const transactionForm = document.getElementById("transaction-form");
const transactionAM = document.getElementById("transaction-Amount");

const transactionsTable = document.getElementById("transactionsTable");

const transactionNAME = document.getElementById("to-account-name");
const userlogo = document.getElementById("userlogo");
const adminlogo = document.getElementById("adminlogo");
const adminDashboardContainer = document.getElementById(
	"admin-dashboard-container"
);

const AdminTransactionsTable = document.getElementById(
	"AdminTransactionsTable"
);

const searchContainer = document.getElementById("search-container");

const SearchAccountNo = document.getElementById("search-account-no");
const SearchDashAccountName = document.getElementById(
	"search-dashaccount-name"
);
const SearchDashCustID = document.getElementById("search-dashcust-id");
const SearchCurrentBalance = document.getElementById("search-current-balance");

const Database = document.getElementById("Database");

const bankA = new BankA(20);

function updateTransactionsTable(customer) {
	console.log("Update transaction begin:");
	console.log(customer);
	console.log(customer.transactions);

	// Get a reference to the transactionsTable element
	const transactionsTableBody = document.querySelector(
		"#transactionsTable tbody"
	);
	transactionsTableBody.innerHTML = "";

	// Loop over the transactions array and add a new row to the transactionsTable for each transaction
	customer.transactions.forEach((transaction) => {
		const transactionTime = transaction.time;
		const transactionType = transaction.type;
		var transactionAmount = transaction.amount;

		const row = document.createElement("tr");
		const timeCell = document.createElement("td");
		const typeCell = document.createElement("td");
		const amountCell = document.createElement("td");

		timeCell.textContent = transactionTime;
		typeCell.textContent = transactionType;
		let sign = "";
		if (transactionAmount > 0) {
			sign += "+ ";
		} else if (transactionAmount < 0) {
			sign += "- ";
			transactionAmount *= -1;
		}
		amountCell.textContent =
			sign +
			parseFloat(transactionAmount)
				.toFixed(2)
				.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
				.toString();

		row.appendChild(timeCell);
		row.appendChild(typeCell);
		row.appendChild(amountCell);
		transactionsTableBody.appendChild(row); // Add the new row to the transactionsTableBody element

		console.log("Update transaction end");
	});
}

function updateAdminTransactionsTable(customer) {
	// Get a reference to the transactionsTable element
	const AdminTransactionsTableBody = document.querySelector(
		"#AdminTransactionsTable tbody"
	);
	AdminTransactionsTableBody.innerHTML = "";

	// Loop over the transactions array and add a new row to the AdminTransactionsTable for each transaction
	customer.transactions.forEach((transaction) => {
		const transactionTime = transaction.time;
		const transactionType = transaction.type;
		var transactionAmount = transaction.amount;

		const row = document.createElement("tr");
		const timeCell = document.createElement("td");
		const typeCell = document.createElement("td");
		const amountCell = document.createElement("td");

		timeCell.textContent = transactionTime;
		typeCell.textContent = transactionType;
		let sign = "";
		if (transactionAmount > 0) {
			sign += "+ ";
		} else if (transactionAmount < 0) {
			sign += "- ";
			transactionAmount *= -1;
		}
		amountCell.textContent =
			sign +
			parseFloat(transactionAmount)
				.toFixed(2)
				.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
				.toString();

		row.appendChild(timeCell);
		row.appendChild(typeCell);
		row.appendChild(amountCell);
		AdminTransactionsTableBody.appendChild(row); // Add the new row to the transactionsTableBody element

		console.log("Update transaction end");
	});
}

function updateDatabase(BankA) {
	// Get a reference to the transactionsTable element
	const DatabaseBody = document.querySelector("#Database tbody");
	DatabaseBody.innerHTML = "";

	// Loop over the transactions array and add a new row to the AdminTransactionsTable for each transaction
	BankA.customers.forEach((customer) => {
		const row = document.createElement("tr");
		const AccountNoCell = document.createElement("td");
		const AccountNameCell = document.createElement("td");
		const CustomerIDCell = document.createElement("td");
		const CurrentBalanceCell = document.createElement("td");

		AccountNoCell.textContent = customer.accountNo;
		AccountNameCell.textContent = customer.accountName;
		CustomerIDCell.textContent = customer.customerId;
		CurrentBalanceCell.innerText = customer.accountBalance;

		row.appendChild(AccountNoCell);
		row.appendChild(AccountNameCell);
		row.appendChild(CustomerIDCell);
		row.appendChild(CurrentBalanceCell);

		if (customer.customerId != "") {
			DatabaseBody.appendChild(row); // Add the new row to the transactionsTableBody element
		}

		console.log("Update transaction end");
	});
}

//Admin Setting

var admin = false;
adminlogo.addEventListener("click", (event) => {
	if (admin == false && prompt("Enter admin password") == "admin") {
		//Hide the createAccountForm and the loginForm
		createAccountForm.style.display = "none";
		loginForm.style.display = "none";

		adminDashboardContainer.style.display = "block";
		admin = true;

		adminlogo.src = "image/adminlogin.svg";
	} else if (admin == true) {
	} else {
		alert("Wrong password");
	}
});

//Admin Dashbroad
//Admin Search function
const adminSearchButton = document.getElementById("admin-search-button");
adminSearchButton.addEventListener("click", (event) => {
	var accountID = prompt("Enter Customer ID");
	const customer = bankA
		.getCustomers()
		.find((customer) => customer.customerId == accountID);

	if (customer) {
		Database.style.display = "none";

		searchContainer.style.display = "block";
		AdminTransactionsTable.style.display = "table";

		SearchAccountNo.innerText = customer.accountNo;
		SearchDashAccountName.innerText = customer.accountName;
		SearchDashCustID.innerText = customer.customerId;
		SearchCurrentBalance.innerText = customer.accountBalance;

		updateAdminTransactionsTable(customer);
	} else {
		alert("Invalid account ID");
		searchContainer.style.display = "none";
		AdminTransactionsTable.style.display = "none";
	}
});

//Admin Database function
const DatabaseButton = document.getElementById("Database-button");
DatabaseButton.addEventListener("click", (event) => {
	searchContainer.style.display = "none";
	AdminTransactionsTable.style.display = "none";
	Database.style.display = "table";
	updateDatabase(bankA);
});

//Admin Logout function
const AdminLogoutButton = document.getElementById("admin-logout-button");
AdminLogoutButton.addEventListener("click", (event) => {
	adminlogo.src = "image/admin.svg";
	createAccountForm.style.display = "inline-block";
	loginForm.style.display = "inline-block";
	adminDashboardContainer.style.display = "none";
	searchContainer.style.display = "none";
	AdminTransactionsTable.style.display = "none";
	Database.style.display = "none";
	admin = false;
});

//Admin Button function
const CancelAnyAccountButton = document.getElementById(
	"Cancel-any-account-button"
);

CancelAnyAccountButton.addEventListener("click", (event) => {
	event.preventDefault();
	var test = prompt("Are you sure to cancel any account? \n 1. Yes \n 2. No");
	if (test == "1") {
		var accountID = prompt("Enter Customer ID");
		const customer = bankA
			.getCustomers()
			.find((customer) => customer.customerId == accountID);
		customer.closeAccount();
		updateDatabase(bankA);
	}
});

// Handle form submission for creating a new account
function handleCreateAccount(event) {
	event.preventDefault();
	if (bankA.checkCustomerExists(document.getElementById("customer-id").value)) {
		alert("This account already exists.");
	} else {
		const customerId = document.getElementById("customer-id").value;
		const password = document.getElementById("password").value;
		const accountName = document.getElementById("account-name").value;
		const deposit = parseInt(document.getElementById("deposit").value);
		var accountNo =
			Math.round(Math.random() * 50) -
			Math.round(Math.random() * 10) +
			Math.round(Math.random() * 1000);

		while (bankA.checkCustomerExistsAccountNo(accountNo)) {
			accountNo =
				Math.round(Math.random() * 50) -
				Math.round(Math.random() * 10) +
				Math.round(Math.random() * 1000);
		}
		const newAccount = new BankASaving(
			bankA,
			accountNo,
			accountName,
			customerId,
			password,
			deposit
		);
		newAccount.openAccount();
		createAccountForm.reset();
		newAccount.accountCheck();
		console.log(newAccount.password);
		console.log(bankA);
		alert("Account created successfully. Account No: " + newAccount.accountNo);
		handleLogin(customerId, password);
	}
}

createAccountForm.addEventListener("submit", handleCreateAccount);

// Handle form submission for logging in
loginForm.addEventListener("submit", (event) => {
	event.preventDefault();
	const customerId = document.getElementById("login-customer-id").value;
	const password = document.getElementById("login-password").value;
	handleLogin(customerId, password);
});

//  Function for both login and auto login after registration
function handleLogin(customerId, password) {
	if (
		bankA.checkCustomerExists(customerId) &&
		bankA.getCustomers().find((customer) => customer.customerId === customerId)
			.password === password
	) {
		const customer = bankA
			.getCustomers()
			.find((customer) => customer.customerId === customerId);
		console.log("Current Account object: ");
		console.log(customer);
		dashboardAccountNo.innerText = customer.accountNo;
		dashboardAccountName.textContent = customer.accountName;
		dashboardBalance.innerText = customer.accountBalance;
		// dashboardTransactionRecord.innerText = customer.transactionRecord;
		dashboardCustID.innerText = customer.customerId;
		updateTransactionsTable(customer);

		//Hide the createAccountForm and the loginForm
		createAccountForm.style.display = "none";
		loginForm.style.display = "none";

		//display the dashboard and the transactionsTable
		dashboard.style.display = "block";
		transactionsTable.style.display = "table";
		userlogo.style.display = "block";
		adminlogo.style.display = "none";
	} else {
		alert("Invalid Customer ID or password.");
	}
	loginForm.reset();
}

//Update customer's transaction record
function updateDisplay(customer) {
	let balance = parseFloat(customer.accountBalance)
		.toFixed(2)
		.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
		.toString();
	dashboardBalance.innerText = balance;
	// dashboardTransactionRecord.innerText = customer.transactionRecord;
}

//  Handle clicking of different buttons

depositButton.addEventListener("click", (event) => {
	const dashID = dashboardCustID.textContent.toString();
	const customer = bankA
		.getCustomers()
		.find((customer) => customer.customerId == dashID);
	event.preventDefault();
	const depositAmount = parseInt(prompt("Enter the amount to deposit:"));
	console.log("Saving Event: " + depositAmount);
	if (depositAmount > 0) {
		customer.deposit(depositAmount);
		updateDisplay(customer);
	} else if (depositAmount <= 0) {
		alert("Amount should be greater than zero");
	} else {
		alert("The transcation callceled");
	}
});

withdrawButton.addEventListener("click", (event) => {
	const dashID = dashboardCustID.textContent.toString();
	const customer = bankA
		.getCustomers()
		.find((customer) => customer.customerId == dashID);
	event.preventDefault();
	const withdrawAmount = parseInt(prompt("Enter the amount to withdraw:"));
	if (customer.accountBalance >= withdrawAmount && withdrawAmount > 0) {
		customer.withdraw(withdrawAmount);
		updateDisplay(customer);
	} else {
		alert("Insufficient balance.");
	}
});

transferButton.addEventListener("click", (event) => {
	event.preventDefault();
	const dashID = dashboardCustID.textContent.toString();
	const customer = bankA
		.getCustomers()
		.find((customer) => customer.customerId == dashID);

	const transactionAmount = parseInt(prompt("Enter the amount to transfer:"));
	const toAccountName = prompt("Enter the receiving account name:").toString();

	console.log("Transfer Event: " + transactionAmount);
	console.log(customer);
	console.log(toAccountName);

	if (transactionAmount <= 0) {
		alert("Amount should be greater than zero");
	} else if (transactionAmount > customer.accountBalance) {
		alert("Insufficient balance.");
	} else if (customer.accountName == toAccountName) {
		alert(
			"You cannot tranfer money to your own account. Please enter a different account name."
		);
	} else if (!bankA.checkCustomerExistsName(toAccountName)) {
		alert("This account does not exist");
	} else if (transactionAmount <= 0) {
		alert("Amount should be greater than zero");
	} else {
		console.log("Transfer Event: " + transactionAmount);
		console.log("CUstomerTransfer: ");
		console.log(customer);
		console.log("Receiving Account: " + toAccountName);

		customer.transfer(transactionAmount, toAccountName);
		updateDisplay(customer);
	}
});

closeAccountButton.addEventListener("click", (event) => {
	const dashID = dashboardCustID.textContent.toString();
	const customer = bankA
		.getCustomers()
		.find((customer) => customer.customerId == dashID);
	event.preventDefault();

	const confirm = parseInt(
		prompt("Are you sure you want to close your account? \n 1. Yes \n 2. No")
	);
	if (confirm == 1) {
		customer.closeAccount();
		dashboard.style.display = "none";
		userlogo.style.display = "none";

		transactionsTable.style.display = "none";
		createAccountForm.style.display = "block";
		loginForm.style.display = "block";
		adminlogo.style.display = "block";
	}
});

logOutButton.addEventListener("click", (event) => {
	event.preventDefault();
	dashboard.style.display = "none";
	transactionsTable.style.display = "none";
	userlogo.style.display = "none";

	createAccountForm.style.display = "inline-block";
	loginForm.style.display = "inline-block";
	adminlogo.style.display = "block";
});

// Smooth scroll to top when the button is clicked
document
	.querySelector(".back-to-top a")
	.addEventListener("click", function (event) {
		event.preventDefault();
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	});

// Show or hide the button based on scroll position
window.addEventListener("scroll", function () {
	var scrollPosition = window.scrollY || document.documentElement.scrollTop;
	if (
		scrollPosition >
		(document.documentElement.scrollHeight - window.innerHeight) / 2
	) {
		document.querySelector(".back-to-top").style.display = "block";
	} else {
		document.querySelector(".back-to-top").style.display = "none";
	}
});

//  Copyright Formatting

var copyright = document.getElementById("copyright");
var copyrightText = "© ";
var date = new Date();
var year = date.getFullYear();
var copyrightText2 = " WAN Ho Yeung. All right reserved.";

copyright.textContent = copyrightText + year + copyrightText2;
copyright.style.backgroundImage = "url('image/home.png')";
copyright.style.color = "white";
copyright.style.padding = "10px";
copyright.style.width = "100%";
copyright.style.textAlign = "center";
