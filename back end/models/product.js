import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import { APP_URL } from '../config';

const productSchema = new Schema(
    {
        title: { type: String, required: true },
        userId: {type: mongoose.Types.ObjectId, required: true},
        desc: { type: String, required: true },
        age: { type: Number, required: true },
        price: { type: Number, required: true },
        phone: {type: Number, required: true},
        image: {
            type: String,
            required: true,
            get: (image) => {
                // http://localhost:5000/uploads/1616443169266-52350494.png
                // if (process.env.ON_HEROKU == 'true') {
                //     return `${image}`;
                // }
                return `${image}`;
            },
        },
    },
    { timestamps: true, toJSON: { getters: true }, id: false }
);

export default mongoose.model('Product', productSchema, 'products');