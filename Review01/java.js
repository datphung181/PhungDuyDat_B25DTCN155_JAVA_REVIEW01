let musicList = JSON.parse(localStorage.getItem("musicList")) || [];

let idCounter = musicList.length > 0 
    ? Math.max(...musicList.map(item => item.id)) + 1 
    : 1;

const title = document.getElementById("title");
const artist = document.getElementById("artist");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const search = document.getElementById("search");
const songTable = document.getElementById("songTable");

let editingId = null;

// click button
submitBtn.addEventListener("click", createNewMusic);

// enter
title.addEventListener("keydown", enterToCreate);
artist.addEventListener("keydown", enterToCreate);

function enterToCreate(e) {
    if (e.key === "Enter") {
        e.preventDefault();
        createNewMusic(e);
    }
}

// create / update
function createNewMusic(e) {
    if (e) e.preventDefault();
    
    const titleInput = title.value.trim();
    const artistInput = artist.value.trim();

    if (!titleInput || !artistInput) {
        alert(editingId !== null 
            ? "Không được để trống khi cập nhật!" 
            : "Nhập đầy đủ bro");
        return;
    }

    if (editingId !== null) {
        const music = musicList.find(m => m.id === editingId);

        if (music) {
            music.nameTitle = titleInput;
            music.nameArtist = artistInput;
        }

        editingId = null;
        submitBtn.textContent = "Thêm";
        cancelBtn.style.display = "none";
    } else {
        const newMusic = {
            id: idCounter++,
            nameTitle: titleInput,
            nameArtist: artistInput,
        };
        musicList.push(newMusic);
    }

    localStorage.setItem("musicList", JSON.stringify(musicList));
    renderMusicList();

    title.value = "";
    artist.value = "";
    title.focus();
}

// edit
function editInfo(id) {
    const music = musicList.find(m => m.id === id);

    if (!music) {
        alert("Không tìm thấy bài hát!");
        return;
    }

    title.value = music.nameTitle;
    artist.value = music.nameArtist;

    editingId = id;

    submitBtn.textContent = "Cập nhật";
    cancelBtn.style.display = "inline";

    title.focus();
}

// cancel
cancelBtn.addEventListener("click", function () {
    editingId = null;

    title.value = "";
    artist.value = "";

    submitBtn.textContent = "Thêm";
    cancelBtn.style.display = "none";
});

// delete
function deleteInfo(id) {
    const confirmDelete = confirm("Bạn có chắc chắn muốn xóa hay không?");
    if (!confirmDelete) return;

    musicList = musicList.filter(m => m.id !== id);

    musicList = musicList.map((m, index) => ({
        ...m,
        id: index + 1
    }));

    idCounter = musicList.length + 1;

    localStorage.setItem("musicList", JSON.stringify(musicList));

    renderMusicList();
}

// render
function renderMusicList() {
    songTable.innerHTML = "";

    musicList.forEach(music => {
        songTable.innerHTML += `
            <tr>
                <td>${music.id}</td>
                <td>${music.nameTitle}</td>
                <td>${music.nameArtist}</td>
                <td>
                    <button onclick="editInfo(${music.id})">Sửa</button> 
                    <button onclick="deleteInfo(${music.id})">Xóa</button>
                </td>
            </tr>
        `;
    });
}

// search
search.addEventListener("input", searchSong);

function searchSong() {
    const keyword = search.value.toLowerCase().trim();
    const filteredList = musicList.filter(m => m.nameTitle.toLowerCase().includes(keyword));
    renderFilteredList(filteredList);
}

function renderFilteredList(list) {
    songTable.innerHTML = "";

    list.forEach(music => {
        songTable.innerHTML += `
            <tr>
                <td>${music.id}</td>
                <td>${music.nameTitle}</td>
                <td>${music.nameArtist}</td>
                <td>
                    <button onclick="editInfo(${music.id})">Sửa</button> 
                    <button onclick="deleteInfo(${music.id})">Xóa</button>
                </td>
            </tr>
        `;
    });
}

renderMusicList();
