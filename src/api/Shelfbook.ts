import { Book, Shelf } from '@/api';
import { Attr, HasOne, Model } from 'spraypaint';
import ApplicationRecord from './ApplicationRecord';

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

    static scopeFactory() {
        return Shelfbook.includes(["shelf", "books"]);
    }

    @Attr() name: string;
    @Attr() status: string;
    @HasOne() shelf: Shelf;
    @HasOne() book: Book;
}
