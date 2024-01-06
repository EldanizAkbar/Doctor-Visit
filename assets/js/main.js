class Modal {
    constructor(modalId) {
        this.modalElement = document.getElementById(modalId);
    }

    show() {
        $(this.modalElement).modal('show');
    }

    hide() {
        $(this.modalElement).modal('hide');
    }

    onShow(callback) {
        $(this.modalElement).on('show.bs.modal', callback);
    }
}

class Visit {
    constructor() {
        this.additionalFields = {};
    }

    setCommonFields(visitPurpose, briefDescription, urgencySelect, fullName, selectedDoctor) {
        this.visitPurpose = visitPurpose;
        this.briefDescription = briefDescription;
        this.urgencySelect = urgencySelect;
        this.fullName = fullName;
        this.selectedDoctor = selectedDoctor;
    }

    setAdditionalFields(additionalFields) {
        this.additionalFields = { ...additionalFields };
    }

    toJson() {
        return {
            visitPurpose: this.visitPurpose,
            briefDescription: this.briefDescription,
            urgencySelect: this.urgencySelect,
            fullName: this.fullName,
            selectedDoctor: this.selectedDoctor,
            ...this.additionalFields,
        };
    }
}

class VisitDentist extends Visit {
    constructor() {
        super();
    }

    setSpecificFields(lastVisitDate) {
        this.additionalFields.lastVisitDate = lastVisitDate;
    }
}

class VisitCardiologist extends Visit {
    constructor() {
        super();
    }

    setSpecificFields(normalBloodPressure, bmi, cardioDiseases, age) {
        this.additionalFields.normalBloodPressure = normalBloodPressure;
        this.additionalFields.bmi = bmi;
        this.additionalFields.cardioDiseases = cardioDiseases;
        this.additionalFields.age = age;
    }
}

class VisitTherapist extends Visit {
    constructor() {
        super();
    }

    setSpecificFields(therapistAge) {
        this.additionalFields.therapistAge = therapistAge;
    }
}

document.addEventListener('DOMContentLoaded', () => {

    const searchInput = document.getElementById('searchInput');
    const priorityFilter = document.getElementById('urgencyFilter');
    const filterForm = document.getElementById('filterForm');
    const clearFiltersBtn = document.getElementById('clearFilterBtn');

    clearFiltersBtn.addEventListener('click', () => {
        searchInput.value = '';
        priorityFilter.value = '';
        applyFilters();
    });

    searchInput.addEventListener('input', applyFilters);
    priorityFilter.addEventListener('change', applyFilters);

    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedPriority = priorityFilter.value.toLowerCase();

        const filteredVisits = JSON.parse(localStorage.getItem('visits')).filter(visit => {
            const titleMatch = visit.visitPurpose.toLowerCase().includes(searchTerm) || visit.briefDescription.toLowerCase().includes(searchTerm);
            const priorityMatch = selectedPriority === '' || visit.urgencySelect.toLowerCase() === selectedPriority;

            return titleMatch && priorityMatch;
        });

        // Clear the current cards on the screen
        const cardContainer = document.getElementById('visitsBoard');
        cardContainer.innerHTML = '';

        // Display the filtered cards
        filteredVisits.forEach(visitData => {
            createCard(visitData);
        });
    }


    const loginForm = document.getElementById('loginForm');
    const submitLoginBtn = document.getElementById('submitLogin');
    const loginStatusMessage = document.getElementById('loginStatusMessage');
    const create_visit = document.getElementById('createVisitBtn');
    const loginbtn = document.getElementById('loginBtn');
    const logoutbtn = document.getElementById('logoutBtn');

    const modal = new Modal('loginModal');
    const createVisitModal = new Modal('createVisitModal');


    logoutbtn.addEventListener('click', () => {
        localStorage.setItem('isLoggedIn', 'false');
        create_visit.classList.add("d-none");
        loginbtn.style.display = "block";
        logoutbtn.style.display = "none";
        let a = document.getElementById("visitsBoard");
        a.classList.add("d-none");
        let filter = document.getElementById("filter");
        filter.classList.add("d-none");
        let organize = document.getElementById("organize");
        organize.classList.remove("d-none");
    });

    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
        let filter = document.getElementById("filter");
        filter.classList.remove("d-none");
        let organize = document.getElementById("organize");
        organize.classList.add("d-none");
        create_visit.classList.remove("d-none");
        loginbtn.style.display = "none";
        logoutbtn.style.display = "block";
        let a = document.getElementById("visitsBoard");
        a.classList.remove("d-none");

    } else {
        logoutbtn.style.display = "none";
        let a = document.getElementById("visitsBoard");
        a.classList.add("d-none");
        let organize = document.getElementById("organize");
        organize.classList.remove("d-none");
    }

    submitLoginBtn.addEventListener('click', () => {
        const enteredEmail = document.getElementById('email').value;
        const enteredPassword = document.getElementById('password').value;

        // Check if the email is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isEmailValid = emailRegex.test(enteredEmail);

        // Check if the password length is between 4 and 10 characters
        const isPasswordValid = enteredPassword.length >= 4 && enteredPassword.length <= 10;

        if (isEmailValid && isPasswordValid) {
            loginStatusMessage.innerHTML = '<div class="alert alert-success" role="alert">Login successful!</div>';
            setTimeout(() => {
                modal.hide();
                loginStatusMessage.innerHTML = "";
            }, 500);
            create_visit.classList.remove("d-none");
            loginbtn.style.display = "none";
            logoutbtn.style.display = "block";
            localStorage.setItem('isLoggedIn', 'true');
            let a = document.getElementById("visitsBoard");
            let filter = document.getElementById("filter");
            let organize = document.getElementById("organize");
            setTimeout(() => {
                a.classList.remove("d-none");
                filter.classList.remove("d-none");
                organize.classList.add("d-none")
            }, 500);



        } else {
            loginStatusMessage.innerHTML = '<div class="alert alert-danger" role="alert">Login failed. Invalid credentials.</div>';
        }
    });

    const doctorSelect = document.getElementById('doctorSelect');
    const doctorFieldsContainer = document.getElementById('doctorFields');
    const createVisitForm = document.getElementById('createVisitForm');
    const submitVisitBtn = document.getElementById('submitVisit');

    doctorSelect.addEventListener('change', () => {
        const selectedDoctor = doctorSelect.value;
        generateDoctorFields(selectedDoctor);
    });

    function generateDoctorFields(doctorType) {
        // Clear existing fields
        doctorFieldsContainer.innerHTML = '';

        // Generate new fields based on the selected doctor type
        switch (doctorType) {
            case 'dentist':
                createDentistFields();
                break;
            case 'cardiologist':
                createCardiologistFields();
                break;
            case 'therapist':
                createTherapistFields();
                break;
            default:
                break;
        }
    }

    function createCardiologistFields() {
        appendField('Normal Blood Pressure', 'text', 'normalBloodPressure', true);
        appendField('Body Mass Index (BMI)', 'text', 'bmi', true);
        appendField('Previously Diagnosed Cardiovascular Diseases', 'text', 'cardioDiseases', true);
        appendField('Age', 'number', 'age', true);
    }

    function createDentistFields() {
        appendField('Last Visit Date', 'date', 'lastVisitDate', true);
    }

    function createTherapistFields() {
        appendField('Age', 'number', 'therapistAge', true);
    }

    function appendField(label, inputType, inputId, required) {
        const fieldDiv = document.createElement('div');
        fieldDiv.classList.add('mb-3');

        const labelElement = document.createElement('label');
        labelElement.setAttribute('for', inputId);
        labelElement.classList.add('form-label');
        labelElement.textContent = label;

        const inputElement = document.createElement('input');
        inputElement.setAttribute('type', inputType);
        inputElement.setAttribute('id', inputId);
        inputElement.classList.add('form-control');
        if (required) {
            inputElement.setAttribute('required', 'required');
        }

        fieldDiv.appendChild(labelElement);
        fieldDiv.appendChild(inputElement);

        doctorFieldsContainer.appendChild(fieldDiv);
    }

    submitVisitBtn.addEventListener('click', () => {
        const visitPurpose = document.getElementById('visitPurpose').value;
        const briefDescription = document.getElementById('briefDescription').value;
        const urgencySelect = document.getElementById('urgencySelect').value;
        const fullName = document.getElementById('fullName').value;
        const selectedDoctor = doctorSelect.value;



        if (!visitPurpose || !briefDescription || !urgencySelect || !fullName || !selectedDoctor) {
            createStatusMessage.innerHTML = '<div class="alert alert-danger" role="alert">Please fill in all required fields.</div>';
            return;
        }

        const visit = getVisitInstance(selectedDoctor);

        if (selectedDoctor === 'cardiologist') {
            if (!document.getElementById('normalBloodPressure').value ||
                !document.getElementById('bmi').value ||
                !document.getElementById('cardioDiseases').value ||
                !document.getElementById('age').value) {
                createStatusMessage.innerHTML = '<div class="alert alert-danger" role="alert">Please fill in all required fields for the selected doctor type.</div>';
                return;
            }
        } else if (selectedDoctor === 'dentist') {
            if (!document.getElementById('lastVisitDate').value) {
                createStatusMessage.innerHTML = '<div class="alert alert-danger" role="alert">Please fill in all required fields for the selected doctor type.</div>';
                return;
            }
        } else if (selectedDoctor === 'therapist') {
            if (!document.getElementById('therapistAge').value) {
                createStatusMessage.innerHTML = '<div class="alert alert-danger" role="alert">Please fill in all required fields for the selected doctor type.</div>';
                return;
            }
        }

        createStatusMessage.innerHTML = '<div class="alert alert-success" role="alert">Visit successfully created!</div>';
        setTimeout(() => { modalClose(); }, 500);
        setTimeout(() => { createStatusMessage.innerHTML = ""; }, 500);



        visit.setCommonFields(visitPurpose, briefDescription, urgencySelect, fullName, selectedDoctor);

        if (selectedDoctor === 'cardiologist') {
            visit.setSpecificFields(
                document.getElementById('normalBloodPressure').value,
                document.getElementById('bmi').value,
                document.getElementById('cardioDiseases').value,
                document.getElementById('age').value
            );
        } else if (selectedDoctor === 'dentist') {
            visit.setSpecificFields(
                document.getElementById('lastVisitDate').value
            );
        } else if (selectedDoctor === 'therapist') {
            visit.setSpecificFields(
                document.getElementById('therapistAge').value
            );
        }





        const formData = visit.toJson();
        const apiUrl = 'https://ajax.test-danit.com/api/v2/cards';
        const token = '103baf3e-e56b-4bb0-8940-1ed665c6054d';

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(response => {
                modal.hide();
                createCard(response);
                saveVisitToLocalStorage(response);

                if (localStorage.getItem('visits') === '[]') {
                    let msg = document.getElementById("no_message")
                    msg.classList.remove("d-none");
                }
                else {
                    let msg = document.getElementById("no_message")
                    msg.classList.add("d-none");
                }
            })
            .catch(error => {
                console.error('Error creating visit:', error);
            });

        function modalClose() {
            createVisitModal.hide();
        }


        const specificFieldsContainer = document.getElementById('doctorFields');
        specificFieldsContainer.innerHTML = ''
        createVisitForm.reset();
    });

    function getVisitInstance(doctorType) {
        if (doctorType === 'cardiologist') {
            return new VisitCardiologist();
        } else if (doctorType === 'dentist') {
            return new VisitDentist();
        } else if (doctorType === 'therapist') {
            return new VisitTherapist();
        } else {
            throw new Error('Invalid doctor type');
        }
    }

    function createCard(visitData) {
        const cardContainer = document.getElementById('visitsBoard');

        const card = document.createElement('div');
        card.classList.add('card');
        card.id = visitData.id;


        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = visitData.fullName;
        cardTitle.id = 'fullNameOnCard';

        const cardText = document.createElement('p');
        cardText.classList.add('card-text');
        cardText.textContent = visitData.selectedDoctor;
        cardText.id = 'doctorOnCard';

        const additionalInfo = document.createElement('div');
        additionalInfo.classList.add('card-footer', 'additional-info', 'd-none');
        additionalInfo.id = 'additionalInfo';

        if (visitData.selectedDoctor === 'cardiologist') {
            createAdditionalInfo('Normal Blood Pressure', visitData.normalBloodPressure);
            createAdditionalInfo('BMI', visitData.bmi);
            createAdditionalInfo('Cardio Diseases', visitData.cardioDiseases);
            createAdditionalInfo('Age', visitData.age);

        } else if (visitData.selectedDoctor === 'dentist') {
            createAdditionalInfo('Last Visit Date', visitData.lastVisitDate);
        } else if (visitData.selectedDoctor === 'therapist') {
            createAdditionalInfo('Therapist Age', visitData.therapistAge);
        }
        createAdditionalInfo('Visit Purpose', visitData.visitPurpose);
        createAdditionalInfo('Brief Description', visitData.briefDescription);
        createAdditionalInfo('Urgency', visitData.urgencySelect);




        function createAdditionalInfo(label, value) {
            if (value !== undefined && value !== null) {
                const uls = document.createElement('ul');
                uls.classList.add('list-group');
                additionalInfo.appendChild(uls);
                const infoItem = document.createElement('li');
                infoItem.classList.add('list-group-item');
                infoItem.classList.add('mb-0');
                infoItem.innerHTML = `<strong>${label}:</strong> ${value}`;
                uls.appendChild(infoItem);
            }
        }



        const showMoreBtn = document.createElement('button');
        showMoreBtn.classList.add('btn', 'btn-outline-info');
        showMoreBtn.textContent = 'Show More';
        showMoreBtn.id = 'showMoreBtn';

        showMoreBtn.addEventListener('click', () => {
            additionalInfo.classList.toggle('d-none');
            showMoreBtn.textContent = additionalInfo.classList.contains('d-none') ? 'Show More' : 'Show Less';
        });

        const editBtn = document.createElement('button');
        editBtn.classList.add("btn", "btn-success", "btn-sm", "rounded-0", "mx-2");
        let icon1 = document.createElement('i');
        icon1.classList.add("fa", "fa-edit");
        editBtn.appendChild(icon1);
        editBtn.id = 'editBtn';

        editBtn.addEventListener('click', () => {
            openEditModal(visitData);
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add("btn", "btn-danger", "btn-sm", "rounded-0");
        let icon = document.createElement('i');
        icon.classList.add("fa", "fa-trash");
        deleteBtn.appendChild(icon);
        deleteBtn.id = 'deleteBtn';

        deleteBtn.addEventListener('click', () => {
            const confirmation = confirm('Are you sure you want to delete this visit?');
            if (confirmation) {
                const cardToDelete = deleteBtn.closest('.card');
                const apiUrl = `https://ajax.test-danit.com/api/v2/cards/${visitData.id}`;
                const token = '103baf3e-e56b-4bb0-8940-1ed665c6054d';

                fetch(apiUrl, {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },


                })
                    .then(response => {
                        if (response.ok) {
                            cardToDelete.remove(); // Remove the card from the DOM
                            removeFromLocalStorage(visitData);
                            if (localStorage.getItem('visits') === '[]') {
                                let msg = document.getElementById("no_message")
                                msg.classList.remove("d-none");
                            }
                            else {
                                let msg = document.getElementById("no_message")
                                msg.classList.add("d-none");
                            }
                        } else {
                            console.error('Error deleting visit:', response.statusText);
                        }
                    })
                    .catch(error => {
                        console.error('Error deleting visit:', error);
                    });
            }
        });



        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText);
        cardBody.appendChild(additionalInfo);
        cardBody.appendChild(showMoreBtn);
        cardBody.appendChild(editBtn);
        cardBody.appendChild(deleteBtn);

        card.appendChild(cardBody);

        cardContainer.prepend(card);
    }

    function openEditModal(visitData) {
        const editModal = new Modal('editVisitModal');

        const editVisitForm = document.getElementById('editVisitForm');
        const submitEditVisitBtn = document.getElementById('submitEditVisit');
        const editDoctorSelect = document.getElementById('editDoctorSelect');
        const editDoctorFieldsContainer = document.getElementById('editDoctorFields');

        // Set initial values in the modal
        document.getElementById('editVisitPurpose').value = visitData.visitPurpose;
        document.getElementById('editBriefDescription').value = visitData.briefDescription;
        document.getElementById('editUrgencySelect').value = visitData.urgencySelect;
        document.getElementById('editFullName').value = visitData.fullName;
        editDoctorSelect.value = visitData.selectedDoctor;
        generateEditDoctorFields(visitData.selectedDoctor);


        function generateEditDoctorFields(doctorType) {
            editDoctorFieldsContainer.innerHTML = '';


            if (doctorType === 'cardiologist') {
                createCardiologistFields(visitData.normalBloodPressure, visitData.bmi, visitData.cardioDiseases, visitData.age);
            } else if (doctorType === 'dentist') {
                createDentistFields(visitData.lastVisitDate);
            } else if (doctorType === 'therapist') {
                createTherapistFields(visitData.therapistAge);
            }
        }

        function createCardiologistFields(blood, bmi, cardio, age) {
            appendField('Normal Blood Pressure', 'text', 'editNormalBloodPressure', true, blood);
            appendField('Body Mass Index (BMI)', 'text', 'editBmi', true, bmi);
            appendField('Previously Diagnosed Cardiovascular Diseases', 'text', 'editCardioDiseases', true, cardio);
            appendField('Age', 'number', 'editAge', true, age);
        }

        function createDentistFields(date) {
            appendField('Last Visit Date', 'date', 'editLastVisitDate', true, date);
        }

        function createTherapistFields(age) {
            appendField('Age', 'number', 'editTherapistAge', true, age);
        }

        function appendField(label, inputType, inputId, required, value) {
            const fieldDiv = document.createElement('div');
            fieldDiv.classList.add('mb-3');

            const labelElement = document.createElement('label');
            labelElement.setAttribute('for', inputId);
            labelElement.classList.add('form-label');
            labelElement.textContent = label;

            const inputElement = document.createElement('input');
            inputElement.setAttribute('type', inputType);
            inputElement.setAttribute('id', inputId);
            inputElement.value = value || '';
            inputElement.classList.add('form-control');
            if (required) {
                inputElement.setAttribute('required', 'required');
            }

            fieldDiv.appendChild(labelElement);
            fieldDiv.appendChild(inputElement);

            editDoctorFieldsContainer.appendChild(fieldDiv);

        }


        if (visitData.selectedDoctor === 'cardiologist') {
            document.getElementById('editNormalBloodPressure').value = visitData.normalBloodPressure;
            document.getElementById('editBmi').value = visitData.bmi;
            document.getElementById('editCardioDiseases').value = visitData.cardioDiseases;
            document.getElementById('editAge').value = visitData.age;
        }
        else if (visitData.selectedDoctor === "dentist") {
            document.getElementById('editLastVisitDate').value = visitData.lastVisitDate;
        }
        else if (visitData.selectedDoctor === "therapist") {
            document.getElementById('editTherapistAge').value = visitData.therapistAge;
        }

        generateEditDoctorFields(visitData.selectedDoctor);



        editDoctorSelect.addEventListener('change', () => {
            const selectedDoctor = editDoctorSelect.value;
            generateEditDoctorFields(selectedDoctor);
        });



        submitEditVisitBtn.addEventListener('click', () => {
            const editedVisitPurpose = document.getElementById('editVisitPurpose').value;
            const editedBriefDescription = document.getElementById('editBriefDescription').value;
            const editedUrgencySelect = document.getElementById('editUrgencySelect').value;
            const editedFullName = document.getElementById('editFullName').value;
            const editedSelectedDoctor = editDoctorSelect.value;
            const editVisitForm = document.getElementById('editVisitForm');

            const editedVisit = getVisitInstance(editedSelectedDoctor);

            if (!editedVisitPurpose || !editedBriefDescription || !editedUrgencySelect || !editedFullName || !editedSelectedDoctor) {
                editStatusMessage.innerHTML = '<div class="alert alert-danger" role="alert">Please fill in all required fields.</div>';
                return;
            }

            if (editedSelectedDoctor === 'cardiologist') {
                if (!document.getElementById('editNormalBloodPressure').value ||
                    !document.getElementById('editBmi').value ||
                    !document.getElementById('editCardioDiseases').value ||
                    !document.getElementById('editAge').value) {
                    editStatusMessage.innerHTML = '<div class="alert alert-danger" role="alert">Please fill in all required fields for the selected doctor type.</div>';
                    return;
                }
            } else if (editedSelectedDoctor === 'dentist') {
                if (!document.getElementById('editLastVisitDate').value) {
                    editStatusMessage.innerHTML = '<div class="alert alert-danger" role="alert">Please fill in all required fields for the selected doctor type.</div>';
                    return;
                }
            } else if (editedSelectedDoctor === 'therapist') {
                if (!document.getElementById('editTherapistAge').value) {
                    editStatusMessage.innerHTML = '<div class="alert alert-danger" role="alert">Please fill in all required fields for the selected doctor type.</div>';
                    return;
                }
            }





            editedVisit.setCommonFields(editedVisitPurpose, editedBriefDescription, editedUrgencySelect, editedFullName, editedSelectedDoctor);

            if (editedSelectedDoctor === 'cardiologist') {
                editedVisit.setSpecificFields(
                    document.getElementById('editNormalBloodPressure').value,
                    document.getElementById('editBmi').value,
                    document.getElementById('editCardioDiseases').value,
                    document.getElementById('editAge').value
                );
            } else if (editedSelectedDoctor === 'dentist') {
                editedVisit.setSpecificFields(
                    document.getElementById('editLastVisitDate').value
                );
            } else if (editedSelectedDoctor === 'therapist') {
                editedVisit.setSpecificFields(
                    document.getElementById('editTherapistAge').value
                );
            }

            const editedFormData = editedVisit.toJson();
            const editApiUrl = `https://ajax.test-danit.com/api/v2/cards/${visitData.id}`;
            console.log(editApiUrl);
            const token = '103baf3e-e56b-4bb0-8940-1ed665c6054d';

            fetch(editApiUrl, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(editedFormData)
            })
                .then(response => response.json())
                .then(response => {

                    updateCard(visitData.id, response); // Update the card in the UI
                    updateLocalStorage(visitData.id, response); // Update the visit in local storage
                    editStatusMessage.innerHTML = '<div class="alert alert-success" role="alert">Visit successfully updated!</div>';
                    setTimeout(() => { createStatusMessage.innerHTML = ""; }, 500);

                    setTimeout(() => { editModal.hide(); }, 500);
                    setTimeout(() => { window.location.reload(); }, 500);


                })
                .catch(error => {
                    console.error('Error editing visit:', error);
                });
        });



        editModal.show();

    }

    function updateCard(visitId, updatedVisitData) {
        const existingCard = document.getElementById(visitId);
        existingCard.querySelector('#fullNameOnCard').textContent = updatedVisitData.fullName;
        existingCard.querySelector('#doctorOnCard').textContent = updatedVisitData.selectedDoctor;




        const additionalInfo = existingCard.querySelector('#additionalInfo');
        additionalInfo.innerHTML = ''; // Clear the existing additional info

        if (updatedVisitData.selectedDoctor === 'cardiologist') {
            createAdditionalInfo('Normal Blood Pressure', updatedVisitData.normalBloodPressure);
            createAdditionalInfo('BMI', updatedVisitData.bmi);
            createAdditionalInfo('Cardio Diseases', updatedVisitData.cardioDiseases);
            createAdditionalInfo('Age', updatedVisitData.age);
        } else if (updatedVisitData.selectedDoctor === 'dentist') {
            createAdditionalInfo('Last Visit Date', updatedVisitData.lastVisitDate);
        } else if (updatedVisitData.selectedDoctor === 'therapist') {
            createAdditionalInfo('Therapist Age', updatedVisitData.therapistAge);
        }
        createAdditionalInfo('Visit Purpose', updatedVisitData.visitPurpose);
        createAdditionalInfo('Brief Description', updatedVisitData.briefDescription);
        createAdditionalInfo('Urgency', updatedVisitData.urgencySelect);

        function createAdditionalInfo(label, value) {
            if (value !== undefined && value !== null) {
                const uls = document.createElement('ul');
                uls.classList.add('list-group');
                additionalInfo.appendChild(uls);
                const infoItem = document.createElement('li');
                infoItem.classList.add('list-group-item');
                infoItem.classList.add('mb-0');
                infoItem.innerHTML = `<strong>${label}:</strong> ${value}`;
                uls.appendChild(infoItem);
            }
        }
    }

    function updateLocalStorage(visitId, updatedVisitData) {
        const existingVisits = JSON.parse(localStorage.getItem('visits')) || [];
        const updatedVisits = existingVisits.map(existingVisit => {
            if (existingVisit.id === visitId) {
                return updatedVisitData;
            } else {
                return existingVisit;
            }
        });
        localStorage.setItem('visits', JSON.stringify(updatedVisits));


    }

    function removeFromLocalStorage(visitData) {
        const existingVisits = JSON.parse(localStorage.getItem('visits')) || [];
        const updatedVisits = existingVisits.filter(existingVisit => existingVisit.id !== visitData.id);
        localStorage.setItem('visits', JSON.stringify(updatedVisits));
    }




    function saveVisitToLocalStorage(visitData) {
        const existingVisits = JSON.parse(localStorage.getItem('visits')) || [];
        existingVisits.push(visitData);
        localStorage.setItem('visits', JSON.stringify(existingVisits));
    }

    window.addEventListener('load', () => {
        const existingVisits = JSON.parse(localStorage.getItem('visits')) || [];
        if (localStorage.getItem('visits') === '[]') {
            let msg = document.getElementById("no_message")
            msg.classList.remove("d-none");
        }
        else {
            let msg = document.getElementById("no_message")
            msg.classList.add("d-none");
        }


        existingVisits.forEach(visitData => {
            createCard(visitData);
        });
    });
});