import { Book, User } from '@/api';
import { Attr, HasMany, HasOne, Model } from 'spraypaint';
import ApplicationRecord from './ApplicationRecord';

@Model()
export default class Shelf extends ApplicationRecord {

    static jsonapiType = 'shelves';

    static listHeaders() {
        return [
            {
                text: 'ID',
                value: 'id',
                width: 100,
            },
            {
                text: 'Name',
                value: 'name',
            },
            {
                text: 'User',
                value: 'user.email'
            },
            {
                text: 'Books',
                value: 'books.length'
            }
        ];
    }

    static scopeFactory() {
        return Shelf.includes(["books", "user"]);
    }

    @Attr() name: string;
    @Attr() public: Boolean;
    @HasMany() books: Book;
    @HasOne() user: User;
}
