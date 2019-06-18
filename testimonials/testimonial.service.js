const db					= require('_helpers/db');
const Testimonial	= db.Testimonial;

module.exports = {
	getAll,
	getById,
	create,
	update,
	delete: _delete
};

async function getAll() {
	return await Testimonial.find({status: "published"}).populate('author', '-password').populate('updatedBy', '-password');
}

async function getById(id) {
	return await Testimonial.findById(id).populate('author', '-password').populate('updatedBy', '-password');
}

async function create(user, testimonialData) {
	const testimonial = new Testimonial(testimonialData);
	testimonial.author = user.sub;
	await testimonial.save();
}

async function update(id, user, testimonialData) {
	const testimonial = await Testimonial.findById(id);

	if(!testimonial) throw 'Testimonial Not Found';

	Object.assign(testimonial, testimonialData);

	testimonial.updatedBy = user.sub;
	testimonial.updatedAt = Date.now();

	await testimonial.save();
}

async function _delete(id) {
	await Testimonial.findByIdAndRemove(id);
}