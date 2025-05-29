import mongoose, { Document, ObjectId, Schema, model } from "mongoose";

export interface IReviewRating extends Document{
    _id:ObjectId,
    userId:ObjectId,
    doctorId:ObjectId,
    rating:number,
    review:string,
    createdAt:Date,
    updatedAt:Date
}

export const reviewRatingSchema = new Schema<IReviewRating>(
    {
        userId:{type:mongoose.Types.ObjectId,ref:'User'},
        doctorId:{type:mongoose.Types.ObjectId,ref:'Doctor'},
        rating:{type:Number},
        review:{type:String}
    },
    {timestamps:true}
)

export const ReviewRating = model<IReviewRating>("ReviewRating",reviewRatingSchema)