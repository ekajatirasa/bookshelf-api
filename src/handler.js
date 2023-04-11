const { nanoid } = require("nanoid");
const books = require("./book");

// Handler untuk menambahkan buku baru
const newBookAdditionHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  // Membuat id, finished, insertedAt, dan updatedAt untuk objek buku baru
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  // Membuat objek buku baru
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  // Client tidak melampirkan properti name pada request body
  if (!name) {
    const response = h
      .response({
        status: "fail",
        message: "Gagal menambahkan buku. Mohon isi nama buku",
      })
      .code(400);
    return response;
  }

  // Client melampirkan nilai properti readPage yang lebih besar dari nilai properti pageCount
  if (readPage > pageCount) {
    const response = h
      .response({
        status: "fail",
        message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
      })
      .code(400);
    return response;
  }

  books.push(newBook);

  // Server berhasil menambahkan buku
  const hasSucceeded = books.filter((note) => note.id === id).length > 0;
  if (hasSucceeded) {
    const response = h
      .response({
        status: "success",
        message: "Buku berhasil ditambahkan",
        data: {
          bookId: `${id}`,
        },
      })
      .code(201);
    return response;
  }

  // Server gagal menambahkan buku
  const response = h
    .response({
      status: "error",
      message: "Buku gagal ditambahkan",
    })
    .code(500);
  return response;
};

// Handler untuk menampilkan seluruh buku
const listAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  switch (reading) {
    case "1": {
      const filteredBooks = books.filter((book) => book.reading);

      const response = h
        .response({
          status: "success",
          data: {
            books: filteredBooks.map((book) => ({
              id: book.id,
              name: book.name,
              publisher: book.publisher,
            })),
          },
        })
        .code(200);
      return response;
    }
    case "0": {
      const filteredBooks = books.filter((book) => !book.reading);

      const response = h
        .response({
          status: "success",
          data: {
            books: filteredBooks.map((book) => ({
              id: book.id,
              name: book.name,
              publisher: book.publisher,
            })),
          },
        })
        .code(200);
      return response;
    }
    default:
      break;
  }

  switch (finished) {
    case "1": {
      const filteredBooks = books.filter((book) => book.finished);

      const response = h
        .response({
          status: "success",
          data: {
            books: filteredBooks.map((book) => ({
              id: book.id,
              name: book.name,
              publisher: book.publisher,
            })),
          },
        })
        .code(200);
      return response;
    }
    case "0": {
      const filteredBooks = books.filter((book) => !book.finished);

      const response = h
        .response({
          status: "success",
          data: {
            books: filteredBooks.map((book) => ({
              id: book.id,
              name: book.name,
              publisher: book.publisher,
            })),
          },
        })
        .code(200);
      return response;
    }
    default:
      break;
  }

  if (name) {
    const filteredBooks = books.filter((book) => {
      const nameRegex = new RegExp(name, "gi");
      return nameRegex.test(book.name);
    });

    const response = h
      .response({
        status: "success",
        data: {
          books: filteredBooks.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      })
      .code(200);
    return response;
  }

  const response = h
    .response({
      status: "success",
      data: {
        books: books.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    })
    .code(200);
  return response;
};

// Handler untuk menampilkan detail buku
const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const targetBook = books.filter((b) => b.id === bookId)[0];

  if (targetBook) {
    const response = h
      .response({
        status: "success",
        data: {
          book: targetBook,
        },
      })
      .code(200);
    return response;
  }

  const response = h
    .response({
      status: "fail",
      message: "Buku tidak ditemukan",
    })
    .code(404);
  return response;
};

// Handler untuk mengubah data buku
const updateBookHandler = (request, h) => {
  const { bookId } = request.params;
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  const updatedAt = new Date().toISOString();

  if (!name) {
    const response = h
      .response({
        status: "fail",
        message: "Gagal memperbarui buku. Mohon isi nama buku",
      })
      .code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h
      .response({
        status: "fail",
        message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
      })
      .code(400);
    return response;
  }

  const index = books.findIndex((book) => book.id === bookId);
  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };
    const response = h
      .response({
        status: "success",
        message: "Buku berhasil diperbarui",
      })
      .code(200);
    return response;
  }

  const response = h
    .response({
      status: "fail",
      message: "Gagal memperbarui buku. Id tidak ditemukan",
    })
    .code(404);
  return response;
};

// Handler untuk menghapus buku
const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((book) => book.id === bookId);
  if (index !== -1) {
    books.splice(index, 1);
    const response = h
      .response({
        status: "success",
        message: "Buku berhasil dihapus",
      })
      .code(200);
    return response;
  }

  const response = h
    .response({
      status: "fail",
      message: "Buku gagal dihapus. Id tidak ditemukan",
    })
    .code(404);
  return response;
};

module.exports = {
  newBookAdditionHandler,
  listAllBooksHandler,
  getBookByIdHandler,
  deleteBookByIdHandler,
  updateBookHandler,
};
