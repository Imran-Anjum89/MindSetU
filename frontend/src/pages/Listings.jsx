import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Listings() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user, logout } = useContext(AuthContext);

    useEffect(() => {
        axios.get('/api/listings')
            .then(response => {
                setListings(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching listings:", err);
                setError("Failed to load listings");
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="row row-cols-lg-3 row-cols-md-2 row-cols-sm-1 mt-3">
            {listings.map(listing => (
                <Link key={listing._id} to={`/listings/${listing._id}`} className="listing-link">
                    <div className="card col listing-card">
                        <img
                            src={listing.image.url}
                            className="card-img-top"
                            alt={listing.title}
                            style={{ height: "20rem" }}
                        />
                        <div className="card-img-overlay"></div>
                        <div className="card-body">
                            <p className="card-text">
                                <b>{listing.title}</b> <br />
                                &#8377; {listing.price ? listing.price.toLocaleString("en-IN") : 'N/A'} /counselling
                            </p>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
