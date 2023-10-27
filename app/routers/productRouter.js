const express = require("express");
const postgresClient = require("../config/db.js");
const router = express.Router()

//Ürün ekleme
router.post('/insert', async (req, res) => {
    try {
        const text = "INSERT INTO products (title, price, details) VALUES ($1, $2, $3) RETURNING *"

        const values = [req.body.title, req.body.price, req.body.details]
        const { rows } = await postgresClient.query(text,values)
        return res.status(201).json({createdProduct: rows[0] })
    } catch (error){
        console.log('Error occured', error.message)
        return res.status(400).json({message: error. message})
    }
})

//Ürün güncelleme
router.put('/update/:productId', async (req, res) => {
    try {
        const {productId} = req.params
        const text = "UPDATE products SET title = $1, price = $2, details= $3 WHERE id = $4 RETURNING * "
        const values = [req.body.title, req.body.price, req.body.details, productId]

        const {rows} = await postgresClient.query(text, values)
        if (!rows.length)
            return res.status(404).json({ message: 'Product not found.'})

        return res.status(200).json({updatedProduct: rows[0]})
    }catch (error) {
        console.log('Error occured', error.message)
        return res.status(400).json({message : error.message})
    }
})

//Tüm ürünleri listeleme
router.get('/', async (req, res) => {
    try{
        const text = "SELECT * FROM products ORDER BY id ASC"
        const {rows} = await postgresClient.query(text)
        return res.status(200).json(rows)
    }catch (error){
        console.log('Error occured', error.message)
        return res.status(400).json({message : error.message})
    }
})

module.exports = router;
