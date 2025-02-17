# Items Dashboard Local Project
[Figma design](https://www.figma.com/design/TJC8pHuIZ3eLwg9cLv4iE7/Dashboard-Management?node-id=10-1239&t=QVYwkoAoxtFz5uQP-0)
- This project is separated into front-end and back-end implementations. The front-end code (NextJS) is all organized into dashboard folder and the back-end code (ExpressJS) is organized into server folder. 
- To run this project locally, simply follow the following steps
    - 1. `git clone` this project and cd 
      2. Install the latest LTS version of Node.js using `nvm install --lts` and verify the version using `node -v`
      3. run `npm install` to install the packages inside `package.json` in both `/server` and `/dashboard` folder
      4. In `/dashboard` folder run `vim .env` and add `NEXTAUTH_SECRET=secretvalue` or any random string to replace `secretvalue`
      5. `cd` into `/dashboard` and run `npm run dev` command to start front-end pages, and you should see  **✓ Starting..**. to indicate NextJS is running
      6. `cd` into `/server` and run `npm run dev` command to start the server, you should see Server started successfully message to indicate the server is running
      7. Go to [localhost:3000](http://localhost:3000), you should be able to enter the application
     

- Code Architecture
    - `/dashboard` folder (front-end)
      - `/app`
          - `/api`
            - handles authentication & sessions inside Next.js
          - `/board` (access via extending url by `/board`)
            - `/page.js`
              - the entry point of the item table (basically the board displaying all the items) where we make the API request of fetching all items from database for rendering the client component
          - `/item`
            - `/[id]/page.js` (access via extending url by `/item/{id}`),
              -  the entry point of each item detail page based on dynamic route parameter [id] where we make the API request of fetching item detail (basic information and last 6 action history) from database for rendering the client component. We would also
          - `/register` (access via extending url by `/register`)
            - `/page.js`
              - the entry point for registration page, will redirect to `/board` if the user has already login
      - `/layout.js` where we wrap each component with context provider
      - `/page.js`
        - the entry point of this project, it will take you to the login form if not logged in, otherwise will direct you to /board
      - `/context`
        - managing global state and share data (such as authentication state, font style, storages info, user selector at the top right) across the component tree
      - `/util.js`
        - contains all the helper methods such as get the current timestamp, solution to action mapping
     
    - `/server` (back-end)
      - `/models`
        - data layer contains everything related to data handling, including database models, schemas, and queries.
      - `/routes` contains Express API endpoints that front-end(dashboard) interact with
        - defines RESTful API endpoints (GET, POST, PUT, DELETE)
        - calls functions from services/ instead of handling logic directly
        - does not interact with the database directly (delegates to services).
      - `/services` It acts as a bridge between models (data) and routes (API).
        - implements business logic
        - calls the models layer to fetch or manipulate data
        - keeps routes clean by handling all processing
      - `/server.js`
        - defines an Express server class with middleware setup, dynamically loads routes from `routes/index.js`, and lifecycle methods for starting and stopping the server
      - `/index.js`
        - asynchronously setting up and starting a server while ensuring proper database initialization, then starts the server and listens for requests, and close the server properly if there's a failure
      - `/sqlite.js`
        - create a database connection to dashboard.db and create table for initialization
      - `/util.js`
        - contains all the helper methods such as get the current timestamp etc.
       
- Database
    - `sqlite3` hosted db
    - Tables each table should have 
      - `items`
        - stores general item details.
      - `inventory_history`
          - Tracks inventory changes.
      - `asset_history`
          - records asset movements.
      - `workorder_history`
          - logs work order modifications.
      - `users`
          - stores user authentication details
      - `storages`
          - defines storage locations
  - check out `server/sqlite.js` for the detailed database fields, their types and definition. 
