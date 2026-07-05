const About = () => {
  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "40px auto",
        padding: "40px",
        background: "#fff",
        borderRadius: "20px",
        boxShadow: "0 5px 20px rgba(0,0,0,.1)"
      }}
    >
      <h1 style={{ color: "#4F7DF3" }}>About ShopNest</h1>

      <p style={{ lineHeight: "32px", fontSize: "18px" }}>
        ShopNest is a modern e-commerce platform designed to provide customers
        with a smooth, secure, and enjoyable online shopping experience. We
        offer premium-quality products across multiple categories at competitive
        prices.
      </p>

      <h2 style={{ marginTop: "30px", color: "#B84BC9" }}>Our Mission</h2>

      <p style={{ lineHeight: "32px", fontSize: "18px" }}>
        Our mission is to make online shopping simple, secure, and affordable
        while delivering exceptional customer satisfaction.
      </p>

      <h2 style={{ marginTop: "30px", color: "#B84BC9" }}>Why Choose Us?</h2>

      <ul style={{ lineHeight: "35px", fontSize: "18px" }}>
        <li>✔ Premium Quality Products</li>
        <li>✔ Secure Razorpay Payments</li>
        <li>✔ Fast Shipping</li>
        <li>✔ Easy Returns</li>
        <li>✔ Trusted Customer Support</li>
      </ul>
    </div>
  );
};

export default About;