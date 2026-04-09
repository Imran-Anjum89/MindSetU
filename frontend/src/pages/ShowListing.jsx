import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function ShowListing() {
    const { id } = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`/api/listings/${id}`)
            .then(response => {
                setListing(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching listing:", err);
                setError("Failed to load listing details");
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!listing) return <div>Listing not found</div>;

    return (
        <div style={{ padding: '2rem' }}>
            <h1>{listing.title}</h1>
            <img src={listing.image.url} alt={listing.title} style={{ maxWidth: '600px', width: '100%', borderRadius: '8px' }} />
            <p>Owned by: {listing.owner ? listing.owner.username : 'Unknown'}</p>
            <p>{listing.description}</p>
            <p>&#8377; {listing.price ? listing.price.toLocaleString("en-IN") : 'N/A'}</p>
            <p>{listing.location}, {listing.country}</p>
            <Link to="/" style={{ textDecoration: 'none', color: 'blue' }}>Back to Listings</Link>
        </div>
    );
}
