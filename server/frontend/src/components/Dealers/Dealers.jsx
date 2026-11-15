import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import review_icon from "../assets/reviewicon.png"

const Dealers = ({ compact = false }) => {
  const [dealersList, setDealersList] = useState([]);
  const [states, setStates] = useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // let root_url = window.location.origin
  let dealer_url ="/djangoapp/get_dealers";
  
  let dealer_url_by_state = "/djangoapp/get_dealers/";
 
  const filterDealers = async (state) => {
    setLoading(true);
    try {
      const res = await fetch(dealer_url_by_state+encodeURIComponent(state), { method: "GET" });
      const retobj = await res.json();
      if(!res.ok || retobj.status !== 200) throw new Error(retobj.error || "Could not filter dealers.");
      setDealersList(Array.from(retobj.dealers || []));
      setError("");
    } catch (err) {
      setError(err.message || "Could not load dealers.");
    } finally {
      setLoading(false);
    }
  }

  const get_dealers = async ()=>{
    setLoading(true);
    try {
      const res = await fetch(dealer_url, { method: "GET" });
      const retobj = await res.json();
      if(!res.ok || retobj.status !== 200) throw new Error(retobj.error || "Could not load dealers.");
      const all_dealers = Array.from(retobj.dealers || []);
      setStates(Array.from(new Set(all_dealers.map((dealer) => dealer.state).filter(Boolean))).sort());
      setDealersList(all_dealers);
      setError("");
    } catch (err) {
      setError(err.message || "Could not load dealers.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    get_dealers();
  },[]);  


let isLoggedIn = sessionStorage.getItem("username") != null ? true : false;
  return(
  <div className={compact ? "dealers-list dealers-list-compact" : "dealers-list"}>
     <div className="dealers-table-wrap">
      <table className='table dealers-table'>
      <thead>
      <tr>
      <th>ID</th>
      <th>Dealer Name</th>
      <th>City</th>
      <th>Address</th>
      <th>Zip</th>
      <th>
      <select aria-label="Filter dealers by state" name="state" id="state" defaultValue="" onChange={(e) => filterDealers(e.target.value)}>
      <option value="" disabled>Filter by state</option>
      <option value="All">All States</option>
      {states.map(state => (
          <option key={state} value={state}>{state}</option>
      ))}
      </select>        

      </th>
      {isLoggedIn && <th>Review Dealer</th>}
      </tr>
      </thead>
      <tbody>
     {loading ? <tr><td colSpan={isLoggedIn ? 7 : 6} className="dealers-loading">Loading dealerships…</td></tr> : error ? <tr><td colSpan={isLoggedIn ? 7 : 6} className="dealers-empty">{error}</td></tr> : dealersList.length === 0 ? <tr><td colSpan={isLoggedIn ? 7 : 6} className="dealers-empty">No dealerships found for this state.</td></tr> : dealersList.map(dealer => (
        <tr key={dealer.id}>
          <td>{dealer['id']}</td>
          <td><Link to={'/dealer/'+dealer['id']+'/'}>{dealer['full_name']}</Link></td>
          <td>{dealer['city']}</td>
          <td>{dealer['address']}</td>
          <td>{dealer['zip']}</td>
          <td>{dealer['state']}</td>
          {isLoggedIn && <td className="dealer-review-cell"><Link to={`/postreview/${dealer['id']}/`} aria-label={`Review ${dealer.full_name}`}><img src={review_icon} className="review_icon" alt="Post Review"/></Link></td>}
        </tr>
      ))}
      </tbody>
     </table>
     </div>
  </div>
)
}

export default Dealers
