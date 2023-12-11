const db = require("../db");
const Book = require("../models/book");
const jsonschema = require("jsonschema");
const bookSchema = require("../schemas/bookSchema.json");

describe("Test Book class", function () {
  beforeEach(async function () {
    await db.query("DELETE FROM books");
    let book1 = await Book.create({
      isbn: "0553103547",
      amazon_url:
        "https://www.amazon.com/Game-Thrones-Song-Fire-Book/dp/0553593714",
      author: "George R. R. Martin",
      language: "English",
      pages: 864,
      publisher: "Harper Voyager",
      title: "A Song of Ice and Fire",
      year: 1996,
    });
    let book2 = await Book.create({
      isbn: "0747532699",
      amazon_url:
        "https://www.amazon.com/Harry-Potter-Philosophers-Stone-Rowling/dp/1408855658",
      author: "J.K Rowling",
      language: "English",
      pages: 223,
      publisher: "Bloomsbury",
      title: "Harry Potter and the Philosopher's Stone",
      year: 1997,
    });
  });

  test("Can get all", async function () {
    let books = await Book.findAll();
    expect({books}).toEqual({
      "books": [
        {
          isbn: "0553103547",
          amazon_url:
            "https://www.amazon.com/Game-Thrones-Song-Fire-Book/dp/0553593714",
          author: "George R. R. Martin",
          language: "English",
          pages: 864,
          publisher: "Harper Voyager",
          title: "A Song of Ice and Fire",
          year: 1996,
        },
        {
          isbn: "0747532699",
          amazon_url:
            "https://www.amazon.com/Harry-Potter-Philosophers-Stone-Rowling/dp/1408855658",
          author: "J.K Rowling",
          language: "English",
          pages: 223,
          publisher: "Bloomsbury",
          title: "Harry Potter and the Philosopher's Stone",
          year: 1997,
        },
      ],
    });
  });

  test("Can get one", async function () {
    let book = await Book.findOne("0553103547");
    expect({book}).toEqual({
        "book": {
            "isbn": "0553103547",
            "amazon_url": "https://www.amazon.com/Game-Thrones-Song-Fire-Book/dp/0553593714",
            "author": "George R. R. Martin",
            "language": "English",
            "pages": 864,
            "publisher": "Harper Voyager",
            "title": "A Song of Ice and Fire",
            "year": 1996
        }
    });
  });

  test("Create book", async function () {
    let params = {
        "isbn" : "0385292163",
	    "amazon_url": "https://www.amazon.com/Art-War-Sun-Tzu/dp/1590302257",
	    "author": "Sun Tzu",
	    "language": "English",
	    "pages": 68,
	    "publisher": "Filiquarian",
	    "title": "The Art of War",
	    "year": 1910
    }
    const result = jsonschema.validate(params, bookSchema)
    if (!result.valid) {
        const errors = result.errors.map(e => e.stack);
        const err = new ExpressError(errors, 400);
    }
    const book = await Book.create(params);
    expect({book}).toEqual({
        "book": params
    })
  })

  test("Edit book", async function (){
    /// edit "pages"
        let testBook = {
            "isbn": "0553103547",
            "amazon_url": "https://www.amazon.com/Game-Thrones-Song-Fire-Book/dp/0553593714",
            "author": "George R. R. Martin",
            "language": "English",
            "pages": 10000,
            "publisher": "Harper Voyager",
            "title": "A Song of Ice and Fire",
            "year": 1996
        }
    const result = jsonschema.validate(testBook, bookSchema);
    if (!result.valid) {
        const errors = result.errors.map(e => e.stack);
        const err = new ExpressError(errors, 400);
    }
    const book = await Book.update("0553103547", testBook);
    expect({book}).toEqual({
        "book": testBook
    })
  })

  test("Remove book", async function(){
    const book = await Book.remove("0553103547");
    expect({book}).toEqual({
        book: undefined
    })
  })

});

afterAll(async function () {
  await db.end();
});
