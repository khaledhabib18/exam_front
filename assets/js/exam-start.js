// ============================
// Exam Start JS - Fetch Real Questions
// ============================

// DOM Elements
const examTitle = document.getElementById("examTitle");
const questionText = document.getElementById("questionText");
const questionNumber = document.getElementById("questionNumber");
const optionsContainer = document.querySelector(".options-container");
const prevBtn = document.getElementById("prevQuestionBtn");
const nextBtn = document.getElementById("nextQuestionBtn");
const submitBtn = document.getElementById("submitExamBtn");
const examTimer = document.getElementById("examTimer");
const logoutBtn = document.getElementById("logoutBtn");

// ============================
// Variables
// ============================
let currentQuestionIndex = 0;
let answers = {}; // store selected answers
let examData = {};
let timerInterval;

// ============================
// Initialization
// ============================
const token = localStorage.getItem("token");
const examId = localStorage.getItem("currentExamId"); // get examId from dashboard

if (!token || !examId) {
    alert("Exam not found or not authorized");
    window.location.href = "../../index.html";
}

// Logout button
logoutBtn.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "../../index.html";
});

// Fetch exam questions from backend
async function fetchExamQuestions() {
    try {
        const response = await fetch(`http://localhost:5000/api/v1/questions/question?examId=${examId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch questions");
        }

        // Prepare examData
        examData = {
            examId,
            title: "Exam", // You can also fetch exam title from backend if available
            duration: 30, // default duration, replace with real value from backend if exists
            questions: data.map(q => ({
                question_text: q.question_text,
                question_type: q.question_type,
                id: q.id,
                options: q.options.map(option => ({
                    label: option.option_label,
                    text: option.option_text
                }))

            }))
        };

        examTitle.textContent = examData.title;
        startTimer(examData.duration);
        renderQuestion(currentQuestionIndex);

    } catch (error) {
        console.error("Fetch Exam Error:", error);
        alert("Failed to load exam questions. Please try again.");
    }
}

// ============================
// Render Question
// ============================
function renderQuestion(index) {
    const question = examData.questions[index];
    questionText.textContent = question.question_text;
    questionNumber.textContent = `Question ${index + 1} of ${examData.questions.length}`;

    // Clear previous options
    optionsContainer.innerHTML = "";

    // Render options
    question.options.forEach(opt => {
        const btn = document.createElement("button");
        btn.className = "option-btn";
        btn.dataset.label = opt.label;
        btn.textContent = `${opt.label}. ${opt.text}`;

        // Highlight previously selected answer
        if (answers[index] === opt.label) {
            btn.style.backgroundColor = "#4f46e5";
            btn.style.color = "#fff";
        }

        btn.addEventListener("click", () => selectOption(index, opt.label, btn));
        optionsContainer.appendChild(btn);
    });
}

// ============================
// Select Option
// ============================
function selectOption(questionIndex, label, button) {
    answers[questionIndex] = label;

    // Reset all buttons
    const allButtons = document.querySelectorAll(".option-btn");
    allButtons.forEach(b => {
        b.style.backgroundColor = "#fff";
        b.style.color = "#000";
        b.style.borderColor = "#4f46e5";
    });

    // Highlight selected button
    button.style.backgroundColor = "#4f46e5";
    button.style.color = "#fff";
}

// ============================
// Previous & Next Question
// ============================
prevBtn.addEventListener("click", () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion(currentQuestionIndex);
    } else {
        alert("This is the first question.");
    }
});

nextBtn.addEventListener("click", () => {
    if (currentQuestionIndex < examData.questions.length - 1) {
        currentQuestionIndex++;
        renderQuestion(currentQuestionIndex);
    } else {
        alert("This is the last question. You can submit the exam.");
    }
});

// ============================
// Submit Exam
// ============================
submitBtn.addEventListener("click", async () => {
    const token = localStorage.getItem("token");
    const attemptId = localStorage.getItem("currentAttemptId");
    const examId = localStorage.getItem("currentExamId");

    if (!token || !attemptId || !examId) {
        return alert("Exam data not found. Please try again.");
    }

    try {
        // 1️⃣ PUT request لتحديث Attempt
        const attemptResponse = await fetch(`http://localhost:5000/api/v1/attempts/attempt?examId=${examId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({})
        });

        const attemptData = await attemptResponse.json();
        if (!attemptResponse.ok) {
            throw new Error(attemptData.message || "Failed to update attempt");
        }

        // 2️⃣ POST request لإرسال الإجابات
        const answersPayload = {
            answers: examData.questions.map((q, index) => ({
                attemptId: attemptId,
                questionId: q.id,
                selection: answers[index] || null // null if no answer selected
            }))
        };

        const answersResponse = await fetch(`http://localhost:5000/api/v1/answers/answer?examId=${examId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(answersPayload)
        });

        const answersData = await answersResponse.json();
        if (!answersResponse.ok) {
            throw new Error(answersData.message || "Failed to submit answers");
        }

        alert("Exam submitted successfully!");
        window.location.href = "../student/result.html";

    } catch (error) {
        console.error("Submit Exam Error:", error);
        alert(error.message);
    }
});

// ============================
// Countdown Timer
// ============================
function startTimer(durationMinutes) {
    let time = durationMinutes * 60; // seconds

    timerInterval = setInterval(() => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;

        examTimer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        if (time <= 0) {
            clearInterval(timerInterval);
            alert("Time is up! Submitting exam...");
            submitBtn.click();
        }

        time--;
    }, 1000);
}

// ============================
// Initialize
// ============================
fetchExamQuestions();
