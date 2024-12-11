// import React from 'react'
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import './css/Service.css'; // Ensure you import your CSS file
import { useNavigate } from 'react-router-dom';
const Service = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Navbar />
      <div style={{ paddingTop: '60px' }}></div>
      <section className="py-3 py-md-5 py-xl-8 mt-11">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-12 col-md-12">
              <h1 ><span>-</span>Service<span>-</span></h1>
              <p  >
                Breaking barriers with seamless sign language translation. Empowering communication for everyone, everywhere.
              </p>
              <button type="button" className="btn btn-lg btn-primary mb-3 mb-md-4 mb-xl-5" onClick={() => {
                navigate('/signup');
              }}>Join Us</button>
            </div>
          </div>

          <div className="container" >
            <div className="row gy-3 gy-md-4 gy-lg-0" >
              <div className="col-12 col-lg-6" >
                <div className="card bg-light p-3 m-0" >
                  <div className="row gy-3 gy-md-0 align-items-md-center" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div className="col-md-5">
                      <img
                        src="https://tse4.mm.bing.net/th?id=OIP.okYnQt5buVgFLc_mpy92qAHaE7&pid=Api&P=0&h=180"
                        className="img-fluid rounded-start card-img"
                        alt="Why Choose Us?"
                      />
                    </div>
                    <div className="col-md-7">
                      <div className="card-body p-0">
                        <h2 className="card-title h4 mb-3">Why Choose Us?</h2>
                        <p className="card-text lead">
                          Bridging the gap between sign language and spoken communication, our app empowers inclusivity by translating gestures into words effortlessly.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-6">
                <div className="card bg-light p-3 m-0">
                  <div className="row gy-3 gy-md-0 align-items-md-center" style={{ height: '100%', display: 'flex', justifyContent: 'center' }}>
                    <div className="col-md-5">
                      <img
                        src="https://tse4.mm.bing.net/th?id=OIP.fQPWsgLBnGZGWdaMkCZIEQHaE_&pid=Api&P=0&h=180"
                        className="img-fluid rounded-start card-img"
                        alt="Visionary Team"
                      />
                    </div>
                    <div className="col-md-7">
                      <div className="card-body p-0">
                        <h2 className="card-title h4 mb-3">Visionary Team</h2>
                        <p className="card-text lead">
                          Driven by innovation and a passion for inclusivity, our visionary team is dedicated to transforming communication for the better.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="py-3 py-md-5 py-xl-8">
        <div className="container our-journey">
          <div className="d-flex justify-content-center align-items-center">
            <div className="row w-100 pt-5">
              <div className="col-12 col-md-10 col-lg-8 mx-auto text-center">
                <h2 className="display-6 mb-3 pt-5">
                  Our journey began with a dream of redefining how the world perceives design.
                </h2>
                <button type="button" className="btn btn-lg btn-primary mb-3 mb-md-4 mb-xl-5">Discover More</button>
              </div>
            </div>
          </div>
        </div>

        <div className="container overflow-hidden mt-5">
          <div className="row justify-content-center text-center">
            <div className="col-12 col-md-12">
              <h1 data-aos="slide-up"><span>-</span>Our Vision<span>-</span></h1>
            </div>
          </div>
          <div className="row gy-4 gy-lg-0">
            <div className="col-12 col-lg-6">
              <article>
                <div className="card border-0">
                  <img
                    data-aos="zoom-in-up"
                    className="card-img-top img-fluid m-0"
                    loading="lazy"
                    src="https://cdn.pixabay.com/photo/2020/02/24/15/52/board-4876630_1280.jpg"
                    alt="Our Vision"
                  />
                  <div className="card-body border bg-white p-4">
                    <div className="entry-header mb-3">
                      <h2 className="card-title entry-title h4 mb-0">
                        <a className="link-dark text-decoration-none" href="#!">Our Vision</a>
                      </h2>
                    </div>
                    <p data-aos="zoom-in-down" className="card-text entry-summary text-secondary mb-3">
                      From sleek modernism to timeless elegance, we infuse every creation with a touch of our artistic ingenuity. As a design agency, great design can shape perceptions, inspire action, and leave an indelible mark on the world.
                    </p>
                  </div>
                </div>
              </article>
            </div>
            <div className="col-12 col-lg-6">
              <article>
                <div className="card border-0">
                  <img
                    data-aos="zoom-in-up"
                    className="card-img-top img-fluid m-0"
                    loading="lazy"
                    src="https://cdn.pixabay.com/photo/2020/06/15/16/53/hands-5302566_1280.jpg"
                    alt="Our Approach"
                  />
                  <div className="card-body border bg-white p-4">
                    <div className="entry-header mb-3">
                      <h2 className="card-title entry-title h4 mb-0">
                        <a className="link-dark text-decoration-none" href="#!">Our Approach</a>
                      </h2>
                    </div>
                    <p data-aos="zoom-in-down" className="card-text entry-summary text-secondary mb-3">
                      Welcome to our design agency, where creativity knows no bounds and innovation takes center stage. We are a team of dedicated designers, strategists, and visionaries with a passion for transforming ideas into captivating visuals.
                    </p>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
      <Footer />
      <div className="service-page">
        <header className="service-header">
          <h1>Indian Sign Language Services</h1>
          <p>Your bridge to inclusive communication with the Indian Sign Language.</p>
        </header>

        <section className="introduction-section">
          <h2>Why Choose Our Services?</h2>
          <p>
            We aim to empower millions by breaking barriers in communication.
            Whether you need to translate text, voice, or gestures into Indian
            Sign Language, our platform provides an easy-to-use and accurate
            solution for all.
          </p>
        </section>

        <section className="service-section">
          <div className="service-card">
            <h3>Text to Sign Language</h3>
            <p>
              Convert any written text into animated Indian Sign Language gestures.
              Perfect for educational content, customer support, and more.
            </p>
          </div>
          <div className="service-card">
            <h3>Voice to Sign Language</h3>
            <p>
              Real-time voice-to-sign language translation. Ideal for live
              meetings, webinars, and events to include individuals with hearing
              disabilities.
            </p>
          </div>
          <div className="service-card">
            <h3>Sign Language to Text/Voice</h3>
            <p>
              Translate Indian Sign Language gestures into text or spoken words,
              fostering understanding in everyday communication.
            </p>
          </div>
        </section>

        <section className="features-section">
          <h2>Features</h2>
          <ul>
            <li>Real-time translation with minimal delays.</li>
            <li>Accurate representation of Indian Sign Language grammar and syntax.</li>
            <li>User-friendly interface accessible to all age groups.</li>
            <li>Works on mobile, tablet, and desktop platforms.</li>
            <li>Offline support for specific translation services.</li>
          </ul>
        </section>

        <section className="testimonials-section">
          <h2>What Our Users Say</h2>
          <blockquote>
            This platform has been a game-changer for our community. The
            translations are spot on, and it is easy to use!" - Priya Sharma
          </blockquote>
          <blockquote>
            Finally, a service that truly understands the nuances of Indian Sign
            Language. Highly recommended!" - Arjun Verma
          </blockquote>
        </section>

        <footer className="service-footer">
          <h3>Get Started Today</h3>
          <p>
            Ready to embrace inclusivity? Contact us or explore our services now
            to create a better tomorrow for everyone.
          </p>
          <button className="service-contact-button">Contact Us</button>
        </footer>
      </div>
    </div>
  )
}

export default Service
