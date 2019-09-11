/** @format */

module.exports = app => {
  const Sequelize = require('sequelize')
  const models = require('../models')
  const api = {}
  const error = app.errors.notices
  const { validate } = require('../validators/notices.js')
  const { removeEmpty } = require('../helpers/listFilters')
  const { isEmpty } = require('lodash')
  const $or = Sequelize.Op.or // sequelize OR shortcut
  const check = require('../helpers/permissionCheck')

  api.create = async (req, res, next) => {
    let errors
    try {
      errors = await validate(req)
    } catch (e) {
      res.status(400).json(error.parse('notices-02', 'Error during validation.'))
      return next()
    }

    if (isEmpty(errors)) {
      /*validation ok -  try to create*/
      try {
        const createdNotice = await models.Notice.create(req.body)
        res.status(201).json(createdNotice)
        return next()
      } catch (e) {
        res.status(400).json(error.parse('notices-05', 'Error trying to create new Notice.'))
        return next()
      }
    } else {
      /* fail, send validation errors */
      res.status(400).json(error.parse('notices-01', { errors }))
      return next()
    }
  }

  api.specificPublic = (req, res, next) => {
    if (req.headers['x-access-token']) {
      next()
    } else {
      const where = removeEmpty({
        visible: true
      })

      //Find and return notice
      models.Notice.findById(req.params.id, { where: where }).then(
        notice => {
          if (notice) {
            res.json(notice)
          } else {
            res.status(400).json(error.parse('notices-04', 'Notice not exist.'))
          }
        },
        e => {
          res.status(500).json(error.parse('notices-02', e))
        }
      )
    }
  }

  api.specific = async (req, res) => {
    let where = {}
    // check if user has roles
    const hasRoles = check.hasRoles(req.user)

    // filter user permissions (roles/restrictions)
    if (hasRoles) {
      const isAdmin = check.isAdmin(req.user)
      const isGlobal = check.hasGlobalPermission(req.user, 'notice_read')

      if (!(isAdmin || isGlobal)) {
        const allowedCourseIds = check.allowedCourseIds(req.user, 'notice_read')

        const notice_structure = {
          include: [
            {
              model: models.selectiveProcess,
              required: false,
              include: [{ model: models.Course, where: { id: allowedCourseIds } }]
            }
          ]
        }

        const noticeIds = await models.Notice.findAll(notice_structure).map(notice => notice.id)

        where[$or] = [{ visible: true }, { notices_id: noticeIds }]
      }
    } else {
      // if user has no special roles, selects only ~visible~ processes
      where.visible = true
    }

    where = removeEmpty(where)

    //Find and return notice
    models.Notice.findById(req.params.id, { where: where }).then(
      notice => {
        if (notice) {
          res.json(notice)
        } else {
          res.status(400).json(error.parse('notices-04', 'Notice not exist.'))
        }
      },
      e => {
        res.status(500).json(error.parse('notices-02', e))
      }
    )
  }

  api.update = async (req, res) => {
    let errors

    try {
      errors = await validate(req, req.params.id)
    } catch (e) {
      res.status(500).json(error.parse('notices-02', e))
    }

    if (isEmpty(errors)) {
      try {
        const notice = await models.Notice.findById(req.params.id)
        const updatedNotice = await notice.update(req.body, { fields: Object.keys(req.body) })

        res.json(updatedNotice)
      } catch (e) {
        res.status(500).json(error.parse('notices-02', 'Error updating notice.'))
      }
    } else {
      res.status(400).json(error.parse('notices-01', { errors }))
    }
  }

  api.delete = (req, res) => {
    models.Notice.destroy({ where: { id: req.params.id } }).then(
      _ => {
        res.sendStatus(204)
      },
      e => {
        res.status(500).json(error.parse('notices-04'))
      }
    )
  }

  api.listPublic = (req, res, next) => {
    if (req.headers['x-access-token']) {
      next()
    } else {
      // filter by selectiveProcess_id
      const where = removeEmpty({
        selectiveProcess_id: req.query.selectiveProcess_id,
        visible: true
      })

      models.Notice.findAll({ where: where }).then(
        noticeList => {
          res.json(noticeList)
        },
        e => {
          res.status(500).json(error.parse('notices-02', e))
        }
      )
    }
  }

  api.list = async (req, res) => {
    let where = {}
    // check if user has roles
    const hasRoles = check.hasRoles(req.user)

    // filter user permissions (roles/restrictions)
    if (hasRoles) {
      const isAdmin = check.isAdmin(req.user)
      const isGlobal = check.hasGlobalPermission(req.user, 'notice_list')

      if (!(isAdmin || isGlobal)) {
        const allowedCourseIds = check.allowedCourseIds(req.user, 'notice_list')

        const notice_structure = {
          include: [
            {
              model: models.selectiveProcess,
              required: false,
              include: [{ model: models.Course, where: { id: allowedCourseIds } }]
            }
          ]
        }

        const noticeIds = await models.Notice.findAll(notice_structure).map(notice => notice.id)

        where[$or] = [{ visible: true }, { notices_id: noticeIds }]
      }
    } else {
      // if user has no special roles, selects only ~visible~ processes
      where.visible = true
    }

    // filter by selectiveProcess_id
    where.selectiveProcess_id = req.query.selectiveProcess_id
    where = removeEmpty(where)

    models.Notice.findAll({ where: where }).then(
      noticeList => {
        res.json(noticeList)
      },
      e => {
        res.status(500).json(error.parse('notices-02', e))
      }
    )
  }

  return api
}
