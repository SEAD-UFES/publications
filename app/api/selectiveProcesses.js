/** @format */

module.exports = app => {
  const api = {}
  const models = require('../models')
  const Sequelize = require('sequelize')
  const error = app.errors.selectiveProcesses
  const { validate } = require('../validators/selectiveprocesses.js')
  const { isEmpty } = require('../helpers/is-empty.js')

  const $or = Sequelize.Op.or // sequelize OR shortcut
  const check = require('../helpers/permissionCheck')
  const {
    unique,
    removeEmpty,
    validYears,
    validProcessNumbers,
    validIds,
    sortObjectByNameValue
  } = require('../helpers/listFilters')

  /* ordering */
  const orderByYearAndNumber = [
    ['year', 'DESC'],
    ['number', 'DESC']
  ]

  const orderByCallAndPublication = [
    [models.Call, 'createdAt', 'ASC'],
    [models.Call, models.Step, 'number', 'ASC'],
    [models.Publication, 'date', 'DESC'],
    [models.Publication, 'createdAt', 'DESC']
  ]

  /* includes for eager loading */
  const includeCourse = {
    model: models.Course,
    required: false
  }

  const includeCall = {
    model: models.Call,
    required: false
  }

  const includeCourseWithGraduationType = {
    model: models.Course,
    required: false,
    include: [
      {
        model: models.GraduationType,
        required: false
      }
    ]
  }

  const includePublicationWithType = {
    model: models.Publication,
    required: false,
    include: [
      {
        model: models.PublicationType,
        required: true
      }
    ]
  }

  const includeCallWithStepAndType = {
    model: models.Call,
    required: false,
    include: [
      {
        model: models.Step,
        required: false,
        include: [
          {
            model: models.StepType,
            required: false
          }
        ]
      },
      {
        model: models.Vacancy,
        required: false,
        include: [
          {
            model: models.Assignment,
            required: false
          }
        ]
      }
    ]
  }

  // temporary polyfill for flaMap
  // the function is not yet supported by Node 10.16 LTS
  if (!Array.prototype.flatMap) {
    Array.prototype.flatMap = function(lambda) {
      return Array.prototype.concat.apply([], this.map(lambda))
    }
  }
  // end-polyfill

  const getRelatedAssignments = process =>
    unique(
      process.Calls.flatMap(call => call.Vacancies).map(vacancy => vacancy.Assignment),
      'name'
    )

  const removeEntryByKey = (originalObject, key) => {
    const { [key]: removed, ...otherProperties } = originalObject.toJSON()

    return otherProperties
  }

  const injectAssignmentAndRemoveVacancies = process => {
    let result = process.toJSON()
    result.Assignments = getRelatedAssignments(process)

    result.Calls = result.Calls.map(call => removeEntryByKey(call, 'Vacancies'))

    return result
  }

  api.list = async (req, res) => {
    // pagination, limit, year
    req.query.limit = req.query.limit > 100 ? 100 : req.query.limit * 1 || 10
    req.query.page = req.query.page * 1 || 1
    req.query.offset = (req.query.page - 1) * req.query.limit

    // filter by year, number and course
    const where = removeEmpty({
      year: validYears(req.query.years),
      number: validProcessNumbers(req.query.numbers),
      course_id: validIds(req.query.courses)
    })

    // params for graduation types and assingment filters
    const graduationTypeIds = validIds(req.query.graduationTypes)
    const assignmentIds = validIds(req.query.assignments)

    // filter by graduation type
    if (typeof graduationTypeIds === 'object' && graduationTypeIds.length > 0) {
      const graduations = await models.GraduationType.findAll({
        attributes: ['id', 'name'],
        where: {
          id: graduationTypeIds
        },
        include: [
          {
            ...includeCourse,
            attributes: ['id']
          }
        ]
      })

      const aditionalCourseIds = graduations.flatMap(graduation => graduation.Courses.map(course => course.id))

      if (typeof where.course_id === 'undefined') {
        where.course_id = aditionalCourseIds
      } else {
        // REFACTOR -> move to helper fn intersection
        const ids = validIds(where.course_id.filter(x => aditionalCourseIds.includes(x)))
        where.course_id = ids
      }
    }

    // filter by assignments (vacancy and its type)
    if (typeof assignmentIds === 'object' && assignmentIds.length > 0) {
      const vacancies = await models.Vacancy.findAll({
        where: {
          assignment_id: assignmentIds
        },
        include: [
          {
            ...includeCall,
            attributes: ['id', 'selectiveProcess_id']
          }
        ]
      })

      const aditionalSelectiveProcessIds = vacancies.map(vacancy => vacancy.Call.selectiveProcess_id)

      where.id = unique(aditionalSelectiveProcessIds)
    }

    // check if user has roles
    const hasRoles = check.hasRoles(req.user)

    // filter user permissions (roles/restrictions)
    if (hasRoles) {
      const isAdmin = check.isAdmin(req.user)
      const isGlobal = check.hasGlobalPermission(req.user, 'selectiveprocess_list')

      if (!(isAdmin || isGlobal)) {
        const allowedCourseIds = check.allowedCourseIds(req.user, 'selectiveprocess_list')

        where[$or] = [{ visible: true }, { course_id: allowedCourseIds }]
      }
    } else {
      // if user has no special roles, selects only ~visible~ processes
      where.visible = true
    }

    models.SelectiveProcess.findAndCountAll({
      include: [includeCallWithStepAndType, includeCourseWithGraduationType],
      distinct: true,
      limit: req.query.limit,
      offset: req.query.offset,
      page: req.query.page,
      where,
      order: orderByYearAndNumber
    }).then(
      selectiveProcesses =>
        res.json({
          info: {
            count: selectiveProcesses.count,
            currentPage: req.query.page ? req.query.page * 1 : 1,
            numberOfPages: Math.ceil(selectiveProcesses.count / req.query.limit)
          },
          selectiveProcesses: selectiveProcesses.rows.map(injectAssignmentAndRemoveVacancies)
        }),
      e => {
        res.status(400).json(error.parse('selectiveProcesses-400', e))
      }
    )
  }

  api.create = async (req, res) => {
    let errors
    try {
      errors = await validate(req)
    } catch (e) {
      res.status(500).json(error.parse('selectiveProcesses-500', 'Error during validation'))
    }

    if (isEmpty(errors)) {
      try {
        const createdProcess = await models.SelectiveProcess.create(req.body)
        res.status(201).json({ id: createdProcess.id })
      } catch (e) {
        res.status(500).json(error.parse('selectiveProcesses-500', 'Error trying to create new Selective Process.'))
      }
    } else {
      res.status(406).json(error.parse('selectiveProcesses-406', { errors }))
    }
  }

  api.filters = async (req, res) => {
    let selectiveProcesses
    let assignments

    try {
      selectiveProcesses = await models.SelectiveProcess.findAll({
        include: [includeCourseWithGraduationType],
        where: { visible: true },
        distinct: true
      })
    } catch (e) {
      res.status(500).json(error.parse('selectiveProcesses-500', e))
    }

    try {
      assignments = await models.Assignment.findAll({
        attributes: ['id', 'name']
      })
    } catch (e) {
      res.status(500).json(error.parse('selectiveProcesses-500', e))
    }

    const years = [...new Set(selectiveProcesses.map(x => x.year))].sort()

    const numbers = [...new Set(selectiveProcesses.map(x => x.number))].sort()

    const allCourses = selectiveProcesses.map(x => ({ id: x.Course.id, name: x.Course.name }))

    const courses = unique(allCourses, 'id').sort(sortObjectByNameValue)

    const allGraduationTypes = selectiveProcesses
      .map(x => ({
        id: x.Course.GraduationType.id,
        name: x.Course.GraduationType.name
      }))
      .sort(sortObjectByNameValue)

    const graduationTypes = unique(allGraduationTypes, 'id').sort(sortObjectByNameValue)

    res.status(201).json({
      years,
      numbers,
      courses,
      graduationTypes,
      assignments
    })
  }

  api.specific = (req, res) => {
    models.SelectiveProcess.findById(req.params.id, {
      include: [includeCallWithStepAndType, includeCourseWithGraduationType, includePublicationWithType],
      order: orderByCallAndPublication
    }).then(
      selectiveProcess => {
        if (!selectiveProcess) {
          res.status(404).json(error.parse('selectiveProcesses-404', {}))
        } else {
          let process = selectiveProcess.toJSON()
          process.Assignments = getRelatedAssignments(selectiveProcess)

          process.Calls = process.Calls.map(call => removeEntryByKey(call, 'Vacancies'))

          res.json(process)
        }
      },
      e => {
        res.status(404).json(error.parse('selectiveProcesses-404', e))
      }
    )
  }

  api.update = async (req, res) => {
    let errors
    try {
      errors = await validate(req)
    } catch (e) {
      res.status(500).json(error.parse('selectiveProcesses-500', e))
    }

    if (isEmpty(errors)) {
      try {
        const selectiveProcess = await models.SelectiveProcess.findById(req.params.id)
        const updatedSelectiveProcess = await selectiveProcess.update(req.body, { fields: Object.keys(req.body) })

        res.json(updatedSelectiveProcess)
      } catch (e) {
        res.status(500).json(error.parse('selectiveProcesses-500', 'Error updating Process'))
      }
    } else {
      res.status(406).json(error.parse('selectiveProcesses-406', { errors }))
    }
  }

  api.delete = (req, res) => {
    models.SelectiveProcess.destroy({
      where: {
        id: req.params.id
      }
    }).then(
      _ => {
        res.sendStatus(204)
      },
      e => {
        res.status(500).json(error.parse('selectiveProcesseses-500'))
      }
    )
  }

  api.listPublic = async (req, res, next) => {
    if (req.headers['x-access-token']) {
      next()
    } else {
      req.query.limit = req.query.limit > 100 ? 100 : req.query.limit * 1 || 10
      req.query.page = req.query.page * 1 || 1
      req.query.offset = (req.query.page - 1) * req.query.limit

      // filter by year, number and course
      const where = removeEmpty({
        visible: true,
        year: validYears(req.query.years),
        number: validProcessNumbers(req.query.numbers),
        course_id: validIds(req.query.courses)
      })

      const graduationTypeIds = validIds(req.query.graduationTypes)
      const assignmentIds = validIds(req.query.assignments)

      // filter by graduation type
      if (typeof graduationTypeIds === 'object' && graduationTypeIds.length > 0) {
        const graduations = await models.GraduationType.findAll({
          attributes: ['id', 'name'],
          where: {
            id: graduationTypeIds
          },
          include: [includeCourseWithGraduationType]
        })

        if (graduations && graduations.length) {
          const aditionalCourseIds = graduations.flatMap(graduation => graduation.Courses.map(course => course.id))

          if (typeof where.course_id === 'undefined') {
            where.course_id = aditionalCourseIds
          } else {
            // REFACTOR -> move to helper fn intersection
            const ids = validIds(where.course_id.filter(x => aditionalCourseIds.includes(x)))
            where.course_id = ids
          }
        }
      }

      // filter by assignments (vacancy and its type)
      if (typeof assignmentIds === 'object' && assignmentIds.length > 0) {
        const vacancies = await models.Vacancy.findAll({
          where: {
            assignment_id: assignmentIds
          },
          include: [
            {
              ...includeCall,
              attributes: ['id', 'selectiveProcess_id']
            }
          ]
        })

        const aditionalSelectiveProcessIds = vacancies.map(vacancy => vacancy.Call.selectiveProcess_id)

        where.id = unique(aditionalSelectiveProcessIds)
      }

      models.SelectiveProcess.findAndCountAll({
        include: [includeCallWithStepAndType, includeCourseWithGraduationType],
        limit: req.query.limit,
        offset: req.query.offset,
        page: req.query.page,
        distinct: true,
        where,
        order: orderByYearAndNumber
      }).then(
        selectiveProcesses =>
          res.json({
            info: {
              count: selectiveProcesses.count,
              currentPage: req.query.page ? req.query.page * 1 : 1,
              numberOfPages: Math.ceil(selectiveProcesses.count / req.query.limit)
            },
            selectiveProcesses: selectiveProcesses.rows.map(injectAssignmentAndRemoveVacancies)
          }),
        e => {
          res.status(400).json(error.parse('selectiveProcesses-400', e))
        }
      )
    } // end-else
  }

  api.specificPublic = (req, res, next) => {
    if (req.headers['x-access-token']) {
      next()
    } else {
      models.SelectiveProcess.findById(req.params.id, {
        include: [includeCallWithStepAndType, includeCourseWithGraduationType, includePublicationWithType],
        order: orderByCallAndPublication
      }).then(
        selectiveProcess => {
          if (!selectiveProcess || !selectiveProcess.visible) {
            res.status(404).json(error.parse('selectiveProcesses-404', {}))
          } else {
            const process = injectAssignmentAndRemoveVacancies(selectiveProcess)

            res.json(process)
          }
        },
        e => {
          res.status(404).json(error.parse('selectiveProcesses-404', e))
        }
      )
    }
  }

  return api
}
