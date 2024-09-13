# Data Query Editor

**Data Query Editor** is a lightweight SQL-like Query Editor web application that allows users to input SQL queries to interact with a mock database. This tool is designed to help users execute simple SQL queries such as `SELECT` on a predefined in-memory dataset and see the results in real-time.

## Features

- Execute SQL-like `SELECT` queries.
- Simple, user-friendly interface to run queries and view results.
- Mock data to simulate a real database environment.

## Additional Enhancements
- Added support for Alias `AS` Operator.

## Technologies Used

- **JavaScript** (for the query engine and logic)
- **HTML/CSS** (for the user interface)
- **npm** (for managing dependencies)

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: [Download here](https://nodejs.org/)
- **npm**: It comes with Node.js installation.

### Steps to Run the Server

1. Clone the repository:

    ```bash
    git clone hhttps://github.com/emohankrishna/data-query-editor.git
    ```

2. Navigate to the project directory:

    ```bash
    cd data-query-editor
    ```

3. Install the necessary dependencies:

    ```bash
    npm install
    ```

4. Start the development server:

    ```bash
    npm run dev
    ```

5. Open your browser and navigate to `SELECT * FROM users` to use the application.

## How to Use

1. Enter a valid SQL-like query in the input field. 
   - Example: `SELECT * FROM users` or `SELECT id, name, email FROM users`.
2. Click the "Run Query" button.
3. The result will be displayed in the results section below the query editor.

## Future Enhancements

- Support for more complex SQL operations like `WHERE`, `ORDER By`, `JOIN`, `GROUP BY`, and `HAVING`.
- Support for multiple datasets (mock databases).
- Enhance the query parser to handle more advanced SQL syntax.
