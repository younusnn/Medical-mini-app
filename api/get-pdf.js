export default async function handler(req, res) {
  // السماح بطلبات CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { file_id } = req.query;
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN; 

  if (!file_id) {
    return res.status(400).json({ error: 'File ID is required' });
  }

  try {
    // 1. طلب مسار الملف من تلجرام
    const fileRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${file_id}`);
    const fileData = await fileRes.json();

    if (!fileData.ok) {
      return res.status(400).json({ error: 'Telegram API Error', details: fileData });
    }

    const filePath = fileData.result.file_path;
    const downloadUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;

    // 2. إعادة توجيه القارئ إلى الرابط المباشر فوراً بدلاً من تحميله على السيرفر
    return res.redirect(302, downloadUrl);

  } catch (error) {
    return res.status(500).json({ error: 'Server Error', details: error.message });
  }
}
