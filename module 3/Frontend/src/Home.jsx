import React from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { DesignNib, Folder } from "iconoir-react";
import { UserGroupIcon, ArrowUpRightIcon } from "@heroicons/react/24/outline";
import Footer from "./components/layout/Footer";
import "./components/layout/Footer.css";
 
// Icons SVG's
import Pen from "../src/assets/Svg/Pen.svg"
import FileStroke from "../src/assets/Svg/FileStroke.svg"
import GroupPeople from "../src/assets/Svg/GroupPeople.svg"
 
// Images
// Banner section image
import bannerImage1 from "./assets/Home-Page-Imgs/Banner-Img.jpg";
import bannerImage2 from "./assets/Home-Page-Imgs/Banner-Img.jpg";
import bannerImage3 from "./assets/Home-Page-Imgs/Banner-Img.jpg";
import bannerImage4 from "./assets/Home-Page-Imgs/Banner-Img.jpg";
 
 
// Features images
import Frame1 from "./assets/Home-Page-Imgs/Feature_Frame_1.jpg"
import Frame2 from "./assets/Home-Page-Imgs/Feature_Frame_2.jpg"
import Frame3 from "./assets/Home-Page-Imgs/Feature_Frame_3.jpg"
import Frame4 from "./assets/Home-Page-Imgs/Feature_Frame_4.jpg"
// Templates images
import Template1 from "./assets/Templates-Page-Image/Template-Img.png";
import Template2 from "./assets/Templates-Page-Image/Template-image.png";
import Template3 from "./assets/Home-Page-Imgs/Template3.jpg";
import Template4 from "./assets/Home-Page-Imgs/Template4.jpg";
import Template5 from "./assets/Home-Page-Imgs/Template5.jpg";
import Template6 from "./assets/Home-Page-Imgs/Template6.jpg";
import Template7 from "./assets/Home-Page-Imgs/Template7.jpg";
// How it works Edit images
import Edit1 from "./assets/Home-Page-Imgs/Edit1.jpg"
import Edit2 from "./assets/Home-Page-Imgs/Edit2.jpg"
import Edit3 from "./assets/Home-Page-Imgs/Edit3.jpg"
import paint_Img from "./assets/Home-Page-Imgs/Paint.png"
 
 
function Home() {
  const navigate = useNavigate();
 
  const goToSignin = () => {
    navigate("/login");
  }
 
  return (
    <>

      <div className="home-page-main">
      {/* Banner Section */}
 
      <section className="banner-wrapper">
 
        {/* Floating Images */}
        <img className="float-card card1" src={bannerImage1} />
        <img className="float-card card2" src={bannerImage2} />
        <img className="float-card card3" src={bannerImage3} />
        <img className="float-card card4" src={bannerImage4} />

        {/* Center Content */}
        <div className="banner-center">
          <h1>
            Design Faster.

            Publish Everywhere.
          </h1>
 
          <p>
            Create social posts, ads, presentations, and more with simple drag-and-drop tools.
            No design experience needed.
          </p>
 
          <div className="banner-buttons">
            <button className="secondary-btn" onClick={goToSignin}>Explore Templates</button>
            <button className="primary-btn" onClick={goToSignin}>Start Free</button>
          </div>
        </div>
 
      </section>
 
      <section className="template-section">
 
        {/* LEFT SIDE */}
        <div className="template-left">
          <div className="timeline">
 
            <div className="timeline-item active">
              <div className="dot"></div>
              <div>
                <h4>Template Library</h4>
                <p>
                  Choose from thousands of ready-made templates for social,
                  business, and presentations.
                </p>
              </div>
            </div>
 
            <div className="timeline-item">
              <div className="dot"></div>
              <span>Drag & Drop Editor</span>
            </div>
 
            <div className="timeline-item">
              <div className="dot"></div>
              <span>Real Time Collaboration</span>
            </div>
 
            <div className="timeline-item">
              <div className="dot"></div>
              <span>Multiformat Export</span>
            </div>
 
          </div>
        </div>
 
        {/* RIGHT SIDE */}
        <div className="template-right">
          <img src={Template1} alt="template UI" />
        </div>
 
      </section>
 
 
      {/* Trusted Section */}
 
      <section className="trusted-section-wrapper">
        <div className="trusted-section-container">
 
          <h2 className="trusted-section-title">
            Trusted by Creators Worldwide
          </h2>
 
          <p className="trusted-section-subtitle">
            Join millions who bring ideas to life every day
          </p>
 
          <div className="trusted-stats-grid">
 
            <div className="trusted-stat-card">
              <img src={Pen} alt="" className="trusted-stat-card-icon" />
              <h3 className="trusted-stat-number">50K +</h3>
              <p className="trusted-stat-text">Designs Created</p>
            </div>
 
            <div className="trusted-stat-card">
              <img src={FileStroke} alt="" className="trusted-stat-card-icon" />
              <h3 className="trusted-stat-number">1M +</h3>
              <p className="trusted-stat-text">Assets Used</p>
            </div>
 
            <div className="trusted-stat-card">
              <img src={GroupPeople} alt="" className="trusted-stat-card-icon" />
              <h3 className="trusted-stat-number">10K +</h3>
              <p className="trusted-stat-text">Active Creators</p>
            </div>
 
          </div>
        </div>
      </section>
 
 
      {/* Features Section */}
 
   <section className="template-showcase">
 
  {/* LEFT IMAGE */}
  <div className="showcase-left">
    <div className="purple-glow"></div>
    <img src={Template2} alt="template preview" className="showcase-left-image" />
  </div>
 
  {/* RIGHT CONTENT */}
  <div className="showcase-right">
 
    <h2>What do you want to create today?</h2>
 
    <p className="desc">
      Design social media posts, marketing graphics, and brand visuals effortlessly
      with powerful templates and smart tools — all in one place
    </p>
 
    <p className="sub-desc">
      From digital marketing posts to professional presentations, Stackly Studio helps
      creators, marketers, and businesses turn ideas into beautiful designs faster than ever.
    </p>
 
    <button className="browse-btn">
      Browse all templates →
    </button>
 
  </div>
 
</section>
 
 
 
    
     {/* How It Works Section */}
<section className="how-section">
  <h2 className="how-title">How it works</h2>
 
  <div className="how-container">
    {/* CARD 1 */}
    <div className="how-card">
      <div className="how-number">1</div>
 
      <div className="card-image">
        <img src={Edit1} alt="Choose template" />
      </div>
 
      <div className="card-content">
        <h3>Choose a template</h3>
        <p>Start with a layout made by professionals.</p>
      </div>
    </div>
 
    {/* CARD 2 */}
    <div className="how-card">
      <div className="how-number">2</div>
 
      <div className="card-image">
        <img src={Edit2} alt="Customize" />
      </div>
 
      <div className="card-content">
        <h3>Customize it</h3>
        <p>Edit text, images, and styles in minutes.</p>
      </div>
    </div>
 
    {/* CARD 3 */}
    <div className="how-card">
      <div className="how-number">3</div>
 
      <div className="card-image">
        <img src={Edit3} alt="Export" />
      </div>
 
      <div className="card-content">
        <h3>Export & share</h3>
        <p>Download or publish directly.</p>
      </div>
    </div>
  </div>
</section>
 
 
      {/* Conversion Section */}
 
      <section className="hero">
        <div className="hero-container">
 
          {/* LEFT COLUMN */}
          <div className="hero-left">
            <h1>
              Ready to <span className="red-text">create</span>

              <span className="gradient-text">something</span> amazing?
            </h1>
 
            <button
              className="hero-btn"
              onClick={goToSignin}
            >
              Get Started for Free
            </button>
 
            <p className="sub-text">
              No credit card required.
            </p>
          </div>
 
          {/* RIGHT COLUMN */}
          <div className="hero-right">
            <img src={paint_Img} alt="Design Palette" />
          </div>
 
        </div>
      </section>
 
 
      {/* Footer Section */}
      <Footer />

      </div>
    </>
  );
 
}
 
export default Home;