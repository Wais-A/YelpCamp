const express = require('express')
const router = express.Router()
const { campgroundSchema } = require('../schemas')
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Campground = require('../Models/campground')
const {isLoggedIn} = require('../middleware.js')

const validateCampground = (req, _res, next) => {
	const { error } = campgroundSchema.validate(req.body)
	if (error) {
		const msg = error.details.map((el) => el.message).join(',')
		throw new ExpressError(msg, 400)
	} else {
		next()
	}
}

router.get('/', catchAsync(async (_req, res) => {
	const campground = await Campground.find({})
	res.render('campgrounds/index', {
		campground,
	})
})
)

router.get('/new', isLoggedIn, (_req, res) => {
	res.render('campgrounds/new')
})

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
	// if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400)

	const campground = new Campground(req.body.campground)
	await campground.save()
	req.flash('success', 'Successfully made a new campground!')
	res.redirect(`/campgrounds/${campground._id}`)
})
)

router.get('/:id', catchAsync(async (req, res) => {
	const { id } = req.params
	const campground = await Campground.findById(id).populate('reviews')
	if (!campground) {
		req.flash('error', 'Cannot find that campground!')
		return res.redirect('/campgrounds')
	}
	res.render('campgrounds/show', {
		campground,
	})
})
)

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
	const campground = await Campground.findById(req.params.id)
	if (!campground) {
		req.flash('error', 'Cannot find that campground!')
		return res.redirect('/campgrounds')
	}
	res.render('campgrounds/edit', {
		campground,
	})
})
)

router.put('/:id', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
	const campground = await Campground.findByIdAndUpdate(req.params.id, {
		...req.body.campground,
	})
	req.flash('success', 'Successfully updated campground!')
	res.redirect(`/campgrounds/${campground._id}`)
})
)

router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
	await Campground.findByIdAndDelete(req.params.id)
	req.flash('success', 'Successfully deleted campground!')
	res.redirect('/campgrounds')
})
)

module.exports = router
