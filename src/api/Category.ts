import { Attr, Model } from 'spraypaint';
import ApplicationRecord from './ApplicationRecord';

@Model()
export default class Category extends ApplicationRecord {

    static jsonapiType = 'categories';

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
            }
        ];
    }

    static scopeFactory() {
        return Category.includes([]);
    }

    @Attr() name: string;
}
