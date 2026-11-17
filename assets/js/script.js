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
    // AI TUTOR ANSWERS
    // =================================

    const tutorAnswers = [
        {
            keywords: ["variable", "data type", "datatype"],
            answer: "A variable is a named container that stores information, like name = \"Alex\" or age = 16. Common data types are strings (text), integers (whole numbers), floats (decimals), and booleans (True/False)."
        },
        {
            keywords: ["loop", "for loop", "while"],
            answer: "A loop repeats instructions. For example, for number in range(1, 4): print(number) prints 1, 2, and 3 without writing print three times. Python has for loops and while loops."
        },
        {
            keywords: ["function", "def "],
            answer: "A function is a reusable block of code that does a specific task. You define it once with def, then call it whenever you need it. Example: def greet(name): print(\"Hello, \" + name)"
        },
        {
            keywords: ["conditional", "condition", "if statement", "if else", "else"],
            answer: "Conditional statements let a program make decisions. With if / else, the program runs one block of code when a condition is true and another block when it is false."
        },
        {
            keywords: ["python"],
            answer: "Python is a beginner-friendly programming language with simple, readable code. It is used for web development, data science, automation, and AI. Example: print(\"Hello, World!\")"
        },
        {
            keywords: ["html"],
            answer: "HTML (HyperText Markup Language) is used to build the structure of a web page, such as headings, paragraphs, images, links, and buttons."
        },
        {
            keywords: ["css"],
            answer: "CSS (Cascading Style Sheets) controls how a web page looks: colors, fonts, spacing, and layout."
        },
        {
            keywords: ["programming", "coding", "code"],
            answer: "Programming is the process of writing instructions that tell a computer what to do. Programmers use languages such as Python, Java, C++, and JavaScript to create programs."
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
    // FLOATING CHAT: OPEN / CLOSE
    // =================================

    const chatToggle = getElement("chatToggle");
    const chatWidget = getElement("chatWidget");
    const chatClose  = getElement("chatClose");

    function setChat(open) {

        chatWidget.classList.toggle("d-none", !open);

        chatToggle.innerHTML = open
            ? '<i class="bi bi-x-lg"></i>'
            : '<i class="bi bi-robot"></i>';

        if (open) {
            getElement("userQuestion").focus();
        }

    }

    chatToggle.addEventListener("click", function () {
        setChat(chatWidget.classList.contains("d-none"));
    });

    chatClose.addEventListener("click", function () {
        setChat(false);
    });

    document.querySelectorAll("[data-open-chat]").forEach(function (el) {

        el.addEventListener("click", function (event) {

            event.preventDefault();

            setChat(true);

        });

    });


    // =================================
    // FLOATING CHAT: AI TUTOR
    // =================================

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

    // Skip the AI Tutor link (href="#"): "#" is not a valid selector
    const navLinks =
        document.querySelectorAll(
            '.navbar .nav-link[href^="#"]:not([data-open-chat])'
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
