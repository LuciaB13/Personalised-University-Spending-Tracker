// Personalised Category List depending on places in around my university but can be changed!
// When a transaction contains one of these keywords associated with it, the transaction will automatically be assigned to that category.
// Personalised categories and keywords
const categoryRules = {
  "Food Shop": {
    emoji: "🛒",
    keywords: [
      "tesco",
      "sainsbury",
      "asda",
      "lidl",
      "marks & spencer",
      "m&s",
      "spar",
      "centra",
      "mace",
    ],
  },

  Transport: {
    emoji: "🚌",
    keywords: [
      "translink",
      "nir",
      "ulsterbus",
      "glider",
      "uber",
      "value cabs",
      "fonacab",
    ],
  },

  "Eating Out": {
    emoji: "🍕",
    keywords: [
      "boojum",
      "mcdonalds",
      "nandos",
      "tim hortons",
      "bunsen burger",
      "maggie mays",
    ],
  },

  Coffee: {
    emoji: "☕️",
    keywords: ["cafe nero", "the coop", "hope cafe", "juice jar", "starbucks"],
  },

  "Night Out": {
    emoji: "🎉",
    keywords: [
      "pub",
      "limelight",
      "qub su",
      "laverys",
      "jeggy nettle",
      "posthouse",
      "winemark",
      "ticketswap",
    ],
  },

  Shopping: {
    emoji: "🛍️",
    keywords: [
      "amazon",
      "primark",
      "hollister",
      "zara",
      "boots",
      "waterstones",
      "jd sports",
      "currys",
    ],
  },

  Entertainment: {
    emoji: "🎬",
    keywords: [
      "omniplex",
      "cinema",
      "netflix",
      "prime",
      "kindle unlimited",
      "apple music",
    ],
  },

  Bills: {
    emoji: "💷",
    keywords: [
      "qub",
      "tuition",
      "student loans",
      "bt group",
      "rea estates",
      "nie networks",
    ],
  },
};

// Keywords to completely ignore (Income / Refunds / Transfers In)
// This prevents income and refunds from being included in user totals
const incomeKeywords = [
  "income",
  "salary",
  "stipend",
  "transfer from",
  "credit",
  "faster payments receipt",
  "refund",
];

// The state object stores information currently being used by the application.
let state = {
  transactions: [],
  categories: Object.keys(categoryRules),
};

// This variable stores the current Chart.js chart.
// It is used so that the existing chart can be destroyed before a new one is created.
let spendingChart;

//Initialise Page
document.addEventListener("DOMContentLoaded", () => {
  //Finds element containing category and finds main category dropdown button
  const categoryOptions = document.getElementById("categoryOptions");
  const categoryButton = document.getElementById("categoryButton");

  categoryButton.dataset.category = "ALL";

  // All Categories button
  const allOption = document.createElement("button");

  allOption.textContent = "All Categories";

  allOption.addEventListener("click", () => {
    categoryButton.textContent = "All Categories ▾ ";

    categoryButton.dataset.category = "ALL";

    //Refreshes the table when using a new filter
    updateDisplay();
  });

  categoryOptions.appendChild(allOption);

  // Add categories to the dropdown
  for (let category of state.categories) {
    //Creates a button for the category.
    const option = document.createElement("button");

    option.textContent = categoryRules[category].emoji + " " + category;

    //Category selected when user clicks button
    option.addEventListener("click", () => {
      categoryButton.textContent = category + " ▾";

      //Stores selected category
      categoryButton.dataset.category = category;

      updateDisplay();
    });

    categoryOptions.appendChild(option);
  }

  // File upload
  document
    .getElementById("fileInput")
    .addEventListener("change", handleFileUpload);
  // Runs update display when user writes in the search
  document
    .getElementById("searchInput")
    .addEventListener("input", updateDisplay);
});

//Uploads CSV file

function handleFileUpload(e) {
  //First selected file
  const file = e.target.files[0];

  if (!file) {
    return;
  }
  //Hides chart while new file is being selected
  document.getElementById("chartContainer").style.display = "none";

  if (file.name.toLowerCase().endsWith(".csv")) {
    //Sends file to papaparse
    parseCSV(file);
  } else {
    console.log(`Unsupported file type: ${file.name}`);

    showNotification("Please upload a CSV file.", "error");
  }
}

// CSV Processing
function parseCSV(file) {
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,

    complete: function (results) {
      console.log("CSV RESULTS:", results.data);
      console.log("FIRST ROW:", results.data[0]);

      // Creates an empty array to store valid spending transactions
      let parsed = [];

      // Gets the value from the "Money Out" column.
      results.data.forEach((row) => {
        const moneyOut = row["Money Out"];
        const desc = row["Name"] || "Unknown";

        // Skips empty amounts or income keywords
        const isIncome = incomeKeywords.some((keyword) =>
          desc.toLowerCase().includes(keyword.toLowerCase()),
        );

        if (!moneyOut || moneyOut === "" || isIncome) {
          return;
        }

        //Creates an object to represent the transaction
        parsed.push({
          //Usually CSV Bank Statements have their own id but if not generate a random ID
          id: row["Transaction ID"] || Math.random().toString(),
          //Store transaction Date
          date: row["Date"] || "N/A",
          description: desc,
          amount: Math.abs(parseFloat(moneyOut)),
          category: autoCategorise(desc),
        });
      });

      state.transactions = parsed;
      updateDisplay();

      //Show chart if file contains transactions
      state.transactions = parsed;
      updateDisplay();

      if (parsed.length === 0) {
        showNotification("No transactions found in this file.", "error");
      } else {
        showNotification(
          `${parsed.length} transactions loaded successfully!`,
          "success",
        );
      }

      if (parsed.length === 0) {
        showNotification("No transactions found in this file.", "error");
      } else {
        showNotification(
          `${parsed.length} transactions loaded successfully!`,
          "success",
        );
      }
    },
  });
}

//Displays notification at top-right of the page
function showNotification(message, type) {
  //Notification Container
  const notification = document.getElementById("outcomeNotification");

  //Icon container
  const icon = document.getElementById("notificationIcon");

  //Message container
  const messageText = document.getElementById("notificationMessage");

  messageText.textContent = message;

  if (type === "success") {
    icon.textContent = "✅";
  } else {
    icon.textContent = "❌";
  }

  notification.classList.remove("success", "error");

  notification.classList.add(type);

  notification.classList.add("show");

  //Hides notification after 5 seconds
  setTimeout(() => {
    notification.classList.remove("show");
  }, 5000);
}
//Attemps to categorise based on category description
function autoCategorise(description) {
  const text = description.toLowerCase();

  for (let [category, details] of Object.entries(categoryRules)) {
    if (details.keywords.some((keyword) => text.includes(keyword))) {
      return category;
    }
  }
  // If no keyword matches, the transaction is placed into the Uncategorised category.
  return "Uncategorised";
}

//Allows use to manually edit category

function editCategory(id) {
  const transaction = state.transactions.find(
    (transaction) => transaction.id === id,
  );

  //If transaction number cannot be found. It stops.
  if (!transaction) {
    return;
  }

  //Creates numbered category list
  const categoryList = state.categories
    .map(
      (category, index) =>
        `${index + 1}. ${categoryRules[category].emoji} ${category}`,
    )
    .join("\n");

  // Display the numbered list using a browser prompt.
  const choice = prompt(
    `Choose a category for "${transaction.description}":\n\n${categoryList}`,
  );

  if (choice === null) {
    return;
  }

  const number = parseInt(choice);

  if (number >= 1 && number <= state.categories.length) {
    transaction.category = state.categories[number - 1];

    updateDisplay();

    //Error message for invalid entries
  } else {
    showNotification("Please enter a valid category number.", "error");
  }
}

//Update Table Display
function updateDisplay() {
  const table = document.getElementById("transactionTable");

  const selectedCategory =
    document.getElementById("categoryButton").dataset.category;

  const searchQuery = document
    .getElementById("searchInput")
    .value.toLowerCase();

  // Clear old table
  table.innerHTML = "";

  // Filter transactions
  const filtered = state.transactions
    .filter((transaction) => {
      const matchesCategory =
        selectedCategory === "ALL" || transaction.category === selectedCategory;

      const matchesSearch = transaction.description
        .toLowerCase()
        .includes(searchQuery);

      return matchesCategory && matchesSearch;
    })
    // Sort from latest date to oldest date.
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  let totalSpent = 0;
  if (filtered.length === 0) {
    const row = document.createElement("tr");

    const cell = document.createElement("td");

    cell.colSpan = 4;
    cell.textContent = "No transactions found for this category.";
    cell.style.textAlign = "center";
    cell.style.color = "#6b7a90";
    cell.style.padding = "2rem";

    row.appendChild(cell);
    table.appendChild(row);
  }
  for (let transaction of filtered) {
    totalSpent += transaction.amount;

    //Table Creation

    const row = document.createElement("tr");

    const date = document.createElement("td");

    date.textContent = transaction.date;

    row.appendChild(date);

    const description = document.createElement("td");

    description.textContent = transaction.description;

    row.appendChild(description);

    const category = document.createElement("td");

    const emoji = categoryRules[transaction.category]?.emoji || "❓";

    category.innerHTML = `<span class="badge">
        ${emoji}
        ${transaction.category}
    </span>`;

    category
      .querySelector(".badge")
      .addEventListener("click", () => editCategory(transaction.id));

    row.appendChild(category);

    const amount = document.createElement("td");

    amount.className = "debit";

    amount.textContent = `£${transaction.amount.toFixed(2)}`;

    row.appendChild(amount);

    table.appendChild(row);
  }

  //Summary

  document.getElementById("totalSpent").innerText = `£${totalSpent.toFixed(2)}`;

  document.getElementById("totalCount").innerText = filtered.length;
  updateChart(selectedCategory);
}

function updateChart(selectedCategory) {
  let labels = [];
  let amounts = [];

  if (selectedCategory === "ALL") {
    const totals = {};

    for (let transaction of state.transactions) {
      if (!totals[transaction.category]) {
        totals[transaction.category] = 0;
      }

      totals[transaction.category] += transaction.amount;
    }

    const sortedCategories = Object.entries(totals).sort((a, b) => b[1] - a[1]);

    labels = sortedCategories.map((item) => item[0]);

    amounts = sortedCategories.map((item) => item[1]);
  } else {
    //Get only transactions from the selected category
    const chartTransactions = state.transactions.filter(
      (transaction) => transaction.category === selectedCategory,
    );

    //Combines transactions with the same description
    const totals = {};

    for (let transaction of chartTransactions) {
      const description = transaction.description;

      if (!totals[description]) {
        totals[description] = 0;
      }

      totals[description] += transaction.amount;
    }

    const sortedItems = Object.entries(totals).sort((a, b) => b[1] - a[1]);

    labels = sortedItems.map((item) => item[0]);

    amounts = sortedItems.map((item) => item[1]);
  }

  const ctx = document.getElementById("spendingChart");

  // Remove the previous chart.
  if (spendingChart) {
    spendingChart.destroy();
  }

  // Don't create a chart if there is nothing to show.
  if (labels.length === 0) {
    spendingChart = null;

    document.getElementById("chartContainer").style.display = "none";

    return;
  }

  document.getElementById("chartContainer").style.display = "block";

  spendingChart = new Chart(ctx, {
    type: "bar",

    data: {
      labels: labels,

      datasets: [
        {
          label: "Amount Spent (£)",
          data: amounts,
          backgroundColor: "#fda6eb",
        },
      ],
    },

    options: {
      responsive: true,

      scales: {
        y: {
          beginAtZero: true,

          ticks: {
            callback: function (value) {
              return "£" + value;
            },
          },
        },
      },

      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });
}
