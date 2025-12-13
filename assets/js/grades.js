// ============================
// Teacher Exam Grades Logic
// ============================

// Back button
const backBtn = document.getElementById("backBtn");
backBtn.addEventListener("click", () => {
    window.location.href = "dashboard.html"; // Redirect to teacher dashboard
});

// Elements
const gradesTable = document.getElementById("gradesTable");
const token = localStorage.getItem("token");
const examId = localStorage.getItem("cardExamId"); // get exam id from localStorage

// Render grades
function renderGrades(grades) {
    gradesTable.innerHTML = "";
    grades.forEach(student => {
        const grade = student.attempts[0].score !== null ? student.attempts[0].score : "-";
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${student.name}</td>
            <td>${grade}</td>
        `;
        gradesTable.appendChild(row);
    });
}

// Fetch grades from backend
async function fetchGrades() {
    try {
        const response = await fetch(`http://localhost:5000/api/v1/answers/student-results?examId=${examId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch grades");
        }

        renderGrades(data);
    } catch (error) {
        console.error("Fetch Grades Error:", error);
        gradesTable.innerHTML = `<tr><td colspan="2" style="color:red;">${error.message}</td></tr>`;
    }
}

// Initialize
fetchGrades();
