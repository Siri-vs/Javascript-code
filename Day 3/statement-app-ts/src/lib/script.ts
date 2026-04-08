import { Txn } from "../model/Txn";

let txns: Txn[] = [];

let editingId: number | null = null;

const form = document.getElementById("txnForm") as HTMLFormElement;
const dateInput = document.getElementById("txnDate") as HTMLInputElement;
const headerInput = document.getElementById("header") as HTMLInputElement;
const creditInput = document.getElementById("credit") as HTMLInputElement;
const debitInput = document.getElementById("debit") as HTMLInputElement;
const tbody = document.getElementById("txnBody") as HTMLElement;

function saveToLocalStorage(): void {
  localStorage.setItem("txns", JSON.stringify(txns));
}

function loadFromLocalStorage(): void {
  const data = localStorage.getItem("txns");
  if (data) {
    txns = JSON.parse(data);
  }
}

function render(): void {
  tbody.innerHTML = "";

  txns.forEach((txn) => {
    const tr = document.createElement("tr");

    if (editingId === txn.id) {
      tr.innerHTML = `
    <td><input type="date" class="form-control" value="${txn.txnDate}" id="edit-date"></td>
    <td><input type="text" class="form-control" value="${txn.header}" id="edit-header"></td>
    <td><input type="number" class="form-control" value="${txn.txnType === "CREDIT" ? txn.amount : ""}" id="edit-credit"></td>
    <td><input type="number" class="form-control" value="${txn.txnType === "DEBIT" ? txn.amount : ""}" id="edit-debit"></td>
    <td>
      <button class="btn btn-sm btn-success" onclick="saveEdit(${txn.id})">Save</button>
      <button class="btn btn-sm btn-secondary" onclick="cancelEdit()">Cancel</button>
    </td>
  `;
    } else {
      tr.innerHTML = `
    <td>${txn.txnDate}</td>
    <td>${txn.header}</td>
    <td>${txn.txnType === "CREDIT" ? txn.amount : ""}</td>
    <td>${txn.txnType === "DEBIT" ? txn.amount : ""}</td>
    <td>
      <button class="btn btn-sm btn-warning" onclick="startEdit(${txn.id})">Edit</button>
      <button class="btn btn-sm btn-danger" onclick="deleteTxn(${txn.id})">Delete</button>
    </td>
  `;
    }

    tbody.appendChild(tr);
  });
  updateTotals();
}

function updateTotals(): void {
  let totalCredit = 0;
  let totalDebit = 0;

  txns.forEach((txn) => {
    if (txn.txnType === "CREDIT") {
      totalCredit += txn.amount;
    } else {
      totalDebit += txn.amount;
    }
  });

  (document.getElementById("totalCredit") as HTMLElement).innerText =
    totalCredit.toString();

  (document.getElementById("totalDebit") as HTMLElement).innerText =
    totalDebit.toString();

  (document.getElementById("balance") as HTMLElement).innerText = (
    totalCredit - totalDebit
  ).toString();
}

(window as any).deleteTxn = (id: number): void => {
  txns = txns.filter((txn) => txn.id !== id);
  saveToLocalStorage();
  render();
};

(window as any).startEdit = (id: number): void => {
  editingId = id;
  render();
};

(window as any).saveEdit = (id: number): void => {
  const txn = txns.find((t) => t.id === id);
  if (!txn) return;

  const credit = Number(
    (document.getElementById("edit-credit") as HTMLInputElement).value,
  );
  const debit = Number(
    (document.getElementById("edit-debit") as HTMLInputElement).value,
  );

  if ((credit > 0 && debit > 0) || (credit === 0 && debit === 0)) {
    alert("Enter either Credit or Debit");
    return;
  }

  txn.txnDate = (
    document.getElementById("edit-date") as HTMLInputElement
  ).value;
  txn.header = (
    document.getElementById("edit-header") as HTMLInputElement
  ).value;
  txn.txnType = credit > 0 ? "CREDIT" : "DEBIT";
  txn.amount = credit > 0 ? credit : debit;

  editingId = null;
  saveToLocalStorage();
  render();
};

(window as any).cancelEdit = (): void => {
  editingId = null;
  render();
};

loadFromLocalStorage();
render();
updateTotals();

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const date = dateInput.value;
  const header = headerInput.value;
  const credit = Number(creditInput.value);
  const debit = Number(debitInput.value);

  if ((credit > 0 && debit > 0) || (credit === 0 && debit === 0)) {
    alert("Please enter either Credit or Debit");
    return;
  }

  const txnType = credit > 0 ? "CREDIT" : "DEBIT";
  const amount = credit > 0 ? credit : debit;

  const txn: Txn = {
    id: Date.now(),
    header,
    txnDate: date,
    txnType,
    amount,
  };

  txns.push(txn);
  saveToLocalStorage();
  render();
  updateTotals();
  form.reset();

  console.log(txns);
});
