const APIS = (() => {
  const changeBudget = (newBudget) => {
    console.log(newBudget);
    return fetch("http://localhost:3000/budgets", {
      method: "PUT",
      body: JSON.stringify(newBudget),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());
  };
  const deleteBudget = (id) => {
    return fetch("http://localhost:3000/budgets/" + id, {
      method: "DELETE",
    }).then((res) => res.json());
  };

  const getBudgets = () => {
    return fetch("http://localhost:3000/budgets").then((res) => res.json());
  };
  const createExpense = (newExpense) => {
    return fetch("http://localhost:3000/expenses", {
      method: "POST",
      body: JSON.stringify(newExpense),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());
  };
  const changeExpense = (id, newExpense) => {
    return fetch("http://localhost:3000/expenses/" + id, {
      method: "PUT",
      body: JSON.stringify(newExpense),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());
  };
  const deleteExpense = (id) => {
    return fetch("http://localhost:3000/expenses/" + id, {
      method: "DELETE",
    }).then((res) => res.json());
  };

  const getExpense = () => {
    return fetch("http://localhost:3000/expenses").then((res) => res.json());
  };
  return {
    changeBudget,
    deleteBudget,
    getBudgets,
    createExpense,
    changeExpense,
    deleteExpense,
    getExpense,
  };
})();
const Model = (() => {
  class State {
    #budgets;
    #expenses;
    #onChange;
    constructor() {
      this.#budgets = {};
      this.#expenses = [];
    }
    get budgets() {
      return this.#budgets;
    }
    get expenses() {
      return this.#expenses;
    }
    set budgets(newBudgets) {
      this.#budgets = newBudgets;
      this.#onChange?.();
    }
    set expenses(newExpenses) {
      this.#expenses = newExpenses;
      this.#onChange?.();
    }
    subscribe(callback) {
      this.#onChange = callback;
    }
  }
  const {
    changeBudget,
    deleteBudget,
    getBudgets,
    createExpense,
    changeExpense,
    deleteExpense,
    getExpense,
  } = APIS;
  return {
    State,
    changeBudget,
    deleteBudget,
    getBudgets,
    createExpense,
    changeExpense,
    deleteExpense,
    getExpense,
  };
})();
const View = (() => {
  const appContainerEl = document.querySelector(".app-container");
  const budgetInputEl = document.querySelector(".budget-input");
  const productInputEl = document.querySelector(".product-input");
  const priceInputEl = document.querySelector(".price-input");
  const checkAmountBtnEl = document.querySelector(".check-amount-btn");
  const setBudgetBtnEl = document.querySelector(".set-budget-btn");
  const totalBudgetEl = document.querySelector("#total-budget");
  const listEl = document.querySelector(".list");
  const totalExpenseEl = document.querySelector("#expense");
  const totalBalanceEl = document.querySelector("#balance");
  const expenseListEl = document.querySelector(".list");
  let allExpenseEl;

  const renderExpenses = (expenses) => {
    let templateHTML = "";
    expenses.forEach((expense) => {
      const expenseHTML = ` <li id=${expense.id}>
          <span class="list-title">${expense.title}</span>
          <span class="list-price">$${expense.price}</span>
          <span class="list-btns">
            <button class="icon btn-change" id=${expense.id}>
              <ion-icon name="pencil-outline" id=${expense.id}></ion-icon>
            </button>
            <button class="icon btn-delete" id=${expense.id}>
              <ion-icon name="trash-outline" id=${expense.id}></ion-icon>
            </button>
          </span>
        </li>`;
      templateHTML += expenseHTML;
    });
    expenseListEl.innerHTML = templateHTML;
    allExpenseEl = document.querySelectorAll("li");
  };
  const renderBudgets = (budgets) => {
    totalBudgetEl.innerHTML = budgets.total;
    totalExpenseEl.innerHTML = budgets.expenses;
    totalBalanceEl.innerHTML = budgets.balance;
  };

  const renderChangeExpense = (id) => {
    if (allExpenseEl.length > 0) {
      allExpenseEl.forEach((item) => {
        if (id === +item.id) {
          const editBtn = item.querySelector(".btn-change");
          const expenseEl = item.querySelector(".list-price");
          const expenseText = expenseEl.innerHTML.slice(1);
          const expenseInputField = `<input class='edit-expense' type='number' value=${expenseText}> `;
          expenseEl.innerHTML = expenseInputField;

          const titleEl = item.querySelector(".list-title");
          const titleText = titleEl.innerHTML;
          const titleInputField = `<input class='edit-title' type='text' value=${titleText}> `;
          titleEl.innerHTML = titleInputField;
          //Change Edit button to Save

          const saveBtn = document.createElement("button");
          saveBtn.className = "btn-save icon";
          saveBtn.id = item.id;
          saveBtn.innerHTML = `<ion-icon name="checkmark-outline"></ion-icon>`;
          editBtn.replaceWith(saveBtn);
        }
      });
    }
  };
  const renderError = (msg, element, originalText) => {
    element.value = "";
    element.classList.add("error-color");
    element.classList.add("error-border");
    element.placeholder = msg;

    setTimeout(() => {
      element.classList.remove("error-color");
      element.classList.remove("error-border");
      element.placeholder = originalText;
    }, 3000);
  };
  const clearInput = () => {
    console.log("clear");
    budgetInputEl.value = "";
    productInputEl.value = "";
    priceInputEl.value = "";
  };
  return {
    appContainerEl,
    budgetInputEl,
    productInputEl,
    priceInputEl,
    checkAmountBtnEl,
    setBudgetBtnEl,
    totalBudgetEl,
    totalExpenseEl,
    totalBalanceEl,
    expenseListEl,
    listEl,
    renderExpenses,
    renderError,
    renderBudgets,
    renderChangeExpense,
    clearInput,
  };
})();

const Controller = ((model, view) => {
  const state = new model.State();
  const init = () => {
    model.getBudgets().then((budgets) => {
      state.budgets = budgets;
      console.log(`got budgets`, state.budgets);
    });
    model.getExpense().then((expenses) => {
      expenses.reverse();
      state.expenses = expenses;
      console.log(`got expenses`, state.expenses);
    });
  };

  const handleSubmitExpense = () => {
    view.checkAmountBtnEl.addEventListener("click", () => {
      const productInputValue = view.productInputEl.value;
      const costInputValue = view.priceInputEl.value;
      if (productInputValue.length === 0) {
        handleInputErr(view.productInputEl, "Input can not be empty");
      }
      if (costInputValue.length === 0) {
        handleInputErr(view.priceInputEl, "Input can not be empty");
      }
      if (productInputValue.length > 0 && costInputValue.length > 0) {
        model
          .createExpense({ title: productInputValue, price: costInputValue })
          .then((expense) => {
            const cost = Number(costInputValue);

            model
              .changeBudget({
                total: state.budgets.total,
                expenses: state.budgets.expenses + cost,
                balance: state.budgets.balance - cost,
              })
              .then((budget) => {
                state.budgets = budget;
                state.expenses = [...state.expenses, expense];
                view.clearInput();
              });
          });
      }
    });
  };
  const handleSubmitBudget = () => {
    view.setBudgetBtnEl.addEventListener("click", () => {
      const inputValue = view.budgetInputEl.value;
      if (inputValue.length === 0 || inputValue < 0)
        handleInputErr(
          view.budgetInputEl,
          "Input can not be empty or negative"
        );
      else {
        const newBudget = {
          total: Number(inputValue),
          expenses: state.budgets.expenses,
          balance: Number(inputValue) - state.budgets.expenses,
        };
        model.changeBudget(newBudget).then((data) => {
          state.budgets = data;
          view.clearInput();
        });
      }
    });
  };

  const handleChangeExpense = () => {
    let expenseInputValue = "";
    let titleInputValue = "";
    view.listEl.addEventListener("click", (event) => {
      if (event.target.name === "pencil-outline") {
        const id = +event.target.id;
        view.renderChangeExpense(id);
      }
    });
    view.listEl.addEventListener("input", (event) => {
      if (event.target.className === "edit-expense") {
        expenseInputValue = event.target.value;
      }
    });
    view.listEl.addEventListener("input", (event) => {
      if (event.target.className === "edit-title") {
        titleInputValue = event.target.value;
      }
    });
    view.listEl.addEventListener("click", (event) => {
      if (event.target.name === "checkmark-outline") {
        const id = +event.target.parentNode.id;

        const originalExpense = state.expenses.filter(
          (expense) => expense.id === +id
        )[0];
        console.log(originalExpense);
        if (titleInputValue === "") titleInputValue = originalExpense.title;
        if (expenseInputValue === "") expenseInputValue = originalExpense.price;

        model
          .changeExpense(id, {
            title: titleInputValue,
            price: expenseInputValue,
          })
          .then((data) => {
            state.expenses = state.expenses.map((item) => {
              if (item.id === +id) return data;
              else return item;
            });

            const newExpense = state.expenses.reduce(
              (acc, item) => acc + Number(item.price),
              0
            );
            const newBalance = state.budgets.total - newExpense;

            model
              .changeBudget({
                total: state.budgets.total,
                expenses: newExpense,
                balance: newBalance,
              })
              .then((data) => {
                state.budgets = data;
                expenseInputValue = "";
                titleInputValue = "";
              });
          });
      }
    });
  };

  const handleDeleteExpense = () => {
    view.listEl.addEventListener("click", (event) => {
      if (event.target.name === "trash-outline") {
        const id = +event.target.id;
        model.deleteExpense(id).then((data) => {
          const price = Number(
            state.expenses.filter((expense) => expense.id === id)[0].price
          );

          model
            .changeBudget({
              total: state.budgets.total,
              expenses: state.budgets.expenses - price,
              balance: state.budgets.balance + price,
            })
            .then((budgets) => {
              state.budgets = budgets;
              state.expenses = state.expenses.filter(
                (expense) => expense.id !== id
              );
              view.clearInput();
            });
        });
      }
    });
  };
  const handleInputErr = (element, msg) => {
    view.renderError(msg, element, element.placeholder);
  };
  const bootstrap = () => {
    init();
    handleSubmitExpense();
    handleSubmitBudget();
    handleChangeExpense();
    handleDeleteExpense();
    state.subscribe(() => {
      view.renderBudgets(state.budgets);
      view.renderExpenses(state.expenses);
    });
  };
  return {
    bootstrap,
  };
})(Model, View);
Controller.bootstrap();
