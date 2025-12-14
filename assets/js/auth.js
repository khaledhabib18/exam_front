// ====== Login Logic ======
const loginForm = document.getElementById("loginForm");
const loginErrorBox = document.getElementById("errorMessage");

if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (loginErrorBox) loginErrorBox.textContent = "";

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!email || !password) {
            if (loginErrorBox) loginErrorBox.textContent = "Please enter email and password";
            return;
        }

        try {
            const response = await fetch("https://exam-backend-pi.vercel.app/api/v1/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            // Save token & role
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.user.role);

            // Redirect based on role
            if (data.user.role === "teacher") {
                window.location.href = "../teacher/dashboard.html";
            } else {
                window.location.href = "../student/dashboard.html";
            }

        } catch (error) {
            if (loginErrorBox) {
                loginErrorBox.textContent = error.message;
            } else {
                console.error("Login Error:", error);
            }
        }
    });
}

// ====== Signup Logic ======
const signupForm = document.getElementById("signupForm");
const signupErrorBox = document.getElementById("signupErrorMessage"); // Optional

if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (signupErrorBox) signupErrorBox.textContent = "";

        const name = document.getElementById("fullName").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        if (!name || !email || !password) {
            if (signupErrorBox) {
                signupErrorBox.textContent = "Please fill all fields";
            } else {
                alert("Please fill all fields");
            }
            return;
        }

        try {
            const response = await fetch("https://exam-backend-pi.vercel.app/api/v1/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Signup failed");
            }

            // Success
            alert("Account created successfully 🎉");

            // Redirect to login page
            window.location.href = "login.html";

        } catch (error) {
            if (signupErrorBox) {
                signupErrorBox.textContent = error.message;
            } else {
                alert(error.message);
            }
            console.error("Signup Error:", error);
        }
    });
}
