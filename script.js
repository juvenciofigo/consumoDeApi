const list = document.querySelector("#games");
var data_id;
var editId;
var aut;

var notification = document.querySelector(".notification");
var divNovo = document.querySelector(".novoGame");
const noConfirm = document.querySelector(".noConfirm");

var axiosConfig = {
    headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
    },
};
setTimeout(() => loadGames(), 1000);
if (localStorage.getItem("token") != null) {
    document.querySelector(".container-fluid2").style.display = "none";
}

if (noConfirm) {
    noConfirm.addEventListener("click", () => (document.querySelector(".confirmDel").style.display = "none"));
}

function sair() {
    localStorage.removeItem("token");
    document.querySelector(".container-fluid2").style.display = "block";
    window.location.reload();
}

function showNotification(message, className) {
    const div = document.createElement("div");
    div.setAttribute("class", className);
    div.textContent = message;
    notification.appendChild(div);
    setTimeout(() => {
        notification.removeChild(div);
    }, 5000);
}

function reload() {
    loadGames();
    clearInputFields();
}

function sim() {
    deleteGame(data_id);
    document.querySelector(".confirmDel").style.display = "none";
}

function clearInputFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#year").value = "";
    document.querySelector("#price").value = "";
    document.querySelector("#titleEdit").value = "";
    document.querySelector("#yearEdit").value = "";
    document.querySelector("#priceEdit").value = "";
}

function loadForm(itemList) {
    editId = itemList.getAttribute("data-id");
    document.querySelector("#titleEdit").value = itemList.getAttribute("data-title");
    document.querySelector("#yearEdit").value = itemList.getAttribute("data-year");
    document.querySelector("#priceEdit").value = itemList.getAttribute("data-price");
}

function showSuccess(message) {
    showNotification(message, "alert alert-success");
}
function showError(message) {
    showNotification(message, "alert alert-danger");
}

// Edit Game
async function update() {
    try {
        const title = document.querySelector("#titleEdit").value;
        const year = document.querySelector("#yearEdit").value;
        const price = document.querySelector("#priceEdit").value;
        var id = editId;

        const game = {
            title: title,
            year: year,
            price: price,
        };

        await axios
            .put(`http://localhost:45678/game/edit/${id}`, game, axiosConfig)
            .then((res) => {
                showSuccess(res.data);
                reload();
                id = "";
            })
            .catch((err) => {
                showError(err.response.data);
            });
    } catch (err) {
        console.log(err);
    }
}

// login
async function login() {
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    const user = {
        email,
        password,
    };

    try {
        await axios
            .post("http://localhost:45678/authentication", user)
            .then((res) => {
                if (res.status == 200) {
                    var token = res.data.token;
                    localStorage.setItem("token", token);
                    window.location.reload();

                    showSuccess(err.response.data);
                }
            })
            .catch((err) => {
                showError(err.response.data);
            });
    } catch (err) {
        console.error(err);
    }
}

// Create a new game
async function createGame() {
    try {
        const title = document.querySelector("#title");
        const year = document.querySelector("#year");
        const price = document.querySelector("#price");

        const game = {
            title: title.value,
            year: year.value,
            price: price.value,
        };

        await axios
            .post("http://localhost:45678/game", game, axiosConfig)
            .then((res) => {
                showSuccess(res.data);
                reload();
            })
            .catch((err) => {
                showError(err.response.data);
            });
    } catch (err) {
        console.log(err);
    }
}

// Delete One Game
async function deleteGame(itemList) {
    try {
        const id = itemList;

        await axios
            .delete(`http://localhost:45678/game/${id}`, axiosConfig)
            .then((res) => {
                loadGames();
                showSuccess(res.data);
            })
            .catch((err) => {
                console.log(err);
                showSuccess(err.response.data);
            });
    } catch (err) {
        console.log(err);
    }
}

// inicial page
async function loadGames() {
    try {
        await axios
            .get("http://localhost:45678/games", axiosConfig)
            .then((res) => {
                const games = res.data.games;
                list.innerHTML = ""; // Limpa a lista

                games.forEach((game, index) => {
                    const itemList = document.createElement("li");
                    itemList.setAttribute("data-id", game.id);
                    itemList.setAttribute("data-title", game.title);
                    itemList.setAttribute("data-price", game.price);
                    itemList.setAttribute("data-year", game.year);
                    const div = document.createElement("div");
                    div.setAttribute("class", "buttons");

                    const deleteBtn = document.createElement("button");
                    deleteBtn.setAttribute("class", "btn btn-danger");
                    deleteBtn.textContent = "Apagar";

                    const editBtn = document.createElement("button");
                    editBtn.setAttribute("class", "btn btn-success");
                    editBtn.textContent = "Atualizar";
                    div.appendChild(deleteBtn);
                    div.appendChild(editBtn);

                    itemList.innerHTML = `${index + 1}. <br/> Título: ${game.title}, <br/> Preço: $${game.price}, <br/>Ano: ${game.year}`;

                    itemList.appendChild(div);

                    list.appendChild(itemList);

                    deleteBtn.addEventListener("click", () => {
                        document.querySelector(".confirmDel").style.display = "flex";
                        data_id = itemList.getAttribute("data-id");
                    });

                    editBtn.addEventListener("click", () => {
                        loadForm(itemList);
                    });
                });
            })
            .catch((err) => {
                console.error(err);
                showNotification(response.data, "alert alert-success");
            });
    } catch (err) {
        console.error(err);
    }
}
