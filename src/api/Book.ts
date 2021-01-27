import { Category } from '@/api';
import { Attr, HasOne, Model } from 'spraypaint';
import ApplicationRecord from './ApplicationRecord';

@Model()
export default class Book extends ApplicationRecord {

    static jsonapiType = 'books';

    static listHeaders() {
        return [
            {
                text: 'ID',
                value: 'id',
                width: 100,
            },
            {
                text: 'Title',
                value: 'title',
            },
            {
                text: 'Author',
                value: 'author'
            },
            {
                text: 'Category',
                value: 'category.name'
            },
            {
                text: 'Description',
                value: 'description'
            }
        ];
    }

    static async newBook(title: string, author: string, description: string, category: Category, cover = null) {
        const book = new Book({
            title,
            author,
            category,
            description,
            cover
        });
        await book.save({ with: ['category.id'] });
        return book;
    }

    static scopeFactory() {
        return Book.includes(["category"]);
    }

    @Attr() title: string;

    @Attr() author: string;

    @Attr() description: string;

    @Attr() cover: string;

    @HasOne() category: Category;
}
