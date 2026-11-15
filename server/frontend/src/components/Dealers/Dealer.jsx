import React, { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import positive_icon from "../assets/positive.png"
import neutral_icon from "../assets/neutral.png"
import negative_icon from "../assets/negative.png"
import review_icon from "../assets/reviewbutton.png"

const Dealer = () => {


  const [dealer, setDealer] = useState({});
  const [reviews, setReviews] = useState([]);
  const [unreviewed, setUnreviewed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const isLoggedIn = Boolean(sessionStorage.getItem("username"));

  let params = useParams();
  let id =params.id;
  let dealer_url = `/djangoapp/dealer/${id}`;
  let reviews_url = `/djangoapp/reviews/dealer/${id}`;
  let post_review = `/postreview/${id}/`;
  
  const get_dealer = async ()=>{
    const res = await fetch(dealer_url, { method: "GET" });
    const retobj = await res.json();
    if(!res.ok || retobj.status !== 200) throw new Error(retobj.error || "Could not load dealership.");
    setDealer((retobj.dealer || [])[0] || {});
  }

  const get_reviews = async ()=>{
    const res = await fetch(reviews_url, { method: "GET" });
    const retobj = await res.json();
    if(!res.ok || retobj.status !== 200) throw new Error(retobj.error || "Could not load reviews.");
    const items = retobj.reviews || [];
    setReviews(items);
    setUnreviewed(items.length === 0);
  }

  const senti_icon = (sentiment)=>{
    let icon = sentiment === "positive"?positive_icon:sentiment==="negative"?negative_icon:neutral_icon;
    return icon;
  }

  useEffect(() => {
    Promise.all([get_dealer(), get_reviews()])
      .catch((err) => setError(err.message || "Could not load dealership information."))
      .finally(() => setLoading(false));
  }, [dealer_url, reviews_url]);


return(
  <main className="site-page dealer-detail-page">
    <section className="dealer-heading">
      <div><p className="eyebrow">Dealership reviews</p><h1>{dealer.full_name || "Dealership"}</h1><p>{[dealer.city, dealer.address, dealer.zip, dealer.state].filter(Boolean).join(" · ")}</p></div>
      {isLoggedIn && <Link className="dealer-review-link" to={post_review}><img src={review_icon} alt="" /> Write a review</Link>}
    </section>
    <section className="reviews-section"><h2>Driver experiences</h2>
      {loading ? <div className="review-empty">Loading dealership reviews…</div> : error ? <div className="review-empty">{error}</div> : unreviewed ? <div className="review-empty">No reviews yet. Be the first to share your experience.</div> :
        <div className="reviews_panel">{reviews.map(review => (
          <article className='review_panel' key={review.id || `${review.name}-${review.review}`}>
            <img src={senti_icon(review.sentiment)} className="emotion_icon" alt={`${review.sentiment || 'neutral'} sentiment`}/>
            <p className='review'>{review.review}</p>
            <div className="reviewer">{[review.name, review.car_make, review.car_model, review.car_year].filter(Boolean).join(" · ")}</div>
          </article>
        ))}</div>}
    </section>
  </main>
)
}

export default Dealer
