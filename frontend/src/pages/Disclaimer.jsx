const Disclaimer = () => {
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
      <h1 style={{ color: "#4F7DF3" }}>Disclaimer</h1>

      <p style={{ lineHeight: "32px", fontSize: "18px" }}>
        The information available on ShopNest is intended for general
        informational purposes only. Product descriptions, images, pricing, and
        availability may change without prior notice.
      </p>

      <p style={{ lineHeight: "32px", fontSize: "18px" }}>
        While we strive to keep all information accurate and up to date, we do
        not guarantee the completeness or reliability of every product listed.
      </p>

      <p style={{ lineHeight: "32px", fontSize: "18px" }}>
        ShopNest shall not be held responsible for any direct or indirect
        damages arising from the use of this website.
      </p>
    </div>
  );
};

export default Disclaimer;