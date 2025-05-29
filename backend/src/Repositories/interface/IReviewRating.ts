import { IReviewRating } from "../../Models/RevieRating";
import { IReviewRatingInput } from "../../type/type";

export interface IReviewRatingRepository{
    postReviewAndRating(data:IReviewRatingInput):Promise<IReviewRating | null>
    fetchReviewPerDoctor(doctorId:string):Promise<IReviewRating[]>
}