import Layout from "../components/layout";

export default function AboutPage() {
  return (
    <Layout>
      <div
        style={{
          textAlign: "center",
        }}
      >
        <br />
        <p>Colors:</p>
        <p style={{ color: "var(--eco-green)" }}> eco-green </p>
        <p style={{ color: "var(--eco-light)" }}> eco-light </p>
        <p style={{ color: "var(--eco-orange)" }}> eco-orange </p>
        <br />
        <p>Headers:</p>
        <h1>Header 1</h1>
        <h2>Header 2</h2>
        <h3>Header 3</h3>
        <h4>Header 4</h4>
        <p>Body text</p>
        <button className="btn-text">Button Text</button>
      </div>
    </Layout>
  );
}
