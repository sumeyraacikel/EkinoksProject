const express = require("express");
const postgresClient = require("../config/db.js");


const router = express.Router()

//Sipariş oluşturma (adres bilgisi vs burada alınabilir.)
router.post('/insert', async (req, res) => {
    try {
        const text = "INSERT INTO orders (customerId, productId, quantity) VALUES ($1, $2, $3) RETURNING *"

        const values = [req.body.customerId, req.body.productId, req.body.quantity]
        const { rows } = await postgresClient.query(text,values)
        return res.status(201).json({createdOrder: rows[0] })
    } catch (error){
        console.log('Error occured', error.message)
        return res.status(400).json({message: error. message})
    }
})

//Tüm siparişleri listeleme
router.get('/', async (req, res) => {
    try{
        const text = "SELECT * FROM orders ORDER BY id ASC"
        const {rows} = await postgresClient.query(text)
        return res.status(200).json(rows)

    }catch (error){
        console.log('Error occured', error.message)
        return res.status(400).json({message : error.message})
    }

}
)
//Bir Müşterinin siparişlerini listeleme
router.post('/list-products', async (req, res) => {

    try {
        const text = "SELECT productId, quantity FROM orders WHERE customerId = $1 ";
        const values = [req.body.customerId];
        const { rows } = await postgresClient.query(text,values)
        return res.status(201).json({listedOrder: rows })

    } catch (error){
        console.log('Error occured', error.message)
        return res.status(400).json({message: error. message})
    }
});

//Müşterinin sipariş detaylarını listeleme
router.post('/products-detail', async (req, res) => {


    try {
        const text ="SELECT products.title, products.price,products.details FROM products INNER JOIN orders ON products.id = orders.productId WHERE customerId = $1 AND productId = $2"
        const values = [req.body.customerId, req.body.productId];
        const { rows } = await postgresClient.query(text,values)
        return res.status(201).json({listedOrder: rows })
    } catch (error){
        console.log('Error occured', error.message)
        return res.status(400).json({message: error. message})
    }
});



module.exports = router;
