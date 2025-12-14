// Check if teacher is logged in
const role = localStorage.getItem("role");
if (!role || role !== "teacher") {
    window.location.href = "../../index.html"; // redirect if not teacher
}

// Logout button
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.clear();
        window.location.href = "../../index.html";
    });
}

// Elements
const questionForm = document.getElementById("questionForm");
const questionTypeSelect = document.getElementById("questionType");
const optionsContainer = document.getElementById("optionsContainer");
const successMessage = document.getElementById("successMessage");
const errorMessage = document.getElementById("errorMessage");
const finishBtn = document.getElementById("finishBtn");

// Get examId from localStorage
const examId = localStorage.getItem("cardExamId");
const token = localStorage.getItem("token");

if (!examId || !token) {
    alert("No exam selected. Please go back to the dashboard.");
    window.location.href = "../teacher/dashboard.html";
}

// Render options based on question type
function renderOptions(type) {
    optionsContainer.innerHTML = ""; // clear previous

    if (type === "multiple_choice") {
        ["A", "B", "C", "D"].forEach(label => {
            const div = document.createElement("div");
            div.className = "form-group";
            div.innerHTML = `
                <label>Option ${label}</label>
                <input type="text" id="option_${label}" placeholder="Enter option ${label}" required />
            `;
            optionsContainer.appendChild(div);
        });

        // Correct answer select
        const div = document.createElement("div");
        div.className = "form-group";
        div.innerHTML = `
            <label>Correct Answer</label>
            <select id="correctAnswer" required>
                <option value="">Select Correct Answer</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
            </select>
        `;
        optionsContainer.appendChild(div);

    } else if (type === "true_false") {
        ["True", "False"].forEach(label => {
            const div = document.createElement("div");
            div.className = "form-group";
            div.innerHTML = `
                <label>
                    <input type="radio" name="tfOption" value="${label}" required />
                    ${label}
                </label>
            `;
            optionsContainer.appendChild(div);
        });
    }
}

// Initial render
renderOptions(questionTypeSelect.value);

// Change listener
questionTypeSelect.addEventListener("change", (e) => {
    renderOptions(e.target.value);
});

// Handle form submission
questionForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    successMessage.textContent = "";
    errorMessage.textContent = "";

    const questionText = document.getElementById("questionText").value.trim();
    const questionType = questionTypeSelect.value;

    if (!questionText) {
        errorMessage.textContent = "Please enter the question text.";
        return;
    }

    let body = { question_text: questionText, question_type: questionType };

    if (questionType === "multiple_choice") {
        const correctAnswer = document.getElementById("correctAnswer").value;
        if (!correctAnswer) {
            errorMessage.textContent = "Please select the correct answer.";
            return;
        }
        body.correct_answer_label = correctAnswer;
        body.options = ["A", "B", "C", "D"].map(label => ({
            label,
            text: document.getElementById(`option_${label}`).value.trim()
        }));
    } else if (questionType === "true_false") {
        const selected = document.querySelector('input[name="tfOption"]:checked');
        if (!selected) {
            errorMessage.textContent = "Please select True or False.";
            return;
        }
        body.correct_answer_label = selected.value === "True" ? "A" : "B";
        body.options = [
            { label: "A", text: "True" },
            { label: "B", text: "False" }
        ];
    }

    try {
        const response = await fetch(`https://exam-backend-pi.vercel.app/api/v1/questions/question?examId=${examId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to add question");
        }

        successMessage.textContent = "Question added successfully! 🎉";
        questionForm.reset();
        renderOptions(questionTypeSelect.value);

    } catch (error) {
        console.error("Add Question Error:", error);
        errorMessage.textContent = error.message;
    }
});


finishBtn.addEventListener('click', () => {
    window.location.href = "../../pages/teacher/dashboard.html"
});