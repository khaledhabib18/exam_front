online-exam-system/
│
├── index.html # Landing page (login / signup)
│
├── assets/
│ ├── css/
│ │ ├── main.css # Global styles
│ │ ├── auth.css # Login / Signup styles
│ │ ├── student.css # Student pages styles
│ │ └── teacher.css # Teacher pages styles
│ │
│ ├── js/
│ │ ├── auth.js # Login / Signup logic
│ │ ├── api.js # Fake API / backend simulation
│ │ ├── utils.js # Helpers (validation, localStorage)
│ │
│ └── images/
│
├── pages/
│ ├── auth/
│ │ ├── login.html
│ │ └── signup.html
│ │
│ ├── teacher/
│ │ ├── dashboard.html # Teacher home
│ │ ├── exams.html # List all exams
│ │ ├── create-exam.html # Create exam
│ │ ├── edit-exam.html # Update exam
│ │ └── grades.html # Student grades per exam
│ │
│ ├── student/
│ │ ├── dashboard.html # Student home
│ │ ├── exams.html # All available exams
│ │ ├── exam-start.html # Exam info + start button
│ │ ├── exam.html # Answer questions one by one
│ │ └── result.html # Exam result
│
├── data/
│ ├── users.js # Fake users database
│ ├── exams.js # Exams & questions
│ └── results.js # Students answers & grades
│
└── README.md
