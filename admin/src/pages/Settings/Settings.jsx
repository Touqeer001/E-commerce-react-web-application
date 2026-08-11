import Card from "../../components/Common/Card";

export default function Settings() {
  return (
    <>
      <h1>Settings</h1>
      <Card title="Permissions">
        <p>
          Editors can maintain products, inventory and orders. Admins also
          manage categories. Only Super Admins can delete categories.
        </p>
      </Card>
    </>
  );
}
