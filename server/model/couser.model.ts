import mongoose, { Schema, Document, Model } from "mongoose";
import { IUser } from "./user.model";

// Define the interfaces
interface IComment extends Document {
    user: IUser;
    question: string;
    questionReplies: IComment[];
}

interface IReview extends Document {
    user: IUser;
    comment: string;
    rating: number;
    commentReplies: IComment[];
}

interface ILink extends Document {
    title: string;
    url: string;
}

interface ICourserData extends Document {
    title: string;
    description: string;
    videoUrl: string;
    videoThumbnail: string;
    videoSection: string;
    videoLength: string;
    links: ILink[];
    suggestion: string;
    questions: IComment[];
}

interface ICourser extends Document {
    name: string;
    description?: string;
    price: number;
    estimatedPrice?: number;
    thumbnail: {
        public_id: string;
        url: string;
    };
    tags: string;
    level: string;
    demoUrl: string;
    benefits: { title: string }[];
    prerequisites: { title: string }[];
    reviews: IReview[];
    courserData: ICourserData[];
    rating?: number;
    purchased?: number;
}

// Define the schemas
const commentSchema = new Schema<IComment>({
    user: Object,
    question: String,
    questionReplies: [Object]
});

const reviewSchema = new Schema<IReview>({
    user: Object,
    comment: String,
    rating: {
        type: Number,
        default: 0
    },
    commentReplies: [commentSchema]
});

const linkSchema = new Schema<ILink>({
    title: String,
    url: String
});

const courserDataSchema = new Schema<ICourserData>({
    title: String,
    description: String,
    videoUrl: String,
    // videoThumbnail: String,
    videoSection: String,
    videoLength: String,
    links: [linkSchema],
    suggestion: String,
    questions: [commentSchema]
});

const courserSchema = new Schema<ICourser>({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    estimatedPrice: Number,
    thumbnail: {
        public_id: {
            type: String,
           
        },
        url: {
            type: String,
           
        }
    },
    tags: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true
    },
    demoUrl: {
        type: String,
        required: true
    },
    benefits: [{ title: String }],
    prerequisites: [{ title: String }],
    reviews: [reviewSchema],
    courserData: [courserDataSchema],
    rating: {
        type: Number,
        default: 0
    },
    purchased: {
        type: Number,
        default: 0
    }
});

const CourserModel: Model<ICourser> = mongoose.model("course", courserSchema);

export default CourserModel;
