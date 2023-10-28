const express = require("express");
const cors = require("cors");
const customerRouter = require("./app/routers/customerRouter");
const productRouter = require("./app/routers/productRouter");
const orderRouter = require("./app/routers/orderRouter");

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// içerik türünün ayrıştırılması - application/json
app.use(express.json());
app.use('/customers', customerRouter)
app.use('/products', productRouter)
app.use('/orders', orderRouter)

// İçerik türünün ayrıştırılması - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// database
const db = require("./app/models");
const Role = db.role;

// db.sequelize.sync();
// force: true eğer mevcutsa tablo oluşmayacak
db.sequelize.sync({force: true}).then(() => {
  console.log('Drop and Resync Database with { force: true }');
  initial();
});

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to online shopping application." });
});

// routers
require('./app/routers/authRouter')(app);
require('./app/routers/userRouter')(app);

// set port, listen for requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.create({
    id: 1,
    name: "user"
  });

  Role.create({
    id: 2,
    name: "customer"
  });

  Role.create({
    id: 3,
    name: "admin"
  });
}
