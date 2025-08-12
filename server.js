const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS: permitir acceso desde Netlify
app.use(cors({
  origin: 'https://pdfpaginas.netlify.app',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({ dest: 'uploads/' });

// Ruta raíz
app.get('/', (req, res) => {
  res.send('🚀 Backend activo. Usa POST /convert-pdf para convertir PDFs.');
});

// Ruta para convertir PDF a texto
app.post('/convert-pdf', upload.single('pdfFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No se subió ningún archivo.');
    }

    const dataBuffer = fs.readFileSync(req.file.path);
    const data = await pdfParse(dataBuffer);
    fs.unlinkSync(req.file.path); // Eliminar archivo temporal

    res.type('text/plain').send(data.text);
  } catch (error) {
    console.error('Error al convertir el PDF:', error);
    res.status(500).send('Error al procesar el PDF');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
