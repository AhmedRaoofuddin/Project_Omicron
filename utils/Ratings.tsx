import React from "react";
import { RatingStars } from "@/components/ui/rating-stars";

type Props = {
  rating: number;
};

const Ratings = ({ rating }: Props) => {
  return <RatingStars rating={rating} size={16} />;
};

export default Ratings;
