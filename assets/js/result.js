// ============================
// Result Page (Backend Version)
// ============================

let questions = [];
let currentIndex = 0;

// Elements
const studentNameSpan = document.getElementById("studentName");
const logoutBtn = document.getElementById("logoutBtn");
const backDashboard = document.getElementById("backDashboard");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const questionCard = document.getElementById("questionCard");
const scoreDisplay = document.getElementById("scoreDisplay");

// ============================
// Basic UI actions
// ============================

studentNameSpan.textContent = "Welcome, Student";

logoutBtn.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "../../index.html";
});

backDashboard.addEventListener("click", () => {
    window.location.href = "dashboard.html";
});

// ============================
// Fetch results from backend
// ============================

async function fetchResults() {
    const token = localStorage.getItem("token");
    const attemptId = localStorage.getItem("currentAttemptId");

    if (!token || !attemptId) {
        alert("Result data not found");
        return;
    }

    try {
        const response = await fetch(
            `https://exam-backend-pi.vercel.app/api/v1/answers/results?attemptId=${attemptId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error("Failed to fetch results");
        }

        questions = data;
        updateScore();
        renderQuestion(currentIndex);

    } catch (error) {
        console.error("Result Fetch Error:", error);
        alert(error.message);
    }
}

// ============================
// Render question
// ============================

function renderQuestion(index) {
    const q = questions[index];

    let optionsHTML = q.options.map(opt => {
        let className = "option";

        if (opt.label === q.correct_answer) {
            className += " correct";
        }

        if (
            opt.label === q.selected_answer &&
            q.selected_answer !== q.correct_answer
        ) {
            className += " incorrect";
        }

        return `
            <div class="${className}">
                ${opt.label}. ${opt.text}
            </div>
        `;
    }).join("");

    questionCard.innerHTML = `
        <h3>Question ${index + 1}</h3>
        <p>${q.question_text}</p>
        <div class="options">
            ${optionsHTML}
        </div>
    `;
}

// ============================
// Score calculation
// ============================

function updateScore() {
    const correctCount = questions.filter(q => q.result === "correct").length;
    scoreDisplay.textContent = `Score: ${correctCount} / ${questions.length}`;
}

// ============================
// Navigation
// ============================

prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
        currentIndex--;
        renderQuestion(currentIndex);
    }
});

nextBtn.addEventListener("click", () => {
    if (currentIndex < questions.length - 1) {
        currentIndex++;
        renderQuestion(currentIndex);
    }
});

// ============================
// Init
// ============================

fetchResults();
