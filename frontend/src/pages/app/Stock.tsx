import axios from "axios";

axios
  .get("http://localhost:3000/app/stock/products")
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  })
  .finally(function () {});

function Stock() {
  return (
    <>
      <h1>Stock</h1>
    </>
  );
}

export default Stock;
