import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";


const PostReview = () => {
  const [dealer, setDealer] = useState({});
  const [review, setReview] = useState("");
  const [model, setModel] = useState();
  const [year, setYear] = useState("");
  const [date, setDate] = useState("");
  const [carmodels, setCarmodels] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  let params = useParams();
  let id =params.id;
  let dealer_url = `/djangoapp/dealer/${id}`;
  let review_url = `/djangoapp/add_review`;
  let carmodels_url = `/djangoapp/get_car_makes`;

  const postreview = async (event)=>{
    event.preventDefault();
    let name = sessionStorage.getItem("firstname")+" "+sessionStorage.getItem("lastname");
    //If the first and second name are stores as null, use the username
    if(name.includes("null")) {
      name = sessionStorage.getItem("username");
    }
    if(!model || review === "" || date === "" || year === "" || model === "") {
      setError("Please complete all fields before submitting your review.");
      return;
    }

    let model_split = model.split(" ");
    let make_chosen = model_split[0];
    let model_chosen = model_split[1];

    let jsoninput = JSON.stringify({
      "name": name,
      "dealership": id,
      "review": review,
      "purchase": true,
      "purchase_date": date,
      "car_make": make_chosen,
      "car_model": model_chosen,
      "car_year": year,
    });

    setSubmitting(true);
    setError("");
    try {
    const res = await fetch(review_url, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: jsoninput,
  });

    const json = await res.json();
    if (!res.ok || json.status !== 200) throw new Error(json.error || "Your review could not be submitted.");
    navigate(`/dealer/${id}/`);
    } catch (err) {
      setError(err.message || "Your review could not be submitted. Please try again.");
    } finally {
      setSubmitting(false);
  }

  }
  const get_dealer = async ()=>{
    const res = await fetch(dealer_url, {
      method: "GET"
    });
    const retobj = await res.json();
    
    if(retobj.status === 200) {
      let dealerobjs = Array.from(retobj.dealer)
      if(dealerobjs.length > 0)
        setDealer(dealerobjs[0])
    }
  }

  const get_cars = async ()=>{
    const res = await fetch(carmodels_url, {
      method: "GET"
    });
    const retobj = await res.json();
    
    let carmodelsarr = (retobj.CarMakes || []).flatMap((make) =>
      (make.models || []).map((car) => ({ CarMake: make.name, CarModel: car.name }))
    );
    setCarmodels(carmodelsarr)
  }
  useEffect(() => {
    get_dealer();
    get_cars();
  },[]);


  return (
    <div>
      <main className="site-page review-form-page">
      <section className="page-intro review-page-intro"><p className="eyebrow">Share your experience</p><h1>Write a dealer review</h1><p>Your feedback helps other drivers choose with confidence.</p>{dealer.full_name && <div className="reviewing-dealer"><span className="reviewing-dealer-label">Reviewing</span><strong>{dealer.full_name}</strong></div>}</section>
      <form className="review-form-card" onSubmit={postreview}>
      <div className="review-form-section-heading"><span className="review-step">01</span><div><h2>Your experience</h2><p>Tell us about your visit to the dealership.</p></div></div>
      <label className="review-field" htmlFor="review">Your review <span className="field-required">Required</span><textarea id='review' rows='6' value={review} onChange={(e) => setReview(e.target.value)} placeholder="What went well? What could have been better?" required /></label>
      <div className="review-form-section-heading review-details-heading"><span className="review-step">02</span><div><h2>Purchase details</h2><p>Add a few details about the vehicle you purchased.</p></div></div>
      <div className="review-details-grid">
        <label className='input_field' htmlFor="purchase-date">Purchase date <span className="field-required">Required</span><input id="purchase-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required /></label>
        <label className='input_field' htmlFor="cars">Make and model <span className="field-required">Required</span>
          <select name="cars" id="cars" value={model || ""} onChange={(e) => setModel(e.target.value)} required>
          <option value="" disabled>Choose make and model</option>
          {carmodels.map(carmodel => (
              <option key={`${carmodel.CarMake}-${carmodel.CarModel}`} value={carmodel.CarMake+" "+carmodel.CarModel}>{carmodel.CarMake} {carmodel.CarModel}</option>
          ))}
          </select>
        </label>
        <label className='input_field' htmlFor="car-year">Vehicle year <span className="field-required">Required</span><input id="car-year" type="number" value={year} onChange={(e) => setYear(e.target.value)} max={new Date().getFullYear()} min={1950} placeholder="e.g. 2022" required /></label>
      </div>

      {error && <p className="review-form-error" role="alert">{error}</p>}
      <div className="review-form-actions"><Link className="review-cancel" to={`/dealer/${id}/`}>Cancel</Link><button className='postreview' type="submit" disabled={submitting}>{submitting ? "Submitting…" : "Submit review"}</button></div>
      </form>
      </main>
    </div>
  )
}
export default PostReview
