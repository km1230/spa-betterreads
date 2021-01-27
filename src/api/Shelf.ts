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

    static async newShelf(name: string, user: User) {
        let shelf = new Shelf({ name, user })
        await shelf.save();
        return shelf;
    }

    static async delShelf(id: string) {
        let { data } = await Shelf.find(id);
        await data.destroy()
    }

    static scopeFactory() {
        return Shelf.includes(["books", "user"]);
    }


    @Attr() name: string;
    @Attr() public: Boolean;
    @HasMany() books: Book[];
    @HasOne() user: User;
}
