
![Logo](https://i.ibb.co/5ByYsKq/gambar.png)

## **About**
Node.js, a server-side JavaScript runtime, empowers developers to execute JavaScript on servers, ensuring high-performance and scalable applications. Paired with Express.js, a flexible web application framework, building APIs becomes streamlined. Express.js simplifies the development process with middleware support for HTTP request handling, a robust routing system for defining endpoints, and easy integration with various modules. The synergy of Node.js and Express.js allows developers to create efficient APIs, handling asynchronous tasks seamlessly and facilitating the integration of databases and other services. The combination offers a versatile and dynamic solution for crafting modern web APIs, making it a preferred choice for developers seeking agility and performance in their server-side applications.

## **Using this Api**
To leverage the capabilities of this API, developers can follow a straightforward process. Begin by reviewing the API documentation, which provides comprehensive insights into available endpoints, request/response formats, and any required authentication. Next, obtain the necessary API key or authentication credentials to access protected resources. With the API key in hand, integrate the API into your application by making HTTP requests to the specified endpoints. Pay attention to response codes and data formats to ensure seamless communication with the API. Implement error handling mechanisms to gracefully manage unexpected scenarios. Regularly check for updates or version changes in the API documentation to stay informed about new features or improvements. By adhering to these steps and guidelines, developers can effectively harness the functionality offered by this API within their applications.
#### Prerequisites
* Git
* [Node.js](https://nodejs.org/en/) (14.x) - [Download](https://nodejs.org/en/)
* [MySql XAMPP](https://www.apachefriends.org/download.html)
* Some plugins may have additional requirements.


#### Installation
1. Git Clone https://github.com/IzaHaiL/node-express-api.git
2. Create Database in your mysql/phpmyadmin
4. Configure the `config.json` 
3.  `npm install`
4. `npx sequelize-cli db:migrate`
5. `npx sequelize-cli db:seed:all`
6. Start  by running `npm start` in your terminal.




## API Documentation - User Management

| Name            | Endpoint         | Description                                      | Parameters                                           | Response                                            |
| --------------- | ---------------- | ------------------------------------------------ | ---------------------------------------------------- | ---------------------------------------------------- |
| Sign In         | **/user/sign**   | Authenticate and obtain a bearer token.           | `username (string, required)`, `password (string, required)` | `200 OK`, with a bearer token for authorized access |
| Sign Up         | **/user/signup** | Create a new user.                                | `usernames (string, required)`, `email (string, required)`, `password (string, required)` | `201 Created`, with a success message and user details |
| Sign Out        | **/user/signout**| Invalidate the current bearer token for sign-out. | `Authorization (string)`                            | `200 OK`, with a success message                      |
| Get All Users   | **/user**         | Retrieve a list of all users.                    | `Authorization (string)`                            | `200 OK`, with an array of user objects             |
| Get User Detail | **/:id**          | Retrieve details of a specific user.             | `Authorization (string)`, `id (string)`              | `200 OK`, with the requested user's details         |
| Update User     | **/user/:id**     | Update information for a specific user.          | `Authorization (string)`, `id (string)`, `Other fields (various)` | `200 OK`, with the updated user's details            |
| Delete User     | **/user/:id**     | Delete a specific user from the system.          | `Authorization (string)`, `id (string)`              | `204 No Content`                                     |

## Description

- The **Sign Up** endpoint creates a new user. The `usernames`, `email`, and `password` parameters are all required.

- The **Sign In** endpoint allows existing users to authenticate and obtain a bearer token. The `username` and `password` parameters are both required.

- The **Sign Out** endpoint invalidates the current bearer token, providing a secure sign-out mechanism. The `Authorization` parameter is required.

- The **Get All Users** endpoint retrieves a list of all users in the system. The `Authorization` parameter is required.

- The **Get User Detail** endpoint retrieves details of a specific user. The `Authorization` parameter is required, and the `id` parameter specifies the ID of the user to retrieve details for.

- The **Update User** endpoint updates information for a specific user. The `Authorization` parameter is required, and the `id` parameter specifies the ID of the user to update. Other fields can be updated by specifying them in the `Other fields` parameter.

- The **Delete User** endpoint deletes a specific user from the system. The `Authorization` parameter is required, and the `id` parameter specifies the ID of the user to delete.

## Parameters

| Parameter        | Type      | Description                                               |
| ---------------- | --------- | --------------------------------------------------------- |
| `Authorization`  | `string`  | **Required.** Bearer token obtained during sign-in.        |
| `id`             | `string`  | **Required.** User ID for detail retrieval or deletion.    |
| `Other fields`  | `various` | **Optional.** Other fields to be updated (usernames, email, password, etc.).

## Response Codes

| Code             | Description                    |
| ---------------- | ------------------------------ |
| `200 OK`         | Success                        |
| `201 Created`    | Resource created successfully  |
| `204 No Content` | Success with no content         |
| `401 Unauthorized` | Invalid token                 |
| `404 Not Found`  | Invalid user ID                |
| `400 Bad Request` | Invalid update data            |
