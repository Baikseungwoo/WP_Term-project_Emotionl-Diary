const allowedAdmins = ['1', '2', '3'];

document.addEventListener("DOMContentLoaded", () => {
  const userId = localStorage.getItem("userId");

  if (!userId || userId === "null" || !allowedAdmins.includes(userId)) {
    alert("You are not authorized to view this page.");
    location.href = "main.html";
    return;
  }

  loadDiaries();
  loadUsers();
});

async function loadDiaries() {
    try {
        const res = await fetch('/api/admin/diary');
        const data = await res.json();
        const tbody = document.querySelector('#diary-table tbody');
        data.forEach(entry => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${entry.diaryId}</td>
            <td>${entry.userId}</td>
            <td>${entry.emotion}</td>
            <td>${entry.keyword1}, ${entry.keyword2}, ${entry.keyword3}</td>
            <td>${entry.date}</td>
          `;
            tbody.appendChild(row);
        });
    } catch (err) {
        alert("Failed to load diary entries.");
        console.error(err);
    }
}

async function loadUsers() {
    try {
        const res = await fetch('/api/admin/users');
        const users = await res.json();

        if (users.length === 0) {
            document.querySelector('#user-table tbody').innerHTML = '<tr><td colspan="99">No users found.</td></tr>';
            return;
        }

        const headerRow = document.querySelector("#user-header-row");
        const firstUser = users[0];
        Object.keys(firstUser).forEach(col => {
            const th = document.createElement("th");
            th.textContent = col;
            headerRow.appendChild(th);
        });

        const tbody = document.querySelector('#user-table tbody');
        users.forEach(user => {
            const row = document.createElement('tr');
            Object.values(user).forEach(value => {
                const td = document.createElement("td");
                td.textContent = value;
                row.appendChild(td);
            });
            tbody.appendChild(row);
        });
    } catch (err) {
        alert("Failed to load user list.");
        console.error(err);
    }
}