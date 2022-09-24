import booksData from './books-data.json'
import { matchSorter } from 'match-sorter'
export type Book = { title: string; author: string; coverImageUrl: string; id: string; pageCount: number; publisher: string; synopsis: string } | { title: number; author: string; coverImageUrl: string; id: string; pageCount: number; publisher: string; synopsis: string }
let books = [...booksData]

async function create(book: Book) {
  books.push(book)
  return book
}

async function read(bookId: string | readonly string[]) {
  return books.find(book => book.id === bookId)
}

async function readManyNotInList(ids: string | any[]) {
  return books.filter(book => !ids.includes(book.id))
}

async function query(search: string) {
  return matchSorter(books, search, {
    keys: [
      'title',
      'author',
      'publisher',
      { threshold: matchSorter.rankings.CONTAINS, key: 'synopsis' },
    ],
  })
}

async function reset() {
  books = [...booksData]
}

export { create, query, read, readManyNotInList, reset }
