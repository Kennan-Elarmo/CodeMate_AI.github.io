document.addEventListener("DOMContentLoaded", function () {

    // =================================
    // HELPERS (safe on every page)
    // =================================

    function getElement(id) {
        return document.getElementById(id);
    }

    // Add an event listener only if the element exists on this page
    function on(id, eventName, handler) {
        const el = getElement(id);
        if (el) el.addEventListener(eventName, handler);
    }

    function setText(id, text) {
        const el = getElement(id);
        if (el) el.textContent = text;
    }


    // =================================
    // STUDENT DASHBOARD (only on dashboard.html)
    // =================================

    if (document.body.classList.contains("dash-page")) {

        let user = null;

        try {
            user = JSON.parse(localStorage.getItem("codemateUser"));
        } catch (error) {
            user = null;
        }

        // Not signed in: back to login
        if (!user) {
            window.location.replace("login.html");
            return;
        }

        const fullName = user.name || "Student";
        const firstName = fullName.split(" ")[0];

        setText("userName", fullName);
        setText("welcomeName", firstName);

        function logout(event) {
            event.preventDefault();
            localStorage.removeItem("codemateUser");
            window.location.href = "login.html";
        }

        on("logoutBtn", "click", logout);
        on("logoutMenu", "click", logout);

        const sidebar = getElement("sidebar");

        on("sidebarToggle", "click", function () {
            if (sidebar) sidebar.classList.toggle("open");
        });

        // Close the mobile sidebar after choosing a link
        document.querySelectorAll(".sidebar-nav a").forEach(function (link) {
            link.addEventListener("click", function () {
                if (sidebar) sidebar.classList.remove("open");
            });
        });

        // Highlight the sidebar link of the section being viewed
        const spyLinks = Array.from(
            document.querySelectorAll('.sidebar-nav a[href^="#"]:not([href="#"])')
        );

        const spySections = spyLinks
            .map(function (link) {
                return document.querySelector(link.getAttribute("href"));
            })
            .filter(Boolean);

        if ("IntersectionObserver" in window) {

            const spy = new IntersectionObserver(function (entries) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        spyLinks.forEach(function (link) {
                            link.classList.toggle(
                                "active",
                                link.getAttribute("href") === "#" + entry.target.id
                            );
                        });

                    }

                });

            }, { rootMargin: "-30% 0px -60% 0px" });

            spySections.forEach(function (section) {
                spy.observe(section);
            });

        }
    }


    // =================================
    // LOGIN / SIGN UP
    // =================================

(() => {
  'use strict';

  // Where to go after a successful sign in / sign up (login.html and dashboard.html are both in /pages)
  const REDIRECT_URL = 'dashboard.html';
  const SWITCH_MS = 750; // keep in sync with --slide in style.css

  const container = document.querySelector('.container');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const stacked = window.matchMedia('(max-width: 760px)');

  /* ---------- Slide between Sign in and Sign up ---------- */
  const switchLink = document.querySelector('.overlay .btn-light');
  let switching = false;

  if (container && switchLink) {
    switchLink.addEventListener('click', (e) => {
      // Let new-tab clicks and plain navigation (small screens, reduced motion) work normally
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      if (reduceMotion.matches || stacked.matches) return;

      e.preventDefault();
      if (switching) return;
      switching = true;
      container.classList.add('is-switching');

      const href = switchLink.href;
      setTimeout(() => { window.location.href = href; }, SWITCH_MS);
    });

    // Back button restores the page from cache: reset the animation state
    window.addEventListener('pageshow', (e) => {
      if (e.persisted) {
        switching = false;
        container.classList.remove('is-switching');
      }
    });
  }

  /* ---------- Validation ---------- */
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  let errorCount = 0;

  const rules = {
    text: (v) => (v.trim().length >= 2 ? '' : 'Please enter your name.'),
    email: (v) => {
      if (!v.trim()) return 'Please enter your email.';
      return EMAIL_RE.test(v.trim()) ? '' : 'Enter a valid email address.';
    },
    password: (v, isSignUp) => {
      if (!v) return 'Please enter your password.';
      return isSignUp && v.length < 8 ? 'Use at least 8 characters.' : '';
    },
  };

  function setError(input, message) {
    let note = input.nextElementSibling;
    if (!note || !note.classList.contains('error')) {
      if (!message) return;
      note = document.createElement('p');
      note.className = 'error';
      note.id = 'error-' + (++errorCount);
      note.setAttribute('role', 'alert');
      input.insertAdjacentElement('afterend', note);
      input.setAttribute('aria-describedby', note.id);
    }
    note.textContent = message;
    note.hidden = !message;
    input.classList.toggle('is-invalid', Boolean(message));
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
  }

  /* ---------- Remember who signed in (used by the dashboard) ---------- */
  function saveUser(form, isSignUp) {
    const emailInput = form.querySelector('input[type="email"]');
    const email = emailInput ? emailInput.value.trim() : '';

    let account = null;
    try {
      account = JSON.parse(localStorage.getItem('codemateAccount'));
    } catch (error) {
      account = null;
    }

    let name = '';

    if (isSignUp) {
      // Sign up: join all name fields (first + last name)
      name = Array.from(form.querySelectorAll('input[type="text"]'))
        .map((input) => input.value.trim())
        .filter(Boolean)
        .join(' ');

      localStorage.setItem('codemateAccount', JSON.stringify({ name: name, email: email }));
    } else if (account && account.email &&
               account.email.toLowerCase() === email.toLowerCase()) {
      // Login with the email that signed up on this browser
      name = account.name;
    } else {
      // Fallback: use the part of the email before the @
      const local = email.split('@')[0] || 'Student';
      name = local.charAt(0).toUpperCase() + local.slice(1);
    }

    localStorage.setItem('codemateUser', JSON.stringify({ name: name || 'Student', email: email }));
  }

  function initForm(form, isSignUp) {
    if (!form) return;
    const fields = Array.from(form.querySelectorAll('input.input'));

    const check = (input) => {
      const rule = rules[input.type];
      const message = rule ? rule(input.value, isSignUp) : '';
      setError(input, message);
      return !message;
    };

    fields.forEach((input) => {
      input.addEventListener('input', () => {
        if (input.classList.contains('is-invalid')) check(input);
      });
      input.addEventListener('blur', () => {
        if (input.value) check(input);
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const results = fields.map(check);
      const firstBad = results.indexOf(false);
      if (firstBad !== -1) {
        fields[firstBad].focus();
        return;
      }

      const button = form.querySelector('button[type="submit"]');
      button.disabled = true;
      button.textContent = isSignUp ? 'Creating account...' : 'Signing in...';

      // Save the signed-in user so the dashboard can show their name
      saveUser(form, isSignUp);

      // TODO: send the form to your backend here, then redirect when it succeeds.
      setTimeout(() => { window.location.href = REDIRECT_URL; }, 600);
    });
  }

  initForm(document.getElementById('signInForm'), false);
  initForm(document.getElementById('signUpForm'), true);

  /* "Forgot your password?" has no page yet: stop it jumping to the top */
  document.querySelectorAll('a.forgot[href="#"]').forEach((link) => {
    link.addEventListener('click', (e) => e.preventDefault());
  });
})();

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

    function saveProgress() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    }


    // =================================
    // UPDATE PROGRESS (skips anything not on this page)
    // =================================

    function updateProgress() {

        const completed = saved.completed.length;

        const percentage = Math.round(
            (completed / lessons.length) * 100
        );

        setText("dashboardProgress", percentage + "%");
        setText("completedLessons", completed + " / " + lessons.length);
        setText("learningStreak", saved.streak + " Days");
        setText("totalXP", saved.xp + " XP");
        setText("progressPercentage", percentage + "%");
        setText(
            "progressText",
            completed + " of " + lessons.length + " lessons completed"
        );

        const progressFill = getElement("progressFill");

        if (progressFill) {
            progressFill.style.width = percentage + "%";
            progressFill.setAttribute("aria-valuenow", percentage);
        }


        // DISPLAY MODULE PROGRESS

        const progressLessons = getElement("progressLessons");

        if (!progressLessons) return;

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

        progressLessons.innerHTML = progressHTML;
    }


    // =================================
    // OPEN LESSON
    // =================================

    function openLesson(index) {

        const viewer = getElement("lessonViewer");

        if (!viewer) return;

        activeLesson = Number(index);

        const lesson = lessons[activeLesson];

        if (!lesson) return;

        setText("lessonTitle", lesson.title);
        setText("lessonDescription", lesson.description);
        setText("lessonExample", lesson.example);

        const completed =
            saved.completed.includes(activeLesson);

        setText(
            "lessonStatus",
            completed ? "Already completed!" : ""
        );

        const completeBtn = getElement("completeLessonBtn");

        if (completeBtn) {
            completeBtn.disabled = completed;
            completeBtn.textContent =
                completed ?
                    "Lesson Completed ✓" :
                    "Complete Lesson ✓";
        }

        viewer.classList.remove("d-none");

        viewer.scrollIntoView({
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

    on("closeLesson", "click", function () {

        getElement("lessonViewer").classList.add("d-none");

    });


    // =================================
    // COMPLETE LESSON
    // =================================

    on("completeLessonBtn", "click", function () {

        if (activeLesson === null) return;

        if (saved.completed.includes(activeLesson)) return;

        saved.completed.push(activeLesson);

        saved.xp += 20;

        saved.streak = Math.max(saved.streak, 1);

        saveProgress();

        updateProgress();

        setText("lessonStatus", "Congratulations! You earned 20 XP!");

        const completeBtn = getElement("completeLessonBtn");

        completeBtn.disabled = true;

        completeBtn.textContent = "Lesson Completed ✓";

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

    on("language", "change", updateCourse);
    on("level", "change", updateCourse);


    // =================================
    // FLOATING CHAT: OPEN / CLOSE
    // =================================

    const chatToggle = getElement("chatToggle");
    const chatWidget = getElement("chatWidget");
    const chatClose  = getElement("chatClose");

    function setChat(open) {

        if (!chatWidget || !chatToggle) return;

        chatWidget.classList.toggle("d-none", !open);

        chatToggle.innerHTML = open
            ? '<i class="bi bi-x-lg"></i>'
            : '<i class="bi bi-robot"></i>';

        if (open) {
            const question = getElement("userQuestion");
            if (question) question.focus();
        }

    }

    if (chatToggle && chatWidget) {

        chatToggle.addEventListener("click", function () {
            setChat(chatWidget.classList.contains("d-none"));
        });

    }

    if (chatClose) {

        chatClose.addEventListener("click", function () {
            setChat(false);
        });

    }

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

        if (!chatMessages) return;

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

        const input = getElement("userQuestion");

        if (input) input.value = "";

        setTimeout(function () {

            const response =
                getAIResponse(cleanQuestion);

            addMessage(response, "bot");

        }, 400);

    }


    // CHAT FORM

    on("chatForm", "submit", function (event) {

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

    on("checkCodeBtn", "click", function () {

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

    on("hintBtn", "click", function () {

        const hint = getElement("hint");

        hint.textContent =
            'Hint: Use the Python print() function. Example: print("Hello, World!")';

        hint.classList.remove("d-none");

    });


    // =================================
    // RESET CODE
    // =================================

    on("resetCodeBtn", "click", function () {

        getElement("codeEditor").value = "";

        getElement("hint").classList.add("d-none");

        getElement("codeResult").classList.add("d-none");

    });


    // =================================
    // CONTACT FORM
    // =================================

    on("contactForm", "submit", function (event) {

        event.preventDefault();

        setText(
            "contactStatus",
            "Thank you! Your message has been recorded in this demo. No email was sent."
        );

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
    // INITIALIZE
    // =================================

    updateProgress();

});
