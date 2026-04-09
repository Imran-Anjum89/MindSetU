import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer>
            <div className="footer-resources">
                <h4 className="footer-heading">Resources</h4>
                <p className="footer-tagline">
                    Helpful articles, videos, and mental-health tips for you.
                </p>

                <div className="resources-grid">
                    <div className="resource-card">
                        <img src="/images/image.png" alt="Mindfulness" className="resource-img" />
                        <h5>Mindfulness Guide</h5>
                        <a href="https://www.webmd.com/depression/what-to-know-about-depression-in-college-students" target="_blank" rel="noreferrer">Read Article</a>
                    </div>

                    <div className="resource-card">
                        <video className="resource-video" autoPlay muted controls poster="/images/video-thumb.jpg">
                            <source src="/images/motivational-video.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        <h5>Relaxation Tips</h5>
                    </div>

                    <div className="resource-card">
                        <img src="/images/support.png" alt="Support Groups" className="resource-img" />
                        <h5>Find Support Groups</h5>
                        <a href="https://example.com/support" target="_blank" rel="noreferrer">Learn More</a>
                    </div>
                </div>
            </div>
            <br /><br />

            <div className="f-info">
                <div className="f-info-socials">
                    <a href="https://www.instagram.com/mindsetu.limuq?utm_source=qr&igsh=emdwYXExeWE3aTFl" target="_blank" rel="noreferrer"><i className="fa-brands fa-instagram"></i></a>
                    <i className="fa-brands fa-facebook"></i>
                    <i className="fa-brands fa-linkedin"></i>
                    <i className="fa-brands fa-facebook-messenger"></i>
                </div>

                <div className="f-info-brand">&copy; MindsetU Private Limited</div>

                <div className="f-info-links">
                    <Link to="/privacy">Privacy</Link>
                    <Link to="/terms">Terms</Link>
                </div>
            </div>
        </footer>
    );
}
