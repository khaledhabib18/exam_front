// ===== Student Dashboard Logic =====

// DOM Elements
const examCardsContainer = document.getElementById("examCards");
const studentNameSpan = document.getElementById("studentName");
const logoutBtn = document.getElementById("logoutBtn");

// ====== Auth Check ======
const role = localStorage.getItem("role");
if (!role || role !== "student") {
    window.location.href = "../../index.html"; // Redirect if not student
}

// Display student name (optional)
if (studentNameSpan) {
    const studentName = localStorage.getItem("name") || "Student";
    studentNameSpan.textContent = `Welcome, ${studentName}`;
}

// Logout button
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.clear();
        window.location.href = "../../index.html";
    });
}

// ====== Fetch Exams from Backend ======
async function fetchExams() {
    const token = localStorage.getItem("token");
    console.log(token);
    if (!token || !examCardsContainer) return;

    try {
        const response = await fetch("https://exam-backend-pi.vercel.app/api/v1/exams/exam", {
            method: "GET", // Using GET request
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch exams");
        }

        const exams = data.exams;
        renderExams(exams);

    } catch (error) {
        console.error("Fetch Exams Error:", error);
        examCardsContainer.innerHTML = `<p style="color:red;">${error.message}</p>`;
    }
}

// ====== Render Exams ======
function renderExams(exams) {
    if (!examCardsContainer) return;

    if (!exams || exams.length === 0) {
        examCardsContainer.innerHTML = "<p>No exams available</p>";
        return;
    }

    examCardsContainer.innerHTML = "";

    exams.forEach(exam => {
        const card = document.createElement("div");
        card.className = "exam-card";

        // Convert start_time to readable format
        const startDate = new Date(exam.start_time);
        const formattedStart = startDate.toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short"
        });

        card.innerHTML = `
            <h3>${exam.title}</h3>
            <p>${exam.description}</p>
            <p>Duration: ${exam.duration} min</p>
            <p>Starts at: ${formattedStart}</p>
            <button onclick="startExam('${exam.id}')">Start Exam</button>
        `;

        examCardsContainer.appendChild(card);
    });
}

// Start Exam
async function startExam(examId) {
    const token = localStorage.getItem("token");
    if (!token) return alert("You are not authorized");

    try {
        const response = await fetch(`https://exam-backend-pi.vercel.app/api/v1/attempts/attempt?examId=${examId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({})
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Exam is not active or you already attempted it");
        }

        // Save attempt id and examId
        localStorage.setItem("currentExamId", examId);
        localStorage.setItem("currentAttemptId", data.id);

        // Redirect to exam page
        window.location.href = "exam-start.html";

    } catch (error) {
        alert(error.message);
    }
}

// ====== Initialize ======
document.addEventListener("DOMContentLoaded", () => {
    fetchExams();
});
