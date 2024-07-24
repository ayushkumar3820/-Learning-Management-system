import mongoose, { Document, Schema, Model } from "mongoose";

export interface IOrder extends Document {
    courseId: string;
    userId: string;
    payment_info: string;
}

const orderSchema = new Schema<IOrder>({
    courseId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    payment_info: {
        type: String,
    },
}, { timestamps: true });

const OrderModel: Model<IOrder> = mongoose.model<IOrder>("Order", orderSchema);
export default OrderModel;
