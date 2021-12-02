const checkName = (event) => {
  // event.preventDefault();
  const reg = /^[A-Z a-z]*$/;
  const name = event.target.value;
  const submitBtn = document.getElementById("submit-btn");
  const saveBtn = document.getElementById("save-btn");

  // validation for name (only letters and space) and hanlding errors
  if (reg.test(name)) {
    setError("");

    submitBtn.removeAttribute("disabled");
    submitBtn.classList.remove("disabled");
    saveBtn.removeAttribute("disabled");
    saveBtn.classList.remove("disabled");
  } else {
    setError("Only English letters and space are allowed");

    submitBtn.setAttribute("disabled", "disabled");
    submitBtn.classList.add("disabled");
    saveBtn.setAttribute("disabled", "disabled");
    saveBtn.classList.add("disabled");
  }
};

// clear radio btn for selected choice
const clearSelection = () => {
  const radio = document.querySelector('input[name="gender"]:checked');

  if (radio) {
    radio.checked = false;
    setError("");
  }
};

// submit the name and error handling , also prediction
const submit = (event) => {
  const name = document.getElementById("name-input").value;

  if (!name) {
    setError("please provide a name");
    return;
  }

  getNameGender(name);
  readNameGender(name);
};

// call the api for prediction and error handling , also call the loading things.
const getNameGender = (name) => {
  setLoading(true);

  fetch(`https://api.genderize.io/?name=${name}`)
    .then(async (res) => {
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error);
      } else {
        return res.json();
      }
    })
    .then((data) => {
      if (!data.gender) {
        setError("failed to predict :(");
        setLoading(false);
        return;
      }

      document.getElementById("prediction-result-title").innerText = data.gender;
      document.getElementById("prediction-result-percent").innerText = data.probability;
    })
    .catch((err) => {
      setError(err);
      setLoading(false);
    });
};

// localstorage
// saving the name and prediction and error handling

const saveNameGender = () => {
  setError("");

  const name = document.getElementById("name-input").value;
  const genderSelect = document.querySelector('input[name="gender"]:checked');
  const genderPredict = document.getElementById("prediction-result-title").innerText;
  let gender;

  if (genderSelect && name) {
    gender = genderSelect.value;
  } else {
    if (!genderPredict || genderPredict === "-" || !name) {
      setError("nothing to save");
      return;
    }
    gender = genderPredict;
  }

  const currentLs = JSON.parse(localStorage.getItem("NAME_GENDER"));
  const data = { ...currentLs, [name]: gender };

  localStorage.setItem("NAME_GENDER", JSON.stringify(data));
  document.getElementById("saved-title").innerText = gender;
};

// delete saved data
const deleteNameGender = () => {
  const name = document.getElementById("name-input").value;
  const currentLs = JSON.parse(localStorage.getItem("NAME_GENDER"));

  delete currentLs[name];

  localStorage.setItem("NAME_GENDER", JSON.stringify({ ...currentLs }));
  document.getElementById("saved-title").innerText = "-";
};

// fetch and read saved data
const readNameGender = (name) => {
  const nameGender = JSON.parse(localStorage.getItem("NAME_GENDER"));

  if (nameGender[name]) {
    document.getElementById("saved-title").innerText = nameGender[name];
  } else {
    document.getElementById("saved-title").innerText = "-";
  }
};

// utils
// loading things
const setLoading = (state) => {
  const title = document.getElementById("prediction-result-title");
  const percent = document.getElementById("prediction-result-percent");

  if (state) {
    title.innerText = "loading...";
    percent.innerText = "loading...";
  } else {
    title.innerText = "-";
    percent.innerText = "-";
  }
};

// error things
const setError = (msg) => {
  const alertBox = document.getElementById("alert");

  if (msg) {
    alertBox.innerHTML = msg;
    alertBox.removeAttribute("hidden");
  } else {
    alertBox.innerHTML = "";
    alertBox.setAttribute("hidden", "hidden");
  }
};
