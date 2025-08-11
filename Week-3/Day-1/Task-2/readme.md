## Week 3 - Day 1 (Task 2 - Task Manager API)

### Task Completed:
- Built a RESTful API using Node.js and Express
- Implemented in-memory CRUD operations for tasks
- Added request data validation (`title` as string, `completed` as boolean)
- Created consistent JSON response structure
- Added error handling middleware
- Integrated Swagger for API documentation
- Tested all endpoints using Postman and exported collection

### Stretch Goals (Optional):
- Used `uuid` for unique task IDs instead of numeric IDs
- Added search functionality:  
  `GET /api/tasks?title=learn` → Filters tasks by title
- Added `/api/stats` endpoint → Shows total, completed, and pending task counts

### API Documentation (Swagger):
- **Docs URL:** http://localhost:3000/api-docs  
- **Includes:**
  - All CRUD endpoints for tasks
  - Request/response examples
- **How to use:**
  1. Run `npm install`
  2. Start server with `npm start`
  3. Open Swagger UI at `http://localhost:3000/api-docs`

### How to Run:
```bash
npm install
npm start
