# 🎀 Personalised University Spending Tracker

A browser-based spending tracker that allows me to upload my bank statement, automatically categorise my spending and visualise where my money is going.

## About the Project

I created this project after working with data and databases during a **Data Driven Systems group project** at university. I wanted to build on what I had learned while combining it with my interests in **web development and finance/FinTech**.

I also wanted more control over how my spending was categorised. The categories used by banking applications did not always match my own spending habits so I decided to create a personalised tracker based around my own university spending and bank CSV data.

## Features

* Upload bank statements as CSV files
* Automatically categorise transactions using keywords
* Manually change transaction categories
* Search transactions by description
* Filter transactions by category
* Calculate total spending and transaction count
* Visualise spending using a bar chart
* Combine transactions from the same merchant
* Sort transactions by date
* Display upload and error notifications
* Process transaction data directly in the browser

## Technologies

* **HTML5** — webpage structure
* **CSS3** — layout and styling
* **JavaScript** — application logic and data processing
* **PapaParse** — CSV parsing
* **Chart.js** — data visualisation
* **Git & GitHub** — version control

## How It Works

When a CSV file is uploaded, the application:

1. Parses the CSV using PapaParse.
2. Filters out income, refunds and transfers.
3. Converts the remaining data into transaction objects.
4. Automatically assigns categories using keyword matching.
5. Displays the transactions in a table.
6. Calculates spending totals.
7. Generates a chart based on the selected category.

The application uses JavaScript arrays and objects to store transaction data and methods such as `.filter()`, `.map()`, `.sort()` and `Object.entries()` to process it.

### Charts

**All Categories** shows total spending by category.

Selecting an individual category shows spending by merchant or transaction description. Transactions with the same description are combined into a single total.

## 📂 Project Structure

```text
├── index.html
├── style.css
├── script.js
└── README.md
```

| File               | Purpose                         |
| ------------------ | ------------------------------- |
| `index.html`       | Structure of the application    |
| `style.css`        | Styling and layout              |
| `script.js`        | Main application logic          |
| `README.md`        | Project documentation           |

## 📄 CSV Format

The application currently works with bank statements containing columns such as:

```text
Date
Transaction ID
Name
Money Out
```

The project was developed around the CSV format of the bank statements I use, so other bank formats may require changes to the code. 

## 🔒 Privacy

Transaction data is processed **client-side in the browser** and is not stored in a backend database.

However, the application does use external resources such as PapaParse, Chart.js and Google Fonts.

## Running the Project

The project can be opened directly in a web browser by opening `index.html`.

Alternatively, the project can be opened in **Visual Studio Code** and run using a local development server such as Live Server.

After opening the application, select:

**Upload Bank Statement (CSV)**

and choose a compatible CSV file. This web application works with all my bank statements but let me know if there is a specific bank statement that doesn't apply to my code.

## What I Learned

This project helped me develop practical experience with:

* JavaScript data processing
* CSV parsing
* DOM manipulation
* Event handling
* Data filtering and sorting
* Data aggregation
* Dynamic data visualisation
* Client-side file handling
* Modular JavaScript
* Git and GitHub

It also allowed me to take concepts from a university group project and apply them independently to a problem relevant to my own life.

## Future Improvements

* PDF parsing
* Budget tracking
* Date-range filtering
* Yearly Report consisting of 12 statements
* Persistent data storage
* CSV export
* Support for additional bank formats
* More advanced transaction categorisation
* Additional spending visualisations

## 👩‍💻🌟 Author

**Lucia B**

