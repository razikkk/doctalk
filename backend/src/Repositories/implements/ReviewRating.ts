import { IReviewRating, ReviewRating} from "../../Models/RevieRating";
import { IReviewRatingInput } from "../../type/type";
import { IReviewRatingRepository } from "../interface/IReviewRating";

export class RevieRatingRepository implements IReviewRatingRepository{
    async postReviewAndRating(data: IReviewRatingInput): Promise<IReviewRating | null> {
        const review = new ReviewRating(data)
        return await review.save()
    }
    async fetchReviewPerDoctor(doctorId: string): Promise<IReviewRating[]> {
        return await ReviewRating.find({doctorId:doctorId}).populate('userId')
    }
    async editReviewAndRating(reviewId: string,review:string,rating:number): Promise<IReviewRating | null> {
        return await ReviewRating.findByIdAndUpdate(reviewId,{review,rating},{new:true})
    }
}