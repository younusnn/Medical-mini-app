export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { file_id } = req.query;
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN; 

  if (!file_id) {
    return res.status(400).json({ error: 'File ID is required' });
  }

  try {
    const fileRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${file_id}`);
    const fileData = await fileRes.json();

    if (!fileData.ok) {
      return res.status(400).json({ error: 'Telegram API Error', details: fileData });
    }

    const filePath = fileData.result.file_path;
    const downloadUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;

    const pdfRes = await fetch(downloadUrl);
    const pdfBuffer = await pdfRes.arrayBuffer();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="document.pdf"');
    return res.send(Buffer.from(pdfBuffer));

  } catch (error) {
    return res.status(500).json({ error: 'Server Error', details: error.message });
  }
}
