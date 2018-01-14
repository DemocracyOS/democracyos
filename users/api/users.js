const express = require('express')
const user = require('../db-api/user')

const router = express.Router()

router.route('/users')
  .post(async (req, res, next) => {
    try {
      await user.create()
    } catch (err) {
      res.status(200).json({ ola: 'mundo' })
    }
  })
  .get(async (req, res, next) => {
    try {
      await user.list()
    } catch (err) {
      res.status(200).json({ ola: 'mundo' })
    }
  })

router.route('/users/:id')
  .get(async (req, res, next) => {
    try {
      await user.get()
    } catch (err) {
      res.status().json()
    }
  })
  .put(async (req, res, next) => {
    try {
      await user.update()
    } catch (err) {
      res.status().json()
    }
  })
  .delete(async (req, res, next) => {
    try {
      await user.remove()
    } catch (err) {
      res.status().json()
    }
  })

module.exports = router
