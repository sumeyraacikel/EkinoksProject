const express = require("express");
const postgresClient = require("../config/db.js");

const router = express.Router()

//Müşteri kayıt işlemi (istenilen farklı özellikler eklenebilir)
router.post('/insert', async (req, res) => {
    try {
        const text = "INSERT INTO customers (email, password, fullname) VALUES ($1, crypt($2, gen_salt('bf')), $3) RETURNING *"

        const values = [req.body.email, req.body.password, req.body.fullname]
        const { rows } = await postgresClient.query(text,values)
        return res.status(201).json({createdCustomer: rows[0] })

    } catch (error){
    console.log('Error occured', error.message)
        return res.status(400).json({message: error. message})
    }

})

//Müşteri giriş işlemi
router.post('/login', async (req,res) => {


    try {
        const text = "SELECT * FROM customers WHERE email = $1 AND password = crypt($2, password)"
        const values = [req.body.email, req.body.password]
        const {rows } = await postgresClient.query(text, values)

      //  console.log(rows)
        if (!rows.length)
            return res.status(404).json({ message: 'Customer not found.'})

            return res.status(200).json({message: 'Authentication successful.'})
    }catch (error) {
    console.log('Error occured', error.message)
        return res.status(400).json({message : error.message})
    }
})

//Müşteri bilgileri değişkliği, güncelleme işlemi
    //update customer
router.put('/update/:customerId', async (req, res) => {
    try {
        const {customerId} = req.params
        const text = "UPDATE customers SET email = $1, fullname = $2 WHERE id = $3 RETURNING * "
        const values = [req.body.email, req.body.fullname, customerId]

        const {rows} = await postgresClient.query(text, values)
        if (!rows.length)
            return res.status(404).json({ message: 'Customer not found.'})

        return res.status(200).json({updatedCustomer: rows[0]})
    }catch (error) {
        console.log('Error occured', error.message)
        return res.status(400).json({message : error.message})
    }
})

//Tüm müşterileri görüntüleme
router.get('/', async (req, res) => {
    try{
        const text = "SELECT * FROM customers ORDER BY id ASC"
        const {rows} = await postgresClient.query(text)
        return res.status(200).json(rows)
    }catch (error){
        console.log('Error occured', error.message)
        return res.status(400).json({message : error.message})
    }
})


module.exports = router;
