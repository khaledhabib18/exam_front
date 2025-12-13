// ============================
// Teacher Dashboard Logic
// ============================

// Auth check
const role = localStorage.getItem("role");
const token = localStorage.getItem("token");

if (!token || role !== "teacher") {
    window.location.href = "../../index.html";
}

// Elements
const logoutBtn = document.getElementById("logoutBtn");
const examCardsContainer = document.getElementById("examCards");
const createExamBtn = document.getElementById("createExamBtn");

// Logout
logoutBtn.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "../../index.html";
});

// Create exam
createExamBtn.addEventListener("click", () => {
    window.location.href = "../teacher/create-exam.html";
});

// Fetch exams from backend
async function fetchExams() {
    try {
        const response = await fetch("http://localhost:5000/api/v1/exams/exam", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch exams");
        }

        renderExams(data.exams);

    } catch (error) {
        console.error("Fetch Exams Error:", error);
        examCardsContainer.innerHTML =
            `<p style="color:red;">${error.message}</p>`;
    }
}

// Render exams
function renderExams(exams) {
    examCardsContainer.innerHTML = "";

    if (!exams || exams.length === 0) {
        examCardsContainer.innerHTML = "<p>No exams created yet</p>";
        return;
    }

    exams.forEach(exam => {
        const startDate = new Date(exam.start_time).toLocaleString();
        const endDate = new Date(exam.end_time).toLocaleString();

        const card = document.createElement("div");
        card.className = "exam-card";

        card.innerHTML = `
            <h3>${exam.title}</h3>
            <p>${exam.description}</p>
            <p><strong>Duration:</strong> ${exam.duration} min</p>
            <p><strong>Start:</strong> ${startDate}</p>
            <p><strong>End:</strong> ${endDate}</p>

            <div class="card-actions">
                <button class="btn btn-outline view-grades">View Grades</button>
                <button class="btn btn-danger delete-exam">Delete</button>
            </div>
        `;

        // View Grades button
        card.querySelector(".view-grades").addEventListener("click", () => {
            localStorage.setItem("cardExamId", exam.id); // store exam id
            window.location.href = "../../pages/teacher/grades.html";
        });

        // Delete button
        card.querySelector(".delete-exam").addEventListener("click", async () => {
            if (!confirm(`Are you sure you want to delete "${exam.title}"?`)) return;

            try {
                const response = await fetch(`http://localhost:5000/api/v1/exams/exam?id=${exam.id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.message || "Failed to delete exam");
                }

                alert("Exam deleted successfully!");
                fetchExams(); // Refresh the exam list
            } catch (error) {
                alert(error.message);
                console.error("Delete Exam Error:", error);
            }
        });

        examCardsContainer.appendChild(card);
    });
}

// Init
fetchExams();
