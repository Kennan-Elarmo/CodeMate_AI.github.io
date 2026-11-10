document.addEventListener("DOMContentLoaded", function () {

    // =================================
    // LESSON DATA
    // =================================

    const lessons = [
        {
            title: "Introduction to Programming",
            description: "Programming is the process of writing instructions that tell a computer what to do. Programmers use languages such as Python, Java, C++, and JavaScript to create programs.",
            example: 'print("Hello, World!")'
        },
        {
            title: "Variables and Data Types",
            description: "Variables are used to store information. Common data types include strings, integers, floats, and booleans.",
            example: 'name = "Alex"\nage = 16\nheight = 1.65\nis_student = True'
        },
        {
            title: "Conditional Statements",
            description: "Conditional statements allow programs to make decisions based on whether a condition is true or false.",
            example: 'score = 85\n\nif score >= 75:\n    print("Passed")\nelse:\n    print("Try again")'
        },
        {
            title: "Loops",
            description: "Loops allow programmers to repeat instructions. Python has for loops and while loops.",
            example: 'for number in range(1, 4):\n    print(number)'
        },
        {
            title: "Functions",
            description: "Functions are reusable blocks of code that perform specific tasks. They help organize programs.",
            example: 'def greet(name):\n    print("Hello, " + name)\n\ngreet("Alex")'
        }
    ];


    // =================================
    // STUDENT PROGRESS
    // =================================

    const STORAGE_KEY = "eduboostProgress";

    let saved = {};

    try {
        saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (error) {
        saved = {};
    }

    if (!Array.isArray(saved.completed)) {
        saved.completed = [];
    }

    if (typeof saved.xp !== "number") {
        saved.xp = saved.completed.length * 20;
    }

    if (typeof saved.streak !== "number") {
        saved.streak = 0;
    }

    let activeLesson = null;

    function getElement(id) {
        return document.getElementById(id);
    }

    function saveProgress() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    }


    // =================================
    // UPDATE DASHBOARD
    // =================================

    function updateProgress() {

        const completed = saved.completed.length;

        const percentage = Math.round(
            (completed / lessons.length) * 100
        );

        getElement("dashboardProgress").textContent =
            percentage + "%";

        getElement("completedLessons").textContent =
            completed + " / " + lessons.length;

        getElement("learningStreak").textContent =
            saved.streak + " Days";

        getElement("totalXP").textContent =
            saved.xp + " XP";

        getElement("progressPercentage").textContent =
            percentage + "%";

        getElement("progressFill").style.width =
            percentage + "%";

        getElement("progressFill").setAttribute(
            "aria-valuenow",
            percentage
        );

        getElement("progressText").textContent =
            completed + " of " + lessons.length +
            " lessons completed";


        // DISPLAY MODULE PROGRESS

        let progressHTML = "";

        lessons.forEach(function (lesson, index) {

            const isCompleted =
                saved.completed.includes(index);

            progressHTML += `
                <div class="module-row">

                    <div>
                        <strong>
                            ${index + 1}. ${lesson.title}
                        </strong>

                        <br>

                        <small>
                            ${isCompleted ?
                                "Completed" :
                                "Not completed yet"}
                        </small>
                    </div>

                    <span class="${isCompleted ?
                        "text-success" : "text-muted"}">

                        ${isCompleted ?
                            '<i class="bi bi-check-circle-fill"></i>' :
                            '<i class="bi bi-circle"></i>'}

                    </span>

                </div>
            `;
        });

        getElement("progressLessons").innerHTML =
            progressHTML;
    }


    // =================================
    // OPEN LESSON
    // =================================

    function openLesson(index) {

        activeLesson = Number(index);

        const lesson = lessons[activeLesson];

        if (!lesson) return;

        getElement("lessonTitle").textContent =
            lesson.title;

        getElement("lessonDescription").textContent =
            lesson.description;

        getElement("lessonExample").textContent =
            lesson.example;

        const completed =
            saved.completed.includes(activeLesson);

        getElement("lessonStatus").textContent =
            completed ? "Already completed!" : "";

        getElement("completeLessonBtn").disabled =
            completed;

        getElement("completeLessonBtn").textContent =
            completed ?
                "Lesson Completed ✓" :
                "Complete Lesson ✓";

        getElement("lessonViewer").classList.remove("d-none");

        getElement("lessonViewer").scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });
    }


    // CONNECT LESSON BUTTONS

    document.querySelectorAll(".open-lesson").forEach(function (button) {

        button.addEventListener("click", function () {

            openLesson(button.dataset.lesson);

        });

    });


    // CLOSE LESSON

    getElement("closeLesson").addEventListener("click", function () {

        getElement("lessonViewer").classList.add("d-none");

    });


    // =================================
    // COMPLETE LESSON
    // =================================

    getElement("completeLessonBtn").addEventListener("click", function () {

        if (activeLesson === null) return;

        if (saved.completed.includes(activeLesson)) return;

        saved.completed.push(activeLesson);

        saved.xp += 20;

        saved.streak = Math.max(saved.streak, 1);

        saveProgress();

        updateProgress();

        getElement("lessonStatus").textContent =
            "Congratulations! You earned 20 XP!";

        getElement("completeLessonBtn").disabled = true;

        getElement("completeLessonBtn").textContent =
            "Lesson Completed ✓";

    });


    // =================================
    // LANGUAGE AND LEVEL SELECTION
    // =================================

    function updateCourse() {

        const language =
            getElement("language").value;

        const level =
            getElement("level").value;

        document.querySelectorAll(
            "#lessonCards .badge"
        ).forEach(function (badge, index) {

            badge.textContent =
                "Lesson 0" + (index + 1) +
                " · " + level;

        });

        console.log(
            "Selected language:",
            language,
            "Level:",
            level
        );
    }

    getElement("language").addEventListener(
        "change",
        updateCourse
    );

    getElement("level").addEventListener(
        "change",
        updateCourse
    );


    // =================================
    // CODEMATE AI TUTOR
    // =================================

    const tutorAnswers = [

        {
            keywords: ["programming", "program"],
            answer: "Programming is the process of writing instructions that tell a computer what to do. Programmers use languages such as Python, Java, C++, and JavaScript."
        },

        {
            keywords: ["variable", "variables"],
            answer: "A variable is a named storage location used to store information. For example: name = 'Alex'. The variable name stores the value Alex."
        },

        {
            keywords: ["data type", "string", "integer", "float", "boolean"],
            answer: "Data types describe the kind of information stored in a variable. String means text, integer means whole number, float means decimal number, and boolean means True or False."
        },

        {
            keywords: ["conditional", "if statement", "decision"],
            answer: "Conditional statements allow programs to make decisions. In Python, an if statement checks whether a condition is true or false."
        },

        {
            keywords: ["loop", "loops", "for loop", "while loop"],
            answer: "Loops repeat instructions. A for loop repeats instructions a specific number of times, while a while loop repeats as long as a condition is true."
        },

        {
            keywords: ["function", "functions"],
            answer: "A function is a reusable block of code that performs a specific task. In Python, functions are created using the def keyword."
        },

        {
            keywords: ["python"],
            answer: "Python is a beginner-friendly programming language used for web development, automation, data analysis, and artificial intelligence."
        },

        {
            keywords: ["html"],
            answer: "HTML stands for HyperText Markup Language. It is used to create the structure of web pages."
        },

        {
            keywords: ["css"],
            answer: "CSS stands for Cascading Style Sheets. It controls the appearance of a website, including colors, fonts, spacing, and layouts."
        },

        {
            keywords: ["javascript"],
            answer: "JavaScript is a programming language used to make websites interactive. It can respond to clicks, validate forms, and update web content."
        }

    ];


    // FIND AI ANSWER

    function getAIResponse(question) {

        const text = question.toLowerCase();

        const match = tutorAnswers.find(function (item) {

            return item.keywords.some(function (keyword) {

                return text.includes(keyword);

            });

        });

        if (match) {
            return match.answer;
        }

        return "Good question! I can currently explain programming, Python, HTML, CSS, variables, data types, conditional statements, loops, and functions. Please ask about one of these topics.";

    }


    // DISPLAY CHAT MESSAGE

    function addMessage(message, sender) {

        const chatMessages =
            getElement("chatMessages");

        const messageElement =
            document.createElement("div");

        messageElement.classList.add(
            "message",
            sender + "-message"
        );

        messageElement.textContent = message;

        chatMessages.appendChild(messageElement);

        chatMessages.scrollTop =
            chatMessages.scrollHeight;

    }


    // SEND CHAT MESSAGE

    function sendQuestion(question) {

        const cleanQuestion = question.trim();

        if (!cleanQuestion) return;

        addMessage(cleanQuestion, "user");

        getElement("userQuestion").value = "";

        setTimeout(function () {

            const response =
                getAIResponse(cleanQuestion);

            addMessage(response, "bot");

        }, 400);

    }


    // CHAT FORM

    getElement("chatForm").addEventListener("submit", function (event) {

        event.preventDefault();

        sendQuestion(
            getElement("userQuestion").value
        );

    });


    // SUGGESTED QUESTIONS

    document.querySelectorAll(".suggestion-btn").forEach(function (button) {

        button.addEventListener("click", function () {

            sendQuestion(button.dataset.question);

        });

    });


    // =================================
    // CODING PRACTICE
    // =================================

    getElement("checkCodeBtn").addEventListener("click", function () {

        const code =
            getElement("codeEditor").value.trim();

        const result =
            getElement("codeResult");

        result.className = "feedback-box mt-3";

        result.classList.remove(
            "d-none",
            "success",
            "error"
        );

        // Accept either single or double quotation marks.
        const normalized = code.replace(/\s+/g, "");

        const correct =
            /^print\((["'])Hello,World!\1\)$/i.test(normalized);

        if (correct) {

            result.classList.add("success");

            result.textContent =
                "Excellent! Your code is correct. You earned 10 XP!";

            if (!saved.practiceCompleted) {

                saved.practiceCompleted = true;

                saved.xp += 10;

                saveProgress();

                updateProgress();

            }

        } else {

            result.classList.add("error");

            result.textContent =
                'Not quite yet! Try print("Hello, World!") and check your spelling and quotation marks.';

        }

    });


    // =================================
    // SHOW HINT
    // =================================

    getElement("hintBtn").addEventListener("click", function () {

        const hint = getElement("hint");

        hint.textContent =
            'Hint: Use the Python print() function. Example: print("Hello, World!")';

        hint.classList.remove("d-none");

    });


    // =================================
    // RESET CODE
    // =================================

    getElement("resetCodeBtn").addEventListener("click", function () {

        getElement("codeEditor").value = "";

        getElement("hint").classList.add("d-none");

        getElement("codeResult").classList.add("d-none");

    });


    // =================================
    // CONTACT FORM
    // =================================

    getElement("contactForm").addEventListener("submit", function (event) {

        event.preventDefault();

        getElement("contactStatus").textContent =
            "Thank you! Your message has been recorded in this demo. No email was sent.";

        getElement("contactForm").reset();

    });


    // =================================
    // NAVIGATION ACTIVE LINK
    // =================================

    const navLinks =
        document.querySelectorAll(
            '.navbar .nav-link[href^="#"]'
        );

    const sections = Array.from(navLinks)
        .map(function (link) {
            return document.querySelector(link.getAttribute("href"));
        })
        .filter(Boolean);

    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver(

            function (entries) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        navLinks.forEach(function (link) {

                            link.classList.toggle(
                                "active",
                                link.getAttribute("href") ===
                                "#" + entry.target.id
                            );

                        });

                    }

                });

            },

            {
                rootMargin: "-30% 0px -60% 0px"
            }

        );

        sections.forEach(function (section) {

            observer.observe(section);

        });

    }


    // =================================
    // INITIALIZE DASHBOARD
    // =================================

    updateProgress();

});
