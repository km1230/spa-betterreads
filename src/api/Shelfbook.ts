import { Book, Shelf, User } from '@/api';
import { Attr, BelongsTo, HasOne, Model } from 'spraypaint';
import ApplicationRecord from './ApplicationRecord';
import Shelf from './Shelf';

@Model()
export default class Shelfbook extends ApplicationRecord {

    static jsonapiType = 'shelfbooks';

    static listHeaders() {
        return [
            {
                text: 'ID',
                value: 'id',
                width: 100,
            },
            {
                text: 'Book',
                value: 'book.title'
            },
            {
                text: 'Shelf',
                value: 'shelf.name',
            },
            {
                text: 'Status',
                value: 'status'
            }
        ];
    }

    static async newShelfbook(shelf: Shelf, book: Book, userId: string) {
        const shelfbook = new Shelfbook({
            shelf,
            book,
        });
        if(shelf.user.id === userId) await shelfbook.save({with: ["shelf.id", "book.id"]});
        return shelfbook;
    }

    static async delShelfBook(id: string) {
        let { data } = await Shelfbook.find(id);
        await data.destroy()
    }

    static scopeFactory() {
        return Shelfbook.includes(["shelf", "book"]);
    }

    @Attr() status: string;
    @HasOne() shelf: Shelf;
    @HasOne() book: Book;
}
