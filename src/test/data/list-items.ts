import { u } from 'msw/lib/glossary-58eca5a8'
import * as booksDB from './books'
const listItemsKey = '__bookshelf_list_items__'
let listItems: Record<booksDB.Book["title"], booksDB.Book> = {}
const persist = () =>
  window.localStorage.setItem(listItemsKey, JSON.stringify(listItems))
const load = () =>
  Object.assign(
    listItems,
    JSON.parse(window.localStorage.getItem(listItemsKey) ?? ""),
  )

// initialize
try {
  load()
} catch (error) {
  persist()
  // ignore json parse error
}

window.__bookshelf = window.__bookshelf || {}
window.__bookshelf.purgeListItems = () => {
  Object.keys(listItems).forEach(key => {
    delete listItems[key as unknown as number]
  })
  persist()
}

interface Error { message: string, status?: number }
async function authorize(userId: any, listItemId: string) {
  const listItem = await read(listItemId)
  if (listItem.ownerId !== userId) {
    const error = new Error('User is not authorized to view that list') as Error
    error.status = 403
    throw error
  }
}

async function create({
  bookId = required('bookId'),
  ownerId = required('ownerId'),
  rating = -1,
  notes = '',
  startDate = Date.now(),
  finishDate = null,
}) {
  const id = hash(`${bookId}${ownerId}`)
  if (listItems[id]) {
    const error = new Error(
      `This user cannot create new list item for that book`,
    ) as Error
    error.status = 400
    throw error
  }
  const book = await booksDB.read(bookId)
  if (!book) {
    const error = new Error(`No book found with the ID of ${bookId}`)
    error.status = 400
    throw error
  }
  listItems[id] = { id, bookId, ownerId, rating, notes, finishDate, startDate }
  persist()
  return read(id)
}

async function read(id: string) {
  validateListItem(id)
  return listItems[id]
}

async function update(id: string | number | readonly string[], updates: string | number | boolean | Record<string, any> | u | null | undefined) {
  validateListItem(id)
  Object.assign(listItems[id], updates)
  persist()
  return read(id)
}

// this would be called `delete` except that's a reserved word in JS :-(
async function remove(id: string | number | readonly string[]) {
  validateListItem(id)
  delete listItems[id]
  persist()
}

async function readMany(userId: any, listItemIds: any[]) {
  return Promise.all(
    listItemIds.map((id: any) => {
      authorize(userId, id)
      return read(id)
    }),
  )
}

async function readByOwner(userId: any) {
  return Object.values(listItems).filter(li => li.ownerId === userId)
}

function validateListItem(id: string | number) {
  load()
  if (!listItems[id]) {
    const error = new Error(`No list item with the id "${id}"`)
    error.status = 404
    throw error
  }
}

function hash(str: string) {
  var hash = 5381,
    i = str.length

  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i)
  }
  return String(hash >>> 0)
}

function required(key: string) {
  const error = new Error(`${key} is required`)
  error.status = 400
  throw error
}

async function reset() {
  listItems = {}
  persist()
}

export { authorize, create, read, update, remove, readMany, readByOwner, reset }
