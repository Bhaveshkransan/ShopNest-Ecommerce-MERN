const ReturnPolicy = () => {
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
      <h1 style={{ color: "#4F7DF3" }}>Return Policy</h1>

      <p style={{ lineHeight: "32px", fontSize: "18px" }}>
        Customer satisfaction is our priority. If you are not satisfied with
        your purchase, you may request a return within <strong>7 days</strong>
        of receiving your order.
      </p>

      <h2 style={{ color: "#B84BC9", marginTop: "30px" }}>
        Return Conditions
      </h2>

      <ul style={{ lineHeight: "35px", fontSize: "18px" }}>
        <li>✔ Product must be unused.</li>
        <li>✔ Original packaging should be intact.</li>
        <li>✔ Invoice or proof of purchase is required.</li>
        <li>✔ Customized products cannot be returned.</li>
      </ul>

      <h2 style={{ color: "#B84BC9", marginTop: "30px" }}>
        Refund Process
      </h2>

      <p style={{ lineHeight: "32px", fontSize: "18px" }}>
        Once the returned item is inspected and approved, the refund will be
        processed within <strong>5–7 business days</strong> through the original
        payment method.
      </p>
    </div>
  );
};

export default ReturnPolicy;