import { Book, User } from '@/api';
import { Attr, HasOne, Model } from 'spraypaint';
import ApplicationRecord from './ApplicationRecord';

@Model()
export default class Review extends ApplicationRecord {

    static jsonapiType = 'reviews';

    static listHeaders() {
        return [
            {
                text: 'ID',
                value: 'id',
                width: 100,
            },
            {
                text: 'Book',
                value: 'book.title',
            },
            {
                text: 'Content',
                value: 'content',
            },
            {
                text: 'Rate',
                value: 'rate',
            },
            {
                text: 'User',
                value: 'user.id'
            },
        ];
    }

    static async newReview(content: string, rate: string, book: Book) {
        const review = new Review({
            content,
            rate,
            book,
        });
        await review.save({ with: ['book.id'] });
        return review;
    }

    static scopeFactory() {
        return Review.includes(["book", "user"]);
    }

    @Attr() content: string;

    @Attr() rate: string;

    @HasOne() book: Book;

    @HasOne() user: User;
}
