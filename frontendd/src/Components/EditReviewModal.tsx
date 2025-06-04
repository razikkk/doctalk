import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { editReviewAndRating, postReviewAndRating } from '../utils/auth';
import { Toaster, toast } from 'sonner';

interface ReviewRatingProps {
  onClose: () => void;
  maxLength?: number;
}

export interface IReviewRating{
    userId:string,
    doctorId:string,
    rating:number,
    review:string
}

const EditReviewRating= ({
reviews,onClose
}) => {
  const [rating, setRating] = useState(reviews.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState(reviews.review || '');
  const [error, setError] = useState('');


//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (rating === 0) {
//       setError('Please select a star rating');
//       return;
//     }
    
//     if (review.trim().length < 10) {
//       setError('Please write a review with at least 10 characters');
//       return;
//     }
    
//     onSubmit({ rating, review });
//     setRating(0);
//     setReview('');
//     setError('');
//   };

  const starOptions = [1, 2, 3, 4, 5];
  
  const getStarLabel = (rating: number) => {
    switch (rating) {
      case 1: return 'Poor';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Great';
      case 5: return 'Excellent';
      default: return 'Select a rating';
    }
  };

  const handleEditReviewRating = async(e)=>{
    e.preventDefault()

    if(!review || review.length <10 ){
        setError('Review must be 10 characters long')
        return
    }
    if(rating === 0){
        setError('Please select a rating')
        return
    }
    try {
        const response = await editReviewAndRating(reviews._id,review,rating)
        console.log(response,'ddd')
        if(response.success){
            setTimeout(()=>{
                onClose()
            },2000)
            toast.success('Your review has been updated')
        }
    } catch (error:any) {
        console.log(error.message)
    }
  }


  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <Toaster/>
      <form>
        <div className="mb-5">
          <label className="block mb-2 font-medium text-gray-700">
            Your Rating
          </label>
          <div className="flex flex-col items-center">
            <div className="flex gap-1 mb-2">
              {starOptions.map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => {
                    setRating(star);
                    setError('');
                  }}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#157B7B] focus:ring-offset-2 rounded-full p-1"
                  aria-label={`Rate ${star} out of 5 stars`}
                >
                  <Star
                    size={28}
                    className={`transition-all duration-200 ${
                      (hoverRating || rating) >= star
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-none text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm font-medium text-gray-600">
              {getStarLabel(hoverRating || rating)}
            </p>
          </div>
        </div>
        
        <div className="mb-5">
          <label htmlFor="review" className="block mb-2 font-medium text-gray-700">
            Your Review
          </label>
          <textarea
            id="review"
            value={review}
            onChange={(e)=>{
                setReview(e.target.value)
                if(e.target.value.trim().length>=10){
                    setError('')
                }
            }}
            placeholder="What did you like or dislike?"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#157B7B] focus:border-[#157B7B] transition-colors"
            rows={4}
            
          />
          <div className="flex justify-between mt-1 text-sm">
            <span className="text-gray-500">
              Min 10 characters
            </span>
            {/* <span className={`${review.length >= maxLength * 0.8 ? 'text-amber-600' : 'text-gray-500'}`}>
              {review.length}/{maxLength}
            </span> */}
          </div>
        </div>
        
        {error && (
          <div className="mb-4 p-3  text-red-500 rounded-md">
            {error}
          </div>
        )}
        
        <button
          type="submit"
          className="w-full py-2 px-4 bg-[#157B7B] text-white rounded-md hover:bg-[#106767] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#157B7B] transition-colors"
          onClick={handleEditReviewRating}
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default EditReviewRating;