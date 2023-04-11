const { newBookAdditionHandler, listAllBooksHandler, getBookByIdHandler, deleteBookByIdHandler, updateBookHandler } = require("./handler");

const routes = [
  {
    method: "POST",
    path: "/books",
    handler: newBookAdditionHandler,
  },
  {
    method: "GET",
    path: "/books",
    handler: listAllBooksHandler,
  },
  {
    method: "GET",
    path: "/books/{bookId}",
    handler: getBookByIdHandler,
  },
  {
    method: "PUT",
    path: "/books/{bookId}",
    handler: updateBookHandler,
  },
  {
    method: "DELETE",
    path: "/books/{bookId}",
    handler: deleteBookByIdHandler,
  },
];

module.exports = routes;
