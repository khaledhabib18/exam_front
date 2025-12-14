// Elements
const createExamForm = document.getElementById("createExamForm");
const messageBox = document.getElementById("message");

// Get token from localStorage
const token = localStorage.getItem("token");
if (!token) {
    alert("You are not authorized. Please login.");
    window.location.href = "../../index.html";
}

// Handle form submission
createExamForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get values from form
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const duration = document.getElementById("duration").value.trim();
    const start_time = document.getElementById("start_time").value;
    const end_time = document.getElementById("end_time").value;

    if (!title || !description || !duration || !start_time || !end_time) {
        messageBox.textContent = "Please fill all fields";
        messageBox.style.color = "red";
        return;
    }

    try {
        const response = await fetch("https://exam-backend-pi.vercel.app/api/v1/exams/exam", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                title,
                description,
                duration,
                start_time,
                end_time
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to create exam");
        }

        // Success
        messageBox.textContent = data.message;
        messageBox.style.color = "green";

        localStorage.setItem('cardExamId', data.exam.id)
        window.location.href = "../../pages/teacher/add-questions.html"

    } catch (error) {
        messageBox.textContent = error.message;
        messageBox.style.color = "red";
        console.error("Create Exam Error:", error);
    }
});

