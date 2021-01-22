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

    static async newReview(user: User, content: string, rate: string, book: Book) {
        const review = new Review({
            user,
            content,
            rate,
            book,
        });
        await review.save();
        return review;
    }

    static async delReview(id: string) {
        let { data } = await Review.find(id);
        await data.destroy()
    }

    static scopeFactory() {
        return Review.includes(["book", "user"]);
    }

    @Attr() content: string;

    @Attr() rate: string;

    @HasOne() book: Book;

    @HasOne() user: User;
}
