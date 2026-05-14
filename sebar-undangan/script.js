const domainInput = document.getElementById("domainInput");
const templateInput = document.getElementById("templateInput");
const tableBody = document.getElementById("tableBody");
const totalGuest = document.getElementById("totalGuest");

// Modals
const detailModal = document.getElementById("detailModal");
const addModal = document.getElementById("addModal");
const editModal = document.getElementById("editModal");
const deleteModal = document.getElementById("deleteModal");
const resetModal = document.getElementById("resetModal");

// Modal Inputs/Texts
const addNameInput = document.getElementById("addNameInput");
const editNameInput = document.getElementById("editNameInput");
const editIndexInput = document.getElementById("editIndex");
const deleteIndexInput = document.getElementById("deleteIndex");
const deleteNameText = document.getElementById("deleteNameText");

const detailNo = document.getElementById("detailNo");
const detailName = document.getElementById("detailName");
const detailLink = document.getElementById("detailLink");
const detailWaButton = document.getElementById("detailWaButton");

const STORAGE_KEY = "seraya_generator_data";

let guestNames = [];

// Support Enter key for modals
addNameInput.addEventListener("keypress", function (e) { if (e.key === "Enter") submitAdd(); });
editNameInput.addEventListener("keypress", function (e) { if (e.key === "Enter") submitEdit(); });

// Save data when inputs change
domainInput.addEventListener("input", saveData);
templateInput.addEventListener("input", saveData);

function saveData() {
    const data = {
        domain: domainInput.value,
        template: templateInput.value,
        names: guestNames
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadData() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            const data = JSON.parse(saved);
            if (data.domain) domainInput.value = data.domain;
            if (data.template) templateInput.value = data.template;
            if (data.names) guestNames = data.names;
        } catch (e) { console.error("Gagal memuat data tersimpan", e); }
    }
    renderTable();
    if (window.lucide) window.lucide.createIcons();
}

// --- ADD FUNCTIONS ---
function openAddModal() {
    addModal.classList.add("open");
    addNameInput.focus();
}
function closeAddModal() {
    addModal.classList.remove("open");
    addNameInput.value = "";
}
function submitAdd() {
    const name = addNameInput.value.trim();
    if (name === "") return;
    guestNames.push(name);
    closeAddModal();
    renderTable();
    saveData();
    showToast("Tamu berhasil ditambahkan", "success");
}

// --- EDIT FUNCTIONS ---
function openEditModal(index) {
    const name = guestNames[index];
    editIndexInput.value = index;
    editNameInput.value = name;
    editModal.classList.add("open");
    editNameInput.focus();
}
function closeEditModal() { editModal.classList.remove("open"); }
function submitEdit() {
    const index = editIndexInput.value;
    const newName = editNameInput.value.trim();
    if (newName === "") return;
    guestNames[index] = newName;
    closeEditModal();
    renderTable();
    saveData();
    showToast("Nama tamu berhasil diperbarui", "success");
}

// --- DELETE FUNCTIONS ---
function openDeleteModal(index) {
    deleteIndexInput.value = index;
    deleteNameText.textContent = guestNames[index];
    deleteModal.classList.add("open");
}
function closeDeleteModal() { deleteModal.classList.remove("open"); }
function submitDelete() {
    const index = deleteIndexInput.value;
    guestNames.splice(index, 1);
    closeDeleteModal();
    renderTable();
    saveData();
    showToast("Tamu telah dihapus", "success");
}

// --- RESET FUNCTIONS ---
function clearNames() {
    resetModal.classList.add("open");
}
function closeResetModal() { resetModal.classList.remove("open"); }
function submitReset() {
    guestNames = [];
    localStorage.removeItem(STORAGE_KEY);
    domainInput.value = "https://undangan.seraya.my.id/d/gina-joko";
    closeResetModal();
    renderTable();
    showToast("Semua data telah direset", "success");
}

function setGuestNames(names) {
    guestNames = names.map(n => String(n).trim()).filter(n => n !== "");
    renderTable();
    saveData();
}

function encodeGuestName(name) { return name.trim().replace(/\s+/g, "+"); }

function openDetail(index) {
    const name = guestNames[index];
    if (!name) return;
    const link = makeLink(name);
    const chat = makeChat(name);
    detailNo.textContent = index + 1;
    detailName.textContent = name;
    detailLink.textContent = link;
    document.getElementById("detailChat").textContent = chat;
    detailWaButton.onclick = function () { window.open(makeWhatsAppUrl(name), "_blank"); };
    detailModal.classList.add("open");
}
function closeDetail() { detailModal.classList.remove("open"); }

function makeLink(name) {
    let domain = domainInput.value.trim();
    if (domain === "") domain = "https://undangan.seraya.my.id/d/nama-tujuan";
    domain = domain.replace(/\?kpd=.*$/i, "");
    return domain + "?kpd=" + encodeGuestName(name);
}

function makeChat(name) {
    const link = makeLink(name);
    let template = templateInput.value;
    if (!template.includes("[NAMA]")) template = "Yth. Bapak/Ibu/Saudara/i\n[NAMA]\n\n" + template;
    if (!template.includes("[LINK]")) template = template + "\n\nLink undangan:\n[LINK]";
    return template.replaceAll("[NAMA]", name).replaceAll("[LINK]", link);
}

function makeWhatsAppUrl(name) {
    const chat = makeChat(name);
    return "https://wa.me/?text=" + encodeURIComponent(chat);
}

function escapeHTML(text) { return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;"); }

function showToast(message, type = "default") {
    const container = document.getElementById("toastContainer");
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    let icon = '<i data-lucide="info"></i>';
    if (type === "success") icon = '<i data-lucide="check-circle"></i>';
    if (type === "error") icon = '<i data-lucide="alert-circle"></i>';

    toast.innerHTML = `${icon} <span>${message}</span>`;
    container.appendChild(toast);

    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
        toast.classList.add("hide");
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

function copyChat(chat) {
    navigator.clipboard.writeText(chat).then(() => {
        showToast("Pesan berhasil disalin!", "success");
    });
}

let sortOrder = 'desc';

function toggleSort() {
    sortOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    
    // Update Desktop Icon
    const icon = document.getElementById("sortIcon");
    if (icon) {
        if (sortOrder === 'desc') {
            icon.innerHTML = `
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>`;
        } else {
            icon.innerHTML = `
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="18 15 12 9 6 15"></polyline>
                </svg>`;
        }
    }

    // Update Mobile Icon
    const mIcon = document.getElementById("mobileSortIcon");
    if (mIcon) {
        if (sortOrder === 'desc') {
            mIcon.innerHTML = `
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m3 16 4 4 4-4"></path><path d="M7 20V4"></path><path d="M11 4h10"></path><path d="M11 8h7"></path><path d="M11 12h4"></path>
                </svg>`;
        } else {
            mIcon.innerHTML = `
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m3 8 4-4 4 4"></path><path d="M7 4v16"></path><path d="M11 12h4"></path><path d="M11 16h7"></path><path d="M11 20h10"></path>
                </svg>`;
        }
    }
    
    renderTable();
}

function renderTable() {
    totalGuest.textContent = guestNames.length;
    if (guestNames.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" class="empty-state">Belum ada nama tamu. Masukkan nama atau import file Excel.</td></tr>`;
        return;
    }

    let html = "";
    if (sortOrder === 'desc') {
        // Newest first
        for (let i = guestNames.length - 1; i >= 0; i--) {
            html += generateRowHTML(i);
        }
    } else {
        // Oldest first
        for (let i = 0; i < guestNames.length; i++) {
            html += generateRowHTML(i);
        }
    }

    tableBody.innerHTML = html;
    if (window.lucide) window.lucide.createIcons();
}

function generateRowHTML(i) {
    const name = guestNames[i];
    const chat = makeChat(name);
    const waUrl = makeWhatsAppUrl(name);
    return `
        <tr>
            <td class="no-col">${i + 1}</td>
            <td class="name-col">${escapeHTML(name)}</td>
            <td class="link-col">${escapeHTML(makeLink(name))}</td>
            <td class="chat-col">
                <div class="chat-preview-box">${escapeHTML(chat)}</div>
            </td>
            <td class="action-col">
                <div class="actions-flex">
                    <button class="btn-icon" onclick="openDetail(${i})" title="Detail"><i data-lucide="eye"></i></button>
                    <button class="btn-icon" onclick="openEditModal(${i})" title="Edit"><i data-lucide="edit-3"></i></button>
                    <button class="btn-icon" onclick="copyChat(\`${chat.replace(/`/g, '\\`')}\`)" title="Salin Pesan"><i data-lucide="copy"></i></button>
                    <a href="${waUrl}" target="_blank" class="btn-icon wa" title="Kirim WA">
                        <svg viewBox="0 0 24 24" fill="currentColor" style="width:20px; height:20px;">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.148-.67-1.615-.918-2.214-.242-.581-.487-.502-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.434h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                    </a>
                    <button class="btn-icon" onclick="openDeleteModal(${i})" title="Hapus"><i data-lucide="trash-2"></i></button>
                </div>
            </td>
        </tr>
    `;
}

function triggerImportExcel() { document.getElementById("excelFileInput").click(); }
function importExcel(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            if (rows.length === 0) return showToast("File Excel kosong", "error");
            
            // Find the row index that contains the header (contains "nama" or "name")
            const headerRowIndex = rows.findIndex(row => 
                row.some(cell => {
                    const val = String(cell || "").toLowerCase().trim();
                    return val.includes("nama") || val.includes("name");
                })
            );

            let names = [];
            if (headerRowIndex !== -1) {
                const headers = rows[headerRowIndex].map(h => String(h || "").toLowerCase().trim());
                const idx = headers.findIndex(h => h.includes("nama") || h.includes("name"));
                // Take all rows AFTER the detected header row
                names = rows.slice(headerRowIndex + 1).map(r => r[idx]);
            } else {
                // Fallback: Skip first row as requested if no header keywords found
                names = rows.slice(1).map(r => r[0]);
            }

            setGuestNames(names);
            showToast(`${names.length} nama berhasil diimport`, "success");
            event.target.value = "";
        } catch (err) { showToast("Gagal membaca Excel", "error"); }
    };
    reader.readAsArrayBuffer(file);
}

function exportExcel() {
    if (guestNames.length === 0) return showToast("Daftar tamu masih kosong", "error");
    const data = guestNames.map(name => ({ "Nama": name, "Link": makeLink(name), "Pesan": makeChat(name), "WhatsApp Link": makeWhatsAppUrl(name) }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Daftar Tamu");
    XLSX.writeFile(wb, "Daftar_Tamu_Seraya.xlsx");
}

loadData();
