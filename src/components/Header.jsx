import company from "../../company.json";

export default function Header() {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo-circle">SG</div>

        <div>
          <h1>{company.productName} List</h1>
          <p>Manage groceries effortlessly</p>
        </div>
      </div>
    </header>
  );
}
