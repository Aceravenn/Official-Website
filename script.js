let data = { Memories: [], Letters: [], "Bucket List": [] };
let currentTab = "Memories", editingModalIndex = null, overlayIndex = null;

function showTab(tab) {
    currentTab = tab;
    document.getElementById("tabTitle").textContent = tab;
    render();
}

function openModal(editIndex = null) {
    editingModalIndex = editIndex;
    document.getElementById("modal").style.display = "flex";

    document.getElementById("memoryInput").style.display = currentTab === "Memories" ? "flex" : "none";
    document.getElementById("textInput").style.display = currentTab === "Letters" ? "flex" : "none";
    document.getElementById("bucketInput").style.display = currentTab === "Bucket List" ? "flex" : "none";

    // Clear inputs
    document.getElementById("memoryTitle").value = "";
    document.getElementById("memoryDesc").value = "";
    document.getElementById("memoryDate").value = "";
    document.getElementById("memoryFile").value = "";
    document.getElementById("addPreview").innerHTML = "";

    document.getElementById("lettersTitle").value = "";
    document.getElementById("lettersDesc").value = "";
    document.getElementById("lettersText").value = "";

    document.getElementById("bucketText").value = "";
    document.getElementById("bucketDesc").value = "";
}

function closeModal() { document.getElementById("modal").style.display = "none"; editingModalIndex = null; }

function previewAddImages(input) {
    const container = document.getElementById("addPreview");
    container.innerHTML = "";
    [...input.files].forEach(file => {
        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);
        container.appendChild(img);
    });
}

function formatDate(d) { return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }); }

function saveModalChanges() {
    if (currentTab === "Memories") {
        const title = document.getElementById("memoryTitle").value.trim();
        const desc = document.getElementById("memoryDesc").value.trim();
        const files = document.getElementById("memoryFile").files;
        const dateInput = document.getElementById("memoryDate").value;
        const date = dateInput ? new Date(dateInput) : new Date();
        if (!title || !files.length) { alert("Title and images are required."); return; }
        const images = [...files].map(f => URL.createObjectURL(f));
        data.Memories.push({ title, desc, images, date });

    } else if (currentTab === "Letters") {
        const title = document.getElementById("lettersTitle").value.trim();
        const desc = document.getElementById("lettersDesc").value.trim();
        const text = document.getElementById("lettersText").value.trim();
        const date = new Date();
        if (!title || !text) { alert("Title and text are required."); return; }
        data.Letters.push({ title, desc, text, date });

    } else if (currentTab === "Bucket List") {
        const text = document.getElementById("bucketText").value.trim();
        const desc = document.getElementById("bucketDesc").value.trim();
        const date = new Date();
        if (!text) { alert("Text is required."); return; }
        data["Bucket List"].push({ text, desc, photos: [], date, completedDate: "" });
    }
    closeModal(); render();
}

function render() {
    const area = document.getElementById("listArea");
    area.innerHTML = "";
    const items = [...data[currentTab]];
    items.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "item";
        let date = formatDate(item.date);
        let description = item.desc ? `<div class="description">${item.desc}</div>` : "";

        if (currentTab === "Memories") {
            div.innerHTML = `<strong>${item.title}</strong>${description}<div class="date">${date}</div>`;
            if (item.images.length) {
                const thumbs = document.createElement("div"); thumbs.className = "item-thumbnails";
                item.images.forEach(img => { const image = document.createElement("img"); image.src = img; thumbs.appendChild(image); });
                div.appendChild(thumbs);
            }
        } else if (currentTab === "Letters") {
            div.innerHTML = `<strong>${item.title}</strong>${description}<div class="date">${date}</div>`;
        } else if (currentTab === "Bucket List") {
            const completed = item.completedDate ? formatDate(item.completedDate) : "Not Completed";
            div.innerHTML = `<strong>${item.text}</strong>${description}<div class="date">Added: ${date} | Completed: ${completed}</div>`;
            if (item.photos.length) {
                const thumbs = document.createElement("div"); thumbs.className = "item-thumbnails";
                item.photos.forEach(img => { const image = document.createElement("img"); image.src = img; thumbs.appendChild(image); });
                div.appendChild(thumbs);
            }
        }
        div.onclick = () => openItemOverlay(index);
        area.appendChild(div);
    });
}

// Overlay and Edit Item functions remain the same (from previous code)