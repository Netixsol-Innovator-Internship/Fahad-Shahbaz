// Mobile menu functionality
document.addEventListener("DOMContentLoaded", function () {
  // Quiz Data
  const quizData = {
    "General Knowledge": {
      title: "General Knowledge",
      category: "general",
      questions: [
        {
          question: "What is the capital of France?",
          options: ["London", "Paris", "Berlin", "Rome"],
          correct: 1,
        },
        {
          question: "Which planet is known as the Red Planet?",
          options: ["Venus", "Mars", "Jupiter", "Saturn"],
          correct: 1,
        },
        {
          question: "Who painted the Mona Lisa?",
          options: [
            "Vincent van Gogh",
            "Pablo Picasso",
            "Leonardo da Vinci",
            "Michelangelo",
          ],
          correct: 2,
        },
        {
          question: "What is the largest ocean on Earth?",
          options: [
            "Atlantic Ocean",
            "Indian Ocean",
            "Arctic Ocean",
            "Pacific Ocean",
          ],
          correct: 3,
        },
        {
          question: "In which year did World War II end?",
          options: ["1944", "1945", "1946", "1947"],
          correct: 1,
        },
        {
          question: "What is the smallest country in the world?",
          options: ["Monaco", "Liechtenstein", "Vatican City", "San Marino"],
          correct: 2,
        },
        {
          question: "Which element has the chemical symbol 'O'?",
          options: ["Gold", "Oxygen", "Silver", "Iron"],
          correct: 1,
        },
        {
          question: "Who wrote 'Romeo and Juliet'?",
          options: [
            "Charles Dickens",
            "William Shakespeare",
            "Jane Austen",
            "Mark Twain",
          ],
          correct: 1,
        },
        {
          question: "What is the longest river in the world?",
          options: [
            "Amazon River",
            "Nile River",
            "Mississippi River",
            "Yangtze River",
          ],
          correct: 1,
        },
        {
          question: "How many continents are there?",
          options: ["5", "6", "7", "8"],
          correct: 2,
        },
      ],
    },
    Science: {
      title: "Science",
      category: "science",
      questions: [
        {
          question: "What is the chemical formula for water?",
          options: ["H2O", "CO2", "NaCl", "O2"],
          correct: 0,
        },
        {
          question: "Which planet is closest to the Sun?",
          options: ["Venus", "Mercury", "Earth", "Mars"],
          correct: 1,
        },
        {
          question: "What gas do plants absorb from the atmosphere?",
          options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"],
          correct: 2,
        },
        {
          question: "What is the speed of light?",
          options: [
            "300,000 km/s",
            "150,000 km/s",
            "450,000 km/s",
            "600,000 km/s",
          ],
          correct: 0,
        },
        {
          question: "Which blood type is known as the universal donor?",
          options: ["A", "B", "AB", "O"],
          correct: 3,
        },
        {
          question: "What is the hardest natural substance on Earth?",
          options: ["Gold", "Iron", "Diamond", "Platinum"],
          correct: 2,
        },
        {
          question: "How many bones are in the human body?",
          options: ["206", "208", "210", "212"],
          correct: 0,
        },
        {
          question: "What is the largest organ in the human body?",
          options: ["Liver", "Brain", "Heart", "Skin"],
          correct: 3,
        },
        {
          question: "What is the chemical symbol for gold?",
          options: ["Go", "Gd", "Au", "Ag"],
          correct: 2,
        },
        {
          question: "Which scientist developed the theory of relativity?",
          options: [
            "Isaac Newton",
            "Albert Einstein",
            "Galileo Galilei",
            "Stephen Hawking",
          ],
          correct: 1,
        },
      ],
    },
    History: {
      title: "History",
      category: "history",
      questions: [
        {
          question: "Who was the first President of the United States?",
          options: [
            "Thomas Jefferson",
            "George Washington",
            "John Adams",
            "Benjamin Franklin",
          ],
          correct: 1,
        },
        {
          question: "In which year did the Berlin Wall fall?",
          options: ["1987", "1988", "1989", "1990"],
          correct: 2,
        },
        {
          question:
            "Which ancient wonder of the world was located in Alexandria?",
          options: ["Hanging Gardens", "Lighthouse", "Colossus", "Mausoleum"],
          correct: 1,
        },
        {
          question: "Who was known as the 'Iron Lady'?",
          options: [
            "Queen Elizabeth",
            "Margaret Thatcher",
            "Angela Merkel",
            "Indira Gandhi",
          ],
          correct: 1,
        },
        {
          question: "Which empire was ruled by Julius Caesar?",
          options: [
            "Greek Empire",
            "Roman Empire",
            "Ottoman Empire",
            "Byzantine Empire",
          ],
          correct: 1,
        },
        {
          question: "In which year did the Titanic sink?",
          options: ["1910", "1911", "1912", "1913"],
          correct: 2,
        },
        {
          question: "Who painted the ceiling of the Sistine Chapel?",
          options: [
            "Leonardo da Vinci",
            "Raphael",
            "Michelangelo",
            "Donatello",
          ],
          correct: 2,
        },
        {
          question: "Which war was fought between 1914-1918?",
          options: ["World War II", "World War I", "Civil War", "Korean War"],
          correct: 1,
        },
        {
          question: "Who was the first man to walk on the moon?",
          options: [
            "Buzz Aldrin",
            "Neil Armstrong",
            "John Glenn",
            "Alan Shepard",
          ],
          correct: 1,
        },
        {
          question: "Which ancient civilization built Machu Picchu?",
          options: ["Aztec", "Maya", "Inca", "Olmec"],
          correct: 2,
        },
      ],
    },
    Literature: {
      title: "Literature",
      category: "literature",
      questions: [
        {
          question: "Who wrote 'Pride and Prejudice'?",
          options: [
            "Charlotte Brontë",
            "Jane Austen",
            "Emily Dickinson",
            "Virginia Woolf",
          ],
          correct: 1,
        },
        {
          question:
            "In which Shakespeare play does the character Hamlet appear?",
          options: ["Macbeth", "Othello", "King Lear", "Hamlet"],
          correct: 3,
        },
        {
          question: "Who wrote '1984'?",
          options: [
            "Aldous Huxley",
            "George Orwell",
            "Ray Bradbury",
            "H.G. Wells",
          ],
          correct: 1,
        },
        {
          question: "What is the first book in the Harry Potter series?",
          options: [
            "Chamber of Secrets",
            "Philosopher's Stone",
            "Prisoner of Azkaban",
            "Goblet of Fire",
          ],
          correct: 1,
        },
        {
          question: "Who wrote 'To Kill a Mockingbird'?",
          options: [
            "Harper Lee",
            "Toni Morrison",
            "Maya Angelou",
            "Zora Neale Hurston",
          ],
          correct: 0,
        },
        {
          question:
            "In which novel would you find the character Atticus Finch?",
          options: [
            "The Great Gatsby",
            "To Kill a Mockingbird",
            "Of Mice and Men",
            "The Catcher in the Rye",
          ],
          correct: 1,
        },
        {
          question: "Who wrote 'The Great Gatsby'?",
          options: [
            "Ernest Hemingway",
            "F. Scott Fitzgerald",
            "John Steinbeck",
            "William Faulkner",
          ],
          correct: 1,
        },
        {
          question: "Which poet wrote 'The Road Not Taken'?",
          options: [
            "Walt Whitman",
            "Emily Dickinson",
            "Robert Frost",
            "Langston Hughes",
          ],
          correct: 2,
        },
        {
          question: "What is the opening line of 'A Tale of Two Cities'?",
          options: [
            "Call me Ishmael",
            "It was the best of times",
            "In a hole in the ground",
            "All happy families",
          ],
          correct: 1,
        },
        {
          question: "Who wrote 'One Hundred Years of Solitude'?",
          options: [
            "Gabriel García Márquez",
            "Jorge Luis Borges",
            "Pablo Neruda",
            "Isabel Allende",
          ],
          correct: 0,
        },
      ],
    },
    Mathematics: {
      title: "Mathematics",
      category: "mathematics",
      questions: [
        {
          question: "What is 15% of 200?",
          options: ["25", "30", "35", "40"],
          correct: 1,
        },
        {
          question: "What is the value of π (pi) to two decimal places?",
          options: ["3.12", "3.14", "3.16", "3.18"],
          correct: 1,
        },
        {
          question: "What is the square root of 144?",
          options: ["11", "12", "13", "14"],
          correct: 1,
        },
        {
          question: "If x + 5 = 12, what is x?",
          options: ["6", "7", "8", "9"],
          correct: 1,
        },
        {
          question: "What is 8 × 7?",
          options: ["54", "56", "58", "60"],
          correct: 1,
        },
        {
          question: "What is the area of a circle with radius 3? (π = 3.14)",
          options: ["28.26", "18.84", "9.42", "6.28"],
          correct: 0,
        },
        {
          question: "What is 2⁴ (2 to the power of 4)?",
          options: ["8", "12", "16", "20"],
          correct: 2,
        },
        {
          question: "What is the next number in the sequence: 2, 4, 8, 16, ?",
          options: ["24", "28", "32", "36"],
          correct: 2,
        },
        {
          question: "What is 0.25 as a fraction?",
          options: ["1/2", "1/3", "1/4", "1/5"],
          correct: 2,
        },
        {
          question:
            "If a triangle has angles of 60° and 60°, what is the third angle?",
          options: ["30°", "45°", "60°", "90°"],
          correct: 2,
        },
      ],
    },
  };

  // Quiz state variables
  let currentQuiz = null;
  let currentQuestionIndex = 0;
  let userAnswers = [];
  let quizTimer = null;
  let timeRemaining = 600; // 10 minutes per quiz
  let startTime = null;

  // Authentication functionality
  function initAuthentication() {
    const signupForm = document.querySelector("#signupSection");
    const signinForm = document.querySelector("#signinSection");

    // Handle signup
    const signupButton = signupForm.querySelector("button");
    signupButton.addEventListener("click", function (e) {
      e.preventDefault();
      handleSignup();
    });

    // Handle signin
    const signinButton = signinForm.querySelector("button");
    signinButton.addEventListener("click", function (e) {
      e.preventDefault();
      handleSignin();
    });

    // Add input event listeners to clear errors on typing
    const allInputs = document.querySelectorAll(
      "#signupSection input, #signinSection input"
    );
    allInputs.forEach((input) => {
      input.addEventListener("input", function () {
        // Clear error styles when user starts typing
        this.classList.remove("border-red-500", "border-2");
        this.classList.add("border-gray-300");

        // Remove error message
        const errorMessage = this.parentNode.querySelector(".error-message");
        if (errorMessage) {
          errorMessage.remove();
        }
      });
    });
  }

  function handleSignup() {
    // Clear previous errors
    clearErrors("#signupSection");

    const fullName = document.querySelector(
      '#signupSection input[placeholder="Full Name"]'
    );
    const email = document.querySelector(
      '#signupSection input[placeholder="Email"]'
    );
    const password = document.querySelector(
      '#signupSection input[placeholder="Password"]'
    );
    const confirmPassword = document.querySelector(
      '#signupSection input[placeholder="Confirm Password"]'
    );

    // Validation
    if (!fullName.value.trim()) {
      showError(fullName, "Please enter your full name");
      return;
    }

    if (!email.value.trim()) {
      showError(email, "Please enter your email");
      return;
    }

    if (!password.value) {
      showError(password, "Please enter a password");
      return;
    }

    if (!confirmPassword.value) {
      showError(confirmPassword, "Please confirm your password");
      return;
    }

    if (password.value !== confirmPassword.value) {
      showError(confirmPassword, "Passwords do not match");
      return;
    }

    // Check if user already exists
    const existingUser = localStorage.getItem(email.value);
    if (existingUser) {
      showError(email, "User already exists with this email. Please sign in.");
      return;
    }

    // Save user to localStorage
    const userData = {
      fullName: fullName.value.trim(),
      email: email.value.trim(),
      password: password.value,
      joinDate: new Date().toISOString(),
    };

    localStorage.setItem(email.value, JSON.stringify(userData));

    showSuccess(
      "#signupSection",
      "Account created successfully! You can now sign in."
    );

    // Clear form
    fullName.value = "";
    email.value = "";
    password.value = "";
    confirmPassword.value = "";

    // Navigate to signin after a short delay
    setTimeout(() => {
      navigateToSection("#signinSection");
    }, 1500);
  }

  function handleSignin() {
    // Clear previous errors
    clearErrors("#signinSection");

    const email = document.querySelector(
      '#signinSection input[placeholder="Email"]'
    );
    const password = document.querySelector(
      '#signinSection input[placeholder="Password"]'
    );

    // Validation
    if (!email.value.trim()) {
      showError(email, "Please enter your email");
      return;
    }

    if (!password.value) {
      showError(password, "Please enter your password");
      return;
    }

    // Check if user exists
    const userData = localStorage.getItem(email.value.trim());
    if (!userData) {
      showError(
        email,
        "No account found with this email. Please sign up first."
      );
      return;
    }

    // Verify password
    const user = JSON.parse(userData);
    if (user.password !== password.value) {
      showError(password, "Incorrect password. Please try again.");
      return;
    }

    // Set current user
    localStorage.setItem("currentUser", email.value.trim());

    showSuccess("#signinSection", "Signed in successfully!");

    // Clear form
    email.value = "";
    password.value = "";

    // Navigate to quiz selection after a short delay
    setTimeout(() => {
      navigateToSection("#quizSection");
    }, 1000);
  }

  // Error handling functions
  function showError(inputElement, message) {
    // Add red border to input
    inputElement.classList.add("border-red-500", "border-2");
    inputElement.classList.remove("border-gray-300");

    // Remove existing error message if any
    const existingError =
      inputElement.parentNode.querySelector(".error-message");
    if (existingError) {
      existingError.remove();
    }

    // Create and add error message
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message text-red-500 text-sm mt-1";
    errorDiv.textContent = message;
    inputElement.parentNode.insertBefore(errorDiv, inputElement.nextSibling);
  }

  function showSuccess(sectionSelector, message) {
    const section = document.querySelector(sectionSelector);

    // Remove existing success message if any
    const existingSuccess = section.querySelector(".success-message");
    if (existingSuccess) {
      existingSuccess.remove();
    }

    // Create and add success message
    const successDiv = document.createElement("div");
    successDiv.className =
      "success-message text-green-500 text-sm text-center p-3 bg-green-50 rounded-md mt-4";
    successDiv.textContent = message;

    // Insert after the form div
    const formDiv = section.querySelector(".space-y-4");
    formDiv.parentNode.insertBefore(successDiv, formDiv.nextSibling);
  }

  function clearErrors(sectionSelector) {
    const section = document.querySelector(sectionSelector);

    // Remove error styles from all inputs
    const inputs = section.querySelectorAll("input");
    inputs.forEach((input) => {
      input.classList.remove("border-red-500", "border-2");
      input.classList.add("border-gray-300");

      // Remove error messages
      const errorMessage = input.parentNode.querySelector(".error-message");
      if (errorMessage) {
        errorMessage.remove();
      }
    });

    // Remove success messages
    const successMessage = section.querySelector(".success-message");
    if (successMessage) {
      successMessage.remove();
    }
  }

  function initQuizSelection() {
    // Make all quiz items clickable
    const quizItems = document.querySelectorAll(
      '#quizSection .nav-link[data-target="#singleQuizSection"]'
    );

    quizItems.forEach((item) => {
      item.addEventListener("click", function (e) {
        e.preventDefault();

        // Get quiz type from the clicked element
        const quizTitle = this.querySelector("h1")
          ? this.querySelector("h1").textContent.trim()
          : this.querySelector("h3")
          ? this.querySelector("h3").textContent.trim()
          : "General Knowledge";

        console.log("Selected quiz:", quizTitle);

        // Check if quiz exists in our data
        if (quizData[quizTitle]) {
          startQuiz(quizTitle);
        } else {
          console.error("Quiz not found:", quizTitle);
          alert("Quiz not available yet!");
        }
      });
    });
  }

  // Quiz Management Functions
  function startQuiz(quizTitle) {
    currentQuiz = quizData[quizTitle];
    currentQuestionIndex = 0;
    userAnswers = new Array(currentQuiz.questions.length).fill(null);
    timeRemaining = 600; // 10 minutes
    startTime = Date.now();

    // Navigate to quiz section
    navigateToSection("#singleQuizSection");

    // Initialize quiz interface
    setupQuizInterface();
    displayQuestion();
    startTimer();
  }

  function setupQuizInterface() {
    // Add navigation event listeners for quiz buttons
    const nextBtn = document.querySelector(
      '#singleQuizSection button[data-target="#resultSection"]'
    );
    const prevBtn = document.querySelector(
      "#singleQuizSection .bg-\\[\\#F0F2F5\\]"
    );

    if (nextBtn) {
      nextBtn.removeAttribute("data-target");
      nextBtn.className =
        "bg-[#0D78F2] w-[92px] h-[40px] rounded-md text-white cursor-pointer hover:bg-[#0B5BBF] transition-colors";
      nextBtn.onclick = nextQuestion;
    }

    if (prevBtn) {
      prevBtn.onclick = previousQuestion;
    }

    // Add click listeners for answer options
    const answerOptions = document.querySelectorAll(
      '#singleQuizSection input[type="radio"]'
    );
    answerOptions.forEach((option, index) => {
      option.addEventListener("change", function () {
        if (this.checked) {
          userAnswers[currentQuestionIndex] = index;
        }
      });
    });
  }

  function displayQuestion() {
    if (!currentQuiz || currentQuestionIndex >= currentQuiz.questions.length) {
      return;
    }

    const question = currentQuiz.questions[currentQuestionIndex];

    // Update progress
    const progressBar = document.querySelector(
      "#singleQuizSection .w-\\[30\\%\\]"
    );
    const progressText = document.querySelector(
      "#singleQuizSection .text-\\[\\#61738A\\]"
    );
    const questionTitle = document.querySelector("#singleQuizSection h1");

    if (progressBar) {
      const progress =
        ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100;
      progressBar.style.width = `${progress}%`;
    }

    if (progressText) {
      progressText.textContent = `Question ${currentQuestionIndex + 1} of ${
        currentQuiz.questions.length
      }`;
    }

    if (questionTitle) {
      questionTitle.textContent = question.question;
    }

    // Update answer options
    const radioInputs = document.querySelectorAll(
      '#singleQuizSection input[type="radio"]'
    );
    const labels = document.querySelectorAll("#singleQuizSection label");

    radioInputs.forEach((input, index) => {
      input.checked = userAnswers[currentQuestionIndex] === index;
      input.name = `question_${currentQuestionIndex}`;
      input.id = `option_${index}`;
    });

    labels.forEach((label, index) => {
      if (question.options[index]) {
        label.textContent = question.options[index];
        label.setAttribute("for", `option_${index}`);
      }
    });

    // Update button states
    const prevBtn = document.querySelector(
      "#singleQuizSection .bg-\\[\\#F0F2F5\\]"
    );
    const nextBtn = document.querySelector(
      "#singleQuizSection .bg-\\[\\#0D78F2\\]"
    );

    if (prevBtn) {
      prevBtn.disabled = currentQuestionIndex === 0;
      prevBtn.style.opacity = currentQuestionIndex === 0 ? "0.5" : "1";
    }

    if (nextBtn) {
      if (currentQuestionIndex === currentQuiz.questions.length - 1) {
        nextBtn.textContent = "Finish";
      } else {
        nextBtn.textContent = "Next";
      }
    }
  }

  function nextQuestion() {
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      currentQuestionIndex++;
      displayQuestion();
    } else {
      finishQuiz();
    }
  }

  function previousQuestion() {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      displayQuestion();
    }
  }

  function startTimer() {
    if (quizTimer) {
      clearInterval(quizTimer);
    }

    quizTimer = setInterval(() => {
      timeRemaining--;
      updateTimerDisplay();

      if (timeRemaining <= 0) {
        clearInterval(quizTimer);
        finishQuiz();
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = timeRemaining % 60;

    const hoursDisplay = document.querySelector(
      "#singleQuizSection .text-black:nth-of-type(1) .bg-\\[\\#F0F2F5\\]"
    );
    const minutesDisplay = document.querySelector(
      "#singleQuizSection .text-black:nth-of-type(2) .bg-\\[\\#F0F2F5\\]"
    );
    const secondsDisplay = document.querySelector(
      "#singleQuizSection .text-black:nth-of-type(3) .bg-\\[\\#F0F2F5\\]"
    );

    if (hoursDisplay)
      hoursDisplay.textContent = hours.toString().padStart(2, "0");
    if (minutesDisplay)
      minutesDisplay.textContent = minutes.toString().padStart(2, "0");
    if (secondsDisplay)
      secondsDisplay.textContent = seconds.toString().padStart(2, "0");
  }

  function finishQuiz() {
    if (quizTimer) {
      clearInterval(quizTimer);
    }

    // Calculate score
    let correctAnswers = 0;
    const incorrectAnswers = [];

    currentQuiz.questions.forEach((question, index) => {
      if (userAnswers[index] === question.correct) {
        correctAnswers++;
      } else {
        incorrectAnswers.push({
          questionIndex: index,
          question: question.question,
          userAnswer:
            userAnswers[index] !== null
              ? question.options[userAnswers[index]]
              : "No answer",
          correctAnswer: question.options[question.correct],
          options: question.options,
        });
      }
    });

    const score = correctAnswers;
    const totalQuestions = currentQuiz.questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);

    // Store results
    const quizResult = {
      quizTitle: currentQuiz.title,
      score: score,
      totalQuestions: totalQuestions,
      percentage: percentage,
      timeSpent: Math.floor((Date.now() - startTime) / 1000),
      incorrectAnswers: incorrectAnswers,
      date: new Date().toISOString(),
    };

    // Save to localStorage
    saveQuizResult(quizResult);

    // Store current result for display
    sessionStorage.setItem("currentQuizResult", JSON.stringify(quizResult));

    // Navigate to results page
    navigateToSection("#resultSection");
    displayResults(quizResult);
  }

  function saveQuizResult(result) {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) return;

    const userResultsKey = `quizResults_${currentUser}`;
    let userResults = JSON.parse(localStorage.getItem(userResultsKey)) || [];

    userResults.push(result);
    localStorage.setItem(userResultsKey, JSON.stringify(userResults));
  }

  function displayResults(result) {
    // Update score display
    const scoreDisplay = document.querySelector(
      "#resultSection .font-bold.text-2xl"
    );
    if (scoreDisplay) {
      scoreDisplay.textContent = `${result.score}/${result.totalQuestions}`;
    }

    // Update congratulations message
    const congratsMessage = document.querySelector("#resultSection p");
    if (congratsMessage) {
      const currentUser = localStorage.getItem("currentUser");
      let userName = "User";

      if (currentUser) {
        const userData = localStorage.getItem(currentUser);
        if (userData) {
          const user = JSON.parse(userData);
          userName = user.fullName.split(" ")[0];
        }
      }

      let message = "";
      if (result.percentage >= 80) {
        message = `Excellent work, ${userName}! You scored ${result.score} out of ${result.totalQuestions} (${result.percentage}%). Outstanding performance!`;
      } else if (result.percentage >= 60) {
        message = `Good job, ${userName}! You scored ${result.score} out of ${result.totalQuestions} (${result.percentage}%). Keep practicing!`;
      } else {
        message = `Nice try, ${userName}! You scored ${result.score} out of ${result.totalQuestions} (${result.percentage}%). Study more and try again!`;
      }

      congratsMessage.textContent = message;
    }

    // Update review answers button
    const reviewBtn = document.querySelector(
      '#resultSection a[data-target="#answerSection"]'
    );
    if (reviewBtn && result.incorrectAnswers.length > 0) {
      reviewBtn.style.display = "inline-block";
      reviewBtn.onclick = function (e) {
        e.preventDefault();
        showIncorrectAnswers(result.incorrectAnswers);
      };
    } else if (reviewBtn) {
      reviewBtn.style.display = "none";
    }
  }

  function showIncorrectAnswers(incorrectAnswers) {
    // Create a section for reviewing incorrect answers
    let reviewSection = document.getElementById("reviewSection");

    if (!reviewSection) {
      // Create review section if it doesn't exist
      reviewSection = document.createElement("div");
      reviewSection.id = "reviewSection";
      reviewSection.className = "page-section hidden";
      reviewSection.innerHTML = `
        <section class="max-w-[960px] mx-auto mt-10 px-4 py-8 rounded-md relative overflow-hidden space-y-6">
          <div class="flex items-center justify-between">
            <h1 class="text-2xl md:text-3xl font-bold">Review Incorrect Answers</h1>
            <button onclick="navigateToSection('#resultSection')" class="bg-[#0D78F2] text-white px-4 py-2 rounded-md hover:bg-[#0B5BBF]">
              Back to Results
            </button>
          </div>
          <div id="incorrectAnswersList" class="space-y-6">
          </div>
        </section>
      `;
      document.body.appendChild(reviewSection);
    }

    // Populate incorrect answers
    const answersList = reviewSection.querySelector("#incorrectAnswersList");
    answersList.innerHTML = "";

    if (incorrectAnswers.length === 0) {
      answersList.innerHTML =
        '<p class="text-center text-green-600 text-lg">Perfect! You got all answers correct!</p>';
    } else {
      incorrectAnswers.forEach((item, index) => {
        const answerDiv = document.createElement("div");
        answerDiv.className =
          "border border-gray-200 rounded-lg p-6 bg-white shadow-sm";
        answerDiv.innerHTML = `
          <h3 class="text-lg font-semibold mb-4">Question ${
            item.questionIndex + 1
          }</h3>
          <p class="text-gray-800 mb-4">${item.question}</p>
          <div class="space-y-2">
            ${item.options
              .map(
                (option, optIndex) => `
              <div class="p-3 rounded-md border ${
                optIndex === currentQuiz.questions[item.questionIndex].correct
                  ? "bg-green-100 border-green-500"
                  : item.userAnswer === option
                  ? "bg-red-100 border-red-500"
                  : "bg-gray-50 border-gray-200"
              }">
                <span class="font-medium">${option}</span>
                ${
                  optIndex === currentQuiz.questions[item.questionIndex].correct
                    ? " ✓ (Correct)"
                    : ""
                }
                ${item.userAnswer === option ? " ✗ (Your answer)" : ""}
              </div>
            `
              )
              .join("")}
          </div>
        `;
        answersList.appendChild(answerDiv);
      });
    }

    navigateToSection("#reviewSection");
  }

  function navigateToSection(targetId) {
    const sections = document.querySelectorAll(".page-section");
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      // Hide all sections
      sections.forEach((section) => {
        section.classList.add("hidden");
      });

      // Show target section
      targetSection.classList.remove("hidden");

      // Close mobile menu if open
      if (isMenuOpen) {
        isMenuOpen = false;
        mobileMenu.classList.add("hidden");
        mobileMenuBtn.querySelector("svg").outerHTML = hamburgerSVG;
      }

      // Scroll to top
      window.scrollTo(0, 0);
    }
  }

  // SPA Navigation functionality
  function initSPANavigation() {
    const navLinks = document.querySelectorAll(".nav-link[data-target]");

    navLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("data-target");

        // Check authentication for protected routes
        if (
          targetId === "#quizSection" ||
          targetId === "#profileSection" ||
          targetId === "#leaderboardSection"
        ) {
          const currentUser = localStorage.getItem("currentUser");
          if (!currentUser) {
            alert("Please sign in to access this page.");
            navigateToSection("#signinSection");
            return;
          }
        }

        navigateToSection(targetId);

        // Update specific sections when accessed
        if (targetId === "#leaderboardSection") {
          updateLeaderboard();
        } else if (targetId === "#profileSection") {
          const currentUser = localStorage.getItem("currentUser");
          if (currentUser) {
            updateProfileSection(currentUser);
          }
        }
      });
    });
  }

  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileMenuIcon = mobileMenuBtn.querySelector("svg");

  if (!mobileMenuBtn || !mobileMenu || !mobileMenuIcon) {
    console.error("Mobile menu elements not found!");
    return;
  }

  let isMenuOpen = false;

  // SVGs for hamburger and close icons
  const hamburgerSVG = `
      <svg class="w-6 h-6 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
    </svg>
  `;
  const closeSVG = `
    <svg class="w-6 h-6 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
    </svg>
  `;

  // Toggle mobile menu
  mobileMenuBtn.addEventListener("click", function () {
    isMenuOpen = !isMenuOpen;
    mobileMenu.classList.toggle("hidden", !isMenuOpen);
    // By selecting the SVG inside the button, we can replace it without affecting the button itself.
    mobileMenuBtn.querySelector("svg").outerHTML = isMenuOpen
      ? closeSVG
      : hamburgerSVG;
  });

  // Keyboard accessibility (Enter/Space)
  mobileMenuBtn.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      mobileMenuBtn.click();
    }
  });

  // Close mobile menu when clicking outside
  document.addEventListener("click", function (event) {
    if (
      isMenuOpen &&
      !mobileMenu.contains(event.target) &&
      !mobileMenuBtn.contains(event.target)
    ) {
      isMenuOpen = false;
      mobileMenu.classList.add("hidden");
      mobileMenuBtn.querySelector("svg").outerHTML = hamburgerSVG;
    }
  });

  // Close mobile menu when window is resized to desktop size
  window.addEventListener("resize", function () {
    if (window.innerWidth >= 1024 && isMenuOpen) {
      isMenuOpen = false;
      mobileMenu.classList.add("hidden");
      mobileMenuBtn.querySelector("svg").outerHTML = hamburgerSVG;
    }
  });

  // Profile icon functionality
  function initProfileIcons() {
    const mobileProfileIcon = document.getElementById("mobileProfileIcon");
    const desktopProfileIcon = document.getElementById("desktopProfileIcon");

    function handleProfileClick() {
      const currentUser = localStorage.getItem("currentUser");
      if (!currentUser) {
        // Not logged in, redirect to signin
        navigateToSection("#signinSection");
      } else {
        // Logged in, show profile with user data
        updateProfileSection();
        navigateToSection("#profileSection");
      }
    }

    if (mobileProfileIcon) {
      mobileProfileIcon.addEventListener("click", handleProfileClick);
    }

    if (desktopProfileIcon) {
      desktopProfileIcon.addEventListener("click", handleProfileClick);
    }
  }

  function updateProfileSection() {
    const currentUserEmail = localStorage.getItem("currentUser");
    if (!currentUserEmail) return;

    const userData = localStorage.getItem(currentUserEmail);
    if (!userData) return;

    const user = JSON.parse(userData);

    // Update profile section with user data
    const profileSection = document.querySelector("#profileSection");

    // Update name in header
    const userName = profileSection.querySelector("h2");
    if (userName) {
      userName.textContent = user.fullName;
    }

    // Update name in personal info
    const nameField = profileSection.querySelector(".grid .text-gray-600");
    if (nameField) {
      nameField.textContent = user.fullName;
    }

    // Update email in personal info
    const emailField = profileSection.querySelectorAll(
      ".grid .text-gray-600"
    )[1];
    if (emailField) {
      emailField.textContent = currentUserEmail;
    }

    // Update join date
    const joinDate = new Date(user.joinDate).getFullYear();
    const joinInfoElements = profileSection.querySelectorAll("p.text-gray-500");
    if (joinInfoElements.length >= 2) {
      // First p.text-gray-500 is "Quiz Enthusiast"
      joinInfoElements[0].textContent = "Quiz Enthusiast";
      // Second p.text-gray-500 is "Joined YYYY"
      joinInfoElements[1].textContent = `Joined ${joinDate}`;
    }

    // Update quiz history
    updateQuizHistory(currentUserEmail);
  }

  function updateQuizHistory(userEmail) {
    const userResultsKey = `quizResults_${userEmail}`;
    const userResults = JSON.parse(localStorage.getItem(userResultsKey)) || [];

    const historyTableBody = document.querySelector("#profileSection tbody");
    if (!historyTableBody) return;

    // Clear existing history
    historyTableBody.innerHTML = "";

    if (userResults.length === 0) {
      historyTableBody.innerHTML = `
        <tr>
          <td colspan="3" class="px-6 py-8 border-b text-center text-gray-500">
            No quiz history yet. Take your first quiz!
          </td>
        </tr>
      `;
      return;
    }

    // Show recent results (last 10)
    const recentResults = userResults.slice(-10).reverse();

    recentResults.forEach((result) => {
      const row = document.createElement("tr");
      // Format date as YYYY-MM-DD
      const date = new Date(result.date).toISOString().split("T")[0];

      row.innerHTML = `
        <td class="px-6 py-4 border-b">${result.quizTitle}</td>
        <td class="px-6 py-4 border-b text-blue-600">${result.score}/${result.totalQuestions} (${result.percentage}%)</td>
        <td class="px-6 py-4 border-b">${date}</td>
      `;

      historyTableBody.appendChild(row);
    });
  }

  // Dynamic Leaderboard functionality
  function updateLeaderboard() {
    const leaderboardContainer = document.querySelector(
      "#leaderboardSection .space-y-4"
    );
    if (!leaderboardContainer) return;

    // Get all users and their scores
    const leaderboardData = [];

    // Iterate through localStorage to find all users and their quiz results
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      // Skip non-user keys (currentUser, quiz results, etc.)
      if (key.includes("@") && !key.startsWith("quizResults_")) {
        try {
          const userData = JSON.parse(localStorage.getItem(key));
          if (userData && userData.fullName) {
            const userResultsKey = `quizResults_${key}`;
            const userResults =
              JSON.parse(localStorage.getItem(userResultsKey)) || [];

            // Calculate total points and average score
            let totalPoints = 0;
            let totalQuizzes = userResults.length;

            userResults.forEach((result) => {
              // Award points based on score percentage
              const percentage = result.percentage || 0;
              totalPoints += Math.round(percentage * 10); // 100% = 1000 points, 80% = 800 points, etc.
            });

            leaderboardData.push({
              name: userData.fullName,
              email: key,
              totalPoints: totalPoints,
              totalQuizzes: totalQuizzes,
              averageScore:
                totalQuizzes > 0
                  ? Math.round(totalPoints / totalQuizzes / 10)
                  : 0,
            });
          }
        } catch (error) {
          // Skip invalid data
          continue;
        }
      }
    }

    // Sort by total points (descending)
    leaderboardData.sort((a, b) => b.totalPoints - a.totalPoints);

    // Clear existing leaderboard
    leaderboardContainer.innerHTML = "";

    // Display leaderboard
    if (leaderboardData.length === 0) {
      leaderboardContainer.innerHTML = `
        <div class="flex justify-center items-center p-8 bg-[#F0F2F5] rounded-md">
          <p class="text-gray-500">No quiz results available yet. Take some quizzes to see the leaderboard!</p>
        </div>
      `;
      return;
    }

    leaderboardData.slice(0, 10).forEach((user, index) => {
      const rankDiv = document.createElement("div");
      rankDiv.className =
        "flex justify-between items-center p-4 bg-[#F0F2F5] rounded-md";

      // Add gold, silver, bronze styling for top 3
      let rankStyle = "";
      if (index === 0) rankStyle = "text-yellow-600 font-bold"; // Gold
      else if (index === 1) rankStyle = "text-gray-400 font-bold"; // Silver
      else if (index === 2) rankStyle = "text-yellow-800 font-bold"; // Bronze

      rankDiv.innerHTML = `
        <div class="flex items-center space-x-3">
          <span class="font-bold text-lg ${rankStyle}">#${index + 1}</span>
          <img src="./images/user-new.png" alt="User" class="w-10 h-10 rounded-full">
          <div class="flex flex-col">
            <span class="font-semibold">${user.name}</span>
            <span class="text-xs text-gray-500">${user.totalQuizzes} quiz${
        user.totalQuizzes !== 1 ? "es" : ""
      } • ${user.averageScore}% avg</span>
          </div>
        </div>
        <span class="font-bold ${rankStyle}">${user.totalPoints} pts</span>
      `;

      leaderboardContainer.appendChild(rankDiv);
    });
  }

  // Logout functionality
  function initLogout() {
    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {
      logoutBtn.addEventListener("click", function () {
        // Confirm logout
        if (confirm("Are you sure you want to logout?")) {
          // Clear current user session from localStorage (not sessionStorage)
          localStorage.removeItem("currentUser");

          // Clear any ongoing quiz session from sessionStorage
          sessionStorage.removeItem("currentQuizState");
          sessionStorage.removeItem("quizTimer");
          sessionStorage.removeItem("currentQuizCategory");

          // Navigate to home page
          navigateToSection("#homeSection");

          // Show success message
          alert("You have been logged out successfully!");
        }
      });
    }
  }

  // Initialize all functionality
  initAuthentication();
  initSPANavigation();
  initQuizSelection();
  initProfileIcons();
  initLogout();
});
