const Faq = require('../models/Faq');

function notFoundError(message = 'FAQ not found') {
  const err = new Error(message);
  err.status = 404;
  return err;
}

async function listFaqs() {
  return Faq.find().sort({ order: 1 });
}

async function createFaq(payload) {
  return Faq.create(payload);
}

async function updateFaq(id, payload) {
  const faq = await Faq.findById(id);
  if (!faq) throw notFoundError();
  Object.assign(faq, payload);
  await faq.save();
  return faq;
}

async function deleteFaq(id) {
  const faq = await Faq.findByIdAndDelete(id);
  if (!faq) throw notFoundError();
  return faq;
}

// Bulk-updates order fields. items: [{ id, order }]
async function reorderFaqs(items) {
  await Promise.all(
    items.map(({ id, order }) => Faq.findByIdAndUpdate(id, { order }))
  );
  return listFaqs();
}

module.exports = { listFaqs, createFaq, updateFaq, deleteFaq, reorderFaqs };
