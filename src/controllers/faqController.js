const asyncHandler = require('../middlewares/asyncHandler');
const { success } = require('../utils/apiResponse');
const faqService = require('../services/faqService');

const getFaqs = asyncHandler(async (req, res) => {
  const faqs = await faqService.listFaqs();
  return success(res, faqs);
});

const createFaq = asyncHandler(async (req, res) => {
  const faq = await faqService.createFaq(req.body);
  return success(res, faq, 201);
});

const updateFaq = asyncHandler(async (req, res) => {
  const faq = await faqService.updateFaq(req.params.id, req.body);
  return success(res, faq);
});

const deleteFaq = asyncHandler(async (req, res) => {
  await faqService.deleteFaq(req.params.id);
  return success(res, { deleted: true });
});

const reorderFaqs = asyncHandler(async (req, res) => {
  const faqs = await faqService.reorderFaqs(req.body);
  return success(res, faqs);
});

module.exports = { getFaqs, createFaq, updateFaq, deleteFaq, reorderFaqs };
