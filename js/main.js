var contactImageInput = document.getElementById("contactImage");
var contactNameInput = document.getElementById("contactName");
var contactPhoneInput = document.getElementById("contactPhone");
var contactEmailInput = document.getElementById("contactEmail");
var contactAddressInput = document.getElementById("contactAddress");
var searchInput = document.getElementById("searchInput");
var contactGroupSelect = document.getElementById("contactGroup");
var favoriteContact = document.getElementById("favoriteContact");
var emergencyContact = document.getElementById("emergencyContact");
var isUpdateMode = false;

var contacts = [];

var contactRegex = {
  contactNameRegex: /^[A-Za-z\s]{2,}$/,
  contactPhoneRegex: /^01[0125][0-9]{8}$/,
  contactEmailRegex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  contactAddressRegex: /^[a-zA-Z0-9\s,.-]{5,}$/,
};

if (localStorage.getItem("contacts") !== null) {
  contacts = JSON.parse(localStorage.getItem("contacts"));
}
displayContacts();
renderFavoriteAndEmergencyList();

function isPhoneExist(phone) {

  for (var i = 0; i < contacts.length; i++) {

    if (contacts[i].phone === phone) {
      return true;
    }

  }

  return false;
}

function addContact() {

  if (contactNameInput.value.trim() === "") {

    Swal.fire({
      icon: "error",
      title: "Missing Name",
      text: "Please enter contact name!",
    });

    return;
  }

  if (contactPhoneInput.value.trim() === "") {

    Swal.fire({
      icon: "error",
      title: "Missing Phone Number",
      text: "Please enter phone number!",
    });

    return;
  }

  if (isPhoneExist(contactPhoneInput.value)) {

    Swal.fire({
      icon: "error",
      title: "Duplicate Phone Number",
      text: "This phone number already exists!",
    });

    return;
  }

  if (
    isContactInputsValid(contactRegex.contactNameRegex, contactNameInput) &&
    isContactInputsValid(contactRegex.contactPhoneRegex, contactPhoneInput) &&
    isContactInputsValid(contactRegex.contactEmailRegex, contactEmailInput) &&
    isContactInputsValid(contactRegex.contactAddressRegex, contactAddressInput)
  ) {

    var contact = {
      image: `./images/${contactImageInput.files[0]?.name ? contactImageInput.files[0]?.name : "placeholder.png"}`,
      name: contactNameInput.value,
      phone: contactPhoneInput.value,
      email: contactEmailInput.value,
      address: contactAddressInput.value,
      group: contactGroupSelect.value,
      isFavorite: favoriteContact.checked,
      isEmergency: emergencyContact.checked,
      favList: 0,
      emeList: 0,
    };

    contacts.push(contact);

    localStorage.setItem("contacts", JSON.stringify(contacts));

    displayContacts();

    renderFavoriteAndEmergencyList();

    resetAllInputs();

    Swal.fire({
      title: "Added!",
      text: "Contact has been added successfully!",
      icon: "success",
    });

  } else {

    Swal.fire({
      icon: "error",
      title: "Missing Data",
      text: "Please enter valid data!",
    });

  }
}
function generateAvatarBox(name) {
  var words = name.trim().split(" ");

  var initials = "";

  if (words[0]) {
    initials += words[0][0];
  }

  if (words[1]) {
    initials += words[1][0];
  }

  return initials.toUpperCase();
}

function resetAllInputs() {
  contactImageInput.value = "";
  contactNameInput.value = "";
  contactPhoneInput.value = "";
  contactEmailInput.value = "";
  contactAddressInput.value = "";
  contactGroupSelect.value = "";
  favoriteContact.checked = false;
  emergencyContact.checked = false;
  contactPreview.src = "";
  document.getElementById("userLogo").classList.remove("d-none");

  contactNameInput.classList.remove("is-valid");
  contactPhoneInput.classList.remove("is-valid");
  contactEmailInput.classList.remove("is-valid");
  contactAddressInput.classList.remove("is-valid");
}
function isFavoriteContact(index) {
  contacts[index].isFavorite = !contacts[index].isFavorite;
  localStorage.setItem("contacts", JSON.stringify(contacts));
  renderFavoriteAndEmergencyList();
  if (searchInput.value) {
    searchContacts();
  } else {
    displayContacts();
  }
}
function isEmergencyContact(index) {
  contacts[index].isEmergency = !contacts[index].isEmergency;
  localStorage.setItem("contacts", JSON.stringify(contacts));
  renderFavoriteAndEmergencyList();
  if (searchInput.value) {
    searchContacts();
  } else {
    displayContacts();
  }
}

function displayContacts(contactsList = contacts) {
  var contactsContainer = "";
  var totalContactsElement = "";
  var numberOfContactsElement = "";

  if (contactsList.length === 0) {
    document.getElementById("cards").innerHTML = `
    <div class="no-contats mx-auto text-center mt-5">
      <div class="icon mx-auto mb-3">
        <i class="fa-solid fa-address-book"></i>
      </div>
      <p class="m-0 text-black-50 fw-bold">No contacts found</p>
      <p class="m-0 text-body-tertiary">Click "Add Contact" to get started</p>
    </div>`;

    document.getElementById("totalContacts").innerHTML = `
                    <p class="stat-label fw-bold">TOTAL</p>
                <p class="stat-value">${contacts.length}</p>
    `;
    document.getElementById("numberOfContacts").innerHTML = `
    ${contacts.length}
    `;

    return;
  }

  totalContactsElement += `
                    <p class="stat-label fw-bold">TOTAL</p>
                <p class="stat-value">${contacts.length}</p>
    `;

  numberOfContactsElement += `
    ${contacts.length}
    `;

  for (var i = 0; i < contactsList.length; i++) {
    contactsContainer += `
                        <div class="col-12 col-sm-6">
                  <div class="card rounded-4 border-0 shadow-sm">
                    <div class="card-body">
                      <div class="d-flex align-items-start mb-3">
                        <div class="${contactsList[i].image.includes("placeholder.png") ? "avatar-box" : "img-box"} me-3">

                        <span class="${contactsList[i].image.includes("placeholder.png") ? "d-block" : "d-none"}">${generateAvatarBox(contactsList[i].name)}</span>
                      
                        <div>
                        <div class="${contactsList[i].isFavorite ? "fav-badge" : "d-none"}"><i class="fa-solid fa-star"></i></div>
                        <div class="${contactsList[i].isEmergency ? "eme-badge" : "d-none"}"><i class="fa-solid fa-heartbeat"></i></div>
                            </div>
                          <img
                            src="${contactsList[i].image}"
                            alt=""
                            class="img-fluid rounded-4 ${contactsList[i].image.includes("placeholder.png") ? "d-none" : "img-fluid"}"
                          />
                        </div>
                        <div>
                          <h3 class="h6 fw-bold mb-1">${contactsList[i].name}</h3>
                          <div
                            class="d-flex align-items-center text-muted small"
                          >
                            <span class="icon-sm bg-blue me-2"
                              ><i class="fa-solid fa-phone fa-xs"></i
                            ></span>
                            ${contactsList[i].phone}
                          </div>
                        </div>
                      </div>

                      <div class="contact-info">
                        <div class="d-flex small align-items-center mb-2">
                          <span class="icon-md bg-purple me-1"
                            ><i class="fa-solid fa-envelope fa-xs"></i
                          ></span>
                          <span class="text-secondary"
                            >${contactsList[i].email}</span
                          >
                        </div>
                        <div class="d-flex align-items-center mb-3 small">
                          <span class="icon-md bg-green me-1"
                            ><i class="fa-solid fa-map-marker-alt fa-xs"></i
                          ></span>
                          <span class="text-secondary"
                            >${contactsList[i].address}</span
                          >
                        </div>
                        <span class="badge ${contactsList[i].group === "Family" ? "badge-family" : contactsList[i].group === "Friends" ? "badge-friends" : contactsList[i].group === "Work" ? "badge-work" : contactsList[i].group === "School" ? "badge-school" : contactsList[i].group === "Other" ? "badge-other" : "d-none"} p-2">${contactsList[i].group}</span>
                        ${contactsList[i].isEmergency ? '<span class="badge badge-emergency p-2"><i class="fa-solid fa-heartbeat"></i> Emergency</span>' : ""}
                      </div>
                    </div>

                    <div
                      class="card-footer bg-light border-0 px-3 py-1 d-flex align-items-center justify-content-between"
                    >
                      <div class="d-flex gap-2 small">
                        <a href="tel:${contactsList[i].phone}" class="link bg-soft-green">
                          <i class="fa-solid fa-phone text-success"></i>
                        </a>
                        <a href="mailto:${contactsList[i].email}" class="link bg-soft-purple">
                          <i class="fa-solid fa-envelope text-purple"></i>
                        </a>
                      </div>
                      <div class="d-flex gap-3 text-muted">
                        <button
                          onclick="isFavoriteContact(${contactsList[i].oldIndex ?? i})"
                          class="border-0 bg-transparent favorite-btn btn-action"
                        >
                          <i
                            class="${contactsList[i].isFavorite ? "fa-solid" : "fa-regular"} fa-star cursor-pointer fa-sm ${contactsList[i].isFavorite ? "text-warning" : "text-black-50"}"
                          ></i>
                        </button>
                        <button
                          onclick="isEmergencyContact(${contactsList[i].oldIndex ?? i})"
                          class="border-0 bg-transparent emergency-btn btn-action"
                        >
                          <i
                            class="${contactsList[i].isEmergency ? "fa-solid" : "fa-regular"} ${contactsList[i].isEmergency ? "fa-heartbeat" : "fa-heart"} cursor-pointer fa-sm ${contactsList[i].isEmergency ? "text-danger" : "text-black-50"}"
                          ></i>
                        </button>
                        <button
                          class="border-0 bg-transparent edit-btn btn-action"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                          onclick="setDataToModal(${contactsList[i].oldIndex ?? i})"
                        >
                          <i
                            class="fa-solid fa-pencil cursor-pointer fa-sm text-black-50"
                          ></i>
                        </button>
                        <button
                          onclick="deleteContact(${contactsList[i].oldIndex ?? i})"
                          class="border-0 bg-transparent delete-btn btn-action"
                        >
                          <i
                            class="fa-solid fa-trash-alt cursor-pointer fa-sm text-black-50"
                          ></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
        `;
  }

  document.getElementById("totalContacts").innerHTML = totalContactsElement;
  document.getElementById("numberOfContacts").innerHTML =
    numberOfContactsElement;
  document.getElementById("cards").innerHTML = contactsContainer;
}

function renderFavoriteAndEmergencyList() {
  var emergencyCounter = 0;
  var favoriteCounter = 0;
  var totalFavoriteElement = "";
  var totalEmergencyElement = "";
  var favoriteContactsHTML = "";
  var emergencyContactsHTML = "";
  for (var i = 0; i < contacts.length; i++) {
    if (contacts[i].isFavorite) {
      favoriteCounter++;
      favoriteContactsHTML += `
                          <div
                    class="bottom d-flex align-items-center justify-content-between mb-lg-2"
                  >
                    <div class="info d-flex align-items-center gap-3">
                        <div class="${contacts[i].image.includes("placeholder.png") ? "avatar-box" : "img-box"} me-3">

                        <span class="${contacts[i].image.includes("placeholder.png") ? "d-block" : "d-none"}">${generateAvatarBox(contacts[i].name)}</span>
                      
                          <img
                            src="${contacts[i].image}"
                            alt=""
                            class="img-fluid rounded-4 ${contacts[i].image.includes("placeholder.png") ? "d-none" : "img-fluid"}"
                          />
                        </div>
                      <div>
                        <h4 class="mb-0">${contacts[i].name}</h4>
                        <p>${contacts[i].phone}</p>
                      </div>
                    </div>
                    <div class="icon-fav">
                      <i class="fa-solid fa-phone text-success"></i>
                    </div>
                  </div>
        `;
    }
    if (contacts[i].isEmergency) {
      emergencyCounter++;
      emergencyContactsHTML += `                  <div
                    class="bottom d-flex align-items-center justify-content-between mb-lg-2"
                  >
                    <div class="info d-flex align-items-center gap-3">
                             <div class="${contacts[i].image.includes("placeholder.png") ? "avatar-box" : "img-box"} me-3">

                        <span class="${contacts[i].image.includes("placeholder.png") ? "d-block" : "d-none"}">${generateAvatarBox(contacts[i].name)}</span>
                      
                          <img
                            src="${contacts[i].image}"
                            alt=""
                            class="img-fluid rounded-3 ${contacts[i].image.includes("placeholder.png") ? "d-none" : "img-fluid"}"
                          />
                        </div>
                      <div>
                        <h4 class="mb-0">${contacts[i].name}</h4>
                        <p>${contacts[i].phone}</p>
                      </div>
                    </div>
                    <div class="icon-eme">
                      <i class="fa-solid fa-phone text-danger"></i>
                    </div>
                  </div>`;
    }
  }
  totalFavoriteElement += `
                   <p class="stat-label fw-bold">TOTAL</p>
               <p class="stat-value">${favoriteCounter}</p>
   `;
  if (favoriteCounter === 0) {
    favoriteContactsHTML = `
    <div class="no-contacts mx-auto text-center text-black-50 mt-4 mb-4">
      <p>No favorite contacts yet</p>
    </div>
  `;
  }
  if (emergencyCounter === 0) {
    emergencyContactsHTML = `
    <div class="no-contacts mx-auto text-center text-black-50 mt-4 mb-4">
      <p>No emergency contacts yet</p>
    </div>
  `;
  }

  totalEmergencyElement += `
                    <p class="stat-label fw-bold">TOTAL</p>
                <p class="stat-value">${emergencyCounter}</p>
    `;
  document.getElementById("favoriteContactsList").innerHTML =
    favoriteContactsHTML;
  document.getElementById("emergencyContactsList").innerHTML =
    emergencyContactsHTML;
  document.getElementById("totalFavoriteContacts").innerHTML =
    totalFavoriteElement;
  document.getElementById("totalEmergencyContacts").innerHTML =
    totalEmergencyElement;
}

function deleteContact(index) {
  Swal.fire({
    title: "Delete Contact?",
    text:
      "Are you sure you want to delete " +
      contacts[index].name +
      "? This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#606773",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      contacts.splice(index, 1);
      localStorage.setItem("contacts", JSON.stringify(contacts));
      displayContacts();
      renderFavoriteAndEmergencyList();
      Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success",
      });
    }
  });
}

function searchContacts() {
  var searchTerm = searchInput.value;

  var searchResults = [];
  for (var i = 0; i < contacts.length; i++) {
    if (
      contacts[i].name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contacts[i].phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contacts[i].email.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      searchResults.push({ ...contacts[i], oldIndex: i });
    }
  }

  displayContacts(searchResults);
}

function setDataToModal(index) {
  isUpdateMode = true;

  updatedIndex = index;

  contactNameInput.value = contacts[index].name;
  contactPhoneInput.value = contacts[index].phone;
  contactEmailInput.value = contacts[index].email;
  contactAddressInput.value = contacts[index].address;
  contactGroupSelect.value = contacts[index].group;

  favoriteContact.checked = contacts[index].isFavorite;
  emergencyContact.checked = contacts[index].isEmergency;
}

var updatedIndex;
function updateContact() {
  contacts[updatedIndex].name = contactNameInput.value;
  contacts[updatedIndex].phone = contactPhoneInput.value;
  contacts[updatedIndex].email = contactEmailInput.value;
  contacts[updatedIndex].address = contactAddressInput.value;
  contacts[updatedIndex].group = contactGroupSelect.value;

  contacts[updatedIndex].isFavorite = favoriteContact.checked;
  contacts[updatedIndex].isEmergency = emergencyContact.checked;
  if (contactImageInput.files.length > 0) {
    contacts[updatedIndex].image =
      `./images/${contactImageInput.files[0]?.name}`;
  }

  localStorage.setItem("contacts", JSON.stringify(contacts));

  displayContacts();

  renderFavoriteAndEmergencyList();

  resetAllInputs();

  isUpdateMode = false;

  Swal.fire({
    title: "Updated!",
    text: "Contact has been updated successfully.",
    icon: "success",
    draggable: false,
  });
}

function saveContact() {
  if (isUpdateMode) {
    updateContact();
  } else {
    addContact();
  }
}

function isContactInputsValid(regex, contactInput) {
  if (regex.test(contactInput.value)) {
    contactInput.classList.remove("is-invalid");

    contactInput.nextElementSibling.classList.replace("d-block", "d-none");

    return true;
  } else {
    contactInput.classList.add("is-invalid");
    contactInput.nextElementSibling.classList.replace("d-none", "d-block");

    return false;
  }
}

function previewImage() {

  contactPreview.src =
    URL.createObjectURL(contactImageInput.files[0]);
    document.getElementById("userLogo").classList.add("d-none");
  
}