## API Endpoints

#### Auctions

- `POST /auctions`: Create a new auction
- `GET /auctions`: Get all auctions
- `GET /auctions/:id`: Get an auction by ID
- `PUT /auctions/:id`: Update an auction by ID
- `DELETE /auctions/:id`: Delete an auction by ID

#### Authentication

- `POST /auth/signup`: Create a new user
- `POST /auth/login`: Authenticate a user and return a JWT

#### Bid

- `POST /bids`: Create a new bid
- `GET /bids`: Get all bids
- `GET /bids/:id`: Get a bid by ID
- `PUT /bids/:id`: Update a bid by ID
- `DELETE /bids/:id`: Delete a bid by ID

#### Cars

- `POST /cars`: Create a new car
- `GET /cars`: Get all cars
- `GET /cars/:id`: Get a car by ID
- `PATCH /cars/:id`: Update a car by ID
- `DELETE /cars/:id`: Delete a car by ID

#### Categories

- `POST /categories`: Create a new category
- `GET /categories`: Get all categories
- `GET /categories/:id`: Get a category by ID
- `PUT /categories/:id`: Update a category by ID
- `DELETE /categories/:id`: Delete a category by ID

#### Payments

- `POST /payments`: Create a new payment
- `GET /payments`: Get all payments
- `GET /payments/user/:userId`: Get payments by user ID
- `PATCH /payments/:id/status`: Update a payment status by ID

#### Users

- `GET /users`: Get all users
- `GET /users/:id`: Get a user by ID
- `PUT /users/:id`: Update a user by ID
- `DELETE /users/:id`: Delete a user by ID

#### Wishlist

- `POST /wishlist`: Add a car to the user's wishlist
- `GET /wishlist/user/:userId`: Get the user's wishlist
- `DELETE /wishlist/:id`: Remove a car from the user's wishlist
- `GET /wishlist`: Get all wishlists
