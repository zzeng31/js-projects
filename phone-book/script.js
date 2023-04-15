const API_URL = "http://localhost:3000/contacts";
const APIS = (() => {
  const getContacts = () => {
    return fetch(API_URL).then((response) => response.json());
  };
  const changeContact = (id, data) => {
    return fetch(`${API_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    }).then((response) => response.json());
  };
  const deleteContact = (id) => {
    return fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    }).then((response) => response.json());
  };
  const addContact = (data) => {
    return fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    }).then((response) => response.json());
  };
  const filterContact = (name) => {
    return fetch(`${API_URL}?name=${name}`).then((response) => response.json());
  };
  return {
    addContact,
    changeContact,
    deleteContact,
    getContacts,
    filterContact,
  };
})();

const Model = (() => {
  class Contact {
    #contacts;
    #onChange;
    constructor() {
      this.#contacts = [];
    }

    get contacts() {
      return this.#contacts;
    }
    set contacts(newContact) {
      this.#contacts = newContact;
      this.#onChange?.();
    }
    subscribe(callback) {
      this.#onChange = callback;
    }
  }
  const {
    addContact,
    changeContact,
    deleteContact,
    getContacts,
    filterContact,
  } = APIS;
  return {
    Contact,
    addContact,
    changeContact,
    deleteContact,
    getContacts,
    filterContact,
  };
})();
const View = (() => {
  const nameInputEl = document.querySelector(".name-input");
  const phoneInputEl = document.querySelector(".phone-input");
  const btnSubmitEl = document.querySelector(".btn-submit");
  const contactListEl = document.querySelector(".phonebook-contacts__list");
  const deleteBtnEl = document.querySelector(".btn-delete");
  const editBtnEl = document.querySelector(".btn-edit");
  const sortBtnEl = document.querySelector(".btn-sort");
  const searchInputEl = document.querySelector(".search-input");
  const searchBtnEl = document.querySelector(".btn-search");
  let allLiEl;
  const renderContacts = (contacts) => {
    let contactTemplate = "";
    contacts.forEach((contact) => {
      const liTemplate = ` <li id=${contact.id}>
      <span class="phonebook-contacts__list-name">${contact.name}</span>
      <span class="phonebook-contacts__list-contact">${contact.phone}</span>
      <div class="phonebook-contacts__list-btns">
        <button class="btn btn-primary btn-edit" id=${contact.id}>Edit</button>
        <button class="btn btn-danger btn-delete" id=${contact.id}>Delete</button>
      </div>
    </li>`;
      contactTemplate += liTemplate;
    });
    if (contactTemplate.length === 0) {
      contactTemplate = `<h1 class='title-primary'>No results</h1>`;
    }
    contactListEl.innerHTML = contactTemplate;
    allLiEl = document.querySelectorAll("li");
  };
  const renderEdit = (id) => {
    if (allLiEl.length > 0) {
      allLiEl.forEach((item) => {
        if (+item.id === id) {
          console.log(id);
          const editBtnEl = item.querySelector(".btn-edit");
          const nameEl = item.querySelector(".phonebook-contacts__list-name");
          const phoneEl = item.querySelector(
            ".phonebook-contacts__list-contact"
          );
          const nameText = nameEl.textContent;
          const phoneText = phoneEl.textContent;
          const nameInputField = `<input class='edit-name' type='text' value='${nameText}'>`;
          console.log(nameText);
          const phoneInputField = `<input class='edit-phone' type='tel' value='${phoneText}'>`;
          const saveBtnEl = document.createElement("button");
          saveBtnEl.classList.add("btn", "btn-primary", "btn-save");
          saveBtnEl.id = item.id;
          saveBtnEl.textContent = "Save";
          nameEl.innerHTML = nameInputField;
          phoneEl.innerHTML = phoneInputField;
          editBtnEl.replaceWith(saveBtnEl);
        }
      });
    }
  };
  const renderError = (msg, element, placeholder) => {
    element.value = "";
    element.classList.add("error-color");
    element.classList.add("error-border");
    element.placeholder = msg;
    setTimeout(() => {
      element.classList.remove("error-color");
      element.classList.remove("error-border");
      element.placeholder = placeholder;
    }, 2000);
  };
  const renderActive = (elem) => {
    elem.classList.toggle("active");
  };
  const clearInput = () => {
    nameInputEl.value = "";
    phoneInputEl.value = "";
  };
  return {
    nameInputEl,
    phoneInputEl,
    btnSubmitEl,
    contactListEl,
    deleteBtnEl,
    editBtnEl,
    allLiEl,
    sortBtnEl,
    searchInputEl,
    searchBtnEl,
    renderContacts,
    renderError,
    renderActive,
    clearInput,
    renderEdit,
  };
})();
const Controller = ((model, view) => {
  const state = new model.Contact();
  const init = () => {
    model.getContacts().then((contacts) => {
      contacts.reverse();
      state.contacts = contacts;
    });
  };

  const handleSubmit = () => {
    view.btnSubmitEl.addEventListener("click", (e) => {
      e.preventDefault();
      const nameInputValue = view.nameInputEl.value;
      const phoneInputValue = view.phoneInputEl.value;
      console.log(nameInputValue, phoneInputValue);
      if (nameInputValue.length === 0) {
        view.renderError("Name is required", view.nameInputEl, "Person Name");
      }
      if (phoneInputValue.length === 0) {
        view.renderError(
          "Phone is required",
          view.phoneInputEl,
          "Person Phone"
        );
      }
      if (nameInputValue.length > 0 && phoneInputValue.length > 0) {
        model
          .addContact({
            name: nameInputValue,
            phone: phoneInputValue,
          })
          .then((data) => {
            state.contacts = [data, ...state.contacts];
            view.clearInput();
          });
      }
    });
  };
  const handleDelete = () => {
    view.contactListEl.addEventListener("click", (e) => {
      console.log(e.target.className);
      if (e.target.className === "btn btn-danger btn-delete") {
        const id = +e.target.id;
        console.log(id, typeof id);
        model.deleteContact(id).then((data) => {
          state.contacts = state.contacts.filter(
            (contact) => contact.id !== id
          );
        });
      }
    });
  };
  const handleEdit = () => {
    let nameInputValue = "";
    let phoneInputValue = "";
    view.contactListEl.addEventListener("input", (e) => {
      console.log(e.target);
      if (e.target.className === "edit-name") {
        nameInputValue = e.target.value;
      }
      if (e.target.className === "edit-phone") {
        phoneInputValue = e.target.value;
      }
    });
    view.contactListEl.addEventListener("click", (e) => {
      if (e.target.className === "btn btn-primary btn-edit") {
        const id = +e.target.id;
        view.renderEdit(id);
      }
      if (e.target.className === "btn btn-primary btn-save") {
        const id = +e.target.id;
        const originalContact = state.contacts.filter(
          (contact) => contact.id === id
        )[0];
        // console.log(originalContact);
        // console.log(nameInputValue, phoneInputValue);
        if (nameInputValue.length === 0) {
          nameInputValue = originalContact.name;
        }
        if (phoneInputValue.length === 0) {
          phoneInputValue = originalContact.phone;
        }
        model
          .changeContact(id, {
            name: nameInputValue,
            phone: phoneInputValue,
          })
          .then((data) => {
            state.contacts = state.contacts.map((contact) => {
              if (contact.id === id) {
                return data;
              } else return contact;
            });
            nameInputValue = "";
            phoneInputValue = "";
          });
      }
    });
  };
  const handleSort = () => {
    view.sortBtnEl.addEventListener("click", () => {
      // if sort button is active, return to default order
      if (view.sortBtnEl.classList.contains("active")) {
        model.getContacts().then((contacts) => {
          contacts.reverse();
          state.contacts = contacts;
        });
      } else {
        // sort contacts by name
        state.contacts = state.contacts.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
      }
      view.renderActive(view.sortBtnEl);
    });
  };
  const handleSearch = () => {
    view.searchBtnEl.addEventListener("click", () => {
      const searchValue = view.searchInputEl.value;
      if (searchValue.length === 0) {
        view.renderError("Can not be empty", view.searchInputEl, "Search");
      } else {
        model
          .filterContact(encodeURIComponent(searchValue))
          .then((contacts) => {
            state.contacts = contacts;
          });
      }
    });
  };

  const bootstrap = () => {
    init();
    handleDelete();
    handleSubmit();
    handleEdit();
    handleSort();
    handleSearch();
    state.subscribe(() => {
      view.renderContacts(state.contacts);
    });
  };
  return { bootstrap };
})(Model, View);
Controller.bootstrap();
